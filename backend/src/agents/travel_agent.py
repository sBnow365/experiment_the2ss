import google.generativeai as genai
from src.config.settings import GEMINI_API_KEY
from src.utils.async_utils import run_blocking
import json
import re

class TravelAgent:
    def __init__(self):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel("models/gemini-2.5-flash-lite")

    async def analyze(self, place_context: dict,user_location) -> dict:
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
    You are a travel planning agent.

    The destination has already been identified and MUST NOT be re-identified.

    DESTINATION DETAILS:
    - Name: {place_context.get("name")}
    - City: {place_context.get("city")}
    - Country: {place_context.get("country")}
    - Type: {place_context.get("place_type")}

    USER LOCATION:
    - Latitude: {user_location.get("lat")}
    - Longitude: {user_location.get("lon")}

    STRICT OUTPUT RULES
    - Return ONLY Markdown following the exact structure below
    - Do NOT include explanations before or after the structure
    - Do NOT add extra sections
    - Keep steps short and actionable
    - Provide 2–3 transport options if possible

    Budget levels must be one of: Low, Medium, High.

    Travel steps should be short actions such as:
    "Take metro to airport"
    "Fly Delhi → Athens"
    "Taxi to destination"

    Required Markdown schema:

    ## Distance
    - <distance between user location and destination in kilometres>

    ## Transport Options

    ### Option 1
    - **Budget Level:** <Low / Medium / High>
    - **Approx Cost (USD):** <estimated cost>
    - **Method:** <flight / train / bus / mixed transport>
    - **Timeline:** <total travel time>

    **Steps**
    - step
    - step
    - step

    ### Option 2
    - **Budget Level:** <Low / Medium / High>
    - **Approx Cost (USD):** <estimated cost>
    - **Method:** <transport method>
    - **Timeline:** <total travel time>

    **Steps**
    - step
    - step
    - step

    ### Option 3
    - **Budget Level:** <Low / Medium / High>
    - **Approx Cost (USD):** <estimated cost>
    - **Method:** <transport method>
    - **Timeline:** <total travel time>

    **Steps**
    - step
    - step
    - step

    ## Travel Tips
    - short tip
    - short tip
    - short tip
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