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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
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
      const response = await api.get('/api/hobbies/daily');
      const hobbies = response.data;
      setCurrentHobby(hobbies[0]); // Get the first hobby from the daily hobbies
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hobby:', error);
      setLoading(false);
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

        {mood && currentHobby && (
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
                <Chip
                  label={`${currentHobby.skill_level} Level`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 181, 232, 0.1)',
                    border: '1px solid rgba(255, 181, 232, 0.3)',
                  }}
                />
                <Chip
                  label={currentHobby.time_commitment}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 181, 232, 0.1)',
                    border: '1px solid rgba(255, 181, 232, 0.3)',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
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
                About this Hobby
              </Typography>
              <Typography paragraph>
                {currentHobby.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Getting Started Guide / دليل البدء
              </Typography>
              <Typography
                component="div"
                sx={{
                  whiteSpace: 'pre-line',
                  mb: 2,
                  p: 2,
                  bgcolor: 'rgba(255, 181, 232, 0.1)',
                  borderRadius: 2
                }}
              >
                {currentHobby.detailed_guide}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Requirements
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Time:</strong> {currentHobby.time_commitment}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Cost Level:</strong> {currentHobby.cost_level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Equipment:</strong> {currentHobby.equipment_needed}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Benefits
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentHobby.benefits}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Connect With Friends Section */}
      {mood && currentHobby && <ConnectWithFriends currentHobby={currentHobby.name} />}
    </Box>
  );
};

export default HobbySuggestion; 