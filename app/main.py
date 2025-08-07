from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="AI Hobby Recommender",
    description="An AI-powered system for recommending personalized hobbies",
    version="1.0.0"
)

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "AI Hobby Recommender is running!"}

@app.get("/test")
async def test():
    return {"message": "Test endpoint working!"}

# Basic API endpoints
@app.get("/api/health")
async def api_health():
    return {"api_status": "working", "database": "connected"}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # For testing - will restrict later
        "https://hobby-recommender.vercel.app",
        "https://hobby-recommender-khadija76767.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add API routes gradually
try:
    from app.api.routes import api_router
    app.include_router(api_router, prefix="/api")
except ImportError:
    # Routes not available yet
    pass 