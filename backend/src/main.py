from fastapi import FastAPI
from src.routes import analyze
from src.routes.followup import router as followup_router
from src.routes.news import router as news_router 
from src.routes.images import router as images_router
from fastapi.middleware.cors import CORSMiddleware
from src.database import client
from src.routes.auth import router as auth_router
from src.routes.explorations import router as explorations_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await client.admin.command("ping")
    print("✅ MongoDB connected")
    yield

app = FastAPI(lifespan=lifespan)


app.include_router(auth_router)
app.include_router(analyze.router)
app.include_router(followup_router)
app.include_router(news_router)
app.include_router(images_router)
app.include_router(explorations_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://the2ss-35zj.vercel.app"],  # Later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
