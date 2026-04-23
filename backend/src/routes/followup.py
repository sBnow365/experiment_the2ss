from fastapi import APIRouter, Depends
from pydantic import BaseModel
from src.orchestrator.followup_orchestrator import FollowupOrchestrator
from src.utils.auth_utils import get_optional_user

router = APIRouter()
orchestrator = FollowupOrchestrator()

class FollowupRequest(BaseModel):
    session_id: str
    tab: str
    question: str

@router.post("/followup")
async def followup(req: FollowupRequest, user_id: str = Depends(get_optional_user)):
    print(f"user_id: {user_id!r}")  # add this
    print(f"session_id: {req.session_id!r}")  # add this
    result = orchestrator.handle_followup(
        session_id=req.session_id,
        tab=req.tab,
        question=req.question
    )

    if user_id and "answer" in result:
        from src.database import explorations_collection
        print(f"Looking for session_id: {req.session_id}, user_id: {user_id}")
        update_result = await explorations_collection.update_one(
            {"session_id": req.session_id, "user_id": user_id},
            {"$push": {"conversation": {
                "tab": req.tab,
                "question": req.question,
                "answer": result["answer"]
            }}}
        )
        print(f"Matched: {update_result.matched_count}, Modified: {update_result.modified_count}")

    return result
