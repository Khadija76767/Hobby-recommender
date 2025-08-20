import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as AutoAwesomeIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import api from '../utils/api'; // إضافة import api
import { useAuth } from '../contexts/AuthContext';
import ConnectWithFriends from './ConnectWithFriends';

const HobbySuggestion = ({ mood }) => {
  const theme = useTheme();
  const { api } = useAuth();
  const [currentHobby, setCurrentHobby] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchNewHobby = async () => {
    if (!mood) {
      setCurrentHobby(null);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🎯 Fetching daily hobby...');
      
      const response = await api.get('/api/hobbies/daily');
      console.log('✅ Daily hobby response:', response.data);
      
      // API returns {hobby: {...}, message: "..."}
      if (response.data && response.data.hobby) {
        setCurrentHobby(response.data.hobby);
        console.log('🎉 Hobby loaded:', response.data.hobby.name);
      } else {
        console.error('❌ No hobby data received:', response.data);
        // إنشاء هواية احتياطية
        setCurrentHobby({
          id: 1,
          name: "القراءة",
          description: "اكتشف عوالم جديدة في الكتب ووسع معرفتك",
          category: "تعليم",
          skill_level: "Beginner",
          cost_level: "Low"
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching hobby:', error);
      
      // هواية احتياطية في حالة الخطأ
      setCurrentHobby({
        id: 1,
        name: "التأمل والاسترخاء",
        description: "تعلم تقنيات التأمل والتنفس للاسترخاء وتحسين التركيز",
        category: "صحة نفسية",
        skill_level: "Beginner",
        cost_level: "Free"
      });
      
      setLoading(false);
      console.log('🆘 Using fallback hobby due to error');
    }
  };

  useEffect(() => {
    fetchNewHobby();
  }, [mood]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      {/* Current Suggestion */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #E8F5FF 0%, #FFF4F9 100%)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            fontFamily="Patrick Hand"
            sx={{ color: theme.palette.primary.main }}
          >
            {mood ? "Today's Discovery ✨" : "Select your mood to get started ✨"}
          </Typography>
          {mood && (
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchNewHobby}
              disabled={loading}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'rgba(255, 181, 232, 0.1)',
                },
              }}
            >
              New Suggestion
            </Button>
          )}
        </Box>

        {!mood && (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            Tell us how you're feeling and we'll suggest the perfect hobby for you! 🌟
          </Typography>
        )}

        {mood && loading && (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            جاري تحميل هواية جديدة... ✨
          </Typography>
        )}

        {mood && currentHobby && !loading && (
          <Card sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h5" component="h3" fontFamily="Patrick Hand">
                {currentHobby.name}
              </Typography>
                <IconButton
                  onClick={handleOpenModal}
                  sx={{ 
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: 'rgba(255, 181, 232, 0.1)',
                    }
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </Box>
              <Typography variant="body1" paragraph>
                {currentHobby.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={currentHobby.category}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 181, 232, 0.1)',
                    border: '1px solid rgba(255, 181, 232, 0.3)',
                  }}
                />
                {currentHobby.skill_level && (
                <Chip
                  label={`${currentHobby.skill_level} Level`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 181, 232, 0.1)',
                    border: '1px solid rgba(255, 181, 232, 0.3)',
                  }}
                />
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {mood && !currentHobby && !loading && (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
            عذراً، لم نتمكن من تحميل هواية اليوم. يرجى المحاولة مرة أخرى.
          </Typography>
        )}
      </Paper>

      {/* Detailed Hobby Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontFamily: "Patrick Hand",
          bgcolor: 'rgba(255, 181, 232, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="h5" component="span">
            {currentHobby?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {currentHobby && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>
                About this Hobby / عن هذه الهواية
              </Typography>
              <Typography paragraph>
                {currentHobby.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Category / الفئة
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentHobby.category}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Skill Level / المستوى
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentHobby.skill_level || 'Beginner'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close / إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      {/* Connect With Friends Section */}
      {mood && currentHobby && <ConnectWithFriends currentHobby={currentHobby.name} />}
    </Box>
  );
};

export default HobbySuggestion; 