import express from 'express';
import cors from 'cors';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_PATH = path.join(__dirname, '../brain.db');

// Hàm hỗ trợ mở database
async function getDb() {
    return open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });
}

// ==========================================
// Factory: tạo MCP Server với toàn bộ tools
// (Dùng pattern stateless - mỗi request là 1 instance mới)
// ==========================================
function createServer() {
    const server = new McpServer({
        name: "ClassConvert-MCP",
        version: "1.0.0"
    });

    // ==========================================
    // 1. get_leads_report_now (Xem danh sách khách hàng)
    // ==========================================
    server.tool(
        "get_leads_report_now",
        "Xem danh sách khách hàng mới nhất (waitlist/mua hàng) từ database",
        { limit: z.number().optional().describe("Số lượng khách hàng cần xem (mặc định 20)") },
        async ({ limit = 20 }) => {
            console.log(`[MCP Call] get_leads_report_now (limit: ${limit})`);
            let db;
            try {
                db = await getDb();
                const leads = await db.all(
                    "SELECT id, name, phone, email, created_at FROM customers ORDER BY created_at DESC LIMIT ?",
                    limit
                );

                if (!leads || leads.length === 0) {
                    return { content: [{ type: "text", text: "Chưa có dữ liệu khách hàng nào." }] };
                }

                const formatted = leads.map(l =>
                    `- [${l.created_at}] ${l.name} - ${l.phone || ""}` + (l.email ? ` - ${l.email}` : "")
                ).join("\n");

                return {
                    content: [{
                        type: "text",
                        text: `Danh sách ${leads.length} khách hàng mới nhất:\n${formatted}`
                    }]
                };
            } catch (error) {
                console.error("Error in get_leads_report_now:", error);
                return { content: [{ type: "text", text: `[LỖI] Không thể lấy báo cáo: ${error.message}` }], isError: true };
            } finally {
                if (db) await db.close();
            }
        }
    );

    // ==========================================
    // 2. trigger_manual_email (Gửi email thủ công)
    // ==========================================
    server.tool(
        "trigger_manual_email",
        "Gửi email (checklist hoặc welcome) tới một địa chỉ cụ thể qua Resend API",
        {
            email: z.string().email().describe("Địa chỉ email khách hàng"),
            template_type: z.enum(["checklist", "welcome"]).default("checklist").describe("Loại email cần gửi")
        },
        async ({ email, template_type }) => {
            console.log(`[MCP Call] trigger_manual_email (email: ${email}, template: ${template_type})`);
            try {
                const apiKey = process.env.RESEND_API_KEY;
                if (!apiKey) {
                    throw new Error("RESEND_API_KEY không tồn tại trong file .env");
                }

                let subject = "";
                let htmlContent = "";

                if (template_type === "checklist") {
                    subject = "Xác nhận đơn hàng thành công: Tuyển sinh Tự động 💎";
                    htmlContent = `<h2>Cảm ơn bạn đã đăng ký mua Checklist 14 ngày!</h2><p>Vui lòng nhấp vào đây để tải tài liệu của bạn.</p>`;
                } else {
                    subject = "1. Chào mừng bạn đến với thế giới 'Tuyển sinh Không người lái' 🚀";
                    htmlContent = `<h2>Chào bạn,</h2><p>Rất vui vì bạn đã quyết định điền tên vào danh sách chờ.</p>`;
                }

                const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Long ClassConvert <thongbao@classconvert.vn>',
                        to: [email],
                        subject: subject,
                        html: htmlContent
                    })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(JSON.stringify(data));
                }

                return {
                    content: [{ type: "text", text: `[THÀNH CÔNG] Đã gửi email '${template_type}' tới ${email}.` }]
                };
            } catch (error) {
                console.error("Error in trigger_manual_email:", error);
                return { content: [{ type: "text", text: `[LỖI] Gửi email thất bại: ${error.message}` }], isError: true };
            }
        }
    );

    // ==========================================
    // 3. update_site_content (Sửa tiêu đề & Cập nhật giá)
    // ==========================================
    server.tool(
        "update_site_content",
        "Cập nhật nội dung Landing Page (Tiêu đề hero hoặc Giá bán). Khi cập nhật hero_title sẽ thay đổi trực tiếp trên website ngay lập tức.",
        {
            type: z.enum(["hero_title", "price"]).describe("Loại nội dung cần cập nhật"),
            new_value: z.string().describe("Giá trị nội dung mới (plain text)")
        },
        async ({ type, new_value }) => {
            console.log(`[MCP Call] update_site_content (type: ${type}, new_value: ${new_value})`);
            try {
                // Bước 1: Lưu vào database
                const db = await getDb();
                await db.exec(`
                    CREATE TABLE IF NOT EXISTS site_settings (
                        key TEXT PRIMARY KEY,
                        value TEXT,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `);
                await db.run(
                    `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) 
                     ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP`,
                    [type, new_value]
                );
                await db.close();

                // Bước 2: Ghi thẳng vào index.html (nếu là hero_title)
                if (type === 'hero_title') {
                    const { readFile, writeFile } = await import('fs/promises');
                    const htmlPath = path.join(__dirname, '../index.html');
                    let html = await readFile(htmlPath, 'utf8');

                    // Thay toàn bộ nội dung bên trong <h1 id="hero-title"...>...</h1>
                    const h1Regex = /(<h1[^>]*id="hero-title"[^>]*>)([\s\S]*?)(<\/h1>)/;
                    if (!h1Regex.test(html)) {
                        throw new Error('Không tìm thấy thẻ <h1 id="hero-title"> trong index.html');
                    }
                    html = html.replace(h1Regex, `$1\n                    ${new_value}\n                $3`);
                    await writeFile(htmlPath, html, 'utf8');
                    console.log(`[MCP] Đã ghi hero_title vào index.html thành công`);
                }

                return {
                    content: [{ type: "text", text: `[THÀNH CÔNG] Đã cập nhật ${type} thành: "${new_value}". Khách hàng refresh website là thấy ngay!` }]
                };
            } catch (error) {
                console.error("Error in update_site_content:", error);
                return { content: [{ type: "text", text: `[LỖI] Cập nhật website thất bại: ${error.message}` }], isError: true };
            }
        }
    );

    // ==========================================
    // 6. check_new_leads_now (Dùng cho Cron Job báo tin nhắn mới)
    // ==========================================
    server.tool(
        "check_new_leads_now",
        "Kiểm tra các tín hiệu kinh doanh mới (leads/đăng ký) chưa được thông báo.",
        {},
        async () => {
            console.log(`[MCP Call] check_new_leads_now`);
            try {
                const db = await getDb();
                
                // 1. Lấy danh sách leads chưa notified
                const newLeads = await db.all(
                    "SELECT * FROM customers WHERE is_notified = 0 ORDER BY id ASC"
                );

                if (newLeads.length === 0) {
                    await db.close();
                    return { content: [{ type: "text", text: "Không có tín hiệu mới nào." }] };
                }

                // 2. Đánh dấu đã notified
                const ids = newLeads.map(l => l.id);
                await db.run(
                    `UPDATE customers SET is_notified = 1 WHERE id IN (${ids.map(() => '?').join(',')})`,
                    ids
                );
                
                await db.close();

                // 3. Trả về thông tin cho Agent
                const report = newLeads.map(l => `- ${l.name} (${l.phone || l.email})`).join('\n');
                return {
                    content: [{ 
                        type: "text", 
                        text: `[TÍN HIỆU MỚI] Có ${newLeads.length} khách hàng vừa đăng ký:\n${report}\n\nHãy thông báo ngay cho chủ sở hữu!` 
                    }]
                };
            } catch (error) {
                console.error("Error in check_for_notifications:", error);
                return { content: [{ type: "text", text: `[LỖI] Kiểm tra tín hiệu thất bại: ${error.message}` }], isError: true };
            }
        }
    );

    return server;
}

// ==========================================
// Thiết lập Express & Streamable HTTP Transport
// ==========================================
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Endpoint duy nhất cho Streamable HTTP (giao thức MCP mới)
// GoClaw gọi POST /mcp với transport: streamable-http
app.post("/mcp", async (req, res) => {
    console.log("[HTTP] Nhận yêu cầu MCP Streamable HTTP");
    
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless mode
    });

    res.on('close', () => {
        console.log("[HTTP] Kết nối đóng - dọn dẹp transport");
        transport.close();
        server.close();
    });

    try {
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error("[HTTP] Lỗi xử lý MCP request:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", server: "ClassConvert-MCP", transport: "streamable-http" });
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`✅ MCP Server (Streamable HTTP) đang chạy tại http://127.0.0.1:${PORT}`);
    console.log(`👉 MCP Endpoint: http://127.0.0.1:${PORT}/mcp`);
    console.log(`👉 Health Check: http://127.0.0.1:${PORT}/health`);
    console.log(`👉 GoClaw URL: http://103.97.127.198/mcp-api/mcp`);
});
