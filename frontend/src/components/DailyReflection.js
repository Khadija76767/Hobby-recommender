import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Fade,
  Chip,
  Collapse,
  Divider,
  IconButton,
} from '@mui/material';
import { Save as SaveIcon, VolumeUp, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { speak, stopSpeaking } from '../utils/speech';
import { useAuth } from '../contexts/AuthContext'; // 🔥 إضافة استيراد useAuth

const REFLECTION_PROMPTS = [
  {
    en: "What made you smile today?",
    ar: "ما الذي جعلك تبتسم اليوم؟"
  },
  {
    en: "What are you grateful for?",
    ar: "ما الذي تشعر بالامتنان له؟"
  },
  {
    en: "What's one thing you learned today?",
    ar: "ما هو الشيء الواحد الذي تعلمته اليوم؟"
  },
  {
    en: "What hobby brought you joy recently?",
    ar: "أي هواية جلبت لك السعادة مؤخراً؟"
  },
  {
    en: "What's something you're looking forward to?",
    ar: "ما هو الشيء الذي تتطلع إليه؟"
  }
];

const DailyReflection = () => {
  const { currentUser } = useAuth(); // 🔥 استخدام بيانات المستخدم الحالي
  const [currentPrompt, setCurrentPrompt] = useState(REFLECTION_PROMPTS[0]);
  const [reflection, setReflection] = useState('');
  
  // 🔥 ربط Reflections بالمستخدم المحدد
  const [savedReflections, setSavedReflections] = useState(() => {
    if (!currentUser) return []; // 🔥 إذا لم يكن هناك مستخدم، أرجع مصفوفة فارغة
    
    const userKey = `dailyReflections_user_${currentUser.id}`; // 🔥 مفتاح فريد لكل مستخدم
    const saved = localStorage.getItem(userKey);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
    setCurrentPrompt(REFLECTION_PROMPTS[randomIndex]);

    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    // 🔥 حفظ البيانات مع مفتاح فريد للمستخدم
    if (currentUser) {
      const userKey = `dailyReflections_user_${currentUser.id}`;
      localStorage.setItem(userKey, JSON.stringify(savedReflections));
    }
  }, [savedReflections, currentUser]);

  // 🔥 تحديث البيانات عند تغيير المستخدم
  useEffect(() => {
    if (currentUser) {
      const userKey = `dailyReflections_user_${currentUser.id}`;
      const saved = localStorage.getItem(userKey);
      setSavedReflections(saved ? JSON.parse(saved) : []);
    } else {
      setSavedReflections([]);
    }
  }, [currentUser]);

  const handleSpeak = async (text) => {
    setSpeaking(true);
    try {
      await speak(text);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setSpeaking(false);
    }
  };

  const handleSave = () => {
    if (reflection.trim() && currentUser) {
      const newReflection = {
        prompt: currentPrompt[language],
        text: reflection,
        date: new Date().toISOString(),
        language,
        userId: currentUser.id, // 🔥 إضافة معرف المستخدم
      };
      setSavedReflections([newReflection, ...savedReflections]);
      setReflection('');
      
      // Get new prompt
      const randomIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
      setCurrentPrompt(REFLECTION_PROMPTS[randomIndex]);
    }
  };

  const handleDelete = (index) => {
    setSavedReflections(savedReflections.filter((_, i) => i !== index));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // 🔥 إذا لم يكن هناك مستخدم مسجل دخول، اعرض رسالة
  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please log in to access your personal reflections
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="daily-reflection">
      {/* Language Toggle */}
      <Button
        onClick={() => setLanguage(lang => lang === 'en' ? 'ar' : 'en')}
        sx={{ mb: 2 }}
      >
        {language === 'en' ? 'عربي' : 'English'}
      </Button>

      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        fontFamily="Patrick Hand"
        gutterBottom
        sx={{
          color: '#4A4A4A',
          textAlign: language === 'ar' ? 'right' : 'left',
          direction: language === 'ar' ? 'rtl' : 'ltr',
        }}
      >
        {language === 'en' ? 'Daily Reflection' : 'تأمل اليوم'}
      </Typography>

      {/* Prompt */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#4A4A4A',
            flex: 1,
            textAlign: language === 'ar' ? 'right' : 'left',
            direction: language === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          {currentPrompt[language]}
        </Typography>
        <IconButton
          onClick={() => handleSpeak(currentPrompt[language])}
          disabled={speaking}
          size="small"
        >
          <VolumeUp />
        </IconButton>
      </Box>

      {/* Reflection Input */}
      <TextField
        multiline
        rows={4}
        fullWidth
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder={
          language === 'en'
            ? 'Write your thoughts here...'
            : 'اكتب أفكارك هنا...'
        }
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            direction: language === 'ar' ? 'rtl' : 'ltr',
          },
        }}
      />

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!reflection.trim()}
          startIcon={<SaveIcon />}
          className="animated-button"
          sx={{
            bgcolor: 'rgba(255, 181, 232, 0.9)',
            color: '#4A4A4A',
            '&:hover': {
              bgcolor: 'rgba(255, 181, 232, 0.7)',
            },
          }}
        >
          {language === 'en' ? 'Save Reflection' : 'حفظ التأمل'}
        </Button>

        <Button
          variant="outlined"
          onClick={() => setShowSaved(!showSaved)}
          sx={{
            color: '#4A4A4A',
            borderColor: 'rgba(255, 181, 232, 0.9)',
            '&:hover': {
              borderColor: 'rgba(255, 181, 232, 0.7)',
              bgcolor: 'rgba(255, 181, 232, 0.1)',
            },
          }}
        >
          {showSaved
            ? language === 'en' ? 'Hide Past' : 'إخفاء السابق'
            : language === 'en' ? 'Show Past' : 'عرض السابق'
          }
        </Button>
      </Box>

      {/* Saved Reflections */}
      <Collapse in={showSaved}>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: '#4A4A4A',
              textAlign: language === 'ar' ? 'right' : 'left',
              direction: language === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            {language === 'en' ? 'Past Reflections' : 'تأملات سابقة'}
          </Typography>
          {savedReflections.map((item, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                position: 'relative',
                direction: item.language === 'ar' ? 'rtl' : 'ltr',
              }}
            >
              <Typography variant="caption" color="textSecondary">
                {formatDate(item.date)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {item.prompt}
              </Typography>
              <Typography variant="body1">{item.text}</Typography>
              <IconButton
                onClick={() => handleDelete(index)}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  [item.language === 'ar' ? 'left' : 'right']: 8,
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default DailyReflection; 