# 📘 Hướng dẫn Vận hành Hệ thống ClassConvert 21-Day Challenge

Chào mừng bạn đến với hệ thống Sales Funnel tự động của ClassConvert. Tài liệu này hướng dẫn bạn cách quản trị và vận hành toàn bộ quy trình từ thu thập khách hàng đến tự động hóa thanh toán.

---

## 🏗️ 1. Cấu trúc Hệ thống (The Ecosystem)

*   **Landing Page (`/`):** Nơi phễu bắt đầu. Khách hàng bấm "Tham gia danh sách chờ" -> Nhận 3 Email Marketing.
*   **Trang Thanh Toán (`/thanhtoan`):** Nơi chốt đơn. Khách hàng quét mã QR -> Hệ thống xác nhận tiền -> Nhận Email 4 (Xác nhận đơn hàng).
*   **Admin Dashboard (`/admin`):** "Bàn làm việc" của bạn. Theo dõi đơn hàng, khách hàng và kích hoạt Email thủ công.
*   **Email Engine (`/api/automate-emails.js`):** "Linh hồn" của hệ thống, kết nối với Resend để gửi thư.

---

## 📧 2. Cách Quản lý & Thay đổi Nội dung Email

Toàn bộ nội dung thư đều nằm trong file: `api/automate-emails.js`.

### Cách sửa thư:
1. Mở file `api/automate-emails.js`.
2. Tìm đến hằng số `const emails = { ... }`.
3. Tại đây bạn có thể sửa:
    - `subject`: Tiêu đề thư (Hãy giữ số thứ tự 1, 2, 3 để tránh bị Gmail gộp thư).
    - `html`: Nội dung thư. Bạn có thể dùng HTML cơ bản để làm thư đẹp hơn.

> [!TIP]
> **Email 3** là email quan trọng nhất vì nó chứa Link dẫn đến trang thanh toán. Hãy đảm bảo link trong nút bấm luôn là `https://alpha.classconvert.vn/thanhtoan`.

---

## 🛡️ 3. Quản trị trong trang Admin

Truy cập: `https://alpha.classconvert.vn/admin`

*   **Thêm Khách hàng thủ công:** Khi bạn có khách từ nguồn khác (Facebook, Zalo), hãy vào tab **Khách hàng** -> **Thêm mới**.
*   **Kích hoạt thư xác nhận:** Nếu khách hàng đã chuyển khoản nhưng gặp trục trặc kỹ thuật không nhận được thư, hãy tìm họ trong bảng Admin và bấm nút **"Tạo đơn"**. Hệ thống sẽ ngay lập tức bắn Email 4 cho họ.
*   **Check Đơn hàng:** Xem lịch sử mua hàng thực tế của khách tại tab **Đơn hàng**.

---

## ⚙️ 4. Xử lý sự cố (Troubleshooting)

### Khách hàng không nhận được Email?
1.  **Kiểm tra Resend:** Truy cập [resend.com/logs](https://resend.com/logs) để xem thư có bị báo lỗi "Bounced" (Địa chỉ sai) hay không.
2.  **Kiểm tra số điện thoại (Trùng lặp):** Hệ thống được cài đặt để một SĐT chỉ được là khách hàng 1 lần. Nếu khách hàng cố tình dùng lại SĐT cũ với Email mới, hệ thống DB sẽ báo lỗi. Hãy ưu tiên dùng SĐT làm mã định danh duy nhất.
3.  **Hết hạn hạn mức:** Tài khoản Resend miễn phí có giới hạn gửi hàng ngày. Nếu bạn gửi quá nhiều trong 1 ngày, hãy nâng cấp tài khoản Resend.

---

## 🚀 5. Quy trình thêm Sản phẩm mới

1. Vào Admin -> Tab **Sản phẩm** -> **Thêm mới**.
2. Sau khi thêm, hãy ghi nhớ **ID** của sản phẩm đó.
3. Để trang Thanh toán thu tiền sản phẩm mới, bạn cần vào trang `/thanhtoan/index.html` và cập nhật cấu hình cho đúng số tiền bạn muốn thu.

---

**ClassConvert - Tự động hóa để bứt phá.**
Nếu cần hỗ trợ kỹ thuật chuyên sâu, hãy liên hệ đội ngũ Dev của bạn.
