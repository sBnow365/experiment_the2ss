from fastapi import APIRouter, Depends, HTTPException
from src.database import explorations_collection
from src.utils.auth_utils import get_optional_user
from bson import ObjectId

router = APIRouter(prefix="/explorations")

def serialize(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.get("/")
async def get_explorations(user_id: str = Depends(get_optional_user)):
    if not user_id:
        raise HTTPException(status_code=401, detail="Login required")
    
    cursor = explorations_collection.find(
        {"user_id": user_id},
        sort=[("created_at", -1)]
    )
    explorations = await cursor.to_list(length=50)
    return [serialize(e) for e in explorations]