from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from fastapi import Header, HTTPException
from typing import Optional
import os

pwd_context = CryptContext(schemes=["bcrypt"])
SECRET_KEY = os.getenv("SECRET_KEY", "yoursecretkey")
ALGORITHM = "HS256"

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

def create_token(user_id: str):
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

def get_optional_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        return payload.get("sub")
    except:
        return None