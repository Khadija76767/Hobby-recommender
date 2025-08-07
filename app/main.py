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

# 20 hobbies - Phase 1
hobbies = [
    {"id": 1, "name": "حفظ القرآن الكريم", "description": "ابدأ رحلة روحانية في حفظ القرآن الكريم والتواصل مع آياته وتعاليمه الجميلة", "category": "روحانية", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 2, "name": "فن الأوريغامي", "description": "فن ياباني لطي الورق، يهدف إلى صنع منحوتات جميلة من ورقة واحدة", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 3, "name": "كتابة الشعر", "description": "عبر عن أفكارك ومشاعرك من خلال فن كتابة الشعر", "category": "أدب", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 4, "name": "الفن الرقمي", "description": "ابتكر أعمالاً فنية جميلة باستخدام الأدوات والبرامج الرقمية", "category": "فنون", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 5, "name": "البستنة", "description": "ازرع واعتني بالنباتات، وأنشئ مساحتك الخضراء الخاصة", "category": "طبيعة", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 6, "name": "التصوير", "description": "التقط وابتكر صوراً جميلة باستخدام الكاميرا", "category": "فنون", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 7, "name": "الطبخ", "description": "تعلم وصفات جديدة ولذيذة وابتكر أطباقك الخاصة", "category": "طعام", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 8, "name": "القراءة", "description": "اكتشف عوالم جديدة في الكتب ووسع معرفتك", "category": "تعليم", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 9, "name": "الرسم", "description": "ارسم بالألوان والأقلام وعبر عن إبداعك", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 10, "name": "الموسيقى", "description": "تعلم آلة موسيقية واستمتع بعزف الألحان", "category": "فنون", "skill_level": "Beginner", "cost_level": "High"},
    
    # إضافة 10 هوايات جديدة
    {"id": 11, "name": "كتابة اليوميات", "description": "دوّن أفكارك ومشاعرك وتجاربك في مذكرة شخصية", "category": "كتابة", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 12, "name": "فلوقات مصغرة", "description": "التقط مقطع فيديو مدته ثانية واحدة كل يوم لإنشاء يوميات حياة فريدة", "category": "رقمي", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 13, "name": "تصميم لوحات المزاج", "description": "صمم لوحات جمالية لأهدافك أو أحلامك باستخدام Pinterest أو Canva", "category": "فنون رقمية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 14, "name": "نحت الصابون", "description": "ابتكر منحوتات جميلة باستخدام قالب صابون وسكين بلاستيكي فقط", "category": "حرف", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 15, "name": "فن برطمان الذكريات", "description": "زين برطماناً واملأه بملاحظات أو صور صغيرة للذكريات", "category": "حرف", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 16, "name": "تذوق الشاي", "description": "جرب أنواعاً مختلفة من الشاي وقيمها في دفتر جميل", "category": "طعام وشراب", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 17, "name": "الرسم على أكياس الشاي", "description": "ابتكر أعمالاً فنية فريدة على أكياس الشاي المستعملة", "category": "حرف", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 18, "name": "صناعة الشموع", "description": "اصنع شموعك العطرية الخاصة بروائح مختلفة", "category": "حرف", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 19, "name": "التلوين الواعي", "description": "استخدم كتب تلوين الماندالا أو الرسومات الجمالية للاسترخاء", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 20, "name": "برطمان الامتنان", "description": "أضف ملاحظة يومية عن شيء تشعر بالامتنان له", "category": "تطوير شخصي", "skill_level": "Beginner", "cost_level": "Low"}
]

@app.get("/")
def root():
    return {"message": f"AI Hobby Recommender with {len(hobbies)} hobbies!"}

@app.get("/health")
def health():
    return {"status": "ok", "hobbies_count": len(hobbies)}

@app.get("/api/health")
def api_health():
    return {"status": "working", "hobbies": len(hobbies), "phase": "1 of 3"}

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
    return {"hobbies": hobbies, "total": len(hobbies), "message": f"متاح الآن {len(hobbies)} هواية!"}

@app.get("/api/hobbies/daily")
def daily_hobby():
    hobby = random.choice(hobbies)
    return {"hobby": hobby, "message": f"هواية اليوم من بين {len(hobbies)} هواية!"}

@app.get("/api/hobbies/{hobby_id}")
def get_hobby(hobby_id: int):
    hobby = next((h for h in hobbies if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(404, "الهواية غير موجودة")
    return hobby

@app.post("/api/hobbies/recommend")
def recommend():
    num_recommendations = min(3, len(hobbies))
    recommendations = random.sample(hobbies, num_recommendations)
    return {"recommendations": recommendations, "total_available": len(hobbies), "message": f"إليك {num_recommendations} اقتراحات من بين {len(hobbies)} هواية!"}

@app.get("/api/hobbies/category/{category}")
def get_hobbies_by_category(category: str):
    filtered = [h for h in hobbies if category.lower() in h["category"].lower()]
    return {"hobbies": filtered, "category": category, "total": len(filtered)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 