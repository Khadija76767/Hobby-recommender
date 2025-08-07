from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(
    title="AI Hobby Recommender",
    description="An AI-powered system for recommending personalized hobbies",
    version="1.0.0"
)

# Pydantic models for requests
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

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

# Simple registration endpoint for testing
@app.post("/api/auth/register")
async def register(user: UserCreate):
    # Simple validation
    if not user.username or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    # For now, just return success (we'll add database later)
    return {
        "message": "Registration successful!",
        "user": {
            "username": user.username,
            "email": user.email,
            "id": 1
        }
    }

# Simple login endpoint for testing
@app.post("/api/auth/login")
async def login(user: UserLogin):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    # Simple test login
    return {
        "message": "Login successful!",
        "user": {
            "email": user.email,
            "username": "Test User",
            "id": 1
        },
        "access_token": "test_token"
    }

# Get current user endpoint
@app.get("/api/auth/me")
async def get_current_user():
    return {
        "id": 1,
        "email": "test@example.com",
        "username": "Test User"
    }

# Get user profile endpoint
@app.get("/api/auth/profile")
async def get_user_profile():
    return {
        "id": 1,
        "email": "test@example.com",
        "username": "Test User",
        "display_name": "Test User",
        "avatar_url": None,
        "user_code": "TEST123"
    }

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # For testing - will restrict later
        "https://hobby-recommender.vercel.app",
        "https://hobby-recommender-khadija76767.vercel.app",
        "https://khadija-hobby-recommender.vercel.app"
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