import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { Refresh, Info as InfoIcon, CalendarToday } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DailyHobbies = ({ onHobbySelect }) => {
  const [dailyHobbies, setDailyHobbies] = useState([]);
  const [cycleInfo, setCycleInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();

  const fetchDailyHobbies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://hobby-recommender-production.up.railway.app'}/api/hobbies/daily`);
      if (!response.ok) {
        throw new Error('Failed to fetch daily hobbies');
      }
      
      const data = await response.json();
      setDailyHobbies(data.hobbies || []);
      setCycleInfo(data.cycle_info || null);
      setMessage(data.message || 'هوايات اليوم');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching daily hobbies:', error);
      setError('حدث خطأ في تحميل الهوايات اليومية');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyHobbies();
  }, []);

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

  const handleHobbySelect = (hobby) => {
    if (onHobbySelect) {
      onHobbySelect(hobby.name);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحضير هوايات اليوم...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchDailyHobbies}
          startIcon={<Refresh />}
        >
          حاول مرة أخرى
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* عنوان الهوايات اليومية */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #FFB5E8 0%, #B5E8FF 50%, #E8B5FF 100%)',
          color: '#4A4A4A',
          textAlign: 'center',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <CalendarToday sx={{ fontSize: 50, mb: 2, color: '#4A4A4A' }} />
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              color: '#4A4A4A',
              fontFamily: 'Patrick Hand',
              textShadow: '0 1px 2px rgba(74,74,74,0.2)'
            }}
          >
            🎯 هوايات اليوم
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#6B6B6B',
              fontWeight: 500,
              mb: 3,
              fontFamily: 'Quicksand'
            }}
          >
            {message}
          </Typography>
          
          {cycleInfo && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Paper
                    elevation={2}
                    sx={{ 
                      px: 3, 
                      py: 1.5, 
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid #FFB5E8',
                      borderRadius: 3,
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(255,181,232,0.2)'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A4A4A', fontFamily: 'Patrick Hand' }}>
                      🌟 الرحلة {cycleInfo.current_cycle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B', fontFamily: 'Quicksand' }}>
                      مجموعة الاكتشاف
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper
                    elevation={2}
                    sx={{ 
                      px: 3, 
                      py: 1.5, 
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid #B5E8FF',
                      borderRadius: 3,
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(181,232,255,0.2)'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A4A4A', fontFamily: 'Patrick Hand' }}>
                      📅 اليوم {cycleInfo.day_in_cycle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B', fontFamily: 'Quicksand' }}>
                      من أصل 14 يوم
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper
                    elevation={2}
                    sx={{ 
                      px: 3, 
                      py: 1.5, 
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid #E8B5FF',
                      borderRadius: 3,
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(232,181,255,0.2)'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A4A4A', fontFamily: 'Patrick Hand' }}>
                      🎯 {cycleInfo.cycle_progress}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B', fontFamily: 'Quicksand' }}>
                      تقدمك الكلي
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* شبكة الهوايات */}
      <Grid container spacing={3}>
        {dailyHobbies.map((hobby, index) => (
          <Grid item xs={12} md={6} key={hobby.id || index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handleHobbySelect(hobby)}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                  {hobby.name}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, minHeight: 60 }}>
                  {hobby.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    label={hobby.category} 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    label={hobby.skill_level} 
                    color={getSkillColor(hobby.skill_level)}
                    size="small"
                  />
                  <Chip 
                    label={hobby.cost_level} 
                    color={getCostColor(hobby.cost_level)}
                    size="small"
                  />
                </Box>
                
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<InfoIcon />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  ابدأ الآن
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* نصائح */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>
          💡 نصائح لاستكشاف هوايات اليوم:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • اختر هواية واحدة وركز عليها لمدة 15-30 دقيقة
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • لا تقلق من النتيجة، المهم هو الاستمتاع بالتجربة
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • شارك تجربتك مع الأصدقاء في قسم "التواصل مع الأصدقاء"
        </Typography>
        <Typography variant="body2">
          • ارجع غداً لاكتشاف 4 هوايات جديدة! 🎊
        </Typography>
      </Paper>
    </Box>
  );
};

export default DailyHobbies; 