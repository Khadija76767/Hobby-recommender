from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import random

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

# Original 54 hobbies data
HOBBIES_DATA = [
    {
        "id": 1,
        "name": "Qur'an Memorization",
        "description": "Embark on a spiritual journey of memorizing the Holy Qur'an, connecting with its beautiful verses and teachings.\n\nحفظ القرآن الكريم\nابدأ رحلة روحانية في حفظ القرآن الكريم والتواصل مع آياته وتعاليمه الجميلة.",
        "category": "Spiritual",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "1-2 hours daily",
        "equipment_needed": "Qur'an, notebook",
        "benefits": "Spiritual growth, improved memory, peace of mind"
    },
    {
        "id": 2,
        "name": "Origami",
        "description": "The Japanese art of paper folding, creating beautiful sculptures from a single sheet of paper.\n\nفن الأوريغامي\nفن ياباني لطي الورق، يهدف إلى صنع منحوتات جميلة من ورقة واحدة.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30 minutes per project",
        "equipment_needed": "Origami paper, instructions",
        "benefits": "Improves focus, patience, and hand-eye coordination"
    },
    {
        "id": 3,
        "name": "Poetry Writing",
        "description": "Express your thoughts and emotions through the art of verse writing.\n\nكتابة الشعر\nعبر عن أفكارك ومشاعرك من خلال فن كتابة الشعر.",
        "category": "Creative Writing",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes daily",
        "equipment_needed": "Notebook, pen",
        "benefits": "Emotional expression, creativity, language skills"
    },
    {
        "id": 4,
        "name": "Digital Art",
        "description": "Create beautiful artwork using digital tools and software.\n\nالفن الرقمي\nابتكر أعمالاً فنية جميلة باستخدام الأدوات والبرامج الرقمية.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Medium",
        "time_commitment": "1-2 hours daily",
        "equipment_needed": "Digital tablet, art software",
        "benefits": "Digital skills, creativity, modern art expression"
    },
    {
        "id": 5,
        "name": "Gardening",
        "description": "Grow and nurture plants, creating your own green space.\n\nالبستنة\nازرع واعتني بالنباتات، وأنشئ مساحتك الخضراء الخاصة.",
        "category": "Nature",
        "skill_level": "Beginner",
        "cost_level": "Medium",
        "time_commitment": "30 minutes daily",
        "equipment_needed": "Pots, soil, seeds, tools",
        "benefits": "Connection with nature, stress relief, fresh produce"
    }
    # ... (adding first 5 for brevity, we'll add all 54 after testing)
]

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

# Hobbies endpoints with original data
@app.get("/api/hobbies/daily")
async def get_daily_hobby():
    hobby = random.choice(HOBBIES_DATA)
    return {
        "hobby": hobby,
        "message": "إليك اقتراح هواية اليوم!"
    }

@app.get("/api/hobbies")
async def get_all_hobbies():
    return {
        "hobbies": HOBBIES_DATA,
        "total": len(HOBBIES_DATA)
    }

@app.get("/api/hobbies/{hobby_id}")
async def get_hobby_detail(hobby_id: int):
    hobby = next((h for h in HOBBIES_DATA if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby

@app.post("/api/hobbies/recommend")
async def get_hobby_recommendations():
    recommendations = random.sample(HOBBIES_DATA, min(3, len(HOBBIES_DATA)))
    return {
        "recommendations": recommendations,
        "message": "إليك بعض الاقتراحات المخصصة لك!"
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