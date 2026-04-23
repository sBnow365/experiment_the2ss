from fastapi import APIRouter, UploadFile,Form
from src.orchestrator.travel_orchestrator import TravelOrchestrator
from fastapi import APIRouter, UploadFile, Form, Depends
from src.orchestrator.travel_orchestrator import TravelOrchestrator
from src.utils.auth_utils import get_optional_user
from src.database import explorations_collection
from datetime import datetime

router = APIRouter()
orchestrator = TravelOrchestrator()

@router.post("/analyze")
async def analyze_image(
    file: UploadFile,
    lat: float | None = Form(None),
    lon: float | None = Form(None),
    user_id: str = Depends(get_optional_user)
):
    image = await file.read()

    result = await orchestrator.process_image(
        image,
        user_location={"lat": lat, "lon": lon}
    )

    if user_id:
        await explorations_collection.insert_one({
            "user_id": user_id,
            "location": {"lat": lat, "lon": lon},
            "session_id": result["session_id"],
            "place": result["place"],
            "geo": result["geo"],
            "culture": result["culture"],
            "travel": result["travel"],
            "conversation": [],
            "created_at": datetime.utcnow()
        })

    return result