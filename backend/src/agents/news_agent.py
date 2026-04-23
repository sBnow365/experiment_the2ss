import requests
from src.config.settings import NEWSAPI_API_KEY
class NewsAgent:
    def __init__(self):
        self.api_key =NEWSAPI_API_KEY

    # def get_news(self, city, country):
    def get_news(self, city, country):

        url = "https://newsapi.org/v2/everything"

        # first try city news
        # query = f"{city} tourism OR {city} city"
        query = f"{city} {country}"


        params = {
            "q": query,
            "sortBy": "publishedAt",
            "apiKey": self.api_key
        }

        response = requests.get(url, params=params)
        data = response.json()

        articles = []

        if "articles" in data:
            for article in data["articles"][:5]:
                articles.append({
                    "title": article.get("title") or "Untitled News",
                    "description": article.get("description"),
                    "url": article["url"],
                    "source": article["source"]["name"],
                    "image": article.get("urlToImage")
                })

        # fallback to country news if empty
        # if not articles and country:

        #     query = f"{country} news"

        #     params["q"] = query

        #     response = requests.get(url, params=params)
        #     data = response.json()

        #     if "articles" in data:
        #         for article in data["articles"][:5]:
        #             articles.append({
        #                 "title": article["title"],
        #                 "url": article["url"],
        #                 "source": article["source"]["name"],
        #                 "image": article.get("urlToImage")
        #             })

        return articles