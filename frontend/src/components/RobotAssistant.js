import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useTheme } from '@mui/material/styles';
import { speak, stopSpeaking } from '../utils/speech';
import { useAuth } from '../contexts/AuthContext'; // 🔥 إضافة استيراد useAuth

const DAILY_AFFIRMATIONS = [
  {
    en: "You're doing great! Every small step counts.",
    ar: "أنت تقوم بعمل رائع! كل خطوة صغيرة تحسب."
  },
  {
    en: "Today is full of wonderful possibilities!",
    ar: "اليوم مليء بالإمكانيات الرائعة!"
  },
  {
    en: "Your creativity knows no bounds.",
    ar: "إبداعك لا حدود له."
  },
  {
    en: "You have the power to make today amazing!",
    ar: "لديك القدرة على جعل اليوم مذهلاً!"
  },
  {
    en: "Every moment is a fresh beginning.",
    ar: "كل لحظة هي بداية جديدة."
  }
];

const MOOD_RESPONSES = {
  happy: {
    en: "Your joy is contagious! Let's channel that energy into something amazing!",
    ar: "فرحك معدي! دعنا نوجه هذه الطاقة إلى شيء مذهل!"
  },
  excited: {
    en: "That's the spirit! Your enthusiasm will make any activity more fun!",
    ar: "هذه هي الروح! حماسك سيجعل أي نشاط أكثر متعة!"
  },
  peaceful: {
    en: "What a wonderful state of mind for trying something new and relaxing.",
    ar: "ما أجمل هذه الحالة الذهنية لتجربة شيء جديد ومريح."
  },
  tired: {
    en: "Let's find something gentle and refreshing for you today.",
    ar: "دعنا نجد شيئًا لطيفًا ومنعشًا لك اليوم."
  },
  creative: {
    en: "Your creative energy is flowing! Let's make something beautiful!",
    ar: "طاقتك الإبداعية تتدفق! دعنا نصنع شيئًا جميلاً!"
  }
};

const RobotAssistant = ({ onMoodChange }) => {
  const { currentUser } = useAuth(); // 🔥 استخدام بيانات المستخدم الحالي
  
  const [currentAffirmation, setCurrentAffirmation] = useState(DAILY_AFFIRMATIONS[0]);
  const [userMood, setUserMood] = useState('');
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState('en');
  
  // 🔥 ربط اسم المستخدم بالمستخدم المحدد
  const [userName, setUserName] = useState(() => {
    if (!currentUser) return '';
    
    const userKey = `userName_user_${currentUser.id}`; // 🔥 مفتاح فريد لكل مستخدم
    const savedName = localStorage.getItem(userKey);
    return savedName || currentUser.display_name || currentUser.username || '';
  });
  
  // 🔥 تحديد متى نعرض نافذة إدخال الاسم
  const [showNameInput, setShowNameInput] = useState(() => {
    if (!currentUser) return false;
    
    const userKey = `userName_user_${currentUser.id}`;
    const savedName = localStorage.getItem(userKey);
    // اعرض نافذة الاسم إذا لم يكن هناك اسم محفوظ للمستخدم الحالي
    return !savedName && !currentUser.display_name;
  });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DAILY_AFFIRMATIONS.length);
    setCurrentAffirmation(DAILY_AFFIRMATIONS[randomIndex]);

    return () => {
      stopSpeaking();
    };
  }, []);

  // 🔥 تحديث البيانات عند تغيير المستخدم أو البروفايل
  useEffect(() => {
    console.log('🐼 RobotAssistant useEffect triggered:', { 
      currentUser: currentUser?.username, 
      display_name: currentUser?.display_name,
      current_userName: userName 
    });

    if (currentUser) {
      const userKey = `userName_user_${currentUser.id}`;
      
      // 🔥 إعطاء أولوية للاسم من البروفايل (display_name) دائماً
      const profileName = currentUser.display_name || currentUser.username;
      
      console.log(`🏷️ Profile name detected: "${profileName}"`);
      
      if (profileName && profileName.trim() !== '') {
        // إذا كان الاسم مختلف عن الحالي، حديثه
        if (profileName !== userName) {
          console.log(`🔄 Updating name from "${userName}" to "${profileName}"`);
          setUserName(profileName);
          localStorage.setItem(userKey, profileName);
          setShowNameInput(false);
        }
      } else {
        // إذا لم يكن هناك اسم في البروفايل، تحقق من localStorage
        const savedName = localStorage.getItem(userKey);
        if (savedName && savedName !== userName) {
          console.log(`🏷️ Loading saved name: "${savedName}"`);
          setUserName(savedName);
          setShowNameInput(false);
        } else if (!savedName) {
          // اطلب من المستخدم إدخال اسم
          console.log('🏷️ No name found, requesting input');
          setUserName('');
          setShowNameInput(true);
        }
      }
    } else {
      setUserName('');
      setShowNameInput(false);
    }
  }, [currentUser, currentUser?.display_name, currentUser?.username]); // 🔥 مراقبة كل البيانات

  // 🔥 مراقبة تغيير display_name تحديداً (للتحديث الفوري)
  useEffect(() => {
    if (currentUser && currentUser.display_name) {
      const currentDisplayName = currentUser.display_name;
      
      // إذا تغير display_name عن الاسم المحفوظ، حديثه
      if (currentDisplayName !== userName && currentDisplayName.trim() !== '') {
        setUserName(currentDisplayName);
        
        // حفظ الاسم الجديد
        const userKey = `userName_user_${currentUser.id}`;
        localStorage.setItem(userKey, currentDisplayName);
        
        console.log(`🔄 Display name changed, updated to: ${currentDisplayName}`);
      }
    }
  }, [currentUser?.display_name]); // مراقبة display_name فقط

  // 🔥 مراقبة متقدمة لتحديثات البيانات (للتأكد من التحديث الفوري)
  useEffect(() => {
    if (!currentUser) return;

    const checkForUpdates = () => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          if (userData.id === currentUser.id) {
            const newDisplayName = userData.display_name || userData.username;
            if (newDisplayName && newDisplayName !== userName) {
              console.log(`🚀 Force update detected: "${userName}" → "${newDisplayName}"`);
              setUserName(newDisplayName);
              
              // حفظ أيضاً في مفتاح RobotAssistant
              const userKey = `userName_user_${currentUser.id}`;
              localStorage.setItem(userKey, newDisplayName);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing userData:', error);
        }
      }
    };

    // فحص فوري
    checkForUpdates();

    // فحص دوري كل ثانية (للتأكد من عدم تفويت أي تحديث)
    const interval = setInterval(checkForUpdates, 1000);

    return () => clearInterval(interval);
  }, [currentUser?.id, userName]);

  // 🔥 مستمع للتحديثات الفورية من البروفايل
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const newDisplayName = event.detail?.newDisplayName;
      if (newDisplayName && newDisplayName !== userName) {
        console.log(`🎯 Profile update event received: "${newDisplayName}"`);
        setUserName(newDisplayName);
      }
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [userName]);

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

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    setShowMoodInput(false);
    onMoodChange(userMood);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() && currentUser) {
      // 🔥 حفظ الاسم مع مفتاح فريد للمستخدم
      const userKey = `userName_user_${currentUser.id}`;
      localStorage.setItem(userKey, userName.trim());
      setShowNameInput(false);
      
      console.log(`🏷️ Name saved for user ${currentUser.id}: ${userName.trim()}`);
    }
  };

  const getMoodResponse = () => {
    const mood = userMood.toLowerCase();
    for (const [key, response] of Object.entries(MOOD_RESPONSES)) {
      if (mood.includes(key)) {
        return response[language];
      }
    }
    return language === 'en' 
      ? "Thank you for sharing! Let's find something that matches your mood!"
      : "شكراً لمشاركتك! دعنا نجد شيئاً يناسب مزاجك!";
  };

  // 🔥 إذا لم يكن هناك مستخدم مسجل دخول
  if (!currentUser) {
    return (
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 16px',
                fontSize: '2rem',
              }}
            >
              🐼
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Welcome!
            </Typography>
            <Typography variant="body2">
              Please log in to get personalized assistance
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} alignItems="center">
      {/* Robot Image */}
      <Grid item xs={12} md={4}>
        <Box
          className="robot-assistant"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <img
            src="/assets/images/robot.png"
            alt="Friendly Robot Assistant"
            style={{
              width: '200px',
              height: 'auto',
              filter: speaking ? 'brightness(1.2)' : 'brightness(1)',
            }}
          />
          <Box
            className={speaking ? 'pulse' : ''}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,181,232,0.2) 0%, rgba(255,255,255,0) 70%)',
              opacity: speaking ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        </Box>
      </Grid>

      {/* Interaction Area */}
      <Grid item xs={12} md={8}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Language Toggle */}
          <Button
            onClick={() => setLanguage(lang => lang === 'en' ? 'ar' : 'en')}
            sx={{ mb: 2 }}
          >
            {language === 'en' ? 'عربي' : 'English'}
          </Button>

          {/* Name Input */}
          <Collapse in={showNameInput}>
            <Box
              component="form"
              onSubmit={handleNameSubmit}
              sx={{ mb: 3 }}
            >
              <TextField
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={language === 'en' ? "What's your name?" : "ما اسمك؟"}
                sx={{ mb: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!userName.trim()}
                sx={{
                  bgcolor: 'rgba(255, 181, 232, 0.9)',
                  color: '#4A4A4A',
                  '&:hover': {
                    bgcolor: 'rgba(255, 181, 232, 0.7)',
                  },
                }}
              >
                {language === 'en' ? 'Continue' : 'استمر'}
              </Button>
            </Box>
          </Collapse>

          {/* Greeting */}
          {!showNameInput && userName && (
            <Typography
              variant="h5"
              component="h2"
              fontFamily="Patrick Hand"
              gutterBottom
              sx={{
                color: '#4A4A4A',
                textAlign: language === 'ar' ? 'right' : 'left',
                direction: language === 'ar' ? 'rtl' : 'ltr',
                mb: 3,
              }}
            >
              {language === 'en' 
                ? `Welcome back, ${userName}! 🌟`
                : `مرحباً بعودتك يا ${userName}! 🌟`}
              <IconButton
                onClick={() => handleSpeak(language === 'en' 
                  ? `Welcome back, ${userName}!`
                  : `مرحباً بعودتك يا ${userName}!`)}
                disabled={speaking}
                size="small"
                sx={{ ml: 1 }}
              >
                <VolumeUpIcon />
              </IconButton>
            </Typography>
          )}

          {/* Daily Affirmation */}
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
            {currentAffirmation[language]}
            <IconButton
              onClick={() => handleSpeak(currentAffirmation[language])}
              disabled={speaking}
              size="small"
              sx={{ ml: 1 }}
            >
              <VolumeUpIcon />
            </IconButton>
          </Typography>

          {/* Mood Input */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => setShowMoodInput(true)}
              className="animated-button"
              sx={{
                bgcolor: 'rgba(255, 181, 232, 0.9)',
                color: '#4A4A4A',
                '&:hover': {
                  bgcolor: 'rgba(255, 181, 232, 0.7)',
                },
              }}
            >
              {language === 'en' ? 'How are you feeling today?' : 'كيف تشعر اليوم؟'}
            </Button>

            <Collapse in={showMoodInput}>
              <Box
                component="form"
                onSubmit={handleMoodSubmit}
                sx={{ mt: 2 }}
              >
                <TextField
                  fullWidth
                  value={userMood}
                  onChange={(e) => setUserMood(e.target.value)}
                  placeholder={language === 'en' ? 'Enter your mood...' : 'أدخل مزاجك...'}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    bgcolor: 'rgba(255, 181, 232, 0.9)',
                    color: '#4A4A4A',
                    '&:hover': {
                      bgcolor: 'rgba(255, 181, 232, 0.7)',
                    },
                  }}
                >
                  {language === 'en' ? 'Submit' : 'إرسال'}
                </Button>
              </Box>
            </Collapse>

            {/* Mood Response */}
            {userMood && !showMoodInput && (
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  color: '#4A4A4A',
                  textAlign: language === 'ar' ? 'right' : 'left',
                  direction: language === 'ar' ? 'rtl' : 'ltr',
                }}
              >
                {getMoodResponse()}
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RobotAssistant; 