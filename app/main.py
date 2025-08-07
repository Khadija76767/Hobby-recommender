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

# Optimized cache for all 54 hobbies
_HOBBIES_CACHE = None

def get_all_54_hobbies():
    global _HOBBIES_CACHE
    if _HOBBIES_CACHE is None:
        _HOBBIES_CACHE = [
            {"id": 1, "name": "Qur'an Memorization", "description": "حفظ القرآن الكريم - ابدأ رحلة روحانية في حفظ القرآن الكريم والتواصل مع آياته وتعاليمه الجميلة", "category": "Spiritual", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "1-2 hours daily", "equipment_needed": "Qur'an, notebook", "benefits": "Spiritual growth, improved memory, peace of mind"},
            {"id": 2, "name": "Origami", "description": "فن الأوريغامي - فن ياباني لطي الورق، يهدف إلى صنع منحوتات جميلة من ورقة واحدة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30 minutes per project", "equipment_needed": "Origami paper, instructions", "benefits": "Improves focus, patience, and hand-eye coordination"},
            {"id": 3, "name": "Poetry Writing", "description": "كتابة الشعر - عبر عن أفكارك ومشاعرك من خلال فن كتابة الشعر", "category": "Creative Writing", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes daily", "equipment_needed": "Notebook, pen", "benefits": "Emotional expression, creativity, language skills"},
            {"id": 4, "name": "Digital Art", "description": "الفن الرقمي - ابتكر أعمالاً فنية جميلة باستخدام الأدوات والبرامج الرقمية", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Medium", "time_commitment": "1-2 hours daily", "equipment_needed": "Digital tablet, art software", "benefits": "Digital skills, creativity, modern art expression"},
            {"id": 5, "name": "Gardening", "description": "البستنة - ازرع واعتني بالنباتات، وأنشئ مساحتك الخضراء الخاصة", "category": "Nature", "skill_level": "Beginner", "cost_level": "Medium", "time_commitment": "30 minutes daily", "equipment_needed": "Pots, soil, seeds, tools", "benefits": "Connection with nature, stress relief, fresh produce"},
            {"id": 6, "name": "Journaling", "description": "كتابة اليوميات - دوّن أفكارك ومشاعرك وتجاربك في مذكرة شخصية", "category": "Writing", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes daily", "equipment_needed": "Journal, pen", "benefits": "Self-reflection, emotional processing, memory keeping"},
            {"id": 7, "name": "Photography", "description": "التصوير الفوتوغرافي - التقط وابتكر صوراً جميلة باستخدام الكاميرا", "category": "Visual Arts", "skill_level": "Beginner", "cost_level": "Medium", "time_commitment": "1-2 hours daily", "equipment_needed": "Camera, editing software", "benefits": "Visual creativity, memory preservation, technical skills"},
            {"id": 8, "name": "Mini Vlogs (1-sec-a-day)", "description": "فلوقات مصغرة (ثانية واحدة في اليوم) - التقط مقطع فيديو مدته ثانية واحدة كل يوم لإنشاء يوميات حياة فريدة", "category": "Digital Creation", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "1 minute daily", "equipment_needed": "Smartphone", "benefits": "Memory keeping, creativity, daily mindfulness"},
            {"id": 9, "name": "Moodboard Making", "description": "تصميم لوحات المزاج - صمم لوحات جمالية لأهدافك أو أحلامك باستخدام Pinterest أو Canva", "category": "Digital Art", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "30-60 minutes", "equipment_needed": "Computer/smartphone, internet", "benefits": "Goal visualization, creativity, digital design skills"},
            {"id": 10, "name": "Soap Carving", "description": "نحت الصابون - ابتكر منحوتات جميلة باستخدام قالب صابون وسكين بلاستيكي فقط", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Soap bar, plastic knife", "benefits": "Stress relief, creativity, fine motor skills"},
            {"id": 11, "name": "Memory Jar Art", "description": "فن برطمان الذكريات - زين برطماناً واملأه بملاحظات أو صور صغيرة للذكريات", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes daily", "equipment_needed": "Jar, paper, decorative items", "benefits": "Memory keeping, creativity, emotional expression"},
            {"id": 12, "name": "Tea Tasting & Journaling", "description": "تذوق الشاي وتدوين الملاحظات - جرب أنواعاً مختلفة من الشاي وقيمها في دفتر جميل", "category": "Food & Drink", "skill_level": "Beginner", "cost_level": "Medium", "time_commitment": "15-30 minutes", "equipment_needed": "Tea varieties, journal, kettle", "benefits": "Mindfulness, taste development, relaxation"},
            {"id": 13, "name": "Teabag Art", "description": "الرسم على أكياس الشاي - ابتكر أعمالاً فنية فريدة على أكياس الشاي المستعملة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Used teabags, paint, brushes", "benefits": "Upcycling, creativity, patience"},
            {"id": 14, "name": "Candle Making", "description": "صناعة الشموع - اصنع شموعك العطرية الخاصة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Medium", "time_commitment": "1-2 hours", "equipment_needed": "Wax, wicks, containers, fragrances", "benefits": "Creativity, aromatherapy, handmade gifts"},
            {"id": 15, "name": "Mindful Coloring", "description": "التلوين الواعي - استخدم كتب تلوين الماندالا أو الرسومات الجمالية للاسترخاء", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-60 minutes", "equipment_needed": "Coloring books, colored pencils/markers", "benefits": "Stress relief, mindfulness, color therapy"},
            {"id": 16, "name": "Gratitude Jar", "description": "برطمان الامتنان - أضف ملاحظة يومية عن شيء تشعر بالامتنان له", "category": "Personal Growth", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "5 minutes daily", "equipment_needed": "Jar, paper, pen", "benefits": "Positivity, mindfulness, emotional wellbeing"},
            {"id": 17, "name": "Window Bird Watching", "description": "مراقبة الطيور من النافذة - تعلم التعرف على الطيور المحلية من نافذتك", "category": "Nature", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes daily", "equipment_needed": "Bird guide, binoculars (optional)", "benefits": "Nature connection, patience, observation skills"},
            {"id": 18, "name": "Virtual Travel", "description": "السفر الافتراضي - استكشف دولاً عشوائية واصنع قوائم بالوجهات التي تحلم بها باستخدام Google Earth", "category": "Travel & Culture", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "30-60 minutes", "equipment_needed": "Computer, internet", "benefits": "Cultural awareness, travel planning, geography knowledge"},
            {"id": 19, "name": "Digital Journaling", "description": "التدوين الرقمي - نظم أفكارك، تتبع أهدافك، وزين بالملصقات الرقمية باستخدام تطبيقات مثل Goodnotes/Notion", "category": "Digital Creation", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes daily", "equipment_needed": "Tablet/computer, journaling app", "benefits": "Organization, creativity, goal tracking"},
            {"id": 20, "name": "Mystery Solving", "description": "حل الألغاز - حل قضايا وألغاز صغيرة يمكنك إيجادها على الإنترنت", "category": "Mental Exercise", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "30-60 minutes", "equipment_needed": "Internet access, notebook", "benefits": "Critical thinking, problem-solving, attention to detail"},
            {"id": 21, "name": "Pressed Flower Art", "description": "فن الزهور المضغوطة - اجمع الزهور واضغطها في الدفاتر أو أطرها", "category": "Nature & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "Collection: 30 mins, Pressing: days", "equipment_needed": "Heavy books, flowers, paper", "benefits": "Nature connection, patience, decoration"},
            {"id": 22, "name": "Language Learning", "description": "تعلم اللغات - تعلم لغة جديدة من خلال التطبيقات والفيديوهات والتدريب", "category": "Education", "skill_level": "Beginner", "cost_level": "Free to Medium", "time_commitment": "15-30 minutes daily", "equipment_needed": "Language learning apps, notebook", "benefits": "Cultural understanding, cognitive development, communication skills"},
            {"id": 23, "name": "Zentangle Drawing", "description": "رسم الزينتانجل - ابتكر أنماطاً جميلة باستخدام أنماط بسيطة ومنظمة", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes", "equipment_needed": "Paper, fine-tip pen", "benefits": "Meditation, creativity, stress relief"},
            {"id": 24, "name": "Punch Needle Embroidery", "description": "تطريز إبرة الثقب - ابتكر فناً نسيجياً باستخدام أداة إبرة الثقب", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Medium", "time_commitment": "1-2 hours", "equipment_needed": "Punch needle, fabric, thread", "benefits": "Creativity, relaxation, unique home decor"},
            {"id": 25, "name": "Rock Painting", "description": "الرسم على الصخور - ارسم تصاميم أو رسائل جميلة على الأحجار", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Rocks, acrylic paint, brushes", "benefits": "Creativity, outdoor activity, spreading joy"},
            {"id": 26, "name": "Shadow Puppetry", "description": "مسرح الظل - اصنع قصصاً باستخدام ظلال اليد أو قصاصات الورق", "category": "Performance Art", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Light source, white screen/wall", "benefits": "Storytelling, creativity, entertainment"},
            {"id": 27, "name": "Character Roleplay", "description": "تقمص الشخصيات - مثّل شخصيات خيالية في مجموعات النص أو الصوت", "category": "Performance Art", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "1-2 hours", "equipment_needed": "Internet connection, imagination", "benefits": "Creativity, social interaction, character development"},
            {"id": 28, "name": "ASMR Creation", "description": "صناعة ASMR - ابتكر أصواتاً مريحة باستخدام الأشياء اليومية", "category": "Audio Creation", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Microphone, everyday objects", "benefits": "Creativity, sound awareness, relaxation"},
            {"id": 29, "name": "Morse Code", "description": "شفرة مورس - تعلم وابتكر رسائل سرية بشفرة مورس", "category": "Communication", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "15-30 minutes daily", "equipment_needed": "Paper, pen, reference guide", "benefits": "Brain training, historical interest, secret communication"},
            {"id": 30, "name": "Dream Mapping", "description": "رسم خرائط الأحلام - ارسم خرائط لأماكن الأحلام أو العوالم الخيالية", "category": "Arts & Imagination", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "1-2 hours", "equipment_needed": "Paper, drawing supplies", "benefits": "Creativity, imagination development, artistic expression"},
            {"id": 31, "name": "Reverse Bucket List", "description": "قائمة الإنجازات العكسية - اكتب واحتفل بكل الأشياء الرائعة التي قمت بها بالفعل", "category": "Personal Growth", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "30-60 minutes", "equipment_needed": "Journal, pen", "benefits": "Gratitude, self-appreciation, motivation"},
            {"id": 32, "name": "Font Making", "description": "صناعة الخطوط - حول خط يدك إلى خط رقمي", "category": "Digital Creation", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "2-3 hours", "equipment_needed": "Paper, pen, scanner/camera", "benefits": "Typography skills, digital creativity, personal branding"},
            {"id": 33, "name": "Voice Acting", "description": "التمثيل الصوتي - تدرب على قراءة شخصيات من العروض/الكتب بأصوات مختلفة", "category": "Performance Art", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes daily", "equipment_needed": "Microphone, scripts", "benefits": "Voice control, acting skills, confidence"},
            {"id": 34, "name": "Pixel Art", "description": "فن البكسل - ابتكر فناً رقمياً بأسلوب قديم بكسل تلو الآخر", "category": "Digital Art", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "1-2 hours", "equipment_needed": "Computer, pixel art software", "benefits": "Digital art skills, patience, attention to detail"},
            {"id": 35, "name": "Time Capsule Making", "description": "صنع كبسولة الزمن - اصنع واخفِ مجموعة من الذكريات الحالية لنفسك في المستقبل", "category": "Personal Growth", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "2-3 hours", "equipment_needed": "Container, mementos, letters", "benefits": "Self-reflection, memory preservation, future connection"},
            {"id": 36, "name": "Cup Rhythm Games", "description": "ألعاب الإيقاع بالأكواب - تعلم وابتكر روتينات إيقاعية باستخدام الأكواب البلاستيكية", "category": "Music & Rhythm", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes daily", "equipment_needed": "Plastic cup", "benefits": "Rhythm skills, coordination, musical expression"},
            {"id": 37, "name": "Whistling Tricks", "description": "حيل الصفير - تعلم تقنيات وألحان مختلفة للصفير", "category": "Music", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "10-15 minutes daily", "equipment_needed": "None", "benefits": "Musical expression, breath control, entertainment"},
            {"id": 38, "name": "Coin Collection", "description": "جمع العملات - اجمع وتعلم عن العملات من مختلف البلدان والعصور", "category": "Collecting", "skill_level": "Beginner", "cost_level": "Varies", "time_commitment": "Flexible", "equipment_needed": "Coin album, magnifying glass", "benefits": "Historical knowledge, organization, value appreciation"},
            {"id": 39, "name": "Conlang Creation", "description": "ابتكار لغة مصطنعة - ابتكر لغتك المصطنعة الخاصة بقواعد ومفردات فريدة", "category": "Linguistics", "skill_level": "Intermediate", "cost_level": "Free", "time_commitment": "1-2 hours daily", "equipment_needed": "Notebook, reference materials", "benefits": "Language understanding, creativity, world-building"},
            {"id": 40, "name": "Cloud Watching Journal", "description": "يوميات مراقبة السحب - وثّق وارسم تشكيلات السحب المثيرة للاهتمام", "category": "Nature & Art", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "15-30 minutes daily", "equipment_needed": "Sketchbook, colored pencils", "benefits": "Mindfulness, weather awareness, artistic expression"},
            {"id": 41, "name": "Tiny Paper Art", "description": "فن الورق الصغير - ابتكر أعمالاً فنية مصغرة على قطع صغيرة من الورق", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Small paper, fine pens", "benefits": "Fine motor skills, patience, detail focus"},
            {"id": 42, "name": "Scent Journal", "description": "يوميات الروائح - وثّق وصف الروائح المختلفة التي تصادفها", "category": "Sensory Exploration", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "5-10 minutes daily", "equipment_needed": "Notebook, pen", "benefits": "Sensory awareness, vocabulary development, memory training"},
            {"id": 43, "name": "Shadow Drawing", "description": "الرسم بالظلال - ابتكر فناً عن طريق تتبع وتحويل الظلال", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Paper, pencils, sunlight/lamp", "benefits": "Creativity, observation skills, light understanding"},
            {"id": 44, "name": "Micro Photography", "description": "التصوير المجهري - التقط صوراً قريبة جداً للأشياء الصغيرة", "category": "Photography", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Smartphone/camera with macro mode", "benefits": "Detail appreciation, photography skills, nature observation"},
            {"id": 45, "name": "Sound Collection", "description": "جمع الأصوات - سجل واجمع الأصوات المثيرة للاهتمام من بيئتك", "category": "Audio", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes daily", "equipment_needed": "Smartphone/recorder", "benefits": "Audio awareness, sound appreciation, environment connection"},
            {"id": 46, "name": "Tiny Book Making", "description": "صناعة الكتب المصغرة - اصنع كتباً مصغرة بقصصك وفنك الخاص", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "1-2 hours", "equipment_needed": "Paper, scissors, glue, pens", "benefits": "Storytelling, crafting skills, creative expression"},
            {"id": 47, "name": "Pattern Hunting", "description": "صيد الأنماط - ابحث ووثق الأنماط المثيرة للاهتمام في الحياة اليومية", "category": "Photography & Art", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "15-30 minutes daily", "equipment_needed": "Camera/phone, notebook", "benefits": "Pattern recognition, visual awareness, artistic inspiration"},
            {"id": 48, "name": "Mindful Walking", "description": "المشي الواعي - مارس تأمل المشي مع ملاحظة محيطك", "category": "Wellness", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "15-30 minutes daily", "equipment_needed": "Comfortable shoes", "benefits": "Mindfulness, stress relief, physical activity"},
            {"id": 49, "name": "Paper Quilling", "description": "لف الورق - ابتكر تصاميم زخرفية عن طريق لف وتشكيل شرائط الورق", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "1-2 hours", "equipment_needed": "Paper strips, quilling tool", "benefits": "Fine motor skills, patience, artistic expression"},
            {"id": 50, "name": "Urban Sketching", "description": "الرسم الحضري - ارسم مشاهد من حياتك اليومية ومحيطك", "category": "Art", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Sketchbook, pencils/pens", "benefits": "Observation skills, artistic growth, memory keeping"},
            {"id": 51, "name": "Food Plating", "description": "تزيين الأطباق - حوّل الوجبات العادية إلى عروض تقديم جذابة بصرياً", "category": "Food & Art", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "15-30 minutes per meal", "equipment_needed": "Plates, basic utensils", "benefits": "Creativity, food appreciation, photography skills"},
            {"id": 52, "name": "Seed Sprouting", "description": "إنبات البذور - انمِ ووثق عملية إنبات البذور المختلفة", "category": "Nature & Science", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "5-10 minutes daily", "equipment_needed": "Seeds, containers, water", "benefits": "Plant knowledge, patience, healthy eating"},
            {"id": 53, "name": "Washi Tape Art", "description": "فن شريط واشي - ابتكر تصاميم زخرفية باستخدام شريط واشي الياباني", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Low", "time_commitment": "30-60 minutes", "equipment_needed": "Washi tape collection, paper", "benefits": "Color coordination, pattern design, decoration skills"},
            {"id": 54, "name": "Found Object Art", "description": "فن الأشياء الموجودة - ابتكر فناً باستخدام أشياء موجودة في الحياة اليومية", "category": "Arts & Crafts", "skill_level": "Beginner", "cost_level": "Free", "time_commitment": "1-2 hours", "equipment_needed": "Found objects, adhesive", "benefits": "Creativity, recycling awareness, unique art"}
        ]
    return _HOBBIES_CACHE

# Fast startup endpoints - immediate response
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "AI Hobby Recommender with 54 hobbies!", "version": "2.0"}

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": "2025"}

@app.get("/ping")
async def ping():
    return {"ping": "pong"}

# API health with hobbies count
@app.get("/api/health")
async def api_health():
    hobbies = get_all_54_hobbies()
    return {"api_status": "working", "total_hobbies": len(hobbies), "message": "All 54 hobbies loaded!"}

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

# Hobbies endpoints - all 54 hobbies
@app.get("/api/hobbies/daily")
async def get_daily_hobby():
    hobbies = get_all_54_hobbies()
    hobby = random.choice(hobbies)
    return {"hobby": hobby, "message": f"إليك اقتراح هواية اليوم من بين {len(hobbies)} هواية!"}

@app.get("/api/hobbies")
async def get_all_hobbies():
    hobbies = get_all_54_hobbies()
    return {"hobbies": hobbies, "total": len(hobbies), "message": f"جميع الـ {len(hobbies)} هوايات متاحة الآن!"}

@app.get("/api/hobbies/{hobby_id}")
async def get_hobby_detail(hobby_id: int):
    hobbies = get_all_54_hobbies()
    hobby = next((h for h in hobbies if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby

@app.post("/api/hobbies/recommend")
async def get_hobby_recommendations():
    hobbies = get_all_54_hobbies()
    recommendations = random.sample(hobbies, min(5, len(hobbies)))
    return {"recommendations": recommendations, "total_available": len(hobbies), "message": f"إليك 5 اقتراحات مخصصة لك من بين {len(hobbies)} هواية!"}

@app.get("/api/hobbies/category/{category}")
async def get_hobbies_by_category(category: str):
    hobbies = get_all_54_hobbies()
    filtered = [h for h in hobbies if category.lower() in h["category"].lower()]
    return {"hobbies": filtered, "category": category, "total": len(filtered)}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "https://hobby-recommender.vercel.app", "https://hobby-recommender-khadija76767.vercel.app", "https://khadija-hobby-recommender.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event - preload cache
@app.on_event("startup")
async def startup_event():
    hobbies = get_all_54_hobbies()
    print(f"✅ Successfully loaded {len(hobbies)} hobbies into cache!")

# Try to include additional API routes
try:
    from app.api.routes import api_router
    app.include_router(api_router, prefix="/api")
except ImportError:
    pass 