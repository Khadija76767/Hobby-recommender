from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Simple hobbies list
hobbies = [
    {"id": 1, "name": "حفظ القرآن الكريم", "description": "ابدأ رحلة روحانية في حفظ القرآن الكريم", "category": "روحانية"},
    {"id": 2, "name": "فن الأوريغامي", "description": "فن ياباني لطي الورق", "category": "فنون"},
    {"id": 3, "name": "كتابة الشعر", "description": "عبر عن أفكارك ومشاعرك", "category": "أدب"},
    {"id": 4, "name": "الفن الرقمي", "description": "ابتكر أعمالاً فنية رقمية", "category": "فنون"},
    {"id": 5, "name": "البستنة", "description": "ازرع واعتني بالنباتات", "category": "طبيعة"},
    {"id": 6, "name": "التصوير", "description": "التقط صوراً جميلة", "category": "فنون"},
    {"id": 7, "name": "الطبخ", "description": "تعلم وصفات جديدة", "category": "طعام"},
    {"id": 8, "name": "القراءة", "description": "اكتشف عوالم جديدة", "category": "تعليم"},
    {"id": 9, "name": "الرسم", "description": "ارسم بالألوان والأقلام", "category": "فنون"},
    {"id": 10, "name": "الموسيقى", "description": "تعلم آلة موسيقية", "category": "فنون"}
]

@app.get("/")
def root():
    return {"message": "AI Hobby Recommender"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/health")
def api_health():
    return {"status": "working", "hobbies": len(hobbies)}

@app.post("/api/auth/register")
def register(user: UserCreate):
    return {"message": "تم التسجيل بنجاح", "user": {"username": user.username, "email": user.email}}

@app.post("/api/auth/login")
def login(user: UserLogin):
    return {"message": "تم تسجيل الدخول", "access_token": "test_token"}

@app.get("/api/auth/me")
def get_me():
    return {"id": 1, "username": "المستخدم التجريبي"}

@app.get("/api/auth/profile")
def get_profile():
    return {"id": 1, "username": "المستخدم التجريبي", "display_name": "مستخدم تجريبي"}

@app.get("/api/hobbies")
def get_hobbies():
    return {"hobbies": hobbies, "total": len(hobbies)}

@app.get("/api/hobbies/daily")
def daily_hobby():
    hobby = random.choice(hobbies)
    return {"hobby": hobby, "message": "هواية اليوم"}

@app.get("/api/hobbies/{hobby_id}")
def get_hobby(hobby_id: int):
    hobby = next((h for h in hobbies if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(404, "الهواية غير موجودة")
    return hobby

@app.post("/api/hobbies/recommend")
def recommend():
    return {"recommendations": random.sample(hobbies, 3)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 