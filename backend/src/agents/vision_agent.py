import google.generativeai as genai
from src.config.settings import GEMINI_API_KEY
from src.utils.async_utils import run_blocking
import json
import re

class VisionAgent:
    def __init__(self):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel("models/gemini-2.5-flash-lite")

    async def analyze(self, image_path: str) -> dict:
        image_file = genai.upload_file(image_path)

        prompt = """
            You are a vision analysis agent.

            STRICT OUTPUT RULES:
            - Return ONLY valid JSON.
            - Do NOT wrap the response in markdown.
            - Do NOT include ``` or ```json.
            - Do NOT include explanations
            - Do NOT use markdown

            Required JSON schema:
            {
                "place_type": "",
                "name": "",
                "city": "",
                "country": ""
                "confidence": 0.0
            }
            """

# Inside your analyze method:
        response = await run_blocking(self.model.generate_content,
            [prompt, image_file],
            # This tells the API to force a JSON structure and skip the markdown
            generation_config={"response_mime_type": "application/json"}
        )       # print(response.text)
        raw = response.text
        # print("----- RAW MODEL OUTPUT START -----")
        # print(raw)
        # print("----- RAW MODEL OUTPUT END -----")
        return self._parse_response(response.text)
    
    def _parse_response(self, text: str) -> dict:
            """
            Cleans the model output and converts it to a dictionary.
            Handles markdown blocks, whitespace, and empty responses.
            """
            if not text:
                raise ValueError("The model returned an empty response.")

            # 1. Try to find JSON content between triple backticks
            # This looks for ```json {data} ``` or just ``` {data} ```
            match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
            
            if match:
                cleaned_text = match.group(1)
            else:
                # 2. If no backticks, just strip whitespace and hope for raw JSON
                cleaned_text = text.strip()

            try:
                return json.loads(cleaned_text)
            except json.JSONDecodeError as e:
                # 3. Last resort: If it still fails, show exactly what we tried to parse
                print("----- DEBUG: FAILED TO PARSE -----")
                print(f"CLEANED TEXT: {cleaned_text}")
                print("----------------------------------")
                raise ValueError(f"JSON parsing failed at {e.pos}. Check the debug output above.")