import uuid
from pathlib import Path

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def save_upload(file) -> str:
    file_path = UPLOAD_DIR / f"{uuid.uuid4()}.jpg"
    file_path.write_bytes(file.file.read())
    return str(file_path)
