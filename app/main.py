from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import random
import os
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional

# تجربة استيراد قاعدة البيانات
try:
    from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, text
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker, Session
    from passlib.context import CryptContext
    from jose import JWTError, jwt
    DATABASE_AVAILABLE = True
    print("✅ تم تحميل مكتبات قاعدة البيانات بنجاح!")
except ImportError as e:
    DATABASE_AVAILABLE = False
    print(f"⚠️ قاعدة البيانات غير متاحة: {e}")

app = FastAPI(
    title="AI Hobby Recommender",
    description="🚀 نظام ذكي متقدم لاقتراح الهوايات مع مستخدمين متعددين",
    version="3.0.0"
)

# إعداد قاعدة البيانات
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

if DATABASE_AVAILABLE and DATABASE_URL:
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
    
    # إنشاء الجداول
    try:
        Base.metadata.create_all(bind=engine)
        print("🔥 تم إنشاء جداول قاعدة البيانات بنجاح!")
        SYSTEM_MODE = "ADVANCED_REAL_DATABASE"
    except Exception as e:
        print(f"❌ خطأ في إنشاء الجداول: {e}")
        SYSTEM_MODE = "SIMPLE_FALLBACK"
        DATABASE_AVAILABLE = False
else:
    SYSTEM_MODE = "SIMPLE_FALLBACK"
    print("⚡ تشغيل النظام البسيط")

# دالة للحصول على جلسة قاعدة البيانات
def get_db():
    if DATABASE_AVAILABLE and DATABASE_URL:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        yield None

# دوال المصادقة
def verify_password(plain_password, hashed_password):
    if DATABASE_AVAILABLE:
        return pwd_context.verify(plain_password, hashed_password)
    return True

def get_password_hash(password):
    if DATABASE_AVAILABLE:
        return pwd_context.hash(password)
    return password

def generate_user_code():
    """توليد كود مستخدم فريد"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not DATABASE_AVAILABLE or not db:
        # مستخدم وهمي للنظام البسيط
        return {"id": 1, "username": "demo_user", "email": "demo@example.com"}
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# نماذج البيانات
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    display_name: Optional[str]
    user_code: str
    is_active: bool

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
    {"id": 29, "name": "الرسم على الصخور", "description": "ارسم تصاميج أو رسائل جميلة على الأحجار ووزعها للآخرين", "category": "فنون", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 30, "name": "مسرح الظل", "description": "اصنع قصصاً باستخدام ظلال اليد أو قصاصات الورق لتسلية الأطفال", "category": "فنون أداء", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 31, "name": "تقمص الشخصيات", "description": "مثّل شخصيات خيالية في مجموعات النص أو الصوت عبر الإنترنت", "category": "فنون أداء", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 32, "name": "صناعة ASMR", "description": "ابتكر أصواتاً مريحة باستخدام الأشياء اليومية لتساعد على الاسترخاء", "category": "صوتيات", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 33, "name": "شفرة مورس", "description": "تعلم وابتكر رسائل سرية بشفرة مورس التاريخية الشهيرة", "category": "تواصل", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 34, "name": "رسم خرائط الأحلام", "description": "ارسم خرائط لأماكن الأحلام أو العوالم الخيالية التي تتخيلها", "category": "فنون وخيال", "skill_level": "Beginner", "cost_level": "Low"},
    {"id": 35, "name": "قائمة الإنجازات العكسية", "description": "اكتب واحتفل بكل الأشياء الرائعة التي قمت بها بالفعل في حياتك", "category": "تطوير شخصي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 36, "name": "صناعة الخطوط", "description": "حول خط يدك إلى خط رقمي يمكن استخدامه على الكمبيوتر", "category": "رقمي", "skill_level": "Beginner", "cost_level": "Free"},
    {"id": 37, "name": "التمثيل الصوتي", "description": "تدرب على قراءة شخصيات من العروض/الكتب بأصوات مختلفة ومميزة", "category": "فنون أداء", "skill_level": "Beginner", "cost_level": "Low"},
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
    return {
        "message": f"🚀 AI Hobby Recommender v3.0 - {SYSTEM_MODE}!", 
        "hobbies": len(hobbies),
        "system": SYSTEM_MODE,
        "database": "PostgreSQL Connected" if DATABASE_AVAILABLE else "Simple Mode",
        "features": ["Unlimited Users", "Real Auth", "User Codes", "Profiles"] if SYSTEM_MODE == "ADVANCED_REAL_DATABASE" else ["Demo Mode"],
        "status": "✅ PRODUCTION READY"
    }

@app.get("/health")
def health():
    return {
        "status": "excellent", 
        "hobbies_count": len(hobbies), 
        "system_mode": SYSTEM_MODE,
        "database_connected": DATABASE_AVAILABLE,
        "real_users": SYSTEM_MODE == "ADVANCED_REAL_DATABASE"
    }

@app.get("/api/health")
def api_health():
    return {
        "status": f"🔥 {SYSTEM_MODE}!", 
        "hobbies": len(hobbies), 
        "message": f"Advanced system with unlimited users and 54 hobbies! 🌟",
        "database": "PostgreSQL" if DATABASE_AVAILABLE else "Simple Mode"
    }

# Auth endpoints
@app.post("/api/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if not DATABASE_AVAILABLE or not db:
        # النظام البسيط
        return {
            "message": "تم التسجيل بنجاح (النظام البسيط)", 
            "user": {"username": user.username, "email": user.email, "id": 1},
            "access_token": "demo_token"
        }
    
    # فحص المستخدم الموجود
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="المستخدم موجود بالفعل"
        )
    
    # إنشاء مستخدم جديد
    user_code = generate_user_code()
    # تأكد من أن الكود فريد
    while db.query(User).filter(User.user_code == user_code).first():
        user_code = generate_user_code()
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        user_code=user_code,
        display_name=user.username
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # إنشاء token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "message": "🎉 تم التسجيل بنجاح!",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "user_code": db_user.user_code,
            "display_name": db_user.display_name
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/api/auth/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    if not DATABASE_AVAILABLE or not db:
        # النظام البسيط
        return {
            "access_token": "demo_token",
            "token_type": "bearer",
            "user": {"username": form_data.username, "id": 1}
        }
    
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اسم المستخدم أو كلمة المرور غير صحيحة",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "user_code": user.user_code
        }
    }

@app.post("/api/auth/login")
def login_json(user: UserLogin, db: Session = Depends(get_db)):
    if not DATABASE_AVAILABLE or not db:
        return {
            "message": "تم تسجيل الدخول (النظام البسيط)", 
            "access_token": "demo_token", 
            "user": {"username": user.username, "id": 1}
        }
    
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اسم المستخدم أو كلمة المرور غير صحيحة"
        )
    
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

@app.get("/api/auth/me")
def get_me(current_user = Depends(get_current_user)):
    return current_user

@app.get("/api/auth/profile")
def get_profile(current_user = Depends(get_current_user)):
    if isinstance(current_user, dict):
        # النظام البسيط
        return {
            "id": 1, 
            "username": "demo_user", 
            "display_name": "مستخدم تجريبي", 
            "user_code": "DEMO123"
        }
    
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "display_name": current_user.display_name or current_user.username,
        "user_code": current_user.user_code,
        "avatar_url": current_user.avatar_url
    }

# اختبار قاعدة البيانات
@app.get("/api/database/test")
def test_database(db: Session = Depends(get_db)):
    if not DATABASE_AVAILABLE or not db:
        return {"status": "simple_mode", "message": "النظام البسيط نشط"}
    
    try:
        # عدد المستخدمين
        user_count = db.query(User).count()
        
        # اختبار الاتصال
        result = db.execute(text("SELECT 1 as test")).first()
        
        return {
            "status": "connected", 
            "message": "🔥 قاعدة البيانات PostgreSQL متصلة ونشطة!",
            "users_count": user_count,
            "system": "ADVANCED_REAL_DATABASE",
            "test_query": result[0] if result else None
        }
    except Exception as e:
        return {"status": "error", "message": f"خطأ في قاعدة البيانات: {str(e)}"}

# Hobby endpoints
@app.get("/api/hobbies")
def get_hobbies():
    return {
        "hobbies": hobbies, 
        "total": len(hobbies), 
        "message": f"🎉 المجموعة الكاملة! {len(hobbies)} هواية رائعة!",
        "system": SYSTEM_MODE
    }

@app.get("/api/hobbies/daily")
def daily_hobby():
    hobby = random.choice(hobbies)
    return {
        "hobby": hobby, 
        "message": f"هواية اليوم من بين {len(hobbies)} هواية! 🌟",
        "system": SYSTEM_MODE
    }

@app.get("/api/hobbies/{hobby_id}")
def get_hobby(hobby_id: int):
    hobby = next((h for h in hobbies if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(404, "الهواية غير موجودة")
    return hobby

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://hobby-recommender.vercel.app",
        "https://hobby-recommender-khadija76767.vercel.app",
        "https://khadija-hobby-recommender.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)