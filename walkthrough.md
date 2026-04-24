# ClassConvert Automation Sales Funnel - Walkthrough

Hệ thống này được thiết kế để tự động hóa hoàn toàn quy trình từ thu thập khách hàng tiềm năng (Lead Generation) đến chốt đơn và bàn giao sản phẩm.

## 1. Bản đồ Luồng Khách hàng (User Journey)
1. **Landing Page**: Khách hàng bấm "Tham gia danh sách chờ" -> Điền Form Popup.
2. **Nurture Sequence**: Hệ thống gửi ngay chuỗi 3 Email (đánh số 1, 2, 3) vào hòm thư khách hàng.
3. **Checkout Selection**: Khách hàng mở Email 3, bấm Link mua hàng -> Chuyển hướng tới `alpha.classconvert.vn/thanhtoan`.
4. **Payment**: Khách hàng quét mã QR (5.000đ).
5. **Confirmation**: Sau khi thanh toán thành công, hệ thống gửi Email 4 (Xác nhận & Link tải Ebook) từ domain `classconvert.vn`.

## 2. Các thành phần Kỹ thuật
- **Frontend**: HTML5, TailwindCSS, Vanilla JS.
- **Backend API**: Vercel Serverless Functions (`/api/automate-emails.js`).
- **Database**: Supabase (Bảng: `customers`, `products`, `orders`).
- **Email Engine**: Resend (Domain: `classconvert.vn`).
- **Cổng thanh toán**: SePay (Tự động quét biến động số dư).

## 3. Hướng dẫn Quản trị (Admin)
Truy cập: `alpha.classconvert.vn/admin`

### Thêm Khách hàng thủ công:
- Chọn tab **Khách hàng** -> **Thêm mới**. Nhập thông tin.
- **Lưu ý**: Số điện thoại là định danh duy nhất, không được nhập trùng.

### Kích hoạt Email Xác nhận (Email 4) bằng tay:
- Trong danh sách Khách hàng, bấm nút **"Tạo đơn"** ở dòng khách hàng tương ứng.
- Hệ thống sẽ tự động tạo một đơn hàng mới trong Database và bắn Email 4 về hòm thư khách hàng đó.

## 4. Các lưu ý quan trọng để vận hành bền vững
- **API Key**: Resend API Key được lưu tại `resend_config.txt`. Tuyệt đối không để lộ file này.
- **Cấu hình Email**: Hiện tại chuỗi 3 email đầu đang để chế độ gửi liên tục (cách nhau 1s) để phục vụ việc kiểm thử. Khi chạy thực tế, bạn có thể chỉnh lại hàm `sleep()` trong file `api/automate-emails.js` sang 24 giờ (`sleep(1000 * 60 * 60 * 24)`).
- **Domain**: Luôn đảm bảo Status của Domain trên Resend là `Verified`.

---
*Tài liệu được biên soạn bởi Antigravity dành cho ClassConvert 21-Days Challenge.*
