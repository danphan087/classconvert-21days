import os
from gen_image import generate_image
from dotenv import load_dotenv

load_dotenv()

def test_minimalist_pixel_art():
    print("Đang tạo 1 ảnh Minimalist Pixel Art (Đơn giản hơn) để test...")
    
    prompt = "A simple, minimalist 8-bit pixel art illustration of a Vietnamese teacher standing in a clean, modern classroom. Flat colors, simple shapes, retro 8-bit game aesthetic. Minimalist background, very clean pixel lines. High contrast."
    
    output_path = "../output/minimalist_pixel_art_test.png"
    img_url = generate_image(prompt, output_path)
    
    if img_url:
        print(f"Thành công! Ảnh đã được lưu tại: {output_path}")
    else:
        print("Lỗi tạo ảnh.")

if __name__ == "__main__":
    test_minimalist_pixel_art()
