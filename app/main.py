from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.api.routes import api_router

app = FastAPI(
    title="AI Hobby Recommender",
    description="An AI-powered system for recommending personalized hobbies",
    version="1.0.0"
)

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "AI Hobby Recommender is running!"}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3002",
        "http://localhost:3003",
        "https://hobby-recommender.vercel.app",  # Vercel domain
        "https://hobby-recommender-khadija76767.vercel.app"  # Vercel domain with username
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/avatars", StaticFiles(directory=os.path.join("avatars")), name="avatars")

# Include API routes
app.include_router(api_router, prefix="/api") 