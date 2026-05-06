import os
import argparse
import requests
from dotenv import load_dotenv

# Tải biến môi trường
load_dotenv()
API_KEY = os.getenv("FREEPIK_API_KEY")

def check_task(task_id):
    url = f"https://api.magnific.com/v1/ai/video/kling-v3/{task_id}"
    headers = {"x-magnific-api-key": API_KEY}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"❌ Lỗi gọi API: {response.status_code} - {response.text}")
        return
        
    data = response.json()
    # Lấy status từ các cấu trúc JSON khác nhau có thể trả về
    status = data.get("data", {}).get("status", data.get("status"))
    
    if status == "COMPLETED":
        urls = data.get("data", {}).get("generated", data.get("generated", []))
        if urls:
            print(f"\n🎉 THÀNH CÔNG! VIDEO URL: {urls[0]}")
        else:
            print(f"\n❌ Báo là COMPLETED nhưng mảng generated bị rỗng: {data}")
    elif status in ["FAILED", "ERROR"]:
        print(f"\n❌ Lỗi tạo video từ Freepik. Dữ liệu: {data}")
    else:
        print(f"\n⏳ VẪN ĐANG XỬ LÝ (Trạng thái: {status}). Vui lòng chờ 30 giây - 1 phút rồi chạy lại lệnh check này nhé!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Kiểm tra trạng thái render video Freepik Kling")
    parser.add_argument("--task", type=str, required=True, help="Mã Task ID để kiểm tra")
    
    args = parser.parse_args()
    check_task(args.task)
