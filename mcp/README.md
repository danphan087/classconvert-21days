# ClassConvert MCP Server

Server này cung cấp các tính năng quản lý Landing Page và Khách hàng cho ClassConvert thông qua Model Context Protocol (MCP).
Goclaw (hoặc bất kỳ AI Agent nào) có thể kết nối tới server này qua HTTP (SSE) để thay mặt bạn thực hiện tác vụ.

## 1. Yêu cầu hệ thống
- Node.js >= 18
- Cùng nằm trên thư mục chứa `brain.db` và `.env` của website chính.

## 2. Các hàm (Tools) được hỗ trợ
1. **`get_leads_report`**: Xem danh sách khách hàng mới nhất.
2. **`trigger_manual_email`**: Gửi email thủ công (checklist/welcome) qua Resend.
3. **`update_site_content`**: Đổi tiêu đề Landing Page (`hero_title`) hoặc Giá bán (`price`).

## 3. Cài đặt và Chạy thử nghiệm Local

1. Di chuyển vào thư mục `mcp`:
   ```bash
   cd /opt/my-website/mcp
   ```
2. Cài đặt thư viện:
   ```bash
   npm install
   ```
3. Chạy server:
   ```bash
   node server.js
   ```

Server sẽ listen tại `http://127.0.0.1:3001`.

## 4. Deploy lên VPS (Sử dụng Systemd)

Để MCP server luôn chạy ngầm trên VPS (giống như website chính), hãy tạo một service systemd.

**Bước 1: Tạo file service**
Mở terminal VPS và chạy lệnh:
```bash
nano /etc/systemd/system/classconvert-mcp.service
```

**Bước 2: Dán nội dung sau vào file** (Sửa `/opt/my-website` thành đường dẫn thực tế của bạn trên VPS):
```ini
[Unit]
Description=ClassConvert MCP Server
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=root
WorkingDirectory=/opt/my-website/mcp
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**Bước 3: Khởi động service**
```bash
systemctl daemon-reload
systemctl enable classconvert-mcp
systemctl start classconvert-mcp
systemctl status classconvert-mcp
```
