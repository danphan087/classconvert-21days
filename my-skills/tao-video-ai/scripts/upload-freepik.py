import os
import time
import argparse
import requests
import json
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()
API_KEY = os.getenv("FREEPIK_API_KEY")

def generate_video(prompt, start_image_url=None, aspect_ratio="9:16", duration="5", cfg_scale=0.5):
    if not API_KEY:
        raise ValueError("Lỗi: Không tìm thấy FREEPIK_API_KEY trong biến môi trường.")

    url = "https://api.magnific.com/v1/ai/video/kling-v3-std"
    headers = {
        "Content-Type": "application/json",
        "x-magnific-api-key": API_KEY
    }
    
    # Payload chuẩn theo API Kling 3.0
    payload = {
        "prompt": prompt,
        "generate_audio": False, # Thường video AI không cần audio native, ghép sau bằng Capcut tốt hơn
        "aspect_ratio": aspect_ratio,
        "duration": str(duration),
        "negative_prompt": "blur, distort, low quality, morphed, extra limbs, bad anatomy, bad text",
        "cfg_scale": cfg_scale
    }
    
    if start_image_url:
        payload["start_image_url"] = start_image_url

    print(f"🚀 Đang gửi yêu cầu tạo video lên Magnific/Freepik (Kling 3 Std)...")
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code != 200:
        print(f"❌ Lỗi API: {response.status_code} - {response.text}")
        return None
        
    data = response.json()
    
    # In raw JSON để dễ theo dõi
    print(f"API Response: {data}")
    
    task_id = None
    if isinstance(data, dict):
        if "task_id" in data:
            task_id = data["task_id"]
        elif "id" in data:
            task_id = data["id"]
        elif "data" in data and isinstance(data["data"], dict):
            task_id = data["data"].get("task_id", data["data"].get("id"))
            
    if not task_id:
        print(f"❌ Lỗi: Không thể trích xuất task_id từ JSON.")
        return None
        
    print(f"\n✅ Đã đẩy lệnh lên máy chủ thành công!")
    print(f"👉 TASK ID: {task_id}")
    print(f"⚠️ GHI CHÚ CHO AGENT: KHÔNG được tự ý chế link. Hãy copy Task ID trên và chạy lệnh `python my-skills/tao-video-ai/scripts/check-freepik.py --task {task_id}` để kiểm tra xem video đã render xong chưa.")
    return task_id

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload prompt/image to Magnific/Freepik Kling 3 API")
    parser.add_argument("--prompt", type=str, required=True, help="Prompt cho video")
    parser.add_argument("--image", type=str, required=False, help="URL ảnh đầu vào (Image-to-Video)")
    parser.add_argument("--ratio", type=str, default="9:16", help="Tỉ lệ khung hình (16:9, 9:16, 1:1)")
    parser.add_argument("--duration", type=str, default="5", help="Thời lượng (3 đến 15)")
    
    args = parser.parse_args()
    
    generate_video(
        prompt=args.prompt, 
        start_image_url=args.image, 
        aspect_ratio=args.ratio,
        duration=args.duration
    )
