import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTest() {
    console.log("🚀 Đang khởi động MCP Server...");
    
    // Khởi động server.js dưới dạng child process
    const serverProcess = spawn('node', ['server.js'], { cwd: __dirname });
    
    serverProcess.stdout.on('data', (data) => {
        console.log(`[Server]: ${data.toString().trim()}`);
    });
    serverProcess.stderr.on('data', (data) => {
        console.error(`[Server Error]: ${data.toString().trim()}`);
    });

    // Đợi server khởi động (2 giây)
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("\n🔌 Đang kết nối tới MCP Server qua SSE...");
    const transport = new SSEClientTransport(new URL("http://localhost:3001/sse"));
    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    
    try {
        await client.connect(transport);
        console.log("✅ Đã kết nối thành công!\n");

        console.log("======================================");
        console.log("🧪 TEST 1: update_site_content");
        console.log("======================================");
        const result1 = await client.callTool({
            name: "update_site_content",
            arguments: { type: "hero_title", new_value: "Hệ thống tự động tuyển sinh 24/7" }
        });
        console.log("Kết quả:", result1.content[0].text, "\n");

        console.log("======================================");
        console.log("🧪 TEST 2: get_leads_report");
        console.log("======================================");
        const result2 = await client.callTool({
            name: "get_leads_report",
            arguments: { limit: 3 }
        });
        console.log("Kết quả:", result2.content[0].text, "\n");

        console.log("======================================");
        console.log("🧪 TEST 3: trigger_manual_email (TEST MODE)");
        console.log("======================================");
        const result3 = await client.callTool({
            name: "trigger_manual_email",
            arguments: { email: "phanlong0807+testmcp@gmail.com", template_type: "welcome" }
        });
        console.log("Kết quả:", result3.content[0].text, "\n");

    } catch (err) {
        console.error("❌ Lỗi trong quá trình test:", err.message);
    } finally {
        // Dọn dẹp
        transport.close();
        serverProcess.kill();
        console.log("🛑 Đã tắt server và kết thúc bài test.");
        process.exit(0);
    }
}

runTest();
