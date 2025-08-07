from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(
    title="AI Hobby Recommender",
    description="An AI-powered system for recommending personalized hobbies",
    version="1.0.0"
)

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# All 54 hobbies data - loaded once
HOBBIES_DATA = [
    {"id": 1, "name": "Qur'an Memorization", "description": "حفظ القرآن الكريم - ابدأ رحلة روحانية في حفظ القرآن الكريم والتواصل مع آياته وتعاليمه الجميلة", "category": "Spiritual", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 2, "name": "Origami", "description": "فن الأوريغامي - فن ياباني لطي الورق، يهدف إلى صنع منحوتات جميلة من ورقة واحدة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 3, "name": "Poetry Writing", "description": "كتابة الشعر - عبر عن أفكارك ومشاعرك من خلال فن كتابة الشعر", "category": "Creative Writing", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 4, "name": "Digital Art", "description": "الفن الرقمي - ابتكر أعمالاً فنية جميلة باستخدام الأدوات والبرامج الرقمية", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 5, "name": "Gardening", "description": "البستنة - ازرع واعتني بالنباتات، وأنشئ مساحتك الخضراء الخاصة", "category": "Nature", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 6, "name": "Journaling", "description": "كتابة اليوميات - دوّن أفكارك ومشاعرك وتجاربك في مذكرة شخصية", "category": "Writing", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 7, "name": "Photography", "description": "التصوير الفوتوغرافي - التقط وابتكر صوراً جميلة باستخدام الكاميرا", "category": "Visual Arts", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 8, "name": "Mini Vlogs", "description": "فلوقات مصغرة - التقط مقطع فيديو مدته ثانية واحدة كل يوم لإنشاء يوميات حياة فريدة", "category": "Digital Creation", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 9, "name": "Moodboard Making", "description": "تصميم لوحات المزاج - صمم لوحات جمالية لأهدافك أو أحلامك باستخدام Pinterest أو Canva", "category": "Digital Art", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 10, "name": "Soap Carving", "description": "نحت الصابون - ابتكر منحوتات جميلة باستخدام قالب صابون وسكين بلاستيكي فقط", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 11, "name": "Memory Jar Art", "description": "فن برطمان الذكريات - زين برطماناً واملأه بملاحظات أو صور صغيرة للذكريات", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 12, "name": "Tea Tasting", "description": "تذوق الشاي وتدوين الملاحظات - جرب أنواعاً مختلفة من الشاي وقيمها في دفتر جميل", "category": "Food & Drink", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 13, "name": "Teabag Art", "description": "الرسم على أكياس الشاي - ابتكر أعمالاً فنية فريدة على أكياس الشاي المستعملة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 14, "name": "Candle Making", "description": "صناعة الشموع - اصنع شموعك العطرية الخاصة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 15, "name": "Mindful Coloring", "description": "التلوين الواعي - استخدم كتب تلوين الماندالا أو الرسومات الجمالية للاسترخاء", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 16, "name": "Gratitude Jar", "description": "برطمان الامتنان - أضف ملاحظة يومية عن شيء تشعر بالامتنان له", "category": "Personal Growth", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 17, "name": "Bird Watching", "description": "مراقبة الطيور من النافذة - تعلم التعرف على الطيور المحلية من نافذتك", "category": "Nature", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 18, "name": "Virtual Travel", "description": "السفر الافتراضي - استكشف دولاً عشوائية واصنع قوائم بالوجهات التي تحلم بها باستخدام Google Earth", "category": "Travel & Culture", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 19, "name": "Digital Journaling", "description": "التدوين الرقمي - نظم أفكارك، تتبع أهدافك، وزين بالملصقات الرقمية باستخدام تطبيقات مثل Goodnotes/Notion", "category": "Digital Creation", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 20, "name": "Mystery Solving", "description": "حل الألغاز - حل قضايا وألغاز صغيرة يمكنك إيجادها على الإنترنت", "category": "Mental Exercise", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 21, "name": "Pressed Flower Art", "description": "فن الزهور المضغوطة - اجمع الزهور واضغطها في الدفاتر أو أطرها", "category": "Nature & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 22, "name": "Language Learning", "description": "تعلم اللغات - تعلم لغة جديدة من خلال التطبيقات والفيديوهات والتدريب", "category": "Education", "skill_level": "Beginner", "cost_level": "Free to Medium"},
    {"id": 23, "name": "Zentangle Drawing", "description": "رسم الزينتانجل - ابتكر أنماطاً جميلة باستخدام أنماط بسيطة ومنظمة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 24, "name": "Punch Needle Embroidery", "description": "تطريز إبرة الثقب - ابتكر فناً نسيجياً باستخدام أداة إبرة الثقب", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 25, "name": "Rock Painting", "description": "الرسم على الصخور - ارسم تصاميم أو رسائل جميلة على الأحجار", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 26, "name": "Shadow Puppetry", "description": "مسرح الظل - اصنع قصصاً باستخدام ظلال اليد أو قصاصات الورق", "category": "Performance Art", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 27, "name": "Character Roleplay", "description": "تقمص الشخصيات - مثّل شخصيات خيالية في مجموعات النص أو الصوت", "category": "Performance Art", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 28, "name": "ASMR Creation", "description": "صناعة ASMR - ابتكر أصواتاً مريحة باستخدام الأشياء اليومية", "category": "Audio Creation", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 29, "name": "Morse Code", "description": "شفرة مورس - تعلم وابتكر رسائل سرية بشفرة مورس", "category": "Communication", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 30, "name": "Dream Mapping", "description": "رسم خرائط الأحلام - ارسم خرائط لأماكن الأحلام أو العوالم الخيالية", "category": "Arts & Imagination", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 31, "name": "Reverse Bucket List", "description": "قائمة الإنجازات العكسية - اكتب واحتفل بكل الأشياء الرائعة التي قمت بها بالفعل", "category": "Personal Growth", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 32, "name": "Font Making", "description": "صناعة الخطوط - حول خط يدك إلى خط رقمي", "category": "Digital Creation", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 33, "name": "Voice Acting", "description": "التمثيل الصوتي - تدرب على قراءة شخصيات من العروض/الكتب بأصوات مختلفة", "category": "Performance Art", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 34, "name": "Pixel Art", "description": "فن البكسل - ابتكر فناً رقمياً بأسلوب قديم بكسل تلو الآخر", "category": "Digital Art", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 35, "name": "Time Capsule Making", "description": "صنع كبسولة الزمن - اصنع واخفِ مجموعة من الذكريات الحالية لنفسك في المستقبل", "category": "Personal Growth", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 36, "name": "Cup Rhythm Games", "description": "ألعاب الإيقاع بالأكواب - تعلم وابتكر روتينات إيقاعية باستخدام الأكواب البلاستيكية", "category": "Music & Rhythm", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 37, "name": "Whistling Tricks", "description": "حيل الصفير - تعلم تقنيات وألحان مختلفة للصفير", "category": "Music", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 38, "name": "Coin Collection", "description": "جمع العملات - اجمع وتعلم عن العملات من مختلف البلدان والعصور", "category": "Collecting", "skill_level": "Beginner", "cost_level": "Varies"},
    {"id": 39, "name": "Conlang Creation", "description": "ابتكار لغة مصطنعة - ابتكر لغتك المصطنعة الخاصة بقواعد ومفردات فريدة", "category": "Linguistics", "skill_level": "Intermediate", "cost_level": "Free"},
    {"id": 40, "name": "Cloud Watching", "description": "يوميات مراقبة السحب - وثّق وارسم تشكيلات السحب المثيرة للاهتمام", "category": "Nature & Art", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 41, "name": "Tiny Paper Art", "description": "فن الورق الصغير - ابتكر أعمالاً فنية مصغرة على قطع صغيرة من الورق", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 42, "name": "Scent Journal", "description": "يوميات الروائح - وثّق وصف الروائح المختلفة التي تصادفها", "category": "Sensory Exploration", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 43, "name": "Shadow Drawing", "description": "الرسم بالظلال - ابتكر فناً عن طريق تتبع وتحويل الظلال", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 44, "name": "Micro Photography", "description": "التصوير المجهري - التقط صوراً قريبة جداً للأشياء الصغيرة", "category": "Photography", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 45, "name": "Sound Collection", "description": "جمع الأصوات - سجل واجمع الأصوات المثيرة للاهتمام من بيئتك", "category": "Audio", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 46, "name": "Tiny Book Making", "description": "صناعة الكتب المصغرة - اصنع كتباً مصغرة بقصصك وفنك الخاص", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 47, "name": "Pattern Hunting", "description": "صيد الأنماط - ابحث ووثق الأنماط المثيرة للاهتمام في الحياة اليومية", "category": "Photography & Art", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 48, "name": "Mindful Walking", "description": "المشي الواعي - مارس تأمل المشي مع ملاحظة محيطك", "category": "Wellness", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 49, "name": "Paper Quilling", "description": "لف الورق - ابتكر تصاميم زخرفية عن طريق لف وتشكيل شرائط الورق", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 50, "name": "Urban Sketching", "description": "الرسم الحضري - ارسم مشاهد من حياتك اليومية ومحيطك", "category": "Art", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 51, "name": "Food Plating", "description": "تزيين الأطباق - حوّل الوجبات العادية إلى عروض تقديم جذابة بصرياً", "category": "Food & Art", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 52, "name": "Seed Sprouting", "description": "إنبات البذور - انمِ ووثق عملية إنبات البذور المختلفة", "category": "Nature & Science", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 53, "name": "Washi Tape Art", "description": "فن شريط واشي - ابتكر تصاميم زخرفية باستخدام شريط واشي الياباني", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 54, "name": "Found Object Art", "description": "فن الأشياء الموجودة - ابتكر فناً باستخدام أشياء موجودة في الحياة اليومية", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Free"}
]

# Health endpoints
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": f"AI Hobby Recommender with {len(HOBBIES_DATA)} hobbies!"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/health")
async def api_health():
    return {"api_status": "working", "total_hobbies": len(HOBBIES_DATA)}

# Auth endpoints
@app.post("/api/auth/register")
async def register(user: UserCreate):
    if not user.username or not user.email or not user.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    return {"message": "Registration successful!", "user": {"username": user.username, "email": user.email, "id": 1}}

@app.post("/api/auth/login")
async def login(user: UserLogin):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    return {"message": "Login successful!", "user": {"email": user.email, "username": "Test User", "id": 1}, "access_token": "test_token"}

@app.get("/api/auth/me")
async def get_current_user():
    return {"id": 1, "email": "test@example.com", "username": "Test User"}

@app.get("/api/auth/profile")
async def get_user_profile():
    return {"id": 1, "email": "test@example.com", "username": "Test User", "display_name": "Test User", "avatar_url": None, "user_code": "TEST123"}

# Hobbies endpoints
@app.get("/api/hobbies/daily")
async def get_daily_hobby():
    hobby = random.choice(HOBBIES_DATA)
    return {"hobby": hobby, "message": f"إليك اقتراح هواية اليوم من بين {len(HOBBIES_DATA)} هواية!"}

@app.get("/api/hobbies")
async def get_all_hobbies():
    return {"hobbies": HOBBIES_DATA, "total": len(HOBBIES_DATA), "message": f"جميع الـ {len(HOBBIES_DATA)} هوايات متاحة الآن!"}

@app.get("/api/hobbies/{hobby_id}")
async def get_hobby_detail(hobby_id: int):
    hobby = next((h for h in HOBBIES_DATA if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby

@app.post("/api/hobbies/recommend")
async def get_hobby_recommendations():
    recommendations = random.sample(HOBBIES_DATA, min(5, len(HOBBIES_DATA)))
    return {"recommendations": recommendations, "total_available": len(HOBBIES_DATA), "message": f"إليك 5 اقتراحات مخصصة لك من بين {len(HOBBIES_DATA)} هواية!"}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to include additional routes
try:
    from app.api.routes import api_router
    app.include_router(api_router, prefix="/api")
except ImportError:
    pass 