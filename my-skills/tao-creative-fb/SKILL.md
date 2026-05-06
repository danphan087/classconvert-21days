---
name: tao-creative-fb
description: "Sản xuất FULL CONTENT (cả Ảnh và Văn bản) cho Facebook. Có 2 mode: Mode 1 (Content Free - auto post) gen 3 ý tưởng -> chọn -> post tự động. Mode 2 (Creative Ads) tạo 3 bộ ảnh + copy (pain/solution/social proof) để chạy ads. Trigger Mode 1: 'tạo content cho ngày mai', 'gen bài Page', 'content free'. Trigger Mode 2: 'tạo creative ads', 'gen ads'."
---

# Skill: tao-creative-fb

## Cấp độ: Cấp 3 (Có Python scripts xử lý tự động)

## Mục đích
Tạo ra **CẢ ẢNH VÀ VĂN BẢN** hoàn chỉnh cho các bài đăng Facebook, hỗ trợ cả 2 nhu cầu: đăng nội dung hữu ích hằng ngày (Organic) và chạy quảng cáo (Ads).

## 2 Mode Hoạt Động

### MODE 1: CONTENT FREE (Auto-post Page hằng ngày)
- **Triggers:** `tạo content cho ngày mai`, `gen bài Page`, `content free`, `content organic`
- **Luồng xử lý (BẮT BUỘC PHẢI DÙNG LỆNH PYTHON):**
  1. **Bước A (Lên ý tưởng):** Agent tự động sinh ra 3 ý tưởng bài đăng (mỗi ý gồm tiêu đề và góc nhìn ngắn) dựa trên chủ đề yêu cầu hoặc business context (ClassConvert). Agent dừng lại và yêu cầu User chọn 1.
  2. **Bước B (Gen Content):** Sau khi User chọn, MÀY PHẢI chạy các lệnh terminal sau để tạo nội dung:
     - Tạo Caption: Chạy lệnh `python scripts/gen_caption.py --system "Bạn là chuyên gia Content. Viết đúng Brand Voice." --user "Viết bài Facebook 80-150 từ cho ý tưởng: <tên ý tưởng>"`
     - Tạo Ảnh: Chạy lệnh `python scripts/gen_image.py "<prompt mô tả ảnh bằng tiếng Anh chi tiết, kích thước 1024x1024>"`
  3. **Bước C (Preview):** Agent hiển thị kết quả tạo ra từ các script trên (cả ảnh và caption) cho User xem. Đợi duyệt.
  4. **Bước D (Post):** Khi User phản hồi `OK`, MÀY PHẢI chạy lệnh sau để đăng bài:
     `python scripts/post_facebook.py --image "<IMAGE_URL_TỪ_BƯỚC_TRƯỚC>" --caption "<CAPTION_TỪ_BƯỚC_TRƯỚC>"`

### MODE 2: CREATIVE ADS (Sinh hàng loạt, không tự đăng)
- **Triggers:** `tạo creative ads`, `gen ads`, `cần creative cho chiến dịch`
- **Luồng xử lý (BẮT BUỘC PHẢI DÙNG LỆNH PYTHON):**
  1. Agent nhận thông tin sản phẩm (giá, USP, mục tiêu) từ câu lệnh của User.
  2. Agent tiến hành tạo **3 BỘ CREATIVE** hoàn chỉnh. Với mỗi bộ, MÀY PHẢI chạy các lệnh terminal sau:
     - Tạo Ad Copy: `python scripts/gen_caption.py --system "Bạn là chuyên gia quảng cáo Facebook. Viết copy ngắn gọn." --user "<Yêu cầu viết copy cho góc nhìn: Pain point / Solution / Social proof>"`
     - Tạo Ảnh: `python scripts/gen_image.py "<prompt mô tả ảnh bằng tiếng Anh chi tiết, kích thước 1024x1024>"`
  3. Yêu cầu bắt buộc: 3 bộ phải theo 3 góc nhìn (Angles) khác nhau:
     - Bộ 1: Pain point (Nỗi đau)
     - Bộ 2: Solution (Giải pháp)
     - Bộ 3: Social proof (Bằng chứng thực tế/Testimonial)
  4. Agent trả kết quả hiển thị cho User để tải về và paste vào Ads Manager. **Không tự động đăng Facebook.**

## Configuration & Testing
- Các file logic nằm trong thư mục `scripts/`.
- Templates cho prompt tạo ảnh và viết bài nằm trong thư mục `assets/`.
- Cần cung cấp `OPENAI_API_KEY`, `FB_PAGE_ID`, và `FB_PAGE_TOKEN` vào file `.env` trước khi sử dụng.
- **Test Mode:** Thiết lập biến `DRY_RUN=true` trong file `.env` để chạy thử toàn bộ luồng mà không đăng thực sự lên Facebook.
