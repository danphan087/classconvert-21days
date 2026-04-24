# Hướng dẫn Deploy lên VPS Ubuntu

## 1. Môi trường cần thiết
- Node.js (phiên bản 18.x trở lên)
- PM2 (để giữ server chạy ngầm)
- Git

## 2. Các biến môi trường (.env)
Bạn cần tạo file `.env` tại thư mục root của dự án trên VPS và điền các giá trị sau:

```env
PORT=3000
RESEND_API_KEY=your_resend_api_key
SEPAY_API_KEY=your_sepay_api_key
SEPAY_ACCOUNT_NUMBER=29947747
SUPABASE_URL=https://rypaiacnnorwxjaywhcd.supabase.co
SUPABASE_KEY=sb_publishable_ThnqQjrR_ch32dsVyqlBwQ_WQmwv46q
```

*Lưu ý: Mặc dù Supabase Key là publishable key, nhưng việc giữ nó trong `.env` giúp dễ dàng thay đổi và bảo vệ khỏi việc bị scan trực tiếp trên mã nguồn.*

## 3. Lệnh chạy Server

1. **Clone repo về VPS:**
   ```bash
   git clone https://github.com/danphan087/classconvert-21days.git
   cd classconvert-21days
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Tạo file .env và điền thông tin (như mục 2)**

4. **Chạy server bằng PM2:**
   ```bash
   # Cài pm2 nếu chưa có: npm install -g pm2
   pm2 start server.js --name "classconvert"
   pm2 save
   pm2 startup
   ```

## 4. Thông tin Cổng (Port)
Server mặc định lắng nghe ở **cổng 3000** (hoặc cổng được định nghĩa trong biến `PORT` của file `.env`).
Bạn có thể cấu hình Nginx làm Reverse Proxy trỏ domain về cổng này.
