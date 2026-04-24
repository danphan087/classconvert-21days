# MCP Functions Draft for ClassConvert (Finalized)

Dưới đây là bộ 3 hàm MCP được chọn để sếp điều hành ClassConvert trực tiếp qua Telegram.

---

### 1. get_leads_report
- **Input params:** `limit` (integer, số lượng khách mới nhất, mặc định là 5)
- **Output dự kiến:** Danh sách (Tên, SĐT, Email, Trạng thái đơn hàng) của các khách hàng mới nhất.
- **Tình huống dùng hàng ngày:** Sếp muốn biết sáng nay có bao nhiêu người vừa quan tâm hoặc đã xuống tiền mua Checklist.
- **Ví dụ câu nhắn Telegram:** 
    - "Cho anh xem 5 người mới đăng ký gần nhất"
    - "Hôm nay có ai mới không?"
- **Độ ưu tiên:** 5/5

### 2. trigger_manual_email
- **Input params:** `email` (string), `template_type` (string: "checklist" hoặc "welcome")
- **Output dự kiến:** Trạng thái gửi thành công/thất bại từ hệ thống Resend.
- **Tình huống dùng hàng ngày:** Xử lý sự cố gửi mail tự động hoặc gửi tặng tài liệu cho đối tác/khách hàng VIP ngay lập tức.
- **Ví dụ câu nhắn Telegram:** 
    - "Gửi lại email checklist cho địa chỉ phanlong@gmail.com"
    - "Bắn mail welcome cho khách abc@gmail.com giúp anh"
- **Độ ưu tiên:** 5/5

### 3. update_site_content
- **Input params:** `type` (string: "hero_title" hoặc "price"), `new_value` (string)
- **Output dự kiến:** Trạng thái cập nhật Database thành công và yêu cầu xác nhận hiển thị trên Web.
- **Tình huống dùng hàng ngày:** Sếp muốn thay đổi thông điệp marketing (Headline) hoặc điều chỉnh giá bán để chạy chương trình khuyến mãi chớp nhoáng.
- **Ví dụ câu nhắn Telegram:** 
    - "Đổi tiêu đề landing thành: Sở hữu hệ thống tuyển sinh trong 7 ngày"
    - "Giảm giá checklist xuống còn 2.000đ trong hôm nay nhé"
- **Độ ưu tiên:** 4/5
