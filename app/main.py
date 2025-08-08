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

# 54 hobbies - المجموعة الكاملة!
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
    {"id": 11, "name": "كتابة اليوميات", "description": "دوّن أفكارك ومشاعرك وتجاربك في مذكرة شخصية", "category": "كتابة", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 12, "name": "فلوقات مصغرة", "description": "التقط مقطع فيديو مدته ثانية واحدة كل يوم لإنشاء يوميات حياة فريدة", "category": "رقمي", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 13, "name": "تصميم لوحات المزاج", "description": "صمم لوحات جمالية لأهدافك أو أحلامك باستخدام Pinterest أو Canva", "category": "فنون رقمية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 14, "name": "نحت الصابون", "description": "ابتكر منحوتات جميلة باستخدام قالب صابون وسكين بلاستيكي فقط", "category": "حرف", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 15, "name": "فن برطمان الذكريات", "description": "زين برطماناً واملأه بملاحظات أو صور صغيرة للذكريات", "category": "حرف", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 16, "name": "تذوق الشاي", "description": "جرب أنواعاً مختلفة من الشاي وقيمها في دفتر جميل", "category": "طعام وشراب", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 17, "name": "الرسم على أكياس الشاي", "description": "ابتكر أعمالاً فنية فريدة على أكياس الشاي المستعملة", "category": "حرف", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 18, "name": "صناعة الشموع", "description": "اصنع شموعك العطرية الخاصة بروائح مختلفة", "category": "حرف", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 19, "name": "التلوين الواعي", "description": "استخدم كتب تلوين الماندالا أو الرسومات الجمالية للاسترخاء", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 20, "name": "برطمان الامتنان", "description": "أضف ملاحظة يومية عن شيء تشعر بالامتنان له", "category": "تطوير شخصي", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 21, "name": "مراقبة الطيور", "description": "تعلم التعرف على الطيور المحلية من نافذتك أو في الحديقة", "category": "طبيعة", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 22, "name": "السفر الافتراضي", "description": "استكشف دولاً عشوائية واصنع قوائم بالوجهات التي تحلم بها باستخدام Google Earth", "category": "سفر وثقافة", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 23, "name": "التدوين الرقمي", "description": "نظم أفكارك، تتبع أهدافك، وزين بالملصقات الرقمية باستخدام تطبيقات مثل Goodnotes/Notion", "category": "رقمي", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 24, "name": "حل الألغاز", "description": "حل قضايا وألغاز صغيرة يمكنك إيجادها على الإنترنت لتطوير مهارات التفكير", "category": "تمارين ذهنية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 25, "name": "فن الزهور المضغوطة", "description": "اجمع الزهور واضغطها في الدفاتر أو أطرها كديكور طبيعي", "category": "طبيعة وحرف", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 26, "name": "تعلم اللغات", "description": "تعلم لغة جديدة من خلال التطبيقات والفيديوهات والتدريب اليومي", "category": "تعليم", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 27, "name": "رسم الزينتانجل", "description": "ابتكر أنماطاً جميلة باستخدام أنماط بسيطة ومنظمة للاسترخاء والتأمل", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 28, "name": "تطريز إبرة الثقب", "description": "ابتكر فناً نسيجياً باستخدام أداة إبرة الثقب لصنع ديكورات فريدة", "category": "حرف", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 29, "name": "الرسم على الصخور", "description": "ارسم تصاميم أو رسائل جميلة على الأحجار ووزعها للآخرين", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 30, "name": "مسرح الظل", "description": "اصنع قصصاً باستخدام ظلال اليد أو قصاصات الورق لتسلية الأطفال", "category": "فنون أداء", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 31, "name": "تقمص الشخصيات", "description": "مثّل شخصيات خيالية في مجموعات النص أو الصوت عبر الإنترنت", "category": "فنون أداء", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 32, "name": "صناعة ASMR", "description": "ابتكر أصواتاً مريحة باستخدام الأشياء اليومية لتساعد على الاسترخاء", "category": "صوتيات", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 33, "name": "شفرة مورس", "description": "تعلم وابتكر رسائل سرية بشفرة مورس التاريخية الشهيرة", "category": "تواصل", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 34, "name": "رسم خرائط الأحلام", "description": "ارسم خرائط لأماكن الأحلام أو العوالم الخيالية التي تتخيلها", "category": "فنون وخيال", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 35, "name": "قائمة الإنجازات العكسية", "description": "اكتب واحتفل بكل الأشياء الرائعة التي قمت بها بالفعل في حياتك", "category": "تطوير شخصي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 36, "name": "صناعة الخطوط", "description": "حول خط يدك إلى خط رقمي يمكن استخدامه على الكمبيوتر", "category": "رقمي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 37, "name": "التمثيل الصوتي", "description": "تدرب على قراءة شخصيات من العروض/الكتب بأصوات مختلفة ومميزة", "category": "فنون أداء", "skill_level": "Beginner", "cost_level": "Low"},
    
    # الـ 17 هواية الأخيرة - إكمال الـ 54!
    {"id": 38, "name": "التقطير المائي", "description": "اصنع عطوراً ومياه عطرة طبيعية من الزهور والأعشاب", "category": "علوم طبيعية", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 39, "name": "صناعة الكتب المصغرة", "description": "ابتكر كتباً صغيرة رائعة باليد للمجموعة أو كهدايا", "category": "حرف الورق", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 40, "name": "فن الكولاج", "description": "اجمع مقاطع من المجلات والصور لإنشاء أعمال فنية فريدة", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 41, "name": "تربية النباتات المائية", "description": "اعتن بنباتات تنمو في الماء فقط في أوعية زجاجية جميلة", "category": "طبيعة", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 42, "name": "البرمجة الإبداعية", "description": "تعلم البرمجة لإنشاء فن رقمي وألعاب بسيطة", "category": "تكنولوجيا", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 43, "name": "جمع وتصنيف الأحجار", "description": "ابحث عن أحجار مثيرة وتعلم عن أنواعها وخصائصها", "category": "علوم الأرض", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 44, "name": "فن الخط العربي", "description": "تعلم جمال الخط العربي وابتكر قطعاً فنية بالكلمات", "category": "فنون تراثية", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 45, "name": "العناية بالطيور", "description": "اجذب الطيور لحديقتك بالمياه والطعام وراقب سلوكها", "category": "حياة برية", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 46, "name": "تصميم الألعاب البسيطة", "description": "ابتكر ألعاب ورقية أو رقمية بسيطة للأصدقاء والعائلة", "category": "تصميم ألعاب", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 47, "name": "فن الأشكال الهندسية", "description": "ارسم أو اصنع أشكالاً هندسية جميلة ومعقدة", "category": "رياضيات فنية", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 48, "name": "صنع العرائس الورقية", "description": "اصنع عرائس ورقية بسيطة لسرد القصص والمرح", "category": "حرف ترفيهية", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 49, "name": "علم الفلك المبسط", "description": "راقب النجوم والقمر وتعلم عن الكواكب والأجرام السماوية", "category": "علوم الفضاء", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 50, "name": "التأمل والاسترخاء", "description": "تعلم تقنيات التأمل والتنفس للاسترخاء وتحسين التركيز", "category": "صحة نفسية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 51, "name": "مهارات البقاء البسيطة", "description": "تعلم مهارات أساسية للبقاء والطوارئ في الطبيعة", "category": "مهارات حياتية", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 52, "name": "فن المجوهرات البسيطة", "description": "اصنع إكسسوارات جميلة باستخدام الخرز والخيوط", "category": "حرف الزينة", "skill_level": "Beginner", "cost_level": "Medium"},
    {"id": 53, "name": "المحافظة على البيئة", "description": "تعلم وطبق طرق صديقة للبيئة في حياتك اليومية", "category": "بيئة واستدامة", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 54, "name": "فن السيراميك المنزلي", "description": "شكّل واصنع قطعاً فنية من الطين بدون أفران خاصة", "category": "فنون تشكيلية", "skill_level": "Beginner", "cost_level": "Medium"}
]

@app.get("/")
def root():
    return {"message": f"🎉 AI Hobby Recommender - Complete with ALL {len(hobbies)} hobbies! 🎉", "status": "COMPLETE", "celebration": "🌟✨🎊"}

@app.get("/health")
def health():
    return {"status": "perfect", "hobbies_count": len(hobbies), "complete": True}

@app.get("/api/health")
def api_health():
    return {"status": "🔥 COMPLETE!", "hobbies": len(hobbies), "message": "All 54 hobbies are here! Perfect collection! 🌟"}

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
    return {"hobbies": hobbies, "total": len(hobbies), "message": f"🎉 المجموعة الكاملة! {len(hobbies)} هواية رائعة!", "celebration": "🌟✨"}

@app.get("/api/hobbies/daily")
def daily_hobby():
    hobby = random.choice(hobbies)
    return {"hobby": hobby, "message": f"هواية اليوم من بين المجموعة الكاملة من {len(hobbies)} هواية! 🌟", "total_available": len(hobbies)}

@app.get("/api/hobbies/{hobby_id}")
def get_hobby(hobby_id: int):
    hobby = next((h for h in hobbies if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(404, "الهواية غير موجودة")
    return hobby

@app.post("/api/hobbies/recommend")
def recommend():
    num_recommendations = min(8, len(hobbies))  # زيادة الاقتراحات لـ 8
    recommendations = random.sample(hobbies, num_recommendations)
    return {"recommendations": recommendations, "total_available": len(hobbies), "message": f"إليك {num_recommendations} اقتراحات من المجموعة الكاملة من {len(hobbies)} هواية! 🌟"}

@app.get("/api/hobbies/category/{category}")
def get_hobbies_by_category(category: str):
    filtered = [h for h in hobbies if category.lower() in h["category"].lower()]
    return {"hobbies": filtered, "category": category, "total": len(filtered), "total_available": len(hobbies)}

@app.get("/api/hobbies/random/{count}")
def get_random_hobbies(count: int = 5):
    count = min(count, len(hobbies))
    random_hobbies = random.sample(hobbies, count)
    return {"hobbies": random_hobbies, "count": count, "total_available": len(hobbies)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 