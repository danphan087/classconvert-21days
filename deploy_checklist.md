# Deploy Checklist — ClassConvert lên VPS Linux

---

## (1) Dự án đang dùng gì?

**Stack chính:**
- Frontend: HTML thuần + Tailwind CSS (CDN) + JavaScript vanilla
- Backend/API: Node.js (ES Modules, `"type": "module"`) — yêu cầu **Node 18.x trở lên**
- Email: Resend API (đọc từ `process.env.RESEND_API_KEY`)
- Thanh toán: SePay (QR code + polling API, key đọc từ `process.env.SEPAY_API_KEY`)
- Database: SQLite (`brain.db`) — chỉ dùng cho AI brain, không phục vụ runtime
- Build tool: `build.cjs` để bundle frontend thành `dist/index.html`
- Git remote: `https://github.com/danphan087/classconvert-21days.git` (private repo)

**Cấu trúc thư mục quan trọng:**
```
index.html          → Landing page chính
script.js           → Logic frontend (SePay checkout, carousel...)
style.css           → CSS riêng
server.js           → Node.js server, route /api/* và serve static files
api/                → 3 API handlers (Node.js ES Modules)
  automate-emails.js
  check-payment.js
  send-email.js
thanhtoan/          → Trang thanh toán (dùng ../script.js)
ebook/              → Trang nhận hàng sau mua
admin/              → Trang admin
.env                → Secret keys (KHÔNG commit lên git)
.gitignore          → Bảo vệ .env, brain.db, node_modules
```

---

## (4) Danh sách đầy đủ cần chuẩn bị trước khi deploy

### Bảo mật
- [x] Tạo `.gitignore` — bảo vệ `.env`, `resend_config.txt`, `brain.db`, `node_modules`
- [x] Tạo `.env` — tập trung toàn bộ secret (Resend, SePay, Supabase)
- [x] Xóa `resend_config.txt` khỏi thư mục dự án
- [x] Chuyển Resend API Key sang `.env` → `automate-emails.js` và `send-email.js` đọc từ `process.env`
- [x] Chuyển SePay API Key ra khỏi `script.js` → `check-payment.js` đọc từ `process.env.SEPAY_API_KEY`
- [ ] ⚠️ **Rotate Resend API Key** — `resend_config.txt` đã được commit lên GitHub (commit `ebae05a`), key cũ nằm trong git history. Cần tạo key mới trên [resend.com/api-keys](https://resend.com/api-keys) rồi cập nhật `.env` trên VPS
- [ ] ⚠️ **Rotate SePay API Key** — `script.js` chứa key đã được commit nhiều lần lên GitHub. Cần tạo key mới trên dashboard SePay rồi cập nhật `.env` trên VPS

### Code
- [x] Viết `server.js` để handle `/api/*` và serve toàn bộ static files
- [x] Đổi `build.js` → `build.cjs` để tránh xung đột CommonJS/ESM
- [x] Cập nhật `package.json` với `scripts.start` và `scripts.build`
- [x] Đường dẫn `../script.js` trong `thanhtoan/index.html` — hợp lệ, `server.js` đã xử lý serve đúng path này

### Server / Môi trường (làm trên VPS)
- [ ] Cài **Node.js 18.x trở lên**: `nvm install 18 && nvm use 18`
- [ ] Cài **PM2**: `npm install -g pm2`
- [ ] Cài **Nginx**: `apt install nginx`
- [ ] Upload code lên VPS (git clone hoặc scp)
- [ ] Tạo file `.env` trên VPS với các key mới sau khi rotate
- [ ] Chạy server: `pm2 start server.js --name classconvert`
- [ ] Cấu hình Nginx proxy `/api/*` đến `localhost:3000`, serve static qua Node

### Domain & SSL
- [ ] Trỏ domain về IP VPS
- [ ] Cài SSL: `certbot --nginx -d yourdomain.com`

### Sau khi deploy
- [ ] Test toàn bộ luồng: điền form → nhận email → thanh toán → nhận ebook
- [ ] Kiểm tra console browser không có lỗi
- [ ] Bật log monitoring: `pm2 logs classconvert`
