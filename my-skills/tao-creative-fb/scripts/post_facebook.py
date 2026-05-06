import os
import requests
from dotenv import load_dotenv

load_dotenv()

def post_to_facebook(image_url, caption_text):
    is_dry_run = os.getenv("DRY_RUN", "false").lower() == "true"
    
    if is_dry_run:
        print("\n--- [DRY RUN MODE] ---")
        print("Sẽ KHÔNG post lên Facebook thật.")
        print(f"Image URL:\n{image_url}")
        print(f"Caption:\n{caption_text}")
        print("----------------------\n")
        return {"success": True, "dry_run": True, "id": "dry_run_fake_id"}
        
    page_id = os.getenv("FB_PAGE_ID")
    page_token = os.getenv("FB_PAGE_TOKEN")
    
    if not page_id or not page_token:
        print("Lỗi: FB_PAGE_ID hoặc FB_PAGE_TOKEN bị thiếu trong file .env")
        return {"success": False, "error": "Missing credentials"}
        
    # Endpoint upload ảnh và post kèm message
    url = f"https://graph.facebook.com/v18.0/{page_id}/photos"
    
    payload = {
        "url": image_url,
        "message": caption_text,
        "access_token": page_token
    }
    
    try:
        response = requests.post(url, data=payload)
        result = response.json()
        
        if response.status_code == 200:
            print(f"Đăng bài lên Facebook thành công! Post ID: {result.get('id')}")
            return {"success": True, "id": result.get('id')}
        else:
            print(f"Facebook API Error: {result}")
            return {"success": False, "error": result}
    except Exception as e:
        print(f"Lỗi khi gọi Facebook API: {e}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import argparse
    import sys
    parser = argparse.ArgumentParser(description="Post to Facebook Fanpage")
    parser.add_argument("--image", help="Image URL to post", required=True)
    parser.add_argument("--caption", help="Caption text for the post", required=True)
    args = parser.parse_args()
    
    res = post_to_facebook(args.image, args.caption)
    if res.get("success"):
        print("Facebook post successful!")
        if "id" in res:
            print(f"POST_ID: {res['id']}")
    else:
        print(f"Failed to post to Facebook: {res.get('error')}", file=sys.stderr)
