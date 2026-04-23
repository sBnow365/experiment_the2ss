# backend/src/routes/images.py
# Add this router to your main FastAPI app

from fastapi import APIRouter
from pydantic import BaseModel
from src.agents.image_search_agent import ImageSearchAgent
from fastapi.responses import JSONResponse

router = APIRouter()
agent = ImageSearchAgent()


class ImageRequest(BaseModel):
    tab: str           # "culture" | "geo" | "travel"
    place_context: str # e.g. "Statue of Liberty, New York"
    tab_content: str   # the full markdown string returned by the tab's agent

@router.post("/images")
def get_tab_images(body: ImageRequest):
    """
    Returns a list of image search results for the given tab.
    Frontend calls this AFTER the main /analyze response is received.
    """
    import json
    
    # Safely parse place_context if it's a JSON string
    try:
        place = json.loads(body.place_context)
    except (json.JSONDecodeError, TypeError):
        place = body.place_context  # already a plain string

    queries = agent.get_images_for_tab(
        tab=body.tab,
        place_context=place,       # ← pass parsed version
        tab_content=body.tab_content,
    )
    all_images = []
    seen_urls = set()

    for query in queries:
        results = agent.search_images(query, num=2)
        for img in results:
            if img["url"] not in seen_urls:
                seen_urls.add(img["url"])
            all_images.append({**img, "query": query})
    print(all_images)
    print("something")
    return {"tab": body.tab, "images": all_images}


# ─── In your main.py, add: ───────────────────────────────────────────────────
# from src.routes.images import router as images_router
# app.include_router(images_router)
# ─────────────────────────────────────────────────────────────────────────────
