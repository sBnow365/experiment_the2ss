import google.generativeai as genai
from src.config.settings import GEMINI_API_KEY
from pathlib import Path

genai.configure(api_key=GEMINI_API_KEY)

class CaptionAgent:
    def __init__(self):
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")

    def generate(self, image_path: str) -> str:
        image_bytes = Path(image_path).read_bytes()

        prompt = (
            "Generate a professional image caption:\n"
            "- Title\n- One-line summary\n- 3 bullet points"
        )

        response = self.model.generate_content(
            [prompt, {"mime_type": "image/jpeg", "data": image_bytes}]
        )

        return response.text
