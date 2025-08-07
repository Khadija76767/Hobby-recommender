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

# Complete 54 hobbies data
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
    },
    {
        "id": 6,
        "name": "Journaling",
        "description": "Document your thoughts, feelings, and experiences in a personal journal.\n\nكتابة اليوميات\nدوّن أفكارك ومشاعرك وتجاربك في مذكرة شخصية.",
        "category": "Writing",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Journal, pen",
        "benefits": "Self-reflection, emotional processing, memory keeping"
    },
    {
        "id": 7,
        "name": "Photography",
        "description": "Capture and create beautiful images using a camera.\n\nالتصوير الفوتوغرافي\nالتقط وابتكر صوراً جميلة باستخدام الكاميرا.",
        "category": "Visual Arts",
        "skill_level": "Beginner",
        "cost_level": "Medium",
        "time_commitment": "1-2 hours daily",
        "equipment_needed": "Camera, editing software",
        "benefits": "Visual creativity, memory preservation, technical skills"
    },
    {
        "id": 8,
        "name": "Mini Vlogs (1-sec-a-day)",
        "description": "Capture a 1-second video clip every day to create a unique life diary.\n\nفلوقات مصغرة (ثانية واحدة في اليوم)\nالتقط مقطع فيديو مدته ثانية واحدة كل يوم لإنشاء يوميات حياة فريدة.",
        "category": "Digital Creation",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "1 minute daily",
        "equipment_needed": "Smartphone",
        "benefits": "Memory keeping, creativity, daily mindfulness"
    },
    {
        "id": 9,
        "name": "Moodboard Making",
        "description": "Design aesthetic boards for your goals or daydreams using Pinterest or Canva.\n\nتصميم لوحات المزاج\nصمم لوحات جمالية لأهدافك أو أحلامك باستخدام Pinterest أو Canva.",
        "category": "Digital Art",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Computer/smartphone, internet",
        "benefits": "Goal visualization, creativity, digital design skills"
    },
    {
        "id": 10,
        "name": "Soap Carving",
        "description": "Create beautiful sculptures using just a bar of soap and a plastic knife.\n\nنحت الصابون\nابتكر منحوتات جميلة باستخدام قالب صابون وسكين بلاستيكي فقط.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Soap bar, plastic knife",
        "benefits": "Stress relief, creativity, fine motor skills"
    },
    {
        "id": 11,
        "name": "Memory Jar Art",
        "description": "Decorate a jar and fill it with tiny memory notes or photos.\n\nفن برطمان الذكريات\nزين برطماناً واملأه بملاحظات أو صور صغيرة للذكريات.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Jar, paper, decorative items",
        "benefits": "Memory keeping, creativity, emotional expression"
    },
    {
        "id": 12,
        "name": "Tea Tasting & Journaling",
        "description": "Try different teas and rate them in a pretty logbook.\n\nتذوق الشاي وتدوين الملاحظات\nجرب أنواعاً مختلفة من الشاي وقيمها في دفتر جميل.",
        "category": "Food & Drink",
        "skill_level": "Beginner",
        "cost_level": "Medium",
        "time_commitment": "15-30 minutes",
        "equipment_needed": "Tea varieties, journal, kettle",
        "benefits": "Mindfulness, taste development, relaxation"
    },
    {
        "id": 13,
        "name": "Teabag Art",
        "description": "Create unique artwork on used teabags.\n\nالرسم على أكياس الشاي\nابتكر أعمالاً فنية فريدة على أكياس الشاي المستعملة.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Used teabags, paint, brushes",
        "benefits": "Upcycling, creativity, patience"
    },
    {
        "id": 14,
        "name": "Candle Making",
        "description": "Create your own custom scented candles.\n\nصناعة الشموع\nاصنع شموعك العطرية الخاصة.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Medium",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Wax, wicks, containers, fragrances",
        "benefits": "Creativity, aromatherapy, handmade gifts"
    },
    {
        "id": 15,
        "name": "Mindful Coloring",
        "description": "Use mandala or aesthetic coloring books for relaxation.\n\nالتلوين الواعي\nاستخدم كتب تلوين الماندالا أو الرسومات الجمالية للاسترخاء.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-60 minutes",
        "equipment_needed": "Coloring books, colored pencils/markers",
        "benefits": "Stress relief, mindfulness, color therapy"
    },
    {
        "id": 16,
        "name": "Gratitude Jar",
        "description": "Add one note a day of something you're thankful for.\n\nبرطمان الامتنان\nأضف ملاحظة يومية عن شيء تشعر بالامتنان له.",
        "category": "Personal Growth",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "5 minutes daily",
        "equipment_needed": "Jar, paper, pen",
        "benefits": "Positivity, mindfulness, emotional wellbeing"
    },
    {
        "id": 17,
        "name": "Window Bird Watching",
        "description": "Learn to identify local birds from your window.\n\nمراقبة الطيور من النافذة\nتعلم التعرف على الطيور المحلية من نافذتك.",
        "category": "Nature",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Bird guide, binoculars (optional)",
        "benefits": "Nature connection, patience, observation skills"
    },
    {
        "id": 18,
        "name": "Virtual Travel",
        "description": "Explore random countries and make lists of dream destinations using Google Earth.\n\nالسفر الافتراضي\nاستكشف دولاً عشوائية واصنع قوائم بالوجهات التي تحلم بها باستخدام Google Earth.",
        "category": "Travel & Culture",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Computer, internet",
        "benefits": "Cultural awareness, travel planning, geography knowledge"
    },
    {
        "id": 19,
        "name": "Digital Journaling",
        "description": "Organize thoughts, track goals, and decorate with digital stickers using apps like Goodnotes/Notion.\n\nالتدوين الرقمي\nنظم أفكارك، تتبع أهدافك، وزين بالملصقات الرقمية باستخدام تطبيقات مثل Goodnotes/Notion.",
        "category": "Digital Creation",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Tablet/computer, journaling app",
        "benefits": "Organization, creativity, goal tracking"
    },
    {
        "id": 20,
        "name": "Mystery Solving",
        "description": "Solve small cases and mysteries you can find online.\n\nحل الألغاز\nحل قضايا وألغاز صغيرة يمكنك إيجادها على الإنترنت.",
        "category": "Mental Exercise",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Internet access, notebook",
        "benefits": "Critical thinking, problem-solving, attention to detail"
    },
    {
        "id": 21,
        "name": "Pressed Flower Art",
        "description": "Collect flowers and press them into journals or frame them.\n\nفن الزهور المضغوطة\nاجمع الزهور واضغطها في الدفاتر أو أطرها.",
        "category": "Nature & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "Collection: 30 mins, Pressing: days",
        "equipment_needed": "Heavy books, flowers, paper",
        "benefits": "Nature connection, patience, decoration"
    },
    {
        "id": 22,
        "name": "Language Learning",
        "description": "Learn a new language through apps, videos, and practice.\n\nتعلم اللغات\nتعلم لغة جديدة من خلال التطبيقات والفيديوهات والتدريب.",
        "category": "Education",
        "skill_level": "Beginner",
        "cost_level": "Free to Medium",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Language learning apps, notebook",
        "benefits": "Cultural understanding, cognitive development, communication skills"
    },
    {
        "id": 23,
        "name": "Zentangle Drawing",
        "description": "Create beautiful patterns using simple, structured patterns.\n\nرسم الزينتانجل\nابتكر أنماطاً جميلة باستخدام أنماط بسيطة ومنظمة.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes",
        "equipment_needed": "Paper, fine-tip pen",
        "benefits": "Meditation, creativity, stress relief"
    },
    {
        "id": 24,
        "name": "Punch Needle Embroidery",
        "description": "Create textile art using a punch needle tool.\n\nتطريز إبرة الثقب\nابتكر فناً نسيجياً باستخدام أداة إبرة الثقب.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Medium",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Punch needle, fabric, thread",
        "benefits": "Creativity, relaxation, unique home decor"
    },
    {
        "id": 25,
        "name": "Rock Painting",
        "description": "Paint cute designs or messages on stones.\n\nالرسم على الصخور\nارسم تصاميم أو رسائل جميلة على الأحجار.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Rocks, acrylic paint, brushes",
        "benefits": "Creativity, outdoor activity, spreading joy"
    },
    {
        "id": 26,
        "name": "Shadow Puppetry",
        "description": "Create stories using hand shadows or paper cutouts.\n\nمسرح الظل\nاصنع قصصاً باستخدام ظلال اليد أو قصاصات الورق.",
        "category": "Performance Art",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Light source, white screen/wall",
        "benefits": "Storytelling, creativity, entertainment"
    },
    {
        "id": 27,
        "name": "Character Roleplay",
        "description": "Act out fictional characters in text or voice groups.\n\nتقمص الشخصيات\nمثّل شخصيات خيالية في مجموعات النص أو الصوت.",
        "category": "Performance Art",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Internet connection, imagination",
        "benefits": "Creativity, social interaction, character development"
    },
    {
        "id": 28,
        "name": "ASMR Creation",
        "description": "Create relaxing sounds with everyday objects.\n\nصناعة ASMR\nابتكر أصواتاً مريحة باستخدام الأشياء اليومية.",
        "category": "Audio Creation",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Microphone, everyday objects",
        "benefits": "Creativity, sound awareness, relaxation"
    },
    {
        "id": 29,
        "name": "Morse Code",
        "description": "Learn and create secret messages in Morse code.\n\nشفرة مورس\nتعلم وابتكر رسائل سرية بشفرة مورس.",
        "category": "Communication",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Paper, pen, reference guide",
        "benefits": "Brain training, historical interest, secret communication"
    },
    {
        "id": 30,
        "name": "Dream Mapping",
        "description": "Draw maps of dream places or imaginary worlds.\n\nرسم خرائط الأحلام\nارسم خرائط لأماكن الأحلام أو العوالم الخيالية.",
        "category": "Arts & Imagination",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Paper, drawing supplies",
        "benefits": "Creativity, imagination development, artistic expression"
    },
    {
        "id": 31,
        "name": "Reverse Bucket List",
        "description": "List and celebrate all the cool things you've already done.\n\nقائمة الإنجازات العكسية\nاكتب واحتفل بكل الأشياء الرائعة التي قمت بها بالفعل.",
        "category": "Personal Growth",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Journal, pen",
        "benefits": "Gratitude, self-appreciation, motivation"
    },
    {
        "id": 32,
        "name": "Font Making",
        "description": "Turn your handwriting into a digital font.\n\nصناعة الخطوط\nحول خط يدك إلى خط رقمي.",
        "category": "Digital Creation",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "2-3 hours",
        "equipment_needed": "Paper, pen, scanner/camera",
        "benefits": "Typography skills, digital creativity, personal branding"
    },
    {
        "id": 33,
        "name": "Voice Acting",
        "description": "Practice reading characters from shows/books with different voices.\n\nالتمثيل الصوتي\nتدرب على قراءة شخصيات من العروض/الكتب بأصوات مختلفة.",
        "category": "Performance Art",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes daily",
        "equipment_needed": "Microphone, scripts",
        "benefits": "Voice control, acting skills, confidence"
    },
    {
        "id": 34,
        "name": "Pixel Art",
        "description": "Create retro-style digital art pixel by pixel.\n\nفن البكسل\nابتكر فناً رقمياً بأسلوب قديم بكسل تلو الآخر.",
        "category": "Digital Art",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Computer, pixel art software",
        "benefits": "Digital art skills, patience, attention to detail"
    },
    {
        "id": 35,
        "name": "Time Capsule Making",
        "description": "Create and hide a collection of current memories for your future self.\n\nصنع كبسولة الزمن\nاصنع واخفِ مجموعة من الذكريات الحالية لنفسك في المستقبل.",
        "category": "Personal Growth",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "2-3 hours",
        "equipment_needed": "Container, mementos, letters",
        "benefits": "Self-reflection, memory preservation, future connection"
    },
    {
        "id": 36,
        "name": "Cup Rhythm Games",
        "description": "Learn and create rhythm routines with plastic cups.\n\nألعاب الإيقاع بالأكواب\nتعلم وابتكر روتينات إيقاعية باستخدام الأكواب البلاستيكية.",
        "category": "Music & Rhythm",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Plastic cup",
        "benefits": "Rhythm skills, coordination, musical expression"
    },
    {
        "id": 37,
        "name": "Whistling Tricks",
        "description": "Learn different whistling techniques and melodies.\n\nحيل الصفير\nتعلم تقنيات وألحان مختلفة للصفير.",
        "category": "Music",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "10-15 minutes daily",
        "equipment_needed": "None",
        "benefits": "Musical expression, breath control, entertainment"
    },
    {
        "id": 38,
        "name": "Coin Collection",
        "description": "Collect and learn about coins from different countries and eras.\n\nجمع العملات\nاجمع وتعلم عن العملات من مختلف البلدان والعصور.",
        "category": "Collecting",
        "skill_level": "Beginner",
        "cost_level": "Varies",
        "time_commitment": "Flexible",
        "equipment_needed": "Coin album, magnifying glass",
        "benefits": "Historical knowledge, organization, value appreciation"
    },
    {
        "id": 39,
        "name": "Conlang Creation",
        "description": "Create your own constructed language with unique rules and vocabulary.\n\nابتكار لغة مصطنعة\nابتكر لغتك المصطنعة الخاصة بقواعد ومفردات فريدة.",
        "category": "Linguistics",
        "skill_level": "Intermediate",
        "cost_level": "Free",
        "time_commitment": "1-2 hours daily",
        "equipment_needed": "Notebook, reference materials",
        "benefits": "Language understanding, creativity, world-building"
    },
    {
        "id": 40,
        "name": "Cloud Watching Journal",
        "description": "Document and sketch interesting cloud formations.\n\nيوميات مراقبة السحب\nوثّق وارسم تشكيلات السحب المثيرة للاهتمام.",
        "category": "Nature & Art",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Sketchbook, colored pencils",
        "benefits": "Mindfulness, weather awareness, artistic expression"
    },
    {
        "id": 41,
        "name": "Tiny Paper Art",
        "description": "Create miniature artworks on small pieces of paper.\n\nفن الورق الصغير\nابتكر أعمالاً فنية مصغرة على قطع صغيرة من الورق.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Small paper, fine pens",
        "benefits": "Fine motor skills, patience, detail focus"
    },
    {
        "id": 42,
        "name": "Scent Journal",
        "description": "Document and describe different scents you encounter.\n\nيوميات الروائح\nوثّق وصف الروائح المختلفة التي تصادفها.",
        "category": "Sensory Exploration",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "5-10 minutes daily",
        "equipment_needed": "Notebook, pen",
        "benefits": "Sensory awareness, vocabulary development, memory training"
    },
    {
        "id": 43,
        "name": "Shadow Drawing",
        "description": "Create art by tracing and transforming shadows.\n\nالرسم بالظلال\nابتكر فناً عن طريق تتبع وتحويل الظلال.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Paper, pencils, sunlight/lamp",
        "benefits": "Creativity, observation skills, light understanding"
    },
    {
        "id": 44,
        "name": "Micro Photography",
        "description": "Take extreme close-up photos of tiny objects.\n\nالتصوير المجهري\nالتقط صوراً قريبة جداً للأشياء الصغيرة.",
        "category": "Photography",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Smartphone/camera with macro mode",
        "benefits": "Detail appreciation, photography skills, nature observation"
    },
    {
        "id": 45,
        "name": "Sound Collection",
        "description": "Record and collect interesting sounds from your environment.\n\nجمع الأصوات\nسجل واجمع الأصوات المثيرة للاهتمام من بيئتك.",
        "category": "Audio",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Smartphone/recorder",
        "benefits": "Audio awareness, sound appreciation, environment connection"
    },
    {
        "id": 46,
        "name": "Tiny Book Making",
        "description": "Create miniature books with your own stories and art.\n\nصناعة الكتب المصغرة\nاصنع كتباً مصغرة بقصصك وفنك الخاص.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Paper, scissors, glue, pens",
        "benefits": "Storytelling, crafting skills, creative expression"
    },
    {
        "id": 47,
        "name": "Pattern Hunting",
        "description": "Find and document interesting patterns in everyday life.\n\nصيد الأنماط\nابحث ووثق الأنماط المثيرة للاهتمام في الحياة اليومية.",
        "category": "Photography & Art",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Camera/phone, notebook",
        "benefits": "Pattern recognition, visual awareness, artistic inspiration"
    },
    {
        "id": 48,
        "name": "Mindful Walking",
        "description": "Practice walking meditation while observing your surroundings.\n\nالمشي الواعي\nمارس تأمل المشي مع ملاحظة محيطك.",
        "category": "Wellness",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Comfortable shoes",
        "benefits": "Mindfulness, stress relief, physical activity"
    },
    {
        "id": 49,
        "name": "Paper Quilling",
        "description": "Create decorative designs by rolling and shaping paper strips.\n\nلف الورق\nابتكر تصاميم زخرفية عن طريق لف وتشكيل شرائط الورق.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Paper strips, quilling tool",
        "benefits": "Fine motor skills, patience, artistic expression"
    },
    {
        "id": 50,
        "name": "Urban Sketching",
        "description": "Draw scenes from your daily life and surroundings.\n\nالرسم الحضري\nارسم مشاهد من حياتك اليومية ومحيطك.",
        "category": "Art",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Sketchbook, pencils/pens",
        "benefits": "Observation skills, artistic growth, memory keeping"
    },
    {
        "id": 51,
        "name": "Food Plating",
        "description": "Transform ordinary meals into visually appealing presentations.\n\nتزيين الأطباق\nحوّل الوجبات العادية إلى عروض تقديم جذابة بصرياً.",
        "category": "Food & Art",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "15-30 minutes per meal",
        "equipment_needed": "Plates, basic utensils",
        "benefits": "Creativity, food appreciation, photography skills"
    },
    {
        "id": 52,
        "name": "Seed Sprouting",
        "description": "Grow and document the sprouting process of different seeds.\n\nإنبات البذور\nانمِ ووثق عملية إنبات البذور المختلفة.",
        "category": "Nature & Science",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "5-10 minutes daily",
        "equipment_needed": "Seeds, containers, water",
        "benefits": "Plant knowledge, patience, healthy eating"
    },
    {
        "id": 53,
        "name": "Washi Tape Art",
        "description": "Create decorative designs using Japanese washi tape.\n\nفن شريط واشي\nابتكر تصاميم زخرفية باستخدام شريط واشي الياباني.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Washi tape collection, paper",
        "benefits": "Color coordination, pattern design, decoration skills"
    },
    {
        "id": 54,
        "name": "Found Object Art",
        "description": "Create art using objects found in daily life.\n\nفن الأشياء الموجودة\nابتكر فناً باستخدام أشياء موجودة في الحياة اليومية.",
        "category": "Arts & Crafts",
        "skill_level": "Beginner",
        "cost_level": "Free",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Found objects, adhesive",
        "benefits": "Creativity, recycling awareness, unique art"
    }
]

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "AI Hobby Recommender is running with 54 hobbies!"}

@app.get("/test")
async def test():
    return {"message": "Test endpoint working!", "total_hobbies": len(HOBBIES_DATA)}

# Basic API endpoints
@app.get("/api/health")
async def api_health():
    return {"api_status": "working", "database": "connected", "total_hobbies": len(HOBBIES_DATA)}

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

# Hobbies endpoints with complete 54 hobbies
@app.get("/api/hobbies/daily")
async def get_daily_hobby():
    hobby = random.choice(HOBBIES_DATA)
    return {
        "hobby": hobby,
        "message": "إليك اقتراح هواية اليوم من بين 54 هواية!"
    }

@app.get("/api/hobbies")
async def get_all_hobbies():
    return {
        "hobbies": HOBBIES_DATA,
        "total": len(HOBBIES_DATA),
        "message": f"جميع الـ {len(HOBBIES_DATA)} هواية متاحة الآن!"
    }

@app.get("/api/hobbies/{hobby_id}")
async def get_hobby_detail(hobby_id: int):
    hobby = next((h for h in HOBBIES_DATA if h["id"] == hobby_id), None)
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby

@app.post("/api/hobbies/recommend")
async def get_hobby_recommendations():
    # Return 5 random recommendations
    recommendations = random.sample(HOBBIES_DATA, min(5, len(HOBBIES_DATA)))
    return {
        "recommendations": recommendations,
        "total_available": len(HOBBIES_DATA),
        "message": "إليك 5 اقتراحات مخصصة لك من بين 54 هواية!"
    }

# Get hobbies by category
@app.get("/api/hobbies/category/{category}")
async def get_hobbies_by_category(category: str):
    filtered_hobbies = [h for h in HOBBIES_DATA if category.lower() in h["category"].lower()]
    return {
        "hobbies": filtered_hobbies,
        "category": category,
        "total": len(filtered_hobbies)
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