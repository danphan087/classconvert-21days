import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_text(system_prompt, user_prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7
        )
        text = response.choices[0].message.content.strip()
        
        # Clean labels like **Hook:**, **Body:**, etc.
        labels_to_remove = ["**Hook:**", "**Body:**", "**Soft CTA:**", "**Strong CTA:**", "**Hashtags:**", "Hook:", "Body:", "Soft CTA:", "Strong CTA:", "Hashtags:"]
        for label in labels_to_remove:
            text = text.replace(label, "")
            
        return text.strip()
    except Exception as e:
        print(f"Error generating text: {e}")
        print("Retrying once...")
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )
            text = response.choices[0].message.content.strip()
            for label in ["**Hook:**", "**Body:**", "**Soft CTA:**", "**Strong CTA:**", "**Hashtags:**", "Hook:", "Body:", "Soft CTA:", "Strong CTA:", "Hashtags:"]:
                text = text.replace(label, "")
            return text.strip()
        except Exception as retry_e:
            print(f"Retry failed: {retry_e}")
            return None

if __name__ == "__main__":
    import argparse
    import sys
    parser = argparse.ArgumentParser(description="Generate text via GPT-4o")
    parser.add_argument("--system", help="System prompt", required=True)
    parser.add_argument("--user", help="User prompt", required=True)
    args = parser.parse_args()
    
    text = generate_text(args.system, args.user)
    if text:
        print(f"CAPTION_TEXT:\n{text}")
    else:
        print("Failed to generate caption.", file=sys.stderr)

