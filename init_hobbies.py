from app.db.session import SessionLocal
from app.models.models import Hobby

def init_hobbies():
    db = SessionLocal()
    
    hobbies = [
        {
            "name": "Qur'an Memorization",
            "description": "Embark on a spiritual journey of memorizing the Holy Qur'an, connecting with its beautiful verses and teachings.\n\nحفظ القرآن الكريم\nابدأ رحلة روحانية في حفظ القرآن الكريم والتواصل مع آياته وتعاليمه الجميلة.",
            "category": "Spiritual",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "1-2 hours daily",
            "equipment_needed": "Qur'an, notebook",
            "benefits": "Spiritual growth, improved memory, peace of mind",
            "detailed_guide": "1. Start with short surahs\n2. Listen to recitations daily\n3. Write verses to reinforce memory\n4. Practice with a teacher\n5. Review regularly\n\nالدليل التفصيلي:\n1. ابدأ بالسور القصيرة\n2. استمع إلى التلاوات يومياً\n3. اكتب الآيات لتعزيز الحفظ\n4. تدرب مع معلم\n5. راجع بانتظام"
        },
        {
            "name": "Origami",
            "description": "The Japanese art of paper folding, creating beautiful sculptures from a single sheet of paper.\n\nفن الأوريغامي\nفن ياباني لطي الورق، يهدف إلى صنع منحوتات جميلة من ورقة واحدة.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30 minutes per project",
            "equipment_needed": "Origami paper, instructions",
            "benefits": "Improves focus, patience, and hand-eye coordination",
            "detailed_guide": "1. Start with basic folds\n2. Follow step-by-step diagrams\n3. Use proper paper\n4. Make crisp folds\n5. Practice basic models first\n\nالدليل التفصيلي:\n1. ابدأ بالطيات الأساسية\n2. اتبع الرسوم التوضيحية خطوة بخطوة\n3. استخدم الورق المناسب\n4. اصنع طيات واضحة\n5. تدرب على النماذج الأساسية أولاً"
        },
        {
            "name": "Poetry Writing",
            "description": "Express your thoughts and emotions through the art of verse writing.\n\nكتابة الشعر\nعبر عن أفكارك ومشاعرك من خلال فن كتابة الشعر.",
            "category": "Creative Writing",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes daily",
            "equipment_needed": "Notebook, pen",
            "benefits": "Emotional expression, creativity, language skills",
            "detailed_guide": "1. Read lots of poetry\n2. Start with free verse\n3. Keep a poetry journal\n4. Learn basic forms\n5. Write daily\n\nالدليل التفصيلي:\n1. اقرأ الكثير من الشعر\n2. ابدأ بالشعر الحر\n3. احتفظ بدفتر للشعر\n4. تعلم الأشكال الأساسية\n5. اكتب يومياً"
        },
        {
            "name": "Digital Art",
            "description": "Create beautiful artwork using digital tools and software.\n\nالفن الرقمي\nابتكر أعمالاً فنية جميلة باستخدام الأدوات والبرامج الرقمية.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Medium",
            "time_commitment": "1-2 hours daily",
            "equipment_needed": "Digital tablet, art software",
            "benefits": "Digital skills, creativity, modern art expression",
            "detailed_guide": "1. Choose your software\n2. Learn basic tools\n3. Practice basic shapes\n4. Study color theory\n5. Create daily sketches\n\nالدليل التفصيلي:\n1. اختر برنامجك\n2. تعلم الأدوات الأساسية\n3. تدرب على الأشكال الأساسية\n4. ادرس نظرية الألوان\n5. ارسم يومياً"
        },
        {
            "name": "Gardening",
            "description": "Grow and nurture plants, creating your own green space.\n\nالبستنة\nازرع واعتني بالنباتات، وأنشئ مساحتك الخضراء الخاصة.",
            "category": "Nature",
            "skill_level": "Beginner",
            "cost_level": "Medium",
            "time_commitment": "30 minutes daily",
            "equipment_needed": "Pots, soil, seeds, tools",
            "benefits": "Connection with nature, stress relief, fresh produce",
            "detailed_guide": "1. Choose your plants\n2. Prepare soil\n3. Plant correctly\n4. Water regularly\n5. Monitor growth\n\nالدليل التفصيلي:\n1. اختر نباتاتك\n2. جهز التربة\n3. ازرع بشكل صحيح\n4. اسقِ بانتظام\n5. راقب النمو"
        },
        {
            "name": "Journaling",
            "description": "Document your thoughts, feelings, and experiences in a personal journal.\n\nكتابة اليوميات\nدوّن أفكارك ومشاعرك وتجاربك في مذكرة شخصية.",
            "category": "Writing",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Journal, pen",
            "benefits": "Self-reflection, emotional processing, memory keeping",
            "detailed_guide": "1. Choose your journal\n2. Set a daily time\n3. Write freely\n4. Add prompts\n5. Review regularly\n\nالدليل التفصيلي:\n1. اختر مذكرتك\n2. حدد وقتاً يومياً\n3. اكتب بحرية\n4. أضف موضوعات\n5. راجع بانتظام"
        },
        {
            "name": "Photography",
            "description": "Capture and create beautiful images using a camera.\n\nالتصوير الفوتوغرافي\nالتقط وابتكر صوراً جميلة باستخدام الكاميرا.",
            "category": "Visual Arts",
            "skill_level": "Beginner",
            "cost_level": "Medium",
            "time_commitment": "1-2 hours daily",
            "equipment_needed": "Camera, editing software",
            "benefits": "Visual creativity, memory preservation, technical skills",
            "detailed_guide": "1. Learn camera basics\n2. Practice composition\n3. Understand lighting\n4. Edit photos\n5. Build portfolio\n\nالدليل التفصيلي:\n1. تعلم أساسيات الكاميرا\n2. تدرب على التكوين\n3. افهم الإضاءة\n4. عدل الصور\n5. ابنِ معرض أعمالك"
        },
        {
            "name": "Mini Vlogs (1-sec-a-day)",
            "description": "Capture a 1-second video clip every day to create a unique life diary.\n\nفلوقات مصغرة (ثانية واحدة في اليوم)\nالتقط مقطع فيديو مدته ثانية واحدة كل يوم لإنشاء يوميات حياة فريدة.",
            "category": "Digital Creation",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "1 minute daily",
            "equipment_needed": "Smartphone",
            "benefits": "Memory keeping, creativity, daily mindfulness",
            "detailed_guide": "1. Choose a consistent time\n2. Find interesting moments\n3. Use good lighting\n4. Keep clips organized\n5. Compile weekly\n\nالدليل التفصيلي:\n1. اختر وقتاً ثابتاً\n2. ابحث عن لحظات مميزة\n3. استخدم إضاءة جيدة\n4. نظم المقاطع\n5. اجمعها أسبوعياً"
        },
        {
            "name": "Moodboard Making",
            "description": "Design aesthetic boards for your goals or daydreams using Pinterest or Canva.\n\nتصميم لوحات المزاج\nصمم لوحات جمالية لأهدافك أو أحلامك باستخدام Pinterest أو Canva.",
            "category": "Digital Art",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Computer/smartphone, internet",
            "benefits": "Goal visualization, creativity, digital design skills",
            "detailed_guide": "1. Choose a theme\n2. Collect inspiring images\n3. Arrange aesthetically\n4. Add text elements\n5. Save and share\n\nالدليل التفصيلي:\n1. اختر موضوعاً\n2. اجمع صوراً ملهمة\n3. رتبها بشكل جمالي\n4. أضف عناصر نصية\n5. احفظ وشارك"
        },
        {
            "name": "Soap Carving",
            "description": "Create beautiful sculptures using just a bar of soap and a plastic knife.\n\nنحت الصابون\nابتكر منحوتات جميلة باستخدام قالب صابون وسكين بلاستيكي فقط.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Soap bar, plastic knife",
            "benefits": "Stress relief, creativity, fine motor skills",
            "detailed_guide": "1. Choose white soap\n2. Draw design\n3. Start with basic shapes\n4. Carve details\n5. Keep shavings for soap use\n\nالدليل التفصيلي:\n1. اختر صابوناً أبيض\n2. ارسم التصميم\n3. ابدأ بالأشكال الأساسية\n4. انحت التفاصيل\n5. احتفظ بالنشارة لاستخدام الصابون"
        },
        {
            "name": "Memory Jar Art",
            "description": "Decorate a jar and fill it with tiny memory notes or photos.\n\nفن برطمان الذكريات\nزين برطماناً واملأه بملاحظات أو صور صغيرة للذكريات.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Jar, paper, decorative items",
            "benefits": "Memory keeping, creativity, emotional expression",
            "detailed_guide": "1. Clean and decorate jar\n2. Write daily memories\n3. Add small mementos\n4. Date each entry\n5. Read monthly\n\nالدليل التفصيلي:\n1. نظف وزين البرطمان\n2. اكتب ذكريات يومية\n3. أضف تذكارات صغيرة\n4. أرخ كل إضافة\n5. اقرأ شهرياً"
        },
        {
            "name": "Tea Tasting & Journaling",
            "description": "Try different teas and rate them in a pretty logbook.\n\nتذوق الشاي وتدوين الملاحظات\nجرب أنواعاً مختلفة من الشاي وقيمها في دفتر جميل.",
            "category": "Food & Drink",
            "skill_level": "Beginner",
            "cost_level": "Medium",
            "time_commitment": "15-30 minutes",
            "equipment_needed": "Tea varieties, journal, kettle",
            "benefits": "Mindfulness, taste development, relaxation",
            "detailed_guide": "1. Choose tea variety\n2. Note brewing time\n3. Record taste notes\n4. Rate experience\n5. Compare varieties\n\nالدليل التفصيلي:\n1. اختر نوع الشاي\n2. دون وقت النقع\n3. سجل ملاحظات المذاق\n4. قيم التجربة\n5. قارن الأنواع"
        },
        {
            "name": "Teabag Art",
            "description": "Create unique artwork on used teabags.\n\nالرسم على أكياس الشاي\nابتكر أعمالاً فنية فريدة على أكياس الشاي المستعملة.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Used teabags, paint, brushes",
            "benefits": "Upcycling, creativity, patience",
            "detailed_guide": "1. Dry used teabags\n2. Iron flat\n3. Prime surface\n4. Paint carefully\n5. Seal artwork\n\nالدليل التفصيلي:\n1. جفف أكياس الشاي\n2. اكويها لتصبح مسطحة\n3. جهز السطح\n4. ارسم بعناية\n5. ثبت العمل الفني"
        },
        {
            "name": "Candle Making",
            "description": "Create your own custom scented candles.\n\nصناعة الشموع\nاصنع شموعك العطرية الخاصة.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Medium",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Wax, wicks, containers, fragrances",
            "benefits": "Creativity, aromatherapy, handmade gifts",
            "detailed_guide": "1. Choose wax type\n2. Prepare containers\n3. Melt wax safely\n4. Add fragrance\n5. Pour and cool\n\nالدليل التفصيلي:\n1. اختر نوع الشمع\n2. جهز الأوعية\n3. أذب الشمع بأمان\n4. أضف العطر\n5. اسكب وبرد"
        },
        {
            "name": "Mindful Coloring",
            "description": "Use mandala or aesthetic coloring books for relaxation.\n\nالتلوين الواعي\nاستخدم كتب تلوين الماندالا أو الرسومات الجمالية للاسترخاء.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-60 minutes",
            "equipment_needed": "Coloring books, colored pencils/markers",
            "benefits": "Stress relief, mindfulness, color therapy",
            "detailed_guide": "1. Choose design\n2. Select colors\n3. Start from center\n4. Work outward\n5. Take breaks\n\nالدليل التفصيلي:\n1. اختر التصميم\n2. حدد الألوان\n3. ابدأ من المركز\n4. اعمل للخارج\n5. خذ استراحات"
        },
        {
            "name": "Gratitude Jar",
            "description": "Add one note a day of something you're thankful for.\n\nبرطمان الامتنان\nأضف ملاحظة يومية عن شيء تشعر بالامتنان له.",
            "category": "Personal Growth",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "5 minutes daily",
            "equipment_needed": "Jar, paper, pen",
            "benefits": "Positivity, mindfulness, emotional wellbeing",
            "detailed_guide": "1. Decorate jar\n2. Write daily note\n3. Date entries\n4. Read monthly\n5. Reflect on growth\n\nالدليل التفصيلي:\n1. زين البرطمان\n2. اكتب ملاحظة يومية\n3. أرخ الإضافات\n4. اقرأ شهرياً\n5. تأمل في التطور"
        },
        {
            "name": "Window Bird Watching",
            "description": "Learn to identify local birds from your window.\n\nمراقبة الطيور من النافذة\nتعلم التعرف على الطيور المحلية من نافذتك.",
            "category": "Nature",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Bird guide, binoculars (optional)",
            "benefits": "Nature connection, patience, observation skills",
            "detailed_guide": "1. Set observation times\n2. Keep bird guide ready\n3. Note behaviors\n4. Record sightings\n5. Research species\n\nالدليل التفصيلي:\n1. حدد أوقات المراقبة\n2. جهز دليل الطيور\n3. لاحظ السلوكيات\n4. سجل المشاهدات\n5. ابحث عن الأنواع"
        },
        {
            "name": "Virtual Travel",
            "description": "Explore random countries and make lists of dream destinations using Google Earth.\n\nالسفر الافتراضي\nاستكشف دولاً عشوائية واصنع قوائم بالوجهات التي تحلم بها باستخدام Google Earth.",
            "category": "Travel & Culture",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Computer, internet",
            "benefits": "Cultural awareness, travel planning, geography knowledge",
            "detailed_guide": "1. Choose region\n2. Explore street view\n3. Research culture\n4. Save locations\n5. Plan future trips\n\nالدليل التفصيلي:\n1. اختر منطقة\n2. استكشف عرض الشارع\n3. ابحث عن الثقافة\n4. احفظ المواقع\n5. خطط لرحلات مستقبلية"
        },
        {
            "name": "Digital Journaling",
            "description": "Organize thoughts, track goals, and decorate with digital stickers using apps like Goodnotes/Notion.\n\nالتدوين الرقمي\nنظم أفكارك، تتبع أهدافك، وزين بالملصقات الرقمية باستخدام تطبيقات مثل Goodnotes/Notion.",
            "category": "Digital Creation",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Tablet/computer, journaling app",
            "benefits": "Organization, creativity, goal tracking",
            "detailed_guide": "1. Choose platform\n2. Set up sections\n3. Add daily entries\n4. Use templates\n5. Review progress\n\nالدليل التفصيلي:\n1. اختر المنصة\n2. أنشئ الأقسام\n3. أضف إدخالات يومية\n4. استخدم القوالب\n5. راجع التقدم"
        },
        {
            "name": "Mystery Solving",
            "description": "Solve small cases and mysteries you can find online.\n\nحل الألغاز\nحل قضايا وألغاز صغيرة يمكنك إيجادها على الإنترنت.",
            "category": "Mental Exercise",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Internet access, notebook",
            "benefits": "Critical thinking, problem-solving, attention to detail",
            "detailed_guide": "1. Find mystery cases\n2. Take notes\n3. Research clues\n4. Form theories\n5. Check solutions\n\nالدليل التفصيلي:\n1. ابحث عن قضايا غامضة\n2. دون الملاحظات\n3. ابحث عن الأدلة\n4. كوّن النظريات\n5. تحقق من الحلول"
        },
        {
            "name": "Pressed Flower Art",
            "description": "Collect flowers and press them into journals or frame them.\n\nفن الزهور المضغوطة\nاجمع الزهور واضغطها في الدفاتر أو أطرها.",
            "category": "Nature & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "Collection: 30 mins, Pressing: days",
            "equipment_needed": "Heavy books, flowers, paper",
            "benefits": "Nature connection, patience, decoration",
            "detailed_guide": "1. Choose flowers\n2. Press carefully\n3. Wait patiently\n4. Arrange artfully\n5. Preserve finished work\n\nالدليل التفصيلي:\n1. اختر الزهور\n2. اضغط بعناية\n3. انتظر بصبر\n4. رتب بفنية\n5. احفظ العمل النهائي"
        },
        {
            "name": "Language Learning",
            "description": "Learn a new language through apps, videos, and practice.\n\nتعلم اللغات\nتعلم لغة جديدة من خلال التطبيقات والفيديوهات والتدريب.",
            "category": "Education",
            "skill_level": "Beginner",
            "cost_level": "Free to Medium",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Language learning apps, notebook",
            "benefits": "Cultural understanding, cognitive development, communication skills",
            "detailed_guide": "1. Choose language\n2. Start with basics\n3. Practice daily\n4. Watch media\n5. Find language partners\n\nالدليل التفصيلي:\n1. اختر اللغة\n2. ابدأ بالأساسيات\n3. تدرب يومياً\n4. شاهد الوسائط\n5. ابحث عن شركاء للغة"
        },
        {
            "name": "Zentangle Drawing",
            "description": "Create beautiful patterns using simple, structured patterns.\n\nرسم الزينتانجل\nابتكر أنماطاً جميلة باستخدام أنماط بسيطة ومنظمة.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes",
            "equipment_needed": "Paper, fine-tip pen",
            "benefits": "Meditation, creativity, stress relief",
            "detailed_guide": "1. Draw boundary shapes\n2. Divide into sections\n3. Fill with patterns\n4. Add shading\n5. Practice new patterns\n\nالدليل التفصيلي:\n1. ارسم حدود الأشكال\n2. قسم إلى أقسام\n3. املأ بالأنماط\n4. أضف الظلال\n5. تدرب على أنماط جديدة"
        },
        {
            "name": "Punch Needle Embroidery",
            "description": "Create textile art using a punch needle tool.\n\nتطريز إبرة الثقب\nابتكر فناً نسيجياً باستخدام أداة إبرة الثقب.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Medium",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Punch needle, fabric, thread",
            "benefits": "Creativity, relaxation, unique home decor",
            "detailed_guide": "1. Choose design\n2. Transfer pattern\n3. Select threads\n4. Punch consistently\n5. Finish backing\n\nالدليل التفصيلي:\n1. اختر التصميم\n2. انقل النمط\n3. اختر الخيوط\n4. اثقب بثبات\n5. أكمل الخلفية"
        },
        {
            "name": "Rock Painting",
            "description": "Paint cute designs or messages on stones.\n\nالرسم على الصخور\nارسم تصاميم أو رسائل جميلة على الأحجار.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Rocks, acrylic paint, brushes",
            "benefits": "Creativity, outdoor activity, spreading joy",
            "detailed_guide": "1. Clean rocks\n2. Plan design\n3. Paint base coat\n4. Add details\n5. Seal finished work\n\nالدليل التفصيلي:\n1. نظف الصخور\n2. خطط للتصميم\n3. ارسم الطبقة الأساسية\n4. أضف التفاصيل\n5. ثبت العمل النهائي"
        },
        {
            "name": "Shadow Puppetry",
            "description": "Create stories using hand shadows or paper cutouts.\n\nمسرح الظل\nاصنع قصصاً باستخدام ظلال اليد أو قصاصات الورق.",
            "category": "Performance Art",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Light source, white screen/wall",
            "benefits": "Storytelling, creativity, entertainment",
            "detailed_guide": "1. Learn basic shapes\n2. Create characters\n3. Practice movements\n4. Write stories\n5. Perform shows\n\nالدليل التفصيلي:\n1. تعلم الأشكال الأساسية\n2. ابتكر الشخصيات\n3. تدرب على الحركات\n4. اكتب القصص\n5. قدم العروض"
        },
        {
            "name": "Character Roleplay",
            "description": "Act out fictional characters in text or voice groups.\n\nتقمص الشخصيات\nمثّل شخصيات خيالية في مجموعات النص أو الصوت.",
            "category": "Performance Art",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Internet connection, imagination",
            "benefits": "Creativity, social interaction, character development",
            "detailed_guide": "1. Choose character\n2. Research background\n3. Develop voice/style\n4. Join communities\n5. Practice interactions\n\nالدليل التفصيلي:\n1. اختر الشخصية\n2. ابحث عن الخلفية\n3. طور الصوت/الأسلوب\n4. انضم للمجتمعات\n5. تدرب على التفاعلات"
        },
        {
            "name": "ASMR Creation",
            "description": "Create relaxing sounds with everyday objects.\n\nصناعة ASMR\nابتكر أصواتاً مريحة باستخدام الأشياء اليومية.",
            "category": "Audio Creation",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Microphone, everyday objects",
            "benefits": "Creativity, sound awareness, relaxation",
            "detailed_guide": "1. Choose sounds\n2. Test recording\n3. Create sequence\n4. Edit audio\n5. Share content\n\nالدليل التفصيلي:\n1. اختر الأصوات\n2. اختبر التسجيل\n3. ابتكر التسلسل\n4. حرر الصوت\n5. شارك المحتوى"
        },
        {
            "name": "Morse Code",
            "description": "Learn and create secret messages in Morse code.\n\nشفرة مورس\nتعلم وابتكر رسائل سرية بشفرة مورس.",
            "category": "Communication",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Paper, pen, reference guide",
            "benefits": "Brain training, historical interest, secret communication",
            "detailed_guide": "1. Learn alphabet\n2. Practice timing\n3. Write messages\n4. Use sound/light\n5. Share with friends\n\nالدليل التفصيلي:\n1. تعلم الأبجدية\n2. تدرب على التوقيت\n3. اكتب الرسائل\n4. استخدم الصوت/الضوء\n5. شارك مع الأصدقاء"
        },
        {
            "name": "Dream Mapping",
            "description": "Draw maps of dream places or imaginary worlds.\n\nرسم خرائط الأحلام\nارسم خرائط لأماكن الأحلام أو العوالم الخيالية.",
            "category": "Arts & Imagination",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Paper, drawing supplies",
            "benefits": "Creativity, imagination development, artistic expression",
            "detailed_guide": "1. Sketch outline\n2. Add features\n3. Name locations\n4. Create legend\n5. Add details\n\nالدليل التفصيلي:\n1. ارسم المخطط\n2. أضف المعالم\n3. سمِّ المواقع\n4. اصنع المفتاح\n5. أضف التفاصيل"
        },
        {
            "name": "Reverse Bucket List",
            "description": "List and celebrate all the cool things you've already done.\n\nقائمة الإنجازات العكسية\nاكتب واحتفل بكل الأشياء الرائعة التي قمت بها بالفعل.",
            "category": "Personal Growth",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Journal, pen",
            "benefits": "Gratitude, self-appreciation, motivation",
            "detailed_guide": "1. Brainstorm achievements\n2. Write details\n3. Add photos\n4. Reflect on growth\n5. Share stories\n\nالدليل التفصيلي:\n1. اجمع الإنجازات\n2. اكتب التفاصيل\n3. أضف الصور\n4. تأمل في التطور\n5. شارك القصص"
        },
        {
            "name": "Font Making",
            "description": "Turn your handwriting into a digital font.\n\nصناعة الخطوط\nحول خط يدك إلى خط رقمي.",
            "category": "Digital Creation",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "2-3 hours",
            "equipment_needed": "Paper, pen, scanner/camera",
            "benefits": "Typography skills, digital creativity, personal branding",
            "detailed_guide": "1. Write alphabet\n2. Digitize letters\n3. Edit shapes\n4. Create font file\n5. Test and refine\n\nالدليل التفصيلي:\n1. اكتب الأبجدية\n2. رقمن الحروف\n3. عدل الأشكال\n4. أنشئ ملف الخط\n5. اختبر وحسّن"
        },
        {
            "name": "Voice Acting",
            "description": "Practice reading characters from shows/books with different voices.\n\nالتمثيل الصوتي\nتدرب على قراءة شخصيات من العروض/الكتب بأصوات مختلفة.",
            "category": "Performance Art",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes daily",
            "equipment_needed": "Microphone, scripts",
            "benefits": "Voice control, acting skills, confidence",
            "detailed_guide": "1. Choose characters\n2. Study voices\n3. Practice lines\n4. Record samples\n5. Get feedback\n\nالدليل التفصيلي:\n1. اختر الشخصيات\n2. ادرس الأصوات\n3. تدرب على الجمل\n4. سجل عينات\n5. احصل على تقييم"
        },
        {
            "name": "Pixel Art",
            "description": "Create retro-style digital art pixel by pixel.\n\nفن البكسل\nابتكر فناً رقمياً بأسلوب قديم بكسل تلو الآخر.",
            "category": "Digital Art",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Computer, pixel art software",
            "benefits": "Digital art skills, patience, attention to detail",
            "detailed_guide": "1. Choose canvas size\n2. Sketch basic shapes\n3. Add colors\n4. Work on details\n5. Create animations\n\nالدليل التفصيلي:\n1. اختر حجم اللوحة\n2. ارسم الأشكال الأساسية\n3. أضف الألوان\n4. اعمل على التفاصيل\n5. ابتكر الرسوم المتحركة"
        },
        {
            "name": "Time Capsule Making",
            "description": "Create and hide a collection of current memories for your future self.\n\nصنع كبسولة الزمن\nاصنع واخفِ مجموعة من الذكريات الحالية لنفسك في المستقبل.",
            "category": "Personal Growth",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "2-3 hours",
            "equipment_needed": "Container, mementos, letters",
            "benefits": "Self-reflection, memory preservation, future connection",
            "detailed_guide": "1. Choose container\n2. Select items\n3. Write letters\n4. Seal carefully\n5. Set open date\n\nالدليل التفصيلي:\n1. اختر الحاوية\n2. اختر العناصر\n3. اكتب الرسائل\n4. أغلق بعناية\n5. حدد تاريخ الفتح"
        },
        {
            "name": "Cup Rhythm Games",
            "description": "Learn and create rhythm routines with plastic cups.\n\nألعاب الإيقاع بالأكواب\nتعلم وابتكر روتينات إيقاعية باستخدام الأكواب البلاستيكية.",
            "category": "Music & Rhythm",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Plastic cup",
            "benefits": "Rhythm skills, coordination, musical expression",
            "detailed_guide": "1. Learn basic pattern\n2. Practice timing\n3. Add variations\n4. Create sequences\n5. Perform with music\n\nالدليل التفصيلي:\n1. تعلم النمط الأساسي\n2. تدرب على التوقيت\n3. أضف تنويعات\n4. ابتكر تسلسلات\n5. أدِّ مع الموسيقى"
        },
        {
            "name": "Whistling Tricks",
            "description": "Learn different whistling techniques and melodies.\n\nحيل الصفير\nتعلم تقنيات وألحان مختلفة للصفير.",
            "category": "Music",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "10-15 minutes daily",
            "equipment_needed": "None",
            "benefits": "Musical expression, breath control, entertainment",
            "detailed_guide": "1. Master basic whistle\n2. Learn variations\n3. Practice control\n4. Try melodies\n5. Create tunes\n\nالدليل التفصيلي:\n1. أتقن الصفير الأساسي\n2. تعلم التنويعات\n3. تدرب على التحكم\n4. جرب الألحان\n5. ابتكر النغمات"
        },
        {
            "name": "Coin Collection",
            "description": "Collect and learn about coins from different countries and eras.\n\nجمع العملات\nاجمع وتعلم عن العملات من مختلف البلدان والعصور.",
            "category": "Collecting",
            "skill_level": "Beginner",
            "cost_level": "Varies",
            "time_commitment": "Flexible",
            "equipment_needed": "Coin album, magnifying glass",
            "benefits": "Historical knowledge, organization, value appreciation",
            "detailed_guide": "1. Start with local coins\n2. Research history\n3. Organize collection\n4. Clean properly\n5. Track values\n\nالدليل التفصيلي:\n1. ابدأ بالعملات المحلية\n2. ابحث عن التاريخ\n3. نظم المجموعة\n4. نظف بشكل صحيح\n5. تتبع القيم"
        },
        {
            "name": "Conlang Creation",
            "description": "Create your own constructed language with unique rules and vocabulary.\n\nابتكار لغة مصطنعة\nابتكر لغتك المصطنعة الخاصة بقواعد ومفردات فريدة.",
            "category": "Linguistics",
            "skill_level": "Intermediate",
            "time_commitment": "1-2 hours daily",
            "cost_level": "Free",
            "equipment_needed": "Notebook, reference materials",
            "benefits": "Language understanding, creativity, world-building",
            "detailed_guide": "1. Design phonetics\n2. Create grammar\n3. Build vocabulary\n4. Write sample texts\n5. Develop culture\n\nالدليل التفصيلي:\n1. صمم الصوتيات\n2. ابتكر القواعد\n3. ابنِ المفردات\n4. اكتب نصوصاً تجريبية\n5. طور الثقافة"
        },
        {
            "name": "Cloud Watching Journal",
            "description": "Document and sketch interesting cloud formations.\n\nيوميات مراقبة السحب\nوثّق وارسم تشكيلات السحب المثيرة للاهتمام.",
            "category": "Nature & Art",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Sketchbook, colored pencils",
            "benefits": "Mindfulness, weather awareness, artistic expression",
            "detailed_guide": "1. Learn cloud types\n2. Find good spots\n3. Sketch shapes\n4. Note weather\n5. Track patterns\n\nالدليل التفصيلي:\n1. تعلم أنواع السحب\n2. جد أماكن جيدة\n3. ارسم الأشكال\n4. دوّن الطقس\n5. تتبع الأنماط"
        },
        {
            "name": "Tiny Paper Art",
            "description": "Create miniature artworks on small pieces of paper.\n\nفن الورق الصغير\nابتكر أعمالاً فنية مصغرة على قطع صغيرة من الورق.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Small paper, fine pens",
            "benefits": "Fine motor skills, patience, detail focus",
            "detailed_guide": "1. Cut tiny papers\n2. Plan design\n3. Work carefully\n4. Add details\n5. Display creatively\n\nالدليل التفصيلي:\n1. قص أوراقاً صغيرة\n2. خطط للتصميم\n3. اعمل بعناية\n4. أضف التفاصيل\n5. اعرض بإبداع"
        },
        {
            "name": "Scent Journal",
            "description": "Document and describe different scents you encounter.\n\nيوميات الروائح\nوثّق وصف الروائح المختلفة التي تصادفها.",
            "category": "Sensory Exploration",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "5-10 minutes daily",
            "equipment_needed": "Notebook, pen",
            "benefits": "Sensory awareness, vocabulary development, memory training",
            "detailed_guide": "1. Note daily scents\n2. Describe details\n3. Rate intensity\n4. Track preferences\n5. Create categories\n\nالدليل التفصيلي:\n1. دوّن الروائح اليومية\n2. صف التفاصيل\n3. قيّم الشدة\n4. تتبع التفضيلات\n5. أنشئ فئات"
        },
        {
            "name": "Shadow Drawing",
            "description": "Create art by tracing and transforming shadows.\n\nالرسم بالظلال\nابتكر فناً عن طريق تتبع وتحويل الظلال.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Paper, pencils, sunlight/lamp",
            "benefits": "Creativity, observation skills, light understanding",
            "detailed_guide": "1. Find interesting shadows\n2. Trace outlines\n3. Add details\n4. Transform shapes\n5. Create stories\n\nالدليل التفصيلي:\n1. ابحث عن ظلال مثيرة\n2. تتبع الحدود\n3. أضف التفاصيل\n4. حوّل الأشكال\n5. ابتكر قصصاً"
        },
        {
            "name": "Micro Photography",
            "description": "Take extreme close-up photos of tiny objects.\n\nالتصوير المجهري\nالتقط صوراً قريبة جداً للأشياء الصغيرة.",
            "category": "Photography",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Smartphone/camera with macro mode",
            "benefits": "Detail appreciation, photography skills, nature observation",
            "detailed_guide": "1. Find tiny subjects\n2. Set up lighting\n3. Focus carefully\n4. Capture details\n5. Edit creatively\n\nالدليل التفصيلي:\n1. ابحث عن مواضيع صغيرة\n2. جهز الإضاءة\n3. ركز بعناية\n4. التقط التفاصيل\n5. حرر بإبداع"
        },
        {
            "name": "Sound Collection",
            "description": "Record and collect interesting sounds from your environment.\n\nجمع الأصوات\nسجل واجمع الأصوات المثيرة للاهتمام من بيئتك.",
            "category": "Audio",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Smartphone/recorder",
            "benefits": "Audio awareness, sound appreciation, environment connection",
            "detailed_guide": "1. Identify sounds\n2. Record clearly\n3. Organize library\n4. Create mixes\n5. Share discoveries\n\nالدليل التفصيلي:\n1. حدد الأصوات\n2. سجل بوضوح\n3. نظم المكتبة\n4. ابتكر مزيجاً\n5. شارك اكتشافاتك"
        },
        {
            "name": "Tiny Book Making",
            "description": "Create miniature books with your own stories and art.\n\nصناعة الكتب المصغرة\nاصنع كتباً مصغرة بقصصك وفنك الخاص.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Paper, scissors, glue, pens",
            "benefits": "Storytelling, crafting skills, creative expression",
            "detailed_guide": "1. Design layout\n2. Write content\n3. Create artwork\n4. Bind pages\n5. Add covers\n\nالدليل التفصيلي:\n1. صمم التخطيط\n2. اكتب المحتوى\n3. ابتكر الفن\n4. اربط الصفحات\n5. أضف الأغلفة"
        },
        {
            "name": "Pattern Hunting",
            "description": "Find and document interesting patterns in everyday life.\n\nصيد الأنماط\nابحث ووثق الأنماط المثيرة للاهتمام في الحياة اليومية.",
            "category": "Photography & Art",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Camera/phone, notebook",
            "benefits": "Pattern recognition, visual awareness, artistic inspiration",
            "detailed_guide": "1. Look for patterns\n2. Photograph finds\n3. Sketch designs\n4. Note locations\n5. Create collections\n\nالدليل التفصيلي:\n1. ابحث عن الأنماط\n2. صور الاكتشافات\n3. ارسم التصاميم\n4. دوّن المواقع\n5. أنشئ مجموعات"
        },
        {
            "name": "Mindful Walking",
            "description": "Practice walking meditation while observing your surroundings.\n\nالمشي الواعي\nمارس تأمل المشي مع ملاحظة محيطك.",
            "category": "Wellness",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "15-30 minutes daily",
            "equipment_needed": "Comfortable shoes",
            "benefits": "Mindfulness, stress relief, physical activity",
            "detailed_guide": "1. Choose quiet route\n2. Set steady pace\n3. Focus on steps\n4. Notice details\n5. Reflect afterward\n\nالدليل التفصيلي:\n1. اختر مساراً هادئاً\n2. حدد وتيرة ثابتة\n3. ركز على الخطوات\n4. لاحظ التفاصيل\n5. تأمل بعد ذلك"
        },
        {
            "name": "Paper Quilling",
            "description": "Create decorative designs by rolling and shaping paper strips.\n\nلف الورق\nابتكر تصاميم زخرفية عن طريق لف وتشكيل شرائط الورق.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Paper strips, quilling tool",
            "benefits": "Fine motor skills, patience, artistic expression",
            "detailed_guide": "1. Learn basic coils\n2. Create shapes\n3. Plan design\n4. Glue carefully\n5. Add details\n\nالدليل التفصيلي:\n1. تعلم اللفات الأساسية\n2. اصنع الأشكال\n3. خطط للتصميم\n4. ألصق بعناية\n5. أضف التفاصيل"
        },
        {
            "name": "Urban Sketching",
            "description": "Draw scenes from your daily life and surroundings.\n\nالرسم الحضري\nارسم مشاهد من حياتك اليومية ومحيطك.",
            "category": "Art",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Sketchbook, pencils/pens",
            "benefits": "Observation skills, artistic growth, memory keeping",
            "detailed_guide": "1. Choose location\n2. Frame scene\n3. Start with basics\n4. Add details\n5. Note date/place\n\nالدليل التفصيلي:\n1. اختر الموقع\n2. حدد المشهد\n3. ابدأ بالأساسيات\n4. أضف التفاصيل\n5. دوّن التاريخ/المكان"
        },
        {
            "name": "Food Plating",
            "description": "Transform ordinary meals into visually appealing presentations.\n\nتزيين الأطباق\nحوّل الوجبات العادية إلى عروض تقديم جذابة بصرياً.",
            "category": "Food & Art",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "15-30 minutes per meal",
            "equipment_needed": "Plates, basic utensils",
            "benefits": "Creativity, food appreciation, photography skills",
            "detailed_guide": "1. Plan layout\n2. Choose colors\n3. Layer elements\n4. Add garnishes\n5. Photograph result\n\nالدليل التفصيلي:\n1. خطط للتنسيق\n2. اختر الألوان\n3. رتب العناصر\n4. أضف الزينة\n5. صور النتيجة"
        },
        {
            "name": "Seed Sprouting",
            "description": "Grow and document the sprouting process of different seeds.\n\nإنبات البذور\nانمِ ووثق عملية إنبات البذور المختلفة.",
            "category": "Nature & Science",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "5-10 minutes daily",
            "equipment_needed": "Seeds, containers, water",
            "benefits": "Plant knowledge, patience, healthy eating",
            "detailed_guide": "1. Select seeds\n2. Prepare containers\n3. Monitor growth\n4. Document changes\n5. Harvest sprouts\n\nالدليل التفصيلي:\n1. اختر البذور\n2. جهز الحاويات\n3. راقب النمو\n4. وثق التغيرات\n5. احصد البراعم"
        },
        {
            "name": "Washi Tape Art",
            "description": "Create decorative designs using Japanese washi tape.\n\nفن شريط واشي\nابتكر تصاميم زخرفية باستخدام شريط واشي الياباني.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Washi tape collection, paper",
            "benefits": "Color coordination, pattern design, decoration skills",
            "detailed_guide": "1. Plan design\n2. Layer tapes\n3. Create patterns\n4. Add details\n5. Seal work\n\nالدليل التفصيلي:\n1. خطط للتصميم\n2. طبق الأشرطة\n3. ابتكر الأنماط\n4. أضف التفاصيل\n5. ثبت العمل"
        },
        {
            "name": "Nature Crown Making",
            "description": "Create beautiful crowns using natural materials.\n\nصنع تيجان الطبيعة\nابتكر تيجاناً جميلة باستخدام مواد طبيعية.",
            "category": "Nature & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Flowers, leaves, twine",
            "benefits": "Nature connection, creativity, seasonal awareness",
            "detailed_guide": "1. Collect materials\n2. Plan design\n3. Create base\n4. Add elements\n5. Wear creation\n\nالدليل التفصيلي:\n1. اجمع المواد\n2. خطط للتصميم\n3. اصنع القاعدة\n4. أضف العناصر\n5. ارتدِ الإبداع"
        },
        {
            "name": "Tea Bag Staining",
            "description": "Create vintage-looking art using tea bag stains.\n\nالتلوين بأكياس الشاي\nابتكر فناً بمظهر قديم باستخدام بقع أكياس الشاي.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Used tea bags, paper",
            "benefits": "Upcycling, patience, unique art creation",
            "detailed_guide": "1. Collect tea bags\n2. Plan design\n3. Apply stains\n4. Layer colors\n5. Add details\n\nالدليل التفصيلي:\n1. اجمع أكياس الشاي\n2. خطط للتصميم\n3. طبق البقع\n4. طبق الألوان\n5. أضف التفاصيل"
        },
        {
            "name": "Bookmark Design",
            "description": "Create unique and beautiful bookmarks.\n\nتصميم الفواصل\nابتكر فواصل كتب فريدة وجميلة.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Paper, decorative items",
            "benefits": "Creativity, gift making, reading motivation",
            "detailed_guide": "1. Choose materials\n2. Plan design\n3. Create base\n4. Add decoration\n5. Laminate/protect\n\nالدليل التفصيلي:\n1. اختر المواد\n2. خطط للتصميم\n3. اصنع القاعدة\n4. أضف الزخرفة\n5. غلف/احمِ"
        },
        {
            "name": "Mindful Dish Washing",
            "description": "Transform daily dish washing into a meditative practice.\n\nغسل الأطباق الواعي\nحوّل غسل الأطباق اليومي إلى ممارسة تأملية.",
            "category": "Mindfulness",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "15-30 minutes",
            "equipment_needed": "Dishes, soap, water",
            "benefits": "Stress relief, mindfulness, cleaner dishes",
            "detailed_guide": "1. Set intention\n2. Notice sensations\n3. Focus on process\n4. Practice gratitude\n5. Reflect after\n\nالدليل التفصيلي:\n1. حدد النية\n2. لاحظ الأحاسيس\n3. ركز على العملية\n4. مارس الامتنان\n5. تأمل بعد ذلك"
        },
        {
            "name": "Finger Painting",
            "description": "Create art using your fingers as tools.\n\nالرسم بالأصابع\nابتكر فناً باستخدام أصابعك كأدوات.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Low",
            "time_commitment": "30-60 minutes",
            "equipment_needed": "Paint, paper",
            "benefits": "Sensory experience, stress relief, creative expression",
            "detailed_guide": "1. Prepare space\n2. Choose colors\n3. Start simple\n4. Layer textures\n5. Clean up\n\nالدليل التفصيلي:\n1. جهز المساحة\n2. اختر الألوان\n3. ابدأ ببساطة\n4. طبق الملمس\n5. نظف"
        },
        {
            "name": "Found Object Art",
            "description": "Create art using objects found in daily life.\n\nفن الأشياء الموجودة\nابتكر فناً باستخدام أشياء موجودة في الحياة اليومية.",
            "category": "Arts & Crafts",
            "skill_level": "Beginner",
            "cost_level": "Free",
            "time_commitment": "1-2 hours",
            "equipment_needed": "Found objects, adhesive",
            "benefits": "Creativity, recycling awareness, unique art",
            "detailed_guide": "1. Collect objects\n2. Sort items\n3. Plan composition\n4. Assemble piece\n5. Display work\n\nالدليل التفصيلي:\n1. اجمع الأشياء\n2. صنف العناصر\n3. خطط للتكوين\n4. جمع القطعة\n5. اعرض العمل"
        }
    ]
    
    # Clear existing hobbies
    db.query(Hobby).delete()
    
    for hobby_data in hobbies:
        hobby = Hobby(**hobby_data)
        db.add(hobby)
    
    db.commit()
    db.close()
    print("Initial hobbies added successfully!")

if __name__ == "__main__":
    init_hobbies() 