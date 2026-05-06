---
name: "Tạo Video AI"
slug: "tao-video-ai"
description: "Skill giúp agent tạo video AI ngắn 15-25s sử dụng Freepik/Magnific (Seedream 4.5 & Kling 3.0)."
---
# Quy Trình Sản Xuất Video AI (Skill: tao-video-ai)
Dùng cho nền tảng: Freepik / Magnific (Seedream 4.5 sinh ảnh + Kling 3.0 làm video)

## Giới thiệu
Đây là quy trình tự động hóa sản xuất video ngắn (15-25s) cho ClassConvert.
Luồng hoạt động: Sinh Kịch bản -> Sinh Ảnh tĩnh (Seedream 4.5 / Freepik Mystic) -> Tạo Video chuyển động (Kling 3.0) qua API -> Gửi Telegram -> Đăng bài.

## Quy Trình 7 Bước Thực Thi (Dành cho Agent)

### BƯỚC 1: Lên ý tưởng & Kịch bản (Storyboard)
- Đọc ngữ cảnh trong `my-business.md` (Sản phẩm ClassConvert).
- Xác định 1 Topic phù hợp (VD: Xây phễu tuyển sinh, Tự động hóa lớp học, Thoát khỏi làm thủ công).
- Phân tách thành 3-5 scene (cảnh), mỗi cảnh 4-5s.

### BƯỚC 2: Sinh Prompt cho Ảnh (Seedream / Mystic)
- Gọi script `scripts/gen-prompt.py` hoặc sử dụng LLM của chính Agent để dịch kịch bản thành Prompt Tiếng Anh chuẩn tả thực.
- Tham khảo `assets/brand-style.md` để đảm bảo tone màu chuyên nghiệp (luxury minimal, tech, B2B).
- *Tạm thời trong skill này, nếu không gọi API tạo ảnh, Agent có thể bỏ qua bước sinh ảnh và dùng Text-to-Video trực tiếp ở Bước 3.*

### BƯỚC 3: Gửi Lệnh Sinh Video (Upload)
- Sử dụng script `my-skills/tao-video-ai/scripts/upload-freepik.py` để đẩy lệnh tạo video lên API.
- Lệnh Terminal mẫu: 
  `python my-skills/tao-video-ai/scripts/upload-freepik.py --prompt "A slow gentle orbit shot of a professional teacher working on a laptop, warm sunlight, cinematic" --ratio "9:16" --duration "5"`
- Script sẽ chạy cực nhanh và trả về cho bạn một cái `TASK ID` (ví dụ: `0061320e-...`).

### BƯỚC 4: Kiểm tra trạng thái Video (Check Status)
- Vì video AI render mất 2-5 phút, bạn KHÔNG ĐƯỢC TỰ Ý BỊA ĐƯỜNG LINK TỪ TASK ID.
- Lấy `TASK ID` ở Bước 3 và chạy lệnh:
  `python my-skills/tao-video-ai/scripts/check-freepik.py --task "ĐIỀN_TASK_ID_VÀO_ĐÂY"`
- Nếu kết quả trả về là "VẪN ĐANG XỬ LÝ", hãy chủ động báo với User: *"Video đang được render, anh chờ xíu nhé..."*, rồi vài phút sau bạn hãy tự động gọi lại lệnh check đó cho đến khi lấy được URL thực sự.

### BƯỚC 5: Gửi Preview qua Telegram
- Khi lấy được Video URL thật, báo cáo cho user: "Anh ơi, em làm xong video rồi, anh xem thử nhé!" kèm theo Link MP4.
- Chờ User phản hồi "OK" hoặc yêu cầu sửa đổi.

### BƯỚC 6: Đăng Bài (Tích hợp tao-creative-fb)
- Khi User duyệt, lấy nội dung bài đăng (Caption) đã chuẩn bị ở Bước 1.
- Gửi lệnh lên Facebook Page, Reels, hoặc TikTok.
