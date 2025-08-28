import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  useTheme,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import RobotAssistant from '../components/RobotAssistant';
import DailyHobbies from '../components/DailyHobbies';
import ConnectWithFriends from '../components/ConnectWithFriends';
import DailyReflection from '../components/DailyReflection';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DashboardAr = () => {
  const theme = useTheme();
  const [currentMood, setCurrentMood] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentHobbyForSharing, setCurrentHobbyForSharing] = useState("الهواية اليومية");

  const switchToEnglish = () => {
    localStorage.setItem('app_language', 'en');
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box dir="rtl" sx={{ textAlign: 'right' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Language Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={switchToEnglish}
            startIcon={<LanguageIcon />}
            sx={{ fontWeight: 'bold' }}
          >
            English
          </Button>
        </Box>

        {/* Header */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #FFB5E8 0%, #B5DEFF 100%)',
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h3" 
            fontFamily="Patrick Hand" 
            sx={{ 
              color: theme.palette.primary.main,
              mb: 2,
              fontWeight: 'bold'
            }}
          >
            🌟 رحلة الهوايات الخاصة بك
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8 }}>
            اكتشف، تعلم، وشارك هواياتك المفضلة
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* Daily Hobbies */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #E8F5E8 0%, #F0F8FF 100%)',
              }}
            >
              <Typography
                variant="h5"
                fontFamily="Patrick Hand"
                gutterBottom
                sx={{ color: theme.palette.primary.main, mb: 3 }}
              >
                🎯 الهوايات اليومية
              </Typography>
              <DailyHobbies onHobbySelect={setCurrentHobbyForSharing} />
            </Paper>
          </Grid>

          {/* Connect with Friends */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #F0F8FF 0%, #E8F5E8 100%)',
              }}
            >
              <Typography
                variant="h5"
                fontFamily="Patrick Hand"
                gutterBottom
                sx={{ color: theme.palette.primary.main, mb: 3 }}
              >
                🤝 التواصل والمشاركة مع الأصدقاء
              </Typography>
              <ConnectWithFriends currentHobby={currentHobbyForSharing} />
            </Paper>
          </Grid>

          {/* Personal Assistant & Daily Reflection */}
          <Grid item xs={12} lg={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                height: 'fit-content',
                background: 'linear-gradient(135deg, #FFF0F8 0%, #F0F8FF 100%)',
              }}
            >
              <Typography
                variant="h5"
                fontFamily="Patrick Hand"
                gutterBottom
                sx={{ color: theme.palette.primary.main, mb: 3 }}
              >
                🐼 مساعدك الشخصي
              </Typography>
              <RobotAssistant onMoodChange={setCurrentMood} />
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                height: 'fit-content',
                background: 'linear-gradient(135deg, #F8F0FF 0%, #FFF0F8 100%)',
              }}
            >
              <Typography
                variant="h5"
                fontFamily="Patrick Hand"
                gutterBottom
                sx={{ color: theme.palette.primary.main, mb: 3 }}
              >
                📝 التأمل اليومي
              </Typography>
              <DailyReflection />
            </Paper>
          </Grid>
        </Grid>

        {/* Tips Section */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mt: 4, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FFF9E6 0%, #F0F8FF 100%)'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
            💡 نصائح لتحقيق أقصى استفادة من رحلة الهوايات:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🎯 ابدأ بهواية واحدة وركز عليها لمدة 15-30 دقيقة
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📱 شارك تجربتك مع الأصدقاء للحصول على الدعم والتشجيع
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                📝 سجل أفكارك ومشاعرك في قسم التأمل اليومي
              </Typography>
              <Typography variant="body2">
                🔄 ارجع غداً لاكتشاف 4 هوايات جديدة ومثيرة!
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardAr; 