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
  Chip,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: <ExploreIcon fontSize="large" color="primary" />,
    title: 'Daily Inspiration',
    description: 'Discover a new hobby every day that matches your interests and brings joy to your life.',
  },
  {
    icon: <TrackChangesIcon fontSize="large" color="primary" />,
    title: 'Journey Tracking',
    description: 'Keep track of your progress and celebrate your achievements as you explore new hobbies.',
  },
];

const popularHobbies = [
  {
    title: 'Qur\'an Memorization',
    description: 'Embark on a spiritual journey of memorizing the Holy Qur\'an.',
    image: '/assets/images/quran.jpg',
  },
  {
    title: 'Teabag Art',
    description: 'Create stunning miniature paintings on used teabags.',
    image: '/assets/images/teabag-art.jpg',
  },
  {
    title: 'Nature Journaling',
    description: 'Document outdoor discoveries through artistic sketches and reflections.',
    image: '/assets/images/nature-journal.jpg',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg">
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
                pr: { md: 0 },
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Welcome to Celeste
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Your hobby corner to discover delightful activities that bring joy and meaning to your daily life. Let's explore together! ✨
              </Typography>
              <Button
                component={RouterLink}
                to={isAuthenticated ? "/dashboard" : "/register"}
                variant="contained"
                size="large"
                color="secondary"
              >
                {isAuthenticated ? "Start Exploring" : "Join Our Community"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* نظام الهوايات اليومية الذكي */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 6
        }}
      >
        <Box textAlign="center" mb={4}>
          <CalendarTodayIcon sx={{ fontSize: 60, mb: 2, color: '#fff' }} />
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            🎯 نظام الهوايات اليومية الذكي
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            اكتشف 4 هوايات جديدة كل يوم من مجموعتنا المتنوعة!
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#FFD700' }}>
                🔥 كيف يعمل النظام؟
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label="📅 يومياً" 
                  sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Chip 
                  label="🎲 عشوائي" 
                  sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Chip 
                  label="🔄 متجدد" 
                  sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                ✨ <strong>4 هوايات فريدة</strong> كل يوم من أصل 54 هواية
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                🚫 <strong>لا تكرار</strong> لمدة 14 يوم كامل
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                🔄 <strong>دورة جديدة</strong> كل أسبوعين بترتيب مختلف
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                📈 <strong>تقدم تدريجي</strong> لاكتشاف كل الهوايات
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={4}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                color: 'text.primary'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#667eea' }}>
                📊 مثال على الدورة:
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  🗓️ <strong>اليوم 1:</strong> حفظ القرآن، الرسم، الطبخ، القراءة
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  🗓️ <strong>اليوم 2:</strong> التصوير، الزراعة، الكتابة، الموسيقى
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  🗓️ <strong>اليوم 3:</strong> التطريز، البرمجة، التأمل، الرياضة
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  ... وهكذا حتى تكتشف كل الـ 54 هواية!
                </Typography>
              </Box>

              <Box textAlign="center" mt={3}>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<AutoAwesomeIcon />}
                  sx={{
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5a6fd8' },
                    borderRadius: 3,
                    px: 4,
                    py: 1.5
                  }}
                >
                  اكتشف هوايات اليوم
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Your Journey Begins Here
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
              }}
            >
              {feature.icon}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Popular Hobbies Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Featured Activities
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {popularHobbies.map((hobby, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={hobby.image}
                alt={hobby.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {hobby.title}
                </Typography>
                <Typography>
                  {hobby.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Paper sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Ready to find your next favorite activity?
        </Typography>
        <Typography variant="body1" paragraph>
          Join our community and discover activities that match your interests and lifestyle.
        </Typography>
        <Button
          component={RouterLink}
          to={isAuthenticated ? "/dashboard" : "/register"}
          variant="contained"
          color="primary"
          size="large"
        >
          {isAuthenticated ? "Explore Hobbies" : "Join Now"}
        </Button>
      </Paper>
    </Container>
  );
};

export default Home; 
