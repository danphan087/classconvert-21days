import os
import sys
from gen_image import generate_image
from gen_caption import generate_text
from post_facebook import post_to_facebook

# Add assets path
ASSETS_DIR = "../assets"
OUTPUT_DIR = "../output"

def load_asset(filename):
    with open(os.path.join(ASSETS_DIR, filename), 'r', encoding='utf-8') as f:
        return f.read()

def test_mode_1():
    print("--- [START TEST MODE 1: ORGANIC POST (DRY RUN)] ---")
    
    topic = "Chia sẻ kinh nghiệm dùng AI agent thay nhân viên"
    brand_voice = "Trực diện, đời thường, thân thiện, dùng 'tôi/mình' linh hoạt, tránh sáo rỗng."
    caption_templates = load_asset("caption-templates.md")
    image_templates = load_asset("image-prompt-templates.md")
    
    # Bước A: Gen 3 ý tưởng
    print("\nĐang lên ý tưởng...")
    sys_prompt_idea = "Bạn là một Content Strategist. Hãy gợi ý 3 tiêu đề và angle bài đăng organic cho Facebook."
    user_prompt_idea = f"Chủ đề: {topic}. Viết cho đối tượng giáo viên online."
    ideas = generate_text(sys_prompt_idea, user_prompt_idea)
    print(f"Ý tưởng gợi ý:\n{ideas}")
    
    # Giả lập User chọn ý số 1
    chosen_idea = "AI Agent: Nhân sự số không bao giờ nghỉ phép"
    print(f"\nGiả lập User chọn ý tưởng: {chosen_idea}")
    
    # Bước B: Gen FULL CONTENT
    print("\nĐang tạo ảnh và caption hoàn chỉnh...")
    
    # Gen Caption
    sys_prompt_cap = f"Bạn là một Content Creator chuyên nghiệp. Brand Voice: {brand_voice}\nTemplates: {caption_templates}"
    user_prompt_cap = f"Viết 1 bài đăng Facebook hoàn chỉnh cho ý tưởng: {chosen_idea}. Nhấn mạnh lợi ích tự động hóa cho giáo viên."
    caption = generate_text(sys_prompt_cap, user_prompt_cap)
    
    # Gen Image
    img_prompt_context = f"A bright, high-quality stock photo of a smiling Vietnamese teacher wearing a professional blazer, standing in a well-lit modern classroom holding a tablet. Soft natural daylight from large windows. Shallow depth of field with softly blurred students sitting in the foreground. High-key lighting, pure real-life photography, 8k. Phong cách: {image_templates}"
    img_url = generate_image(img_prompt_context, os.path.join(OUTPUT_DIR, "organic_post_test.png"))
    
    # Bước C & D: Post (Dry Run)
    print("\nĐang tiến hành đăng bài (Preview/Post)...")
    result = post_to_facebook(img_url, caption)
    
    print("\n--- [TEST MODE 1 HOÀN TẤT] ---")

if __name__ == "__main__":
    test_mode_1()
