import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: <ExploreIcon fontSize="large" color="primary" />,
    title: 'الإلهام اليومي',
    description: 'اكتشف هواية جديدة كل يوم تناسب اهتماماتك وتجلب السعادة لحياتك.',
  },
  {
    icon: <TrackChangesIcon fontSize="large" color="primary" />,
    title: 'تتبع الرحلة',
    description: 'تابع تقدمك واحتفل بإنجازاتك أثناء استكشاف هوايات جديدة.',
  },
  {
    icon: <CalendarTodayIcon fontSize="large" color="primary" />,
    title: 'النظام اليومي الذكي',
    description: 'احصل على 4 هوايات فريدة كل يوم - لا تكرار لمدة أسبوعين، ثم تبدأ دورة جديدة!',
  },
];

const popularHobbies = [
  {
    title: 'حفظ القرآن الكريم',
    description: 'ابدأ رحلة روحانية لحفظ القرآن الكريم.',
    image: '/assets/images/quran.jpg',
  },
  {
    title: 'فن أكياس الشاي',
    description: 'اصنع لوحات مصغرة مذهلة على أكياس الشاي المستعملة.',
    image: '/assets/images/teabag-art.jpg',
  },
  {
    title: 'يوميات الطبيعة',
    description: 'وثق اكتشافات الطبيعة من خلال الرسوم الفنية والتأملات.',
    image: '/assets/images/nature-journal.jpg',
  },
];

const HomeAr = () => {
  const { isAuthenticated } = useAuth();

  const switchToEnglish = () => {
    localStorage.setItem('app_language', 'en');
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" dir="rtl" sx={{ textAlign: 'right' }}>
      {/* Language Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, mb: 2 }}>
        <Tooltip title="Switch to English">
          <Button
            variant="outlined"
            onClick={switchToEnglish}
            startIcon={<LanguageIcon />}
            sx={{ fontWeight: 'bold' }}
          >
            English
          </Button>
        </Tooltip>
      </Box>

      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(/assets/images/welcome.png)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pl: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                مرحباً بك في سليست
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                ركن الهوايات الخاص بك لاكتشاف الأنشطة الممتعة التي تجلب البهجة والمعنى لحياتك اليومية. دعنا نستكشف معاً! ✨
              </Typography>
              <Button
                component={RouterLink}
                to={isAuthenticated ? "/dashboard" : "/register"}
                variant="contained"
                size="large"
                color="secondary"
              >
                {isAuthenticated ? "ابدأ الاستكشاف" : "انضم لمجتمعنا"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        رحلتك تبدأ هنا
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                height: '100%',
              }}
            >
              {feature.icon}
              <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Featured Activities Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        الأنشطة المميزة
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {popularHobbies.map((hobby, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={hobby.image}
                alt={hobby.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {hobby.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hobby.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomeAr; 