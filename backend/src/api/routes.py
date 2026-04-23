from fastapi import APIRouter, UploadFile, Form
from src.utils.file_utils import save_upload
from src.agents.vision_agent import VisionAgent
from src.agents.caption_agent import CaptionAgent
from src.agents.ai_detector_agent import AIDetectorAgent

router = APIRouter()

vision_agent = VisionAgent()
caption_agent = CaptionAgent()
ai_agent = AIDetectorAgent()

@router.post("/image/process")
async def process_image(
    file: UploadFile,
    task: str = Form(...)
):
    image_path = save_upload(file)

    if task == "vision":
        return vision_agent.analyze(image_path)

    if task == "caption":
        return {"result": caption_agent.generate(image_path)}

    if task == "ai":
        return {"result": ai_agent.detect(image_path)}

    return {"error": "Invalid task"}
