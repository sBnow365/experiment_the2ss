import asyncio
import uuid
import tempfile

from src.agents.vision_agent import VisionAgent
from src.agents.geo_agent import GeoAgent
from src.agents.cultural_agent import CulturalAgent
from src.agents.travel_agent import TravelAgent

from src.utils.context_store import context_store   # NEW


class TravelOrchestrator:

    def __init__(self):
        self.vision_agent = VisionAgent()
        self.geo_agent = GeoAgent()
        self.cultural_agent = CulturalAgent()
        self.travel_agent = TravelAgent()

    async def process_image(self, image_bytes, user_location=None):

        # NEW: generate session id for followups
        session_id = str(uuid.uuid4())

        # Step 1: Detect place
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            tmp.write(image_bytes)
            temp_path = tmp.name

        place_context = await self.vision_agent.analyze(temp_path)

        # Step 2: Run domain agents in parallel
        geo_task = self.geo_agent.analyze(place_context)
        cultural_task = self.cultural_agent.analyze(place_context)
        travel_task = self.travel_agent.analyze(place_context, user_location)

        geo, culture, travel = await asyncio.gather(
            geo_task,
            cultural_task,
            travel_task
        )
        # await asyncio.sleep(20)  # 60s / 5 requests = 12s gap minimum
        # geo = await self.geo_agent.analyze(place_context)
        # await asyncio.sleep(30)  # 60s / 5 requests = 12s gap minimum
        # culture = await self.cultural_agent.analyze(place_context)
        # await asyncio.sleep(30)  # 60s / 5 requests = 12s gap minimum
        # travel = await self.travel_agent.analyze(place_context, user_location)

        # NEW: Store results for followup questions
        context_store.save(session_id, "place", place_context)
        context_store.save(session_id, "geo", geo)
        context_store.save(session_id, "culture", culture)
        context_store.save(session_id, "travel", travel)

        # return session id to frontend
        return {
            "session_id": session_id,   # NEW
            "place": place_context,
            "geo": geo,
            "culture": culture,
            "travel": travel
        }