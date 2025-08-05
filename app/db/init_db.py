from sqlalchemy.orm import Session
import json
from app.models.models import Hobby
from app.services.openai_service import openai_service

# Sample hobbies data
sample_hobbies = [
    {
        "name": "Tahajjud and Sunrise Watch",
        "description": "Wake up for tahajjud prayer and experience the peaceful transition from night to dawn, watching the sunrise.",
        "category": "Spiritual",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Prayer mat, comfortable clothes",
        "benefits": "Spiritual growth, peaceful start to day, better sleep schedule",
        "detailed_guide": "1. Set alarm for tahajjud time\n2. Prepare prayer space\n3. Perform prayer\n4. Wait for sunrise\n5. Reflect and meditate"
    },
    {
        "name": "Qur'an Memorization",
        "description": "Embark on a spiritual journey of memorizing the Holy Qur'an, connecting with its beautiful verses and teachings.",
        "category": "Spiritual",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30-60 minutes daily",
        "equipment_needed": "Qur'an, notebook",
        "benefits": "Spiritual growth, improved memory, peace of mind",
        "mood_tags": "peaceful, spiritual, focused, mindful",
        "vector_embedding": "[]"
    },
    {
        "name": "Recipe Journal Creation",
        "description": "Create and decorate a personal cookbook with your favorite recipes, cooking tips, and food memories.",
        "category": "Creative",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "flexible",
        "equipment_needed": "Notebook, pens, decorative materials",
        "benefits": "Memory keeping, creativity, cooking skill development",
        "mood_tags": "creative, productive, happy, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Teacup Painting",
        "description": "Transform ordinary teacups into beautiful works of art using ceramic paints and your creativity.",
        "category": "Arts & Crafts",
        "skill_level": "beginner",
        "cost_level": "medium",
        "time_commitment": "2-3 hours per project",
        "equipment_needed": "Ceramic paints, brushes, teacups",
        "benefits": "Creative expression, relaxation, unique home decor",
        "mood_tags": "creative, peaceful, artistic, focused",
        "vector_embedding": "[]"
    },
    {
        "name": "Hairstyling and Braiding",
        "description": "Learn various hairstyling techniques and braiding patterns to create beautiful hairstyles.",
        "category": "Beauty & Self-Care",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Hair accessories, mirror, brush",
        "benefits": "Self-care, creativity, practical skill",
        "mood_tags": "creative, confident, relaxed, productive",
        "vector_embedding": "[]"
    },
    {
        "name": "Language Learning",
        "description": "Start learning a new language through apps, exchanges, or local meetups.",
        "category": "Education",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30 minutes daily",
        "equipment_needed": "Language learning apps, notebook",
        "benefits": "Cultural understanding, cognitive development, social connections",
        "mood_tags": "curious, focused, social, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Sign Language Learning",
        "description": "Learn basic sign language (ASL or local) to communicate in a new way.",
        "category": "Education",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "30 minutes daily",
        "equipment_needed": "Online tutorials, practice partner",
        "benefits": "Inclusivity, new communication skills, cognitive development",
        "mood_tags": "focused, social, inspired, productive",
        "vector_embedding": "[]"
    },
    {
        "name": "Calisthenics",
        "description": "Learn bodyweight exercises and poses like handstands and crow stands.",
        "category": "Fitness",
        "skill_level": "beginner to intermediate",
        "cost_level": "free",
        "time_commitment": "30-60 minutes daily",
        "equipment_needed": "Exercise mat, comfortable clothes",
        "benefits": "Strength, flexibility, body control",
        "mood_tags": "energetic, focused, confident, determined",
        "vector_embedding": "[]"
    },
    {
        "name": "Historical Journaling",
        "description": "Research and write about interesting historical facts and your reflections.",
        "category": "Education",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "flexible",
        "equipment_needed": "Notebook, research materials",
        "benefits": "Knowledge expansion, writing skills, critical thinking",
        "mood_tags": "curious, focused, inspired, thoughtful",
        "vector_embedding": "[]"
    },
    {
        "name": "Musical Instrument Learning",
        "description": "Begin learning an instrument like violin, guitar, or flute using apps and online resources.",
        "category": "Music",
        "skill_level": "beginner",
        "cost_level": "medium to high",
        "time_commitment": "30-60 minutes daily",
        "equipment_needed": "Musical instrument, learning apps",
        "benefits": "Musical skills, creativity, cognitive development",
        "mood_tags": "creative, focused, inspired, determined",
        "vector_embedding": "[]"
    },
    {
        "name": "Beginner Coding",
        "description": "Start learning to code through online platforms and simple projects.",
        "category": "Technology",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "flexible",
        "equipment_needed": "Computer, internet connection",
        "benefits": "Problem-solving skills, creativity, career development",
        "mood_tags": "focused, curious, productive, determined",
        "vector_embedding": "[]"
    },
    {
        "name": "Yoga and Pilates",
        "description": "Practice gentle yoga and pilates exercises for mind-body wellness.",
        "category": "Fitness",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "20-60 minutes daily",
        "equipment_needed": "Yoga mat, comfortable clothes",
        "benefits": "Flexibility, strength, stress relief",
        "mood_tags": "peaceful, mindful, energetic, balanced",
        "vector_embedding": "[]"
    },
    {
        "name": "Nail Art and Makeup",
        "description": "Experiment with nail designs and makeup looks using tutorials.",
        "category": "Beauty & Self-Care",
        "skill_level": "beginner",
        "cost_level": "medium",
        "time_commitment": "1-2 hours per session",
        "equipment_needed": "Nail polish, makeup supplies",
        "benefits": "Creative expression, self-care, confidence",
        "mood_tags": "creative, confident, relaxed, artistic",
        "vector_embedding": "[]"
    },
    {
        "name": "Album Journaling",
        "description": "Create a decorated journal combining photos, memories, and favorite songs.",
        "category": "Creative",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "flexible",
        "equipment_needed": "Journal, decorative materials, photos",
        "benefits": "Memory keeping, creativity, emotional expression",
        "mood_tags": "creative, nostalgic, peaceful, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Seashell Jewelry Making",
        "description": "Create unique jewelry pieces using collected seashells.",
        "category": "Arts & Crafts",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "2-3 hours per project",
        "equipment_needed": "Seashells, jewelry supplies",
        "benefits": "Creative expression, nature connection, unique accessories",
        "mood_tags": "creative, peaceful, artistic, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Cloud Journaling",
        "description": "Observe and document different cloud formations with stories and drawings.",
        "category": "Nature",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "flexible",
        "equipment_needed": "Journal, drawing supplies",
        "benefits": "Mindfulness, creativity, nature connection",
        "mood_tags": "peaceful, creative, mindful, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Public Speaking Practice",
        "description": "Improve eloquence through word practice, speech recording, and self-review.",
        "category": "Personal Development",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "30 minutes daily",
        "equipment_needed": "Recording device, mirror",
        "benefits": "Communication skills, confidence, self-awareness",
        "mood_tags": "confident, focused, determined, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Simple Crafts",
        "description": "Create small crafts like bookmarks, decorated jars, or simple stitching projects.",
        "category": "Arts & Crafts",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours per project",
        "equipment_needed": "Basic craft supplies",
        "benefits": "Creative expression, relaxation, handmade items",
        "mood_tags": "creative, peaceful, artistic, productive",
        "vector_embedding": "[]"
    },
    {
        "name": "Minimalist Art",
        "description": "Create art using limited colors or materials to explore creativity within constraints.",
        "category": "Arts & Crafts",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Basic art supplies",
        "benefits": "Creative thinking, artistic development, focus",
        "mood_tags": "creative, focused, artistic, mindful",
        "vector_embedding": "[]"
    },
    {
        "name": "Tea Poetry",
        "description": "Write short poems while enjoying different types of tea.",
        "category": "Creative Writing",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Notebook, tea supplies",
        "benefits": "Creative expression, relaxation, mindfulness",
        "mood_tags": "creative, peaceful, inspired, mindful",
        "vector_embedding": "[]"
    },
    {
        "name": "Space Organization",
        "description": "Redesign and organize your personal space for comfort and productivity.",
        "category": "Home & Living",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "flexible",
        "equipment_needed": "Basic organization supplies",
        "benefits": "Improved environment, reduced stress, creativity",
        "mood_tags": "productive, peaceful, focused, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Nature Sound Art",
        "description": "Create artwork inspired by natural sounds and environmental music.",
        "category": "Arts & Media",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Art supplies, nature sounds",
        "benefits": "Creative expression, nature connection, mindfulness",
        "mood_tags": "creative, peaceful, inspired, mindful",
        "vector_embedding": "[]"
    },
    {
        "name": "Gratitude Practice",
        "description": "Write thoughtful messages of gratitude to yourself and others.",
        "category": "Personal Development",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "15-30 minutes",
        "equipment_needed": "Journal, writing materials",
        "benefits": "Emotional wellbeing, positivity, self-awareness",
        "mood_tags": "peaceful, mindful, inspired, happy",
        "vector_embedding": "[]"
    },
    {
        "name": "Simple Baking",
        "description": "Try basic baking recipes and experiment with simple variations.",
        "category": "Culinary",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Basic baking supplies",
        "benefits": "Cooking skills, creativity, satisfaction",
        "mood_tags": "creative, productive, happy, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Digital Arabic Calligraphy",
        "description": "Learn the art of Arabic calligraphy using digital tools and create beautiful Islamic art.",
        "category": "Digital Arts",
        "skill_level": "beginner",
        "cost_level": "medium",
        "time_commitment": "1-2 hours daily",
        "equipment_needed": "Tablet/iPad, stylus, calligraphy app",
        "benefits": "Artistic expression, spiritual connection, digital skills",
        "mood_tags": "creative, spiritual, focused, artistic",
        "vector_embedding": "[]"
    },
    {
        "name": "Islamic Pattern Design",
        "description": "Create geometric patterns inspired by Islamic art using basic tools or digital software.",
        "category": "Arts & Design",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Paper, compass, ruler, or digital design software",
        "benefits": "Mathematical thinking, artistic skills, cultural appreciation",
        "mood_tags": "creative, focused, spiritual, precise",
        "vector_embedding": "[]"
    },
    {
        "name": "Mindful Tea Brewing",
        "description": "Learn the art of brewing different teas and create mindful tea ceremonies.",
        "category": "Mindfulness",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "15-30 minutes",
        "equipment_needed": "Tea set, various teas",
        "benefits": "Mindfulness, relaxation, cultural appreciation",
        "mood_tags": "peaceful, mindful, relaxed, focused",
        "vector_embedding": "[]"
    },
    {
        "name": "Pressed Flower Art",
        "description": "Collect and press flowers to create beautiful botanical artwork.",
        "category": "Nature Crafts",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "Ongoing project",
        "equipment_needed": "Flower press or heavy books, paper",
        "benefits": "Nature connection, patience, creativity",
        "mood_tags": "creative, patient, peaceful, artistic",
        "vector_embedding": "[]"
    },
    {
        "name": "Mindful Walking",
        "description": "Practice mindful walking in nature, focusing on each step and breath.",
        "category": "Mindfulness",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "20-60 minutes",
        "equipment_needed": "Comfortable shoes",
        "benefits": "Physical activity, mindfulness, stress relief",
        "mood_tags": "peaceful, mindful, energetic, focused",
        "vector_embedding": "[]"
    },
    {
        "name": "Paper Quilling",
        "description": "Create intricate designs by rolling and shaping paper strips.",
        "category": "Paper Crafts",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Quilling tools, paper strips",
        "benefits": "Fine motor skills, patience, creativity",
        "mood_tags": "creative, focused, patient, artistic",
        "vector_embedding": "[]"
    },
    {
        "name": "Stone Stacking",
        "description": "Practice the meditative art of balancing stones.",
        "category": "Mindfulness",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Various stones",
        "benefits": "Focus, patience, stress relief",
        "mood_tags": "peaceful, focused, mindful, patient",
        "vector_embedding": "[]"
    },
    {
        "name": "Shadow Art",
        "description": "Create art using shadows and light, capturing unique perspectives.",
        "category": "Photography",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Light source, smartphone/camera",
        "benefits": "Creative thinking, observation skills",
        "mood_tags": "creative, artistic, observant, inspired",
        "vector_embedding": "[]"
    },
    {
        "name": "Aromatherapy Blending",
        "description": "Learn to blend essential oils for different moods and purposes.",
        "category": "Wellness",
        "skill_level": "beginner",
        "cost_level": "medium",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Essential oils, carrier oils, bottles",
        "benefits": "Aromatherapy knowledge, stress relief",
        "mood_tags": "peaceful, creative, mindful, nurturing",
        "vector_embedding": "[]"
    },
    {
        "name": "Miniature Painting",
        "description": "Create tiny, detailed paintings of landscapes or objects.",
        "category": "Arts & Crafts",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Small brushes, paints, tiny canvases",
        "benefits": "Focus, patience, artistic skills",
        "mood_tags": "creative, focused, patient, artistic",
        "vector_embedding": "[]"
    },
    {
        "name": "Cloud Watching",
        "description": "Observe and sketch cloud formations, noting their patterns and shapes.",
        "category": "Nature",
        "skill_level": "beginner",
        "cost_level": "free",
        "time_commitment": "15-30 minutes",
        "equipment_needed": "Sketchbook, pencils",
        "benefits": "Relaxation, creativity, nature connection",
        "mood_tags": "peaceful, observant, creative, relaxed",
        "vector_embedding": "[]"
    },
    {
        "name": "Origami",
        "description": "Learn the Japanese art of paper folding to create beautiful designs.",
        "category": "Paper Crafts",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Origami paper",
        "benefits": "Focus, patience, spatial thinking",
        "mood_tags": "creative, focused, patient, precise",
        "vector_embedding": "[]"
    },
    {
        "name": "Sound Bath Meditation",
        "description": "Create and experience meditative sound environments.",
        "category": "Mindfulness",
        "skill_level": "beginner",
        "cost_level": "low to medium",
        "time_commitment": "15-30 minutes",
        "equipment_needed": "Singing bowls or digital sounds",
        "benefits": "Stress relief, meditation, sound therapy",
        "mood_tags": "peaceful, mindful, relaxed, spiritual",
        "vector_embedding": "[]"
    },
    {
        "name": "Micro-Gardening",
        "description": "Grow tiny gardens in small containers using miniature plants.",
        "category": "Nature",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "15-30 minutes daily",
        "equipment_needed": "Small containers, tiny plants, mini tools",
        "benefits": "Nature connection, nurturing, creativity",
        "mood_tags": "peaceful, nurturing, creative, patient",
        "vector_embedding": "[]"
    },
    {
        "name": "Light Painting Photography",
        "description": "Create artistic photos using long exposure and moving lights.",
        "category": "Photography",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "1-2 hours",
        "equipment_needed": "Camera with manual settings, light sources",
        "benefits": "Creative expression, technical skills",
        "mood_tags": "creative, artistic, experimental, focused",
        "vector_embedding": "[]"
    },
    {
        "name": "Zen Doodling",
        "description": "Create meditative patterns through simple repetitive drawing.",
        "category": "Arts & Mindfulness",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "15-60 minutes",
        "equipment_needed": "Paper, fine-tip pens",
        "benefits": "Stress relief, focus, artistic expression",
        "mood_tags": "peaceful, creative, mindful, focused",
        "vector_embedding": "[]"
    },
    {
        "name": "Mindful Coloring",
        "description": "Use coloring as a form of meditation and stress relief.",
        "category": "Arts & Mindfulness",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Coloring books, colored pencils/markers",
        "benefits": "Stress relief, focus, color therapy",
        "mood_tags": "peaceful, creative, mindful, relaxed",
        "vector_embedding": "[]"
    },
    {
        "name": "Nature Sound Recording",
        "description": "Capture and collect peaceful sounds from nature.",
        "category": "Nature & Audio",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Smartphone or audio recorder",
        "benefits": "Nature connection, mindfulness, sound appreciation",
        "mood_tags": "peaceful, observant, mindful, focused",
        "vector_embedding": "[]"
    },
    {
        "name": "Gratitude Journaling",
        "description": "Keep a daily journal focused on gratitude and positive reflection.",
        "category": "Writing",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "10-15 minutes",
        "equipment_needed": "Journal, pen",
        "benefits": "Positive mindset, self-reflection, emotional well-being",
        "mood_tags": "peaceful, mindful, positive, reflective",
        "vector_embedding": "[]"
    },
    {
        "name": "Finger Painting",
        "description": "Express creativity through direct contact with paint using fingers.",
        "category": "Arts & Expression",
        "skill_level": "beginner",
        "cost_level": "low",
        "time_commitment": "30-60 minutes",
        "equipment_needed": "Non-toxic paints, paper",
        "benefits": "Sensory experience, creative expression, stress relief",
        "mood_tags": "creative, playful, expressive, free",
        "vector_embedding": "[]"
    }
]

async def init_db(db: Session) -> None:
    """Initialize database with sample data."""
    # Check if we already have hobbies
    hobby_count = db.query(Hobby).count()
    if hobby_count > 0:
        return
    
    # Add sample hobbies
    for hobby_data in sample_hobbies:
        hobby = Hobby(**hobby_data)
        db.add(hobby)
    
    db.commit() 