from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = client.the2ss

# collections
users_collection = db.users
explorations_collection = db.explorations