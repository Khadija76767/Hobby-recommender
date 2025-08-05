import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Collapse,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { speak, stopSpeaking } from '../utils/speech';

const REFLECTION_PROMPTS = [
  {
    en: "What made you smile today?",
    ar: "ما الذي جعلك تبتسم اليوم؟"
  },
  {
    en: "What's one thing you learned recently?",
    ar: "ما هو الشيء الذي تعلمته مؤخراً؟"
  },
  {
    en: "What are you grateful for today?",
    ar: "ما الذي تشعر بالامتنان له اليوم؟"
  },
  {
    en: "What's a small victory you had today?",
    ar: "ما هو الإنجاز الصغير الذي حققته اليوم؟"
  },
  {
    en: "What's something you're looking forward to?",
    ar: "ما هو الشيء الذي تتطلع إليه؟"
  }
];

const DailyReflection = () => {
  const [currentPrompt, setCurrentPrompt] = useState(REFLECTION_PROMPTS[0]);
  const [reflection, setReflection] = useState('');
  const [savedReflections, setSavedReflections] = useState(() => {
    const saved = localStorage.getItem('dailyReflections');
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
    localStorage.setItem('dailyReflections', JSON.stringify(savedReflections));
  }, [savedReflections]);

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
    if (reflection.trim()) {
      const newReflection = {
        prompt: currentPrompt[language],
        text: reflection,
        date: new Date().toISOString(),
        language
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
          <VolumeUpIcon />
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
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default DailyReflection; 