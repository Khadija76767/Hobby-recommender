import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import axios from 'axios';

const HobbyDetail = () => {
  const { id } = useParams();
  const [hobby, setHobby] = useState(null);
  const [progress, setProgress] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track progress dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState('interested');
  const [notes, setNotes] = useState('');
  const [progressSubmitting, setProgressSubmitting] = useState(false);
  const [progressError, setProgressError] = useState('');
  
  useEffect(() => {
    const fetchHobbyDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch hobby details
        const hobbyResponse = await axios.get(`/api/hobbies/${id}`);
        setHobby(hobbyResponse.data);
        
        // Try to fetch existing progress
        try {
          const progressResponse = await axios.get(`/api/progress/hobby/${id}`);
          if (progressResponse.data) {
            setProgress(progressResponse.data);
            setStatus(progressResponse.data.status);
            setNotes(progressResponse.data.notes || '');
          }
        } catch (err) {
          // No progress exists yet, that's okay
        }
        
        // Fetch personalized tips
        try {
          const tipsResponse = await axios.get(`/api/hobbies/${id}/tips`, {
            params: { experience_level: 'beginner' }
          });
          setTips(tipsResponse.data.tips || []);
        } catch (err) {
          console.error('Error fetching tips:', err);
          // Non-critical, so we continue
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hobby details:', err);
        setError('Failed to load hobby details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchHobbyDetails();
  }, [id]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProgressError('');
  };

  const handleTrackProgress = async () => {
    try {
      setProgressSubmitting(true);
      setProgressError('');
      
      const progressData = {
        status,
        notes
      };
      
      if (progress) {
        // Update existing progress
        await axios.put(`/api/progress/${progress.id}`, progressData);
      } else {
        // Create new progress
        await axios.post(`/api/progress/hobby/${id}`, progressData);
      }
      
      // Refresh progress data
      const progressResponse = await axios.get(`/api/progress/hobby/${id}`);
      setProgress(progressResponse.data);
      
      setProgressSubmitting(false);
      handleCloseDialog();
    } catch (err) {
      console.error('Error tracking progress:', err);
      setProgressError('Failed to save progress. Please try again.');
      setProgressSubmitting(false);
    }
  };

  // Placeholder image for hobby
  const getHobbyImage = (category) => {
    const categories = {
      'Arts & Media': 'https://source.unsplash.com/random/800x400/?art',
      'Outdoors': 'https://source.unsplash.com/random/800x400/?outdoors',
      'Sports': 'https://source.unsplash.com/random/800x400/?sports',
      'Crafts': 'https://source.unsplash.com/random/800x400/?crafts',
      'Technology': 'https://source.unsplash.com/random/800x400/?technology',
      'Culinary': 'https://source.unsplash.com/random/800x400/?cooking'
    };
    
    return categories[category] || 'https://source.unsplash.com/random/800x400/?hobby';
  };

  return (
    <Container maxWidth="lg">
      {loading ? (
        <LinearProgress />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : hobby ? (
        <>
          <Paper sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
            {/* Hero Image */}
            <Box
              sx={{
                height: 300,
                width: '100%',
                position: 'relative',
                backgroundImage: `url(${getHobbyImage(hobby.category)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7))',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  p: 3,
                  width: '100%',
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h3" component="h1">
                    {hobby.name}
                  </Typography>
                  <Chip 
                    label={hobby.category} 
                    color="primary" 
                    sx={{ bgcolor: 'rgba(25, 118, 210, 0.8)' }}
                  />
                </Box>
              </Box>
            </Box>
            
            {/* Main Content */}
            <Box sx={{ p: 3 }}>
              {/* Description */}
              <Typography variant="body1" paragraph>
                {hobby.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Details Grid */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Skill Level
                      </Typography>
                      <Typography variant="h6">
                        {hobby.skill_level}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Cost
                      </Typography>
                      <Typography variant="h6">
                        {hobby.cost_level}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Time Commitment
                      </Typography>
                      <Typography variant="h6">
                        {hobby.time_commitment}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Equipment Needed
                      </Typography>
                      <Typography variant="h6" noWrap>
                        {hobby.equipment_needed}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Benefits */}
              <Typography variant="h6" gutterBottom>
                Benefits
              </Typography>
              <Typography variant="body1" paragraph>
                {hobby.benefits}
              </Typography>
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
                <Button 
                  variant="contained"
                  startIcon={<TrackChangesIcon />}
                  onClick={handleOpenDialog}
                >
                  {progress ? 'Update Progress' : 'Track Progress'}
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  component={RouterLink}
                  to={`/chat/${hobby.id}`}
                >
                  Chat with AI Assistant
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={<FavoriteIcon />}
                >
                  Like
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Paper>
          
          {/* Tips Section */}
          {tips.length > 0 && (
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Personalized Tips
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box component="ul" sx={{ pl: 2 }}>
                {tips.map((tip, index) => (
                  <Typography component="li" key={index} paragraph>
                    {tip}
                  </Typography>
                ))}
              </Box>
            </Paper>
          )}
          
          {/* Progress Tracking Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {progress ? 'Update Progress' : 'Track Your Progress'}
            </DialogTitle>
            <DialogContent>
              {progressError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {progressError}
                </Alert>
              )}
              <DialogContentText>
                Keep track of your journey with {hobby.name}. Update your status and add notes about your experience.
              </DialogContentText>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="interested">Interested</MenuItem>
                  <MenuItem value="started">Started</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                id="notes"
                label="Notes"
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts, achievements, or next steps..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                onClick={handleTrackProgress} 
                variant="contained"
                disabled={progressSubmitting}
              >
                {progressSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Alert severity="info">
          Hobby not found.
        </Alert>
      )}
    </Container>
  );
};

export default HobbyDetail; 