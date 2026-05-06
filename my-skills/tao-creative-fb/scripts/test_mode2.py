import os
import sys
from gen_image import generate_image
from gen_caption import generate_text

# Add assets path
ASSETS_DIR = "../assets"
OUTPUT_DIR = "../output"

def load_asset(filename):
    with open(os.path.join(ASSETS_DIR, filename), 'r', encoding='utf-8') as f:
        return f.read()

def test_mode_2():
    print("--- [START TEST MODE 2: CREATIVE ADS] ---")
    
    product_info = {
        "name": "Khoá học Vibe Coding",
        "price": "2tr",
        "usp": "Học 21 ngày có hệ thống business chạy 24/7",
        "goal": "Lead generation cho landing page"
    }
    
    brand_voice = "Trực diện, đời thường, thân thiện, dùng 'tôi/mình' linh hoạt, tránh sáo rỗng."
    caption_templates = load_asset("caption-templates.md")
    image_templates = load_asset("image-prompt-templates.md")
    
    angles = ["Pain Point", "Solution", "Social Proof"]
    
    for i, angle in enumerate(angles, 1):
        print(f"\nĐang tạo Bộ {i}: Angle {angle}...")
        
        # 1. Gen Caption
        sys_prompt = f"Bạn là một chuyên gia viết Ad Copy. Brand Voice: {brand_voice}\nTemplates: {caption_templates}"
        user_prompt = f"Viết 1 bản Ad Copy cho sản phẩm {product_info['name']} với Angle {angle}. Thông tin: {product_info['usp']}, giá {product_info['price']}. Mục tiêu: {product_info['goal']}."
        
        caption = generate_text(sys_prompt, user_prompt)
        print(f"[Caption {i} OK]")
        
        # 2. Gen Image
        img_prompt_context = f"Dựa trên angle {angle} và sản phẩm {product_info['name']}. Dùng phong cách từ template: {image_templates}"
        img_url = generate_image(img_prompt_context, os.path.join(OUTPUT_DIR, f"ads_angle_{i}.png"))
        print(f"[Image {i} OK] -> {img_url}")
        
        print(f"\n--- BỘ {i} ({angle}) ---")
        print(f"TEXT:\n{caption}")
        print(f"IMAGE: output/ads_angle_{i}.png")

    print("\n--- [TEST MODE 2 HOÀN TẤT] ---")

if __name__ == "__main__":
    test_mode_2()
