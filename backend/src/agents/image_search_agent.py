# backend/src/agents/image_search_agent.py
import requests
from src.config.settings import PEXELS_API_KEY


class ImageSearchAgent:
    """
    Uses Pexels API to fetch contextual images.
    Free tier: 200 requests/hour, 20,000 requests/month. No credit card needed.

    Setup:
      1. Go to https://www.pexels.com/api/ → Sign up
      2. Get API key → add as PEXELS_API_KEY in your .env
    """

    BASE_URL = "https://api.pexels.com/v1/search"

    def __init__(self):
        self.api_key = PEXELS_API_KEY

    def search_images(self, query: str, num: int = 2) -> list[dict]:
        """
        Search for images matching the query.
        Returns list of {url, title, thumbnail} dicts.
        num: number of results (max 80 per request)
        """
        print(f"[DEBUG] API Key loaded: {bool(self.api_key)}")
        print(f"[DEBUG] Query: {query}")

        headers = {
            "Authorization": self.api_key
        }
        params = {
            "query": query,
            "per_page": num
        }

        try:
            response = requests.get(self.BASE_URL, headers=headers, params=params, timeout=5)
            data = response.json()
            print(f"[DEBUG] Items count: {len(data.get('photos', []))}")

            if response.status_code != 200:
                print(f"[DEBUG] Pexels error: {response.status_code} - {data}")
                return []

            results = []
            for photo in data.get("photos", []):
                results.append({
                    "url": photo["src"]["large"],
                    "title": photo.get("alt", query),
                    "thumbnail": photo["src"]["small"],
                    "context_url": photo.get("url"),
                    "photographer": photo.get("photographer", ""),
                })
            return results

        except Exception as e:
            print(f"[ImageSearchAgent] Error: {e}")
            return []

    def get_images_for_tab(self, tab: str, place_context, tab_content: str) -> list:

        # Normalize place_context whether it's a dict or string
        if isinstance(place_context, dict):
            name = place_context.get("name", "")
            city = place_context.get("city", "")
            country = place_context.get("country", "")
            place_str = f"{name} {city} {country}".strip()
        else:
            place_str = str(place_context)

        queries = []

        if tab == "culture":
            import re
            names = re.findall(r"\*\*Name:\*\*\s*(.+)", tab_content)
            for name in names[:3]:
                queries.append(f"{name.strip()} portrait photo")
            queries.append(f"{place_str} cultural significance")

        elif tab == "geo":
            queries.append(f"{place_str} aerial view")
            queries.append(f"{place_str} landscape photo")

        elif tab == "travel":
            import re
            methods = re.findall(r"\*\*Method:\*\*\s*(.+)", tab_content)
            unique_methods = list(set(m.strip() for m in methods[:2]))
            for method in unique_methods:
                queries.append(f"{method} photo")
            queries.append(f"{place_str} tourist visit")

        print(f"[DEBUG] Resolved place_str: {place_str}")
        print(f"[DEBUG] Queries built: {queries}")
        return queries