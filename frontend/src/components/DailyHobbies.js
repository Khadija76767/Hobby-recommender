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
      const response = await fetch('/api/hobbies/daily');
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
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🎯 هوايات اليوم
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {message}
        </Typography>
        
        {cycleInfo && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`الدورة ${cycleInfo.current_cycle}`}
              sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              label={`اليوم ${cycleInfo.day_in_cycle}/${14}`}
              sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              label={cycleInfo.cycle_progress}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
        )}
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