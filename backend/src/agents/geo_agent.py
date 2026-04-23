import google.generativeai as genai
from src.config.settings import GEMINI_API_KEY
from src.utils.async_utils import run_blocking
import json
import re


class GeoAgent:
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
    You are a geography analysis agent.

    The place has already been identified and MUST NOT be re-identified or questioned.

    PLACE DETAILS:
    - Name: {place_context.get("name")}
    - City: {place_context.get("city")}
    - Country: {place_context.get("country")}
    - Type: {place_context.get("place_type")}

    STRICT OUTPUT RULES:
    - Return ONLY Markdown following the exact structure below
    - Do NOT output JSON
    - Do NOT include explanations before or after the structure
    - Do NOT add extra sections
    - Keep bullet points short and factual

    Required Markdown schema:

    ## Landforms
    - short bullet point
    - short bullet point

    ## Weather Info
    - **Season:** <season name>  
    **Summary:** <short summary>

    - **Season:** <season name>  
    **Summary:** <short summary>

    ## Rain & Natural Resources
    - short bullet point
    - short bullet point

    ## Flora & Fauna
    - short bullet point
    - short bullet point

    ## Population Facts
    - short bullet point
    - short bullet point
    """

        response = await run_blocking(
            self.model.generate_content,
            prompt
        )

        raw = response.text
        # print("----- RAW geographical MODEL OUTPUT START -----")
        # print(raw)
        # print("----- RAW geographical MODEL OUTPUT END -----")

        return raw