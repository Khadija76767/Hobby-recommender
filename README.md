#  Hobby Recommender

نظام  لاقتراح الهوايات يوميا. يساعد المستخدمين في اكتشاف هوايات جديدة تتناسب مع اهتماماتهم وشخصياتهم.

# المميزات الرئيسية

-  التواصل مع الأصدقاء ومشاركة الهوايات
-  واجهة مستخدم سهلة وجذابة
-  نظام تسجيل دخول آمن
-  إمكانية تخصيص الملف الشخصي
-  هوايات ممتعة وجديدة وغير مكررة لمدة شهر 

# التقنيات المستخدمة

# الواجهة الأمامية (Frontend)
- React.js
- Material-UI
- Axios

## الخادم (Backend)
- FastAPI
- SQLAlchemy
- PostgreSQL
- OpenAI API

# المتطلبات

- Python 3.10+
- Node.js 14+
- PostgreSQL

# التثبيت والتشغيل

1. استنساخ المشروع:
```bash
git clone https://github.com/Khadija76767/Hobby-recommender.git
cd Hobby-recommender
```

2. إعداد البيئة الافتراضية وتثبيت المتطلبات:
```bash
python -m venv venv
source venv/bin/activate  # على Linux/Mac
# أو
.\venv\Scripts\activate  # على Windows
pip install -r requirements.txt
```

3. تشغيل الخادم:
```bash
uvicorn app.main:app --reload
```

4. إعداد وتشغيل الواجهة الأمامية:
```bash
cd frontend
npm install
npm start
```

## المساهمة

نرحب بمساهماتكم! يرجى إنشاء fork للمشروع وتقديم pull request مع تغييراتكم. 
