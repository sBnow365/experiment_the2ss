import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
NEWSAPI_API_KEY=os.getenv("NEWSAPI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")
PEXELS_API_KEY=os.getenv("PEXELS_API_KEY")
if GEMINI_API_KEY is None:
    raise ValueError("GEMINI_API_KEY not found in environment")

if NEWSAPI_API_KEY is None:
    raise ValueError("NEWSAPI_API_KEY not found in environment")
