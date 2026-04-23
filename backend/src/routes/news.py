from fastapi import APIRouter
from src.agents.news_agent import NewsAgent

router = APIRouter()

news_agent = NewsAgent()

@router.post("/news")
async def get_news(place: dict):

    city = place.get("city")
    country = place.get("country")

    news = news_agent.get_news(city, country)
    # news = news_agent.get_news(city)


    return {"news": news}