import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Collapse,
  CircularProgress,
  Alert
} from '@mui/material';
import { Refresh, ExpandMore, ExpandLess, Info as InfoIcon } from '@mui/icons-material';

// الهوايات المحدثة مباشرة في الكود!
const hobbies = [
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
  {"id": 27, "name": "رسم الأشكال الهندسية المتداخلة", "description": "ارسمي دوائر، مربعات، مثلثات متداخلة - ستحصلين على تصميمات زخرفية رائعة", "category": "رسم هندسي", "skill_level": "Beginner", "cost_level": "Free"}
];

const HobbySuggestion = () => {
  const [currentHobby, setCurrentHobby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchRandomHobby = () => {
    setLoading(true);
    setError(null);
    
    // اختيار هواية عشوائية من القائمة المحدثة
    const randomIndex = Math.floor(Math.random() * hobbies.length);
    const randomHobby = hobbies[randomIndex];
    
    // محاكاة loading للتجربة
    setTimeout(() => {
      setCurrentHobby(randomHobby);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchRandomHobby();
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getCostColor = (costLevel) => {
    switch (costLevel) {
      case 'Free': return 'success';
      case 'Low': return 'info'; 
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  const getSkillColor = (skillLevel) => {
    switch (skillLevel) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            جاري تحضير هواية مميزة لك...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={fetchRandomHobby}
            startIcon={<Refresh />}
            fullWidth
          >
            المحاولة مرة أخرى
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            🎯 هوايتك اليوم
          </Typography>
          <IconButton 
            onClick={fetchRandomHobby}
            color="primary"
            size="large"
            title="هواية جديدة"
          >
            <Refresh />
          </IconButton>
        </Box>

        {currentHobby && (
          <>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              {currentHobby.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={currentHobby.category} 
                variant="outlined" 
                color="primary" 
              />
              <Chip 
                label={currentHobby.skill_level} 
                variant="outlined" 
                color={getSkillColor(currentHobby.skill_level)}
              />
              <Chip 
                label={currentHobby.cost_level} 
                variant="outlined" 
                color={getCostColor(currentHobby.cost_level)}
              />
            </Box>

            <Typography variant="body1" paragraph>
              {currentHobby.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={fetchRandomHobby}
                startIcon={<Refresh />}
                sx={{ flex: 1 }}
              >
                هواية جديدة
              </Button>
              <Button
                variant="outlined"
                onClick={handleExpandClick}
                endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              >
                تفاصيل أكثر
              </Button>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  معلومات إضافية
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>التصنيف:</strong> {currentHobby.category}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>مستوى الصعوبة:</strong> {currentHobby.skill_level}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>التكلفة المتوقعة:</strong> {currentHobby.cost_level}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  هذه الهواية مناسبة للمبتدئين ويمكن البدء بها فوراً!
                </Typography>
              </Box>
            </Collapse>
          </>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          💡 نصيحة: جربي الهواية لمدة 10 دقائق فقط لتبدئي!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HobbySuggestion; 