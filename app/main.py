from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import random
import asyncio

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

# Lazy loading for hobbies - only load when needed
_HOBBIES_CACHE = None

def get_hobbies_data():
    global _HOBBIES_CACHE
    if _HOBBIES_CACHE is None:
        _HOBBIES_CACHE = [
            {
                "id": 1,
                "name": "Qur'an Memorization",
                "description": "حفظ القرآن الكريم - ابدأ رحلة روحانية في حفظ القرآن الكريم",
                "category": "Spiritual",
                "skill_level": "Beginner",
                "cost_level": "Low"
            },
            {
                "id": 2,
                "name": "Origami",
                "description": "فن الأوريغامي - فن ياباني لطي الورق",
                "category": "Arts & Crafts",
                "skill_level": "Beginner",
                "cost_level": "Low"
            },
            {
                "id": 3,
                "name": "Poetry Writing",
                "description": "كتابة الشعر - عبر عن أفكارك ومشاعرك",
                "category": "Creative Writing",
                "skill_level": "Beginner",
                "cost_level": "Low"
            },
            {
                "id": 4,
                "name": "Digital Art",
                "description": "الفن الرقمي - ابتكر أعمالاً فنية رقمية",
                "category": "Arts & Crafts",
                "skill_level": "Beginner",
                "cost_level": "Medium"
            },
            {
                "id": 5,
                "name": "Gardening",
                "description": "البستنة - ازرع واعتني بالنباتات",
                "category": "Nature",
                "skill_level": "Beginner",
                "cost_level": "Medium"
            },
            {
                "id": 6,
                "name": "Photography",
                "description": "التصوير الفوتوغرافي - التقط صوراً جميلة",
                "category": "Visual Arts",
                "skill_level": "Beginner",
                "cost_level": "Medium"
            },
            {
                "id": 7,
                "name": "Cooking",
                "description": "الطبخ - تعلم وصفات جديدة ولذيذة",
                "category": "Food & Drink",
                "skill_level": "Beginner",
                "cost_level": "Medium"
            },
            {
                "id": 8,
                "name": "Reading",
                "description": "القراءة - اكتشف عوالم جديدة في الكتب",
                "category": "Education",
                "skill_level": "Beginner",
                "cost_level": "Low"
            },
            {
                "id": 9,
                "name": "Journaling",
                "description": "كتابة اليوميات - دوّن أفكارك ومشاعرك",
                "category": "Writing",
                "skill_level": "Beginner",
                "cost_level": "Low"
            },
            {
                "id": 10,
                "name": "Meditation",
                "description": "التأمل - مارس الهدوء والسكينة",
                "category": "Wellness",
                "skill_level": "Beginner",
                "cost_level": "Free"
            }
        ]
    return _HOBBIES_CACHE

# Fast startup endpoints
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "AI Hobby Recommender is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/ping")
async def ping():
    return {"ping": "pong"}

# Basic API endpoints
@app.get("/api/health")
async def api_health():
    hobbies_count = len(get_hobbies_data())
    return {"api_status": "working", "total_hobbies": hobbies_count}

# Simple registration endpoint
@app.post("/api/auth/register")
async def register(user: UserCreate):
    if not user.username or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    return {
        "message": "Registration successful!",
        "user": {
            "username": user.username,
            "email": user.email,
            "id": 1
        }
    }

# Simple login endpoint
@app.post("/api/auth/login")
async def login(user: UserLogin):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
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

# Optimized hobbies endpoints
@app.get("/api/hobbies/daily")
async def get_daily_hobby():
    hobbies = get_hobbies_data()
    hobby = random.choice(hobbies)
    return {
        "hobby": hobby,
        "message": f"إليك اقتراح هواية اليوم من بين {len(hobbies)} هواية!"
    }

@app.get("/api/hobbies")
async def get_all_hobbies():
    hobbies = get_hobbies_data()
    return {
        "hobbies": hobbies,
        "total": len(hobbies),
        "message": f"جميع الـ {len(hobbies)} هوايات متاحة الآن!"
    }

@app.get("/api/hobbies/{hobby_id}")
async def get_hobby_detail(hobby_id: int):
    hobbies = get_hobbies_data()
    hobby = next((h for h in hobbies if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby

@app.post("/api/hobbies/recommend")
async def get_hobby_recommendations():
    hobbies = get_hobbies_data()
    num_recommendations = min(3, len(hobbies))
    recommendations = random.sample(hobbies, num_recommendations)
    return {
        "recommendations": recommendations,
        "total_available": len(hobbies),
        "message": f"إليك {num_recommendations} اقتراحات مخصصة لك!"
    }

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # For testing
        "https://hobby-recommender.vercel.app",
        "https://hobby-recommender-khadija76767.vercel.app",
        "https://khadija-hobby-recommender.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add startup event
@app.on_event("startup")
async def startup_event():
    # Pre-load hobbies cache
    get_hobbies_data()
    print("✅ Hobbies cache loaded successfully!")

# Add API routes gradually
try:
    from app.api.routes import api_router
    app.include_router(api_router, prefix="/api")
except ImportError:
    # Routes not available yet
    pass 