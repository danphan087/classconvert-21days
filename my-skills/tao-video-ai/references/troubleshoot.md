# Cẩm Nang Gỡ Lỗi (Troubleshooting) API Tạo Video

Dành cho Agent khi gặp lỗi trong quá trình sinh video thông qua Kling 3.0 / Freepik.

## 1. Lỗi: "Không tìm thấy FREEPIK_API_KEY"
- **Nguyên nhân:** Môi trường thực thi chưa load được biến môi trường từ file `.env`.
- **Cách xử lý:** Script hiện đã được cài đặt cứng để tìm file `.env` ở thư mục `/var/lib/docker/volumes/goclaw_goclaw-workspace/_data/nhat-ha/nhat-ha/.env`. Hãy báo cho user nếu lỗi này vẫn xảy ra để user kiểm tra file `.env`.

## 2. Lỗi: Bị "Ảo giác" Link Video (Timeout Error)
- **Dấu hiệu:** Agent tự ý tạo ra một link CDN `https://cdn-magnific.freepik.com/videos/video_KLING...` nhưng khi bấm vào bị lỗi Access Denied hoặc Error Reference từ Akamai.
- **Nguyên nhân:** Bạn (Agent) đã lấy `Task ID` và tự biên tự diễn đoạn URL mà không thông qua bước lấy Token bảo mật.
- **Cách xử lý Đ BẮT BUỘC:** NGHIÊM CẤM TỰ TẠO LINK. Luôn sử dụng lệnh `python scripts/check-freepik.py --task <ID>` để chờ và lấy URL thực sự do API nhả ra.

## 3. Lỗi: Video bị méo hình, khuôn mặt biến dạng (Morphing)
- **Nguyên nhân:** Prompt yêu cầu camera di chuyển quá mạnh hoặc nhân vật di chuyển quá nhanh.
- **Cách xử lý:** Khuyên user sinh lại cảnh khác. Sửa lại prompt: Thêm từ khóa `static camera`, `slow motion`, `subtle movement`. Đảm bảo `negative-prompt.txt` luôn được áp dụng.

## 4. Lỗi: Lệnh Check trả về FAILED hoặc ERROR
- **Nguyên nhân:** Prompt vi phạm chính sách nội dung (NSFW, bạo lực) của hệ thống Magnific/Kling, hoặc hệ thống Kling đang quá tải.
- **Cách xử lý:** Báo cáo ngay cho User để điều chỉnh lại từ ngữ trong prompt (tránh các từ nhạy cảm) và tiến hành Submit lại Task mới.
