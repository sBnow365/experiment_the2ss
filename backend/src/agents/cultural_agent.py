import google.generativeai as genai
from src.config.settings import GEMINI_API_KEY
from src.utils.async_utils import run_blocking
import json
import re


class CulturalAgent:
    def __init__(self):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel("models/gemini-2.5-flash-lite")

    async def analyze(self, place_context: dict) -> dict:
        """
        place_context example:
        {
            "place_type": "historic site",
            "name": "Parthenon",
            "city": "Athens",
            "country": "Greece",
            "confidence": 1.0
        }
        """

        prompt = f"""
You are a cultural analysis agent.

The place has already been identified and MUST NOT be re-identified or questioned.

PLACE DETAILS:
- Name: {place_context.get("name")}
- City: {place_context.get("city")}
- Country: {place_context.get("country")}
- Type: {place_context.get("place_type")}

STRICT OUTPUT RULES:
- Return ONLY Markdown following the exact structure below
- Do NOT include explanations before or after the structure
- Do NOT add extra sections
- Keep bullet points short and factual

Required Markdown schema:

## Cultural Significance
- short bullet point
- short bullet point
- short bullet point

## Important People

### Person 1
- **Name:** <name>
- **Summary:** <short summary>

### Person 2
- **Name:** <name>
- **Summary:** <short summary>

## Food & Fun Facts
- short bullet point
- short bullet point
- short bullet point
"""

        response = await run_blocking(
            self.model.generate_content,
            prompt
        )
        

        raw = response.text
        # print("----- RAW CULTURAL MODEL OUTPUT START -----")
        # print(raw)
        # print("----- RAW CULTURAL MODEL OUTPUT END -----")

        return raw