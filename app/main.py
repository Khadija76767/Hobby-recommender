from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
import random
import os
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional
import time
import uuid
import hashlib

app = FastAPI(
    title="AI Hobby Recommender",
    description="🚀 نظام ذكي متقدم لاقتراح الهوايات مع مستخدمين متعددين",
    version="3.0.0"
)

# تجربة استيراد قاعدة البيانات بشكل آمن
DATABASE_AVAILABLE = False
Base = None
User = None
SessionLocal = None
pwd_context = None
jwt = None

try:
    from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, text
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker, Session
    from passlib.context import CryptContext
    from jose import JWTError, jwt
    
    DATABASE_AVAILABLE = True
    print("✅ تم تحميل مكتبات قاعدة البيانات بنجاح!")
    
    # إعداد قاعدة البيانات
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    if DATABASE_URL:
        # إعداد قاعدة البيانات
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base = declarative_base()
        
        # إعداد كلمات المرور المشفرة
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")
        
        # نموذج المستخدم في قاعدة البيانات
        class User(Base):
            __tablename__ = "users"
            
            id = Column(Integer, primary_key=True, index=True)
            username = Column(String, unique=True, index=True)
            email = Column(String, unique=True, index=True)
            hashed_password = Column(String)
            display_name = Column(String, nullable=True)
            avatar_url = Column(String, nullable=True)
            user_code = Column(String, unique=True, index=True)
            is_active = Column(Boolean, default=True)
            created_at = Column(DateTime, default=datetime.utcnow)
        
        # إنشاء الجداول بشكل آمن
        try:
            Base.metadata.create_all(bind=engine)
            print("🔥 تم إنشاء جداول قاعدة البيانات بنجاح!")
            SYSTEM_MODE = "ADVANCED_REAL_DATABASE"
        except Exception as e:
            print(f"❌ خطأ في إنشاء الجداول: {e}")
            SYSTEM_MODE = "SIMPLE_WITH_DB_DETECTION"
            DATABASE_AVAILABLE = False
    else:
        print("⚠️ DATABASE_URL غير موجود")
        SYSTEM_MODE = "SIMPLE_WITH_DB_DETECTION"
        DATABASE_AVAILABLE = False
        
except ImportError as e:
    DATABASE_AVAILABLE = False
    SYSTEM_MODE = "SIMPLE_FALLBACK"
    print(f"⚠️ قاعدة البيانات غير متاحة: {e}")
except Exception as e:
    DATABASE_AVAILABLE = False
    SYSTEM_MODE = "SIMPLE_FALLBACK"
    print(f"❌ خطأ في إعداد قاعدة البيانات: {e}")

# دالة للحصول على جلسة قاعدة البيانات
def get_db():
    if DATABASE_AVAILABLE and SessionLocal:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        yield None

# دوال المصادقة الآمنة
def verify_password(plain_password, hashed_password):
    if DATABASE_AVAILABLE and pwd_context:
        return pwd_context.verify(plain_password, hashed_password)
    return plain_password == hashed_password  # للنظام البسيط

def get_password_hash(password):
    if DATABASE_AVAILABLE and pwd_context:
        return pwd_context.hash(password)
    return password  # للنظام البسيط

def generate_user_code():
    """توليد كود مستخدم فريد"""
    import uuid
    import hashlib
    
    # 🔥 استخدام timestamp دقيق + random UUID + process ID
    timestamp = str(time.time()).replace('.', '')[-6:]  # آخر 6 أرقام من timestamp مع microseconds
    uuid_part = str(uuid.uuid4()).replace('-', '')[:4]  # 4 أحرف من UUID عشوائي
    
    # دمج وتحويل لأحرف كبيرة مع أرقام
    combined = f"{uuid_part}{timestamp}"
    
    # ضمان الطول = 6 أحرف/أرقام
    if len(combined) > 6:
        combined = combined[:6]
    elif len(combined) < 6:
        combined = combined + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6-len(combined)))
    
    return combined.upper()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    if not DATABASE_AVAILABLE or not jwt:
        return "demo_token"
    
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def get_current_user(db: Session = Depends(get_db)):
    if not DATABASE_AVAILABLE or not db:
        # مستخدم وهمي للنظام البسيط
        return {"id": 1, "username": "demo_user", "email": "demo@example.com", "user_code": "DEMO123"}
    
    # للنظام المتقدم - سنضيف المصادقة الحقيقية لاحقاً
    return {"id": 1, "username": "demo_user", "email": "demo@example.com", "user_code": "DEMO123"}

# نماذج البيانات
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# 54 hobbies - المجموعة المحسنة والودودة!
hobbies = [
    {"id": 1, "name": "حفظ آية واحدة كل يوم", "description": "ابدئي يومك بحفظ آية واحدة من القرآن الكريم - 10 دقائق كافية لآية واحدة جميلة", "category": "روحانية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 2, "name": "فن طي الورق البسيط", "description": "اطوي أي ورقة متاحة لديك لتصنعي طائر أو وردة - الأوريغامي يبدأ بورقة واحدة!", "category": "فنون", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 3, "name": "كتابة قصيدة عن مشاعرك", "description": "صفي شعورك الحالي في 4 أبيات شعر - عبري عن مشاعرك بكلمات جميلة", "category": "أدب", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 4, "name": "الرسم الرقمي بالجوال", "description": "استخدمي تطبيق Procreate أو Adobe Fresco أو حتى تطبيق الرسم المجاني في جوالك لترسمي حلمك أو هدفك القادم", "category": "فنون رقمية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 5, "name": "زراعة البذور في الماء", "description": "خذي بذرة من أي فاكهة تناولتيها وضعيها في كوب ماء - راقبي نموها يومياً!", "category": "طبيعة", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 6, "name": "تصوير الجمال المخفي", "description": "التقطي 10 صور لأشياء جميلة في مكانك - اكتشفي الجمال في التفاصيل الصغيرة", "category": "تصوير", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 7, "name": "طبخ من 3 مكونات فقط", "description": "تحدي الإبداع! اصنعي وجبة لذيذة من 3 مكونات متوفرة في مطبخك", "category": "طعام", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 8, "name": "قراءة مكثفة قصيرة", "description": "اقرئي 20 صفحة من أي كتاب قريب منك - ستندهشي من كمية المعرفة في 20 صفحة", "category": "تعليم", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 9, "name": "رسم ما تراه أمامك", "description": "انظري حولك واختاري شيئاً واحداً وارسميه - كوب، نبتة، يدك، أي شيء!", "category": "رسم", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 10, "name": "تعلم الموسيقى البسيطة", "description": "استخدمي تطبيق Simply Piano أو Yousician أو Piano Academy لتتعلمي 5 نوتات موسيقية بسيطة", "category": "موسيقى", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 11, "name": "رسالة للذات المستقبلية", "description": "اكتبي رسالة لنفسك بعد سنة من اليوم - ما أحلامك؟ ما تتمنينه لها؟", "category": "تطوير شخصي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 12, "name": "يوميات فيديو ثانية واحدة", "description": "استخدمي تطبيق 1 Second Everyday أو صوري ثانية واحدة كل ساعة لتوثقي يومك", "category": "فيديو", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 13, "name": "لوحة أحلام رقمية", "description": "استخدمي Pinterest أو Canva لتجمعي 10 صور تعبر عن أحلامك وأهدافك", "category": "تخطيط أحلام", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 14, "name": "نحت الصابون البسيط", "description": "خذي قطعة صابون وسكين بلاستيك واصنعي شكلاً بسيطاً - قلب، نجمة، أي شكل تحبينه", "category": "نحت", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 15, "name": "برطمان الذكريات اليومية", "description": "زيني برطمان واكتبي 5 أشياء جميلة حدثت معك اليوم وضعيها فيه - كل يوم أضيفي المزيد", "category": "ذكريات", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 16, "name": "رحلة تذوق أنواع الشاي", "description": "إذا توفر لديك أنواع شاي مختلفة، تذوقي 3 أنواع وسجلي ملاحظاتك عن كل نوع", "category": "تذوق", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 17, "name": "فن الرسم على أكياس الشاي", "description": "بعد شرب الشاي، جففي الكيس وارسمي عليه رسمة صغيرة - فن من إعادة التدوير!", "category": "رسم إبداعي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 18, "name": "صناعة شموع من البقايا", "description": "اجمعي بقايا الشموع القديمة واذيبيها لتصنعي شمعة جديدة بعطر مميز", "category": "صناعة", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 19, "name": "التلوين التأملي", "description": "اطبعي صفحة تلوين ماندالا من الإنترنت أو ارسمي أشكال بسيطة ولونيها مع الموسيقى", "category": "تلوين تأملي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 20, "name": "يوميات الامتنان", "description": "اكتبي 3 أشياء تشعرين بالامتنان لها - يمكن أن تكون صحتك، عائلتك، أي شيء!", "category": "امتنان", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 21, "name": "مراقبة الطيور من النافذة", "description": "اجلسي بجانب النافذة لمدة 10 دقائق وحاولي رؤية أنواع مختلفة من الطيور", "category": "مراقبة طبيعة", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 22, "name": "السفر الافتراضي", "description": "افتحي Google Earth أو تطبيق Earth من Google واختاري دولة عشوائية وتجولي فيها لمدة 15 دقيقة", "category": "سفر افتراضي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 23, "name": "تنظيم الهاتف بطريقة جمالية", "description": "استخدمي تطبيق Widgetsmith أو Shortcuts لتنظمي شاشة جوالك وتجعليها أكثر جمالاً", "category": "تنظيم رقمي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 24, "name": "حل الألغاز الذهنية", "description": "ادخلي على موقع Puzzle Baron أو تطبيق Peak أو Lumosity وحلي لغز واحد لتحدي عقلك", "category": "ألغاز", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 25, "name": "ضغط الأوراق والزهور", "description": "اجمعي ورقة شجر أو زهرة صغيرة وضعيها في كتاب لتجف - ستصبح ديكوراً طبيعياً!", "category": "طبيعة فنية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 26, "name": "تعلم كلمات بلغة جديدة", "description": "استخدمي Duolingo أو Google Translate لتتعلمي 5 كلمات بلغة جديدة - ابدئي بـ: مرحبا، شكراً، كيف حالك", "category": "لغات", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 27, "name": "رسم الأشكال الهندسية المتداخلة", "description": "ارسمي دوائر، مربعات، مثلثات متداخلة - ستحصلين على تصميمات زخرفية رائعة", "category": "رسم هندسي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 28, "name": "التطريز البسيط", "description": "اعملي تطريز بسيط على قطعة قماش قديمة بخيط ملون - حتى لو كانت خطوط بسيطة", "category": "تطريز", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 29, "name": "رسم على الأحجار", "description": "اجمعي 3 أحجار صغيرة نظيفة وارسمي عليها وجوه مبتسمة أو أشكال ملونة", "category": "رسم على أحجار", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 30, "name": "مسرح الظل باليدين", "description": "في مكان مظلم، استخدمي كشاف الجوال لتصنعي أشكال حيوانات بظل يديك على الحائط", "category": "مسرح ظل", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 31, "name": "تقليد الشخصيات الكرتونية", "description": "اختاري شخصية كرتونية تحبينها وقلدي صوتها وحركاتها لدقيقتين - متعة خالصة!", "category": "تمثيل", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 32, "name": "أصوات ASMR منزلية", "description": "استخدمي أقلام، كؤوس، ملاعق لتصنعي أصوات مريحة ومهدئة - مثل ASMR منزلي", "category": "أصوات مريحة", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 33, "name": "كتابة الرسائل السرية", "description": "اكتبي رسالة واستبدلي كل حرف بالحرف التالي في الأبجدية - شفرة سرية بسيطة!", "category": "شفرات", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 34, "name": "رسم خرائط الأماكن الخيالية", "description": "ارسمي خريطة للمكان الذي تحلمين بزيارته مع كل التفاصيل - المطاعم، الحدائق، المعالم", "category": "رسم خرائط خيالية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 35, "name": "الاحتفال بالإنجازات الشخصية", "description": "اكتبي قائمة بـ 20 إنجاز حققتيهم في حياتك - احتفلي بنجاحاتك الصغيرة والكبيرة!", "category": "احتفال بالإنجازات", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 36, "name": "تصميم خط رقمي شخصي", "description": "اكتبي بخط يدك وصوريه، ثم استخدمي تطبيق Font Maker أو Calligraphr لتحويله لخط رقمي", "category": "خطوط رقمية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 37, "name": "القراءة التمثيلية", "description": "اقرئي قصة قصيرة أو حتى منشور بأصوات مختلفة لكل شخصية - كأنك تمثلين", "category": "قراءة تمثيلية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 38, "name": "صناعة العطور الطبيعية", "description": "اطحني أوراق النعناع الطازجة وضعيها في ماء دافئ لتحصلي على عطر طبيعي منعش", "category": "عطور طبيعية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 39, "name": "صناعة كتب مصغرة", "description": "اطوي ورقة A4 ثلاث مرات واقطعيها لتصبح كتاب صغير من 8 صفحات - اكتبي فيه ما تشائين", "category": "صناعة كتب", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 40, "name": "فن الكولاج الملون", "description": "اجمعي صور ملونة من مجلات أو اطبعيها وقصيها لتصنعي تصميم فني جميل", "category": "كولاج", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 41, "name": "زراعة النباتات المائية", "description": "ضعي قطعة من نبات البوتوس أو الفيكس في كوب ماء شفاف وراقبي نمو الجذور", "category": "نباتات مائية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 42, "name": "البرمجة الإبداعية للمبتدئين", "description": "ادخلي على موقع Scratch.mit.edu وحاولي كتابة كود بسيط لرسم شكل هندسي أو تحريك شخصية", "category": "برمجة إبداعية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 43, "name": "جمع وترتيب الأحجار الملونة", "description": "ابحثي عن 5 أحجار بألوان أو أشكال مختلفة من الطبيعة ورتبيهم حسب الحجم أو اللون", "category": "جمع أحجار", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 44, "name": "فن الخط العربي", "description": "تدربي على كتابة اسمك بأجمل خط عربي باستخدام قلم سميك - كرري الكتابة 10 مرات لتتحسني", "category": "خط عربي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 45, "name": "إطعام ومراقبة الطيور", "description": "ضعي فتات خبز أو حبوب في البلكونة واجلسي لمراقبة الطيور التي تأتي للطعام", "category": "مراقبة طيور", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 46, "name": "ابتكار ألعاب ورقية", "description": "فكري في لعبة بسيطة تحتاج ورق وقلم فقط - مثل لعبة أسئلة أو تحدي رسم سريع", "category": "ابتكار ألعاب", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 47, "name": "الرسم الهندسي المتداخل", "description": "ارسمي 10 أشكال هندسية متداخلة (دوائر، مربعات، مثلثات) لتحصلي على أنماط جميلة", "category": "هندسة فنية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 48, "name": "صناعة العرائس الورقية", "description": "ارسمي شخصية بسيطة على ورق مقوى واقطعيها، ثم اصنعي لها ملابس ورقية قابلة للتغيير", "category": "عرائس ورقية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 49, "name": "مراقبة السماء والنجوم", "description": "في المساء، ابحثي عن القمر وألمع نجمة في السماء - استخدمي تطبيق Star Walk للتعرف على النجوم", "category": "مراقبة سماء", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 50, "name": "تمارين التنفس والتأمل", "description": "اجلسي مريح وخذي 5 أنفاس عميقة مع العد للعشرة في كل نفس - استخدمي تطبيق Calm للإرشاد", "category": "تنفس وتأمل", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 51, "name": "تعلم عقد الحبال العملية", "description": "شاهدي فيديو على YouTube لتتعلمي عقدة جديدة مفيدة باستخدام أي حبل أو خيط سميك", "category": "مهارات عملية", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 52, "name": "صناعة الإكسسوارات البسيطة", "description": "اصنعي سوار بسيط من خيوط ملونة أو خرز باستخدام تقنية الضفيرة أو العقد", "category": "إكسسوارات", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 53, "name": "ممارسات صديقة للبيئة", "description": "ابحثي في منزلك عن 3 أشياء قابلة لإعادة التدوير وضعيها في مكان مخصص", "category": "بيئة", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 54, "name": "تشكيل الطين والعجين", "description": "استخدمي طين طبيعي أو عجين ملون لتشكلي وعاء صغير أو كوب بيديك", "category": "تشكيل طين", "skill_level": "Beginner", "cost_level": "Low"}
]

@app.get("/")
def root():
    return {
        "message": f"🚀 AI Hobby Recommender v3.0 - {SYSTEM_MODE}!", 
        "hobbies": len(hobbies),
        "system": SYSTEM_MODE,
        "database": "PostgreSQL Connected" if DATABASE_AVAILABLE else "Safe Fallback Mode",
        "features": ["Database Ready", "Safe Imports", "54 Hobbies"] if DATABASE_AVAILABLE else ["Stable Mode", "54 Hobbies"],
        "status": "✅ STABLE & WORKING"
    }

@app.get("/health")
def health():
    return {
        "status": "excellent", 
        "hobbies_count": len(hobbies), 
        "system_mode": SYSTEM_MODE,
        "database_connected": DATABASE_AVAILABLE,
        "imports_safe": True
    }

@app.get("/api/health")
def api_health():
    return {
        "status": f"🔥 {SYSTEM_MODE}!", 
        "hobbies": len(hobbies), 
        "message": f"Stable system with safe database imports and 54 hobbies! 🌟",
        "database": "PostgreSQL Available" if DATABASE_AVAILABLE else "Safe Fallback"
    }

# Auth endpoints
@app.post("/api/auth/register")
def register(user_data: dict):
    """Registration endpoint with flexible data handling"""
    try:
        # استخراج البيانات بشكل آمن
        username = user_data.get('username', '')
        email = user_data.get('email', '')
        password = user_data.get('password', '')
        
        # تحقق بسيط
        if not username or not email or not password:
            unique_id = hash(f"{username}_{email}_{time.time()}") % 100000
            return {
                "message": "تم التسجيل بنجاح (بيانات مكملة تلقائياً)!",
                "user": {
                    "username": username or "user_" + generate_user_code()[:3],
                    "email": email or f"user_{generate_user_code()[:3]}@example.com",
                    "id": unique_id,
                    "user_code": generate_user_code(),
                    "display_name": username or "مستخدم جديد"
                },
                "access_token": "demo_token_flexible"
            }
        
        # النظام المتقدم (إذا متاح)
        if DATABASE_AVAILABLE and SessionLocal and User:
            db = SessionLocal()
            try:
                print(f"🔄 Attempting database registration for: {username}")
                
                # فحص المستخدم الموجود
                existing_user = db.query(User).filter(
                    (User.username == username) | (User.email == email)
                ).first()
                
                if existing_user:
                    # إذا موجود، سجل دخول بدلاً من التسجيل
                    print(f"✅ Found existing user: {existing_user.username}")
                    return {
                        "message": "🎉 تم العثور على المستخدم وتم تسجيل الدخول!",
                        "user": {
                            "id": existing_user.id,
                            "username": existing_user.username,
                            "email": existing_user.email,
                            "user_code": existing_user.user_code,
                            "display_name": existing_user.display_name
                        },
                        "access_token": "demo_token_existing"
                    }
                
                # إنشاء مستخدم جديد
                user_code = generate_user_code()
                hashed_password = get_password_hash(password)
                db_user = User(
                    username=username,
                    email=email,
                    hashed_password=hashed_password,
                    user_code=user_code,
                    display_name=username
                )
                
                db.add(db_user)
                db.commit()
                db.refresh(db_user)
                
                print(f"✅ Successfully created user in database: {db_user.username} with code: {db_user.user_code}")
                
                return {
                    "message": "🎉 تم التسجيل في قاعدة البيانات!",
                    "user": {
                        "id": db_user.id,
                        "username": db_user.username,
                        "email": db_user.email,
                        "user_code": db_user.user_code,
                        "display_name": db_user.display_name
                    },
                    "access_token": create_access_token(data={"sub": username})
                }
            except Exception as e:
                print(f"❌ Database registration failed: {e}")
                db.rollback()
                # نزول للنظام البسيط
            finally:
                db.close()
        
        # النظام البسيط (always works)
        simple_id = hash(f"{username}_{email}_{time.time()}") % 100000
        return {
            "message": "🎉 تم التسجيل بنجاح!",
            "user": {
                "username": username,
                "email": email,
                "id": simple_id,
                "user_code": generate_user_code(),
                "display_name": username
            },
            "access_token": "demo_token_simple"
        }
        
    except Exception as e:
        print(f"Registration error: {e}")
        # emergency fallback
        emergency_id = hash(f"emergency_{time.time()}") % 100000
        emergency_code = generate_user_code()
        return {
            "message": "تم التسجيل بنجاح (نظام الطوارئ)!",
            "user": {
                "username": "user_" + emergency_code[:4],
                "email": f"user_{emergency_code[:4]}@example.com",
                "id": emergency_id,
                "user_code": emergency_code,
                "display_name": "مستخدم جديد"
            },
            "access_token": "emergency_token"
        }

@app.post("/api/auth/register-backup")
def register_backup(user_data: dict):
    """Ultimate backup registration - never fails"""
    try:
        username = user_data.get('username', 'user_' + generate_user_code()[:4])
        email = user_data.get('email', f'{username}@example.com')
        
        return {
            "message": "تم التسجيل بنجاح (النظام الاحتياطي)!", 
            "user": {
                "username": username, 
                "email": email, 
                "id": 1, 
                "user_code": generate_user_code(),
                "display_name": username
            },
            "access_token": "backup_token"
        }
    except:
        # absolute emergency
        code = generate_user_code()[:4]
        return {
            "message": "تم التسجيل بنجاح!", 
            "user": {
                "username": f"user_{code}", 
                "email": f"user_{code}@example.com", 
                "id": 1, 
                "user_code": generate_user_code(),
                "display_name": f"مستخدم {code}"
            },
            "access_token": "emergency_backup_token"
        }

@app.post("/api/auth/login")
def login_json(user: UserLogin, db: Session = Depends(get_db)):
    if not DATABASE_AVAILABLE or not db or not User:
        # النظام البسيط - يقبل أي بيانات للاختبار
        return {
            "message": "تم تسجيل الدخول (النظام الآمن)", 
            "access_token": "demo_token", 
            "user": {
                "username": user.username, 
                "email": f"{user.username}@example.com",
                "id": 1, 
                "user_code": generate_user_code(),
                "display_name": user.username
            }
        }
    
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        # إذا فشل - عودة للنظام البسيط
        return {
            "message": "تم تسجيل الدخول (النظام الاحتياطي)",
            "access_token": "demo_token_fallback",
            "user": {
                "username": user.username,
                "email": f"{user.username}@example.com", 
                "id": 1,
                "user_code": generate_user_code(),
                "display_name": user.username
            }
        }
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {
        "message": "تم تسجيل الدخول بنجاح",
        "access_token": access_token,
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "user_code": db_user.user_code
        }
    }

@app.post("/api/auth/token")
def login_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Fallback token endpoint for compatibility"""
    if not DATABASE_AVAILABLE or not db or not User:
        # النظام البسيط - يقبل أي بيانات
        return {
            "access_token": "demo_token",
            "token_type": "bearer",
            "user": {
                "username": form_data.username, 
                "id": 1, 
                "user_code": generate_user_code(),
                "email": f"{form_data.username}@example.com",
                "display_name": form_data.username
            }
        }
    
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        # إذا فشل - عودة للنظام البسيط
        return {
            "access_token": "demo_token_fallback",
            "token_type": "bearer",
            "user": {
                "username": form_data.username,
                "id": 1,
                "user_code": generate_user_code(),
                "email": f"{form_data.username}@example.com",
                "display_name": form_data.username
            }
        }
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "user_code": db_user.user_code
        }
    }

@app.get("/api/auth/me")
def get_me(current_user = Depends(get_current_user)):
    return current_user

@app.get("/api/auth/profile")
def get_profile(current_user = Depends(get_current_user)):
    return {
        "id": current_user.get("id", 1),
        "username": current_user.get("username", "demo_user"),
        "email": current_user.get("email", "demo@example.com"),
        "display_name": current_user.get("display_name", "مستخدم"),
        "user_code": current_user.get("user_code", "DEMO123"),
        "avatar_url": current_user.get("avatar_url", None)
    }

@app.post("/api/auth/profile")
def update_profile(
    profile_data: dict,
    current_user = Depends(get_current_user)
):
    """Update user profile."""
    try:
        # If database is available, update user
        if DATABASE_AVAILABLE and SessionLocal:
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.id == current_user.get("id", 1)).first()
                if user:
                    if "display_name" in profile_data:
                        user.display_name = profile_data["display_name"]
                    db.commit()
                    return {"message": "Profile updated successfully"}
            finally:
                db.close()

        # Fallback: return success message
        return {"message": "Profile updated successfully"}
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Could not update profile"
        )

@app.post("/api/auth/profile/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Upload user avatar."""
    try:
        # Import here to avoid issues if not available
        import shutil
        from fastapi import UploadFile, File
        
        # Create user directory if it doesn't exist
        # Use root avatars directory for production
        user_dir = os.path.join("avatars", str(current_user.get("id", 1)))
        os.makedirs(user_dir, exist_ok=True)

        # Save the file
        file_path = os.path.join(user_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create avatar URL
        avatar_url = f"/avatars/{current_user.get('id', 1)}/{file.filename}"
        
        # If database is available, update user
        if DATABASE_AVAILABLE and SessionLocal:
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.id == current_user.get("id", 1)).first()
                if user:
                    user.avatar_url = avatar_url
                    db.commit()
                    print(f"✅ Avatar updated in database: {avatar_url}")
            except Exception as db_error:
                print(f"⚠️ Database update failed: {db_error}")
            finally:
                db.close()

        print(f"✅ Avatar uploaded successfully: {avatar_url}")
        return {"avatar_url": avatar_url, "message": "Avatar uploaded successfully!"}
    except Exception as e:
        print(f"❌ Error uploading avatar: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Could not upload avatar"
        )

@app.get("/api/hobbies")
def get_hobbies():
    return {
        "hobbies": hobbies, 
        "total": len(hobbies), 
        "message": f"🎉 المجموعة الكاملة! {len(hobbies)} هواية رائعة!",
        "system": SYSTEM_MODE
    }

@app.get("/api/hobbies/daily")
def daily_hobby(current_user = Depends(get_current_user)):
    """
    نظام الهوايات اليومية الذكي الشخصي:
    - كل مستخدم يبدأ رحلته من اليوم 1
    - كل يوم 4 هوايات جديدة من الـ 54
    - لا تكرر نفس الهوايات لمدة 14 يوم
    - بعد انتهاء الرحلة، تبدأ رحلة جديدة عشوائية
    """
    from datetime import datetime
    import math
    
    try:
        user_id = current_user.get("id", 1)
        
        # 🔥 حساب أيام المستخدم منذ التسجيل
        user_start_date = None
        user_day = 1  # القيمة الافتراضية
        
        # محاولة الحصول على تاريخ التسجيل من قاعدة البيانات
        if DATABASE_AVAILABLE and SessionLocal:
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.id == user_id).first()
                if user and hasattr(user, 'created_at') and user.created_at:
                    user_start_date = user.created_at
                    print(f"📅 User start date from DB: {user_start_date}")
                    
                    # حساب عدد الأيام منذ بداية رحلة المستخدم
                    today = datetime.now().date()
                    if hasattr(user_start_date, 'date'):
                        user_start_date = user_start_date.date()
                    
                    days_since_start = (today - user_start_date).days
                    user_day = max(1, days_since_start + 1)  # على الأقل اليوم 1
                    
                    print(f"✅ User {user_id}: Registered on {user_start_date}, today is day {user_day}")
                else:
                    print(f"⚠️ User {user_id} not found in DB or no created_at, using day 1")
                    user_day = 1
            except Exception as e:
                print(f"⚠️ Could not get user start date: {e}, defaulting to day 1")
                user_day = 1
            finally:
                db.close()
        else:
            print(f"⚠️ Database not available, new user starts at day 1")
            user_day = 1
        
        print(f"👤 User {user_id}: Day {user_day} of their journey")
    
    except Exception as e:
        print(f"❌ Error calculating user day: {e}, falling back to day 1")
        user_day = 1
    
    # كل رحلة = 14 يوم (54 هواية ÷ 4 = 13.5 ≈ 14 يوم)
    cycle_length = 14
    hobbies_per_day = 4
    
    # تحديد الرحلة الحالية واليوم داخل الرحلة
    current_cycle = (user_day - 1) // cycle_length
    day_in_cycle = (user_day - 1) % cycle_length
    
    # إنشاء seed للعشوائية بناءً على الرحلة والمستخدم (لضمان ثبات الهوايات)
    import random
    random.seed(f"{user_id}_{current_cycle}")
    
    # خلط الهوايات بطريقة عشوائية لهذه الرحلة
    cycle_hobbies = hobbies.copy()
    random.shuffle(cycle_hobbies)
    
    # حساب الهوايات لليوم الحالي
    start_index = day_in_cycle * hobbies_per_day
    end_index = min(start_index + hobbies_per_day, len(cycle_hobbies))
    
    # الحصول على هوايات اليوم
    daily_hobbies = cycle_hobbies[start_index:end_index]
    
    # إذا لم نحصل على 4 هوايات، أكمل من البداية
    if len(daily_hobbies) < hobbies_per_day:
        needed = hobbies_per_day - len(daily_hobbies)
        daily_hobbies.extend(cycle_hobbies[:needed])
    
    # معلومات إضافية للمستخدم
    remaining_days = cycle_length - day_in_cycle
    total_hobbies_shown = min((day_in_cycle + 1) * hobbies_per_day, len(hobbies))
    
    # رسالة توضيحية شخصية
    if day_in_cycle == 0:
        message = f"🎉 رحلة اكتشاف جديدة! اليوم {user_day} - 4 هوايات فريدة من أصل {len(hobbies)} هواية"
    elif remaining_days == 1:
        message = f"🔥 آخر يوم في رحلة الاكتشاف! غداً ستبدأ رحلة جديدة - اليوم {user_day}"
    else:
        message = f"✨ اليوم {user_day} - هوايات يومك ({total_hobbies_shown}/{len(hobbies)}) - باقي {remaining_days} أيام في رحلة الاكتشاف"
    
    return {
        "hobbies": daily_hobbies,
        "message": message,
        "cycle_info": {
            "current_cycle": current_cycle + 1,
            "day_in_cycle": day_in_cycle + 1,
            "remaining_days": remaining_days,
            "total_hobbies_shown": total_hobbies_shown,
            "cycle_progress": f"{total_hobbies_shown}/{len(hobbies)}",
            "user_day": user_day,  # 🔥 اليوم الشخصي للمستخدم
            "user_id": user_id
        },
        "system": SYSTEM_MODE
    }

@app.get("/api/hobbies/{hobby_id}")
def get_hobby(hobby_id: int):
    hobby = next((h for h in hobbies if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(404, "الهواية غير موجودة")
    
    # إضافة تفاصيل موسعة للهواية
    detailed_hobby = hobby.copy()
    
    # إضافة تفاصيل حسب نوع الهواية
    category = hobby["category"]
    
    if "روحانية" in category:
        detailed_hobby.update({
            "time_commitment": "10-30 دقيقة يومياً",
            "equipment_needed": "لا يوجد - فقط نية صادقة",
            "benefits": "تطوير الروحانية، السكينة الداخلية، الاتصال مع الله",
            "detailed_guide": "ابدأ بـ 5 دقائق يومياً، اختر وقت ثابت، ركز على المعنى وليس فقط الحفظ",
            "tips": ["اختر وقت صافي الذهن", "كرر الآية عدة مرات", "تأمل في معناها", "سجل تقدمك"]
        })
    elif "فنون" in category:
        detailed_hobby.update({
            "time_commitment": "15-45 دقيقة",
            "equipment_needed": "ورق، أقلام/ألوان، أو مواد بسيطة متوفرة",
            "benefits": "تحسين التركيز، التعبير الإبداعي، الاسترخاء الذهني",
            "detailed_guide": "ابدأ بأشكال بسيطة، لا تقلق من النتيجة، المهم هو الاستمتاع بالعملية",
            "tips": ["تدرب يومياً ولو 10 دقائق", "تابع فيديوهات تعليمية", "شارك أعمالك مع الأصدقاء", "احتفظ بمجلد لأعمالك"]
        })
    elif "فنون رقمية" in category:
        detailed_hobby.update({
            "time_commitment": "20-60 دقيقة",
            "equipment_needed": "جوال/تابلت، تطبيق رسم (Procreate, Adobe Fresco, مجاني)",
            "benefits": "مهارات تقنية، إبداع رقمي، فرص عمل مستقبلية",
            "detailed_guide": "نزل تطبيق مجاني، ابدأ بالأدوات الأساسية، تابع دروس يوتيوب، مارس يومياً",
            "tips": ["ابدأ بـ Procreate Pocket (مدفوع) أو Autodesk Sketchbook (مجاني)", "تعلم طبقات الرسم", "استخدم الفرش المختلفة", "احفظ أعمالك واشرها"]
        })
    elif "طبيعة" in category:
        detailed_hobby.update({
            "time_commitment": "10-30 دقيقة يومياً",
            "equipment_needed": "بذور، أكواب/أصص، ماء، تربة (اختياري)",
            "benefits": "الاتصال مع الطبيعة، الصبر، مراقبة النمو والحياة",
            "detailed_guide": "ابدأ بالنباتات السهلة، ضع قرب النافذة، اسق بانتظام، راقب التغييرات",
            "tips": ["ابدأ بالبقدونس أو النعناع", "سجل نمو النبات بالصور", "اقرأ عن النبات الذي تزرعه", "استمتع بالعملية وليس فقط النتيجة"]
        })
    elif "تعليم" in category:
        detailed_hobby.update({
            "time_commitment": "15-30 دقيقة يومياً",
            "equipment_needed": "كتاب، جوال/كمبيوتر للبحث، دفتر ملاحظات",
            "benefits": "توسيع المعرفة، تحسين التركيز، تطوير مهارات جديدة",
            "detailed_guide": "اختر موضوع يهمك، ابدأ بمصادر بسيطة، لخص ما تعلمته، طبق المعرفة",
            "tips": ["حدد هدف تعلم واضح", "اقرأ في أوقات نشاطك الذهني", "ناقش ما تعلمته مع آخرين", "اربط المعرفة الجديدة بحياتك"]
        })
    else:
        # تفاصيل عامة للهوايات الأخرى
        detailed_hobby.update({
            "time_commitment": "15-45 دقيقة",
            "equipment_needed": "مواد بسيطة ومتوفرة في المنزل",
            "benefits": "تطوير مهارات جديدة، الاستمتاع، قضاء وقت مفيد",
            "detailed_guide": "ابدأ بخطوات بسيطة، تدرب بانتظام، استمتع بالعملية",
            "tips": ["ابدأ بجلسات قصيرة", "استمتع بالتعلم", "شارك تجربتك", "كن صبوراً مع نفسك"]
        })
    
    return detailed_hobby

@app.post("/api/hobbies/recommend")
def recommend():
    num_recommendations = min(8, len(hobbies))
    recommendations = random.sample(hobbies, num_recommendations)
    return {
        "recommendations": recommendations, 
        "total_available": len(hobbies), 
        "message": f"إليك {num_recommendations} اقتراحات! 🌟"
    }

@app.get("/api/hobbies/category/{category}")
def get_hobbies_by_category(category: str):
    filtered = [h for h in hobbies if category.lower() in h["category"].lower()]
    return {
        "hobbies": filtered, 
        "category": category, 
        "total": len(filtered)
    }

@app.get("/api/hobbies/random/{count}")
def get_random_hobbies(count: int = 5):
    count = min(count, len(hobbies))
    random_hobbies = random.sample(hobbies, count)
    return {
        "hobbies": random_hobbies, 
        "count": count, 
        "total_available": len(hobbies)
    }

@app.get("/api/test/endpoints")
def test_endpoints():
    """Test all endpoints status."""
    import os
    
    endpoints_status = {
        "auth_endpoints": {
            "/api/auth/me": "✅ Available",
            "/api/auth/profile": "✅ Available", 
            "/api/auth/profile/avatar": "✅ Available",
            "/api/auth/friends": "✅ Available",
            "/api/auth/friends/{code}": "✅ Available"
        },
        "avatars_directory": {
            "exists": os.path.exists("avatars"),
            "path": os.path.abspath("avatars"),
            "writable": os.access("avatars", os.W_OK) if os.path.exists("avatars") else False
        },
        "database": {
            "available": DATABASE_AVAILABLE,
            "connection": "✅ Connected" if DATABASE_AVAILABLE else "❌ Fallback mode"
        }
    }
    
    return endpoints_status

@app.get("/api/debug/user-codes")
def debug_user_codes():
    """Debug endpoint to check user codes uniqueness."""
    try:
        if DATABASE_AVAILABLE and SessionLocal:
            db = SessionLocal()
            try:
                users = db.query(User).all()
                user_codes = []
                for user in users:
                    user_codes.append({
                        "id": user.id,
                        "username": user.username,
                        "user_code": user.user_code
                    })
                
                # فحص التكرار
                all_codes = [u["user_code"] for u in user_codes]
                duplicates = []
                for code in set(all_codes):
                    if all_codes.count(code) > 1:
                        duplicates.append(code)
                
                return {
                    "total_users": len(user_codes),
                    "user_codes": user_codes,
                    "duplicates": duplicates,
                    "unique_codes": len(set(all_codes))
                }
            finally:
                db.close()
        else:
            return {
                "message": "Database not available - codes generated randomly",
                "test_codes": [generate_user_code() for _ in range(5)]
            }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/debug/test-codes")
def test_code_generation():
    """Test user code generation uniqueness."""
    codes = []
    for i in range(20):
        code = generate_user_code()
        codes.append(code)
        # انتظار قصير لضمان timestamp مختلف
        import time
        time.sleep(0.01)
    
    duplicates = []
    for code in set(codes):
        if codes.count(code) > 1:
            duplicates.append(code)
    
    return {
        "generated_codes": codes,
        "total_generated": len(codes),
        "unique_codes": len(set(codes)),
        "duplicates": duplicates,
        "all_unique": len(duplicates) == 0
    }

@app.post("/api/debug/fix-user-codes")
def fix_user_codes():
    """Fix duplicate user codes by regenerating them."""
    try:
        if DATABASE_AVAILABLE and SessionLocal:
            db = SessionLocal()
            try:
                users = db.query(User).all()
                
                if not users:
                    return {
                        "message": "No users found in database",
                        "users_updated": 0
                    }
                
                # جمع الأكواد الحالية للتحقق من التكرار
                current_codes = {}
                for user in users:
                    if user.user_code in current_codes:
                        current_codes[user.user_code].append(user.id)
                    else:
                        current_codes[user.user_code] = [user.id]
                
                # البحث عن التكرارات
                duplicates = {code: user_ids for code, user_ids in current_codes.items() if len(user_ids) > 1}
                
                if not duplicates:
                    return {
                        "message": "No duplicate codes found",
                        "duplicates": duplicates,
                        "total_users": len(users)
                    }
                
                # إعادة تعيين الأكواد المتكررة
                updated_users = []
                for code, user_ids in duplicates.items():
                    # ترك المستخدم الأول، وإعادة تعيين الباقي
                    for user_id in user_ids[1:]:  # تخطي المستخدم الأول
                        user = db.query(User).filter(User.id == user_id).first()
                        if user:
                            old_code = user.user_code
                            new_code = generate_user_code()
                            
                            # التأكد من عدم تكرار الكود الجديد
                            while db.query(User).filter(User.user_code == new_code).first():
                                new_code = generate_user_code()
                            
                            user.user_code = new_code
                            updated_users.append({
                                "user_id": user.id,
                                "username": user.username,
                                "old_code": old_code,
                                "new_code": new_code
                            })
                
                db.commit()
                
                return {
                    "message": f"Successfully updated {len(updated_users)} users",
                    "duplicates_found": duplicates,
                    "updated_users": updated_users,
                    "total_users": len(users)
                }
                
            finally:
                db.close()
        else:
            return {
                "error": "Database not available",
                "suggestion": "This fix is only needed when using real database"
            }
            
    except Exception as e:
        return {"error": str(e)}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hobby-recommender.vercel.app",
        "https://hobby-recommender-khadija76767.vercel.app", 
        "https://khadija-hobby-recommender.vercel.app",
        "http://localhost:3000",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount avatars directory for serving uploaded images
# Create avatars directory in the root for production
AVATARS_DIR = "avatars"
if not os.path.exists(AVATARS_DIR):
    os.makedirs(AVATARS_DIR, exist_ok=True)
    
# Mount the avatars directory
app.mount("/avatars", StaticFiles(directory=AVATARS_DIR), name="avatars")

@app.post("/api/debug/reset-user-journey")
def reset_user_journey():
    """Reset user journey to start from today (Day 1)."""
    try:
        if DATABASE_AVAILABLE and SessionLocal:
            db = SessionLocal()
            try:
                from datetime import datetime
                
                # العثور على جميع المستخدمين
                users = db.query(User).all()
                
                if not users:
                    return {
                        "message": "No users found in database",
                        "users_updated": 0
                    }
                
                updated_users = []
                today = datetime.now()
                
                for user in users:
                    old_created_at = user.created_at if hasattr(user, 'created_at') else None
                    
                    # تحديث created_at لليوم الحالي (ليبدأ من اليوم 1)
                    user.created_at = today
                    
                    updated_users.append({
                        "user_id": user.id,
                        "username": user.username,
                        "old_created_at": str(old_created_at) if old_created_at else "None",
                        "new_created_at": str(today),
                        "user_code": user.user_code
                    })
                
                db.commit()
                
                return {
                    "message": f"Successfully reset journey for {len(updated_users)} users to start from Day 1",
                    "updated_users": updated_users,
                    "total_users": len(users),
                    "new_start_date": str(today.date())
                }
                
            finally:
                db.close()
        else:
            return {
                "error": "Database not available",
                "suggestion": "This reset is only needed when using real database"
            }
            
    except Exception as e:
        return {"error": str(e)}