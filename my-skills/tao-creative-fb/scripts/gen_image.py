import os
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_image(prompt, output_filename=None):
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        image_url = response.data[0].url
        
        # Lưu file về máy nếu có yêu cầu tên file output
        if output_filename:
            os.makedirs(os.path.dirname(output_filename) or '.', exist_ok=True)
            img_data = requests.get(image_url).content
            with open(output_filename, 'wb') as handler:
                handler.write(img_data)
                
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        print("Retrying once...")
        try:
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )
            image_url = response.data[0].url
            if output_filename:
                os.makedirs(os.path.dirname(output_filename) or '.', exist_ok=True)
                img_data = requests.get(image_url).content
                with open(output_filename, 'wb') as handler:
                    handler.write(img_data)
            return image_url
        except Exception as retry_e:
            print(f"Retry failed: {retry_e}")
            return None

if __name__ == "__main__":
    import argparse
    import sys
    parser = argparse.ArgumentParser(description="Generate image via DALL-E 3")
    parser.add_argument("prompt", help="The image generation prompt")
    parser.add_argument("--output", help="Output filename", default=None)
    args = parser.parse_args()
    
    url = generate_image(args.prompt, args.output)
    if url:
        print(f"IMAGE_URL: {url}")
    else:
        print("Failed to generate image.", file=sys.stderr)

