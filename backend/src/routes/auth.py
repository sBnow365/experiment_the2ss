from fastapi import APIRouter, HTTPException
from src.database import users_collection
from src.models.user import UserRegister, UserLogin
from src.utils.auth_utils import hash_password, verify_password, create_token
from bson import ObjectId

router = APIRouter(prefix="/auth")

@router.post("/register")
async def register(user: UserRegister):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    result = await users_collection.insert_one({
        "email": user.email,
        "password": hash_password(user.password)
    })
    token = create_token(str(result.inserted_id))
    return {"token": token, "email": user.email}

@router.post("/login")
async def login(user: UserLogin):
    existing = await users_collection.find_one({"email": user.email})
    if not existing or not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(str(existing["_id"]))
    return {"token": token, "email": user.email}