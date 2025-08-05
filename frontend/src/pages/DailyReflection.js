import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '✨', label: 'Excited' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '💪', label: 'Motivated' },
];

const PROMPTS = [
  "What made you smile today?",
  "What's one thing you learned?",
  "What are you grateful for?",
  "What's a small victory you had?",
  "What's something you're looking forward to?",
  "What hobby brought you joy today?",
  "What inspired you recently?",
  "What made today special?",
];

const STICKER_COLORS = [
  'linear-gradient(135deg, #FFE8D6 0%, #FFB7B2 100%)',
  'linear-gradient(135deg, #E2F0CB 0%, #B7E4C7 100%)',
  'linear-gradient(135deg, #D4E7FF 0%, #B7C0FF 100%)',
  'linear-gradient(135deg, #FFE8F5 0%, #FFB5E8 100%)',
  'linear-gradient(135deg, #FFF3B0 0%, #FFE66D 100%)',
];

const DailyReflection = () => {
  const theme = useTheme();
  const [reflection, setReflection] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [savedReflections, setSavedReflections] = useState(() => {
    const saved = localStorage.getItem('reflections');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Get a random prompt
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
  }, []);

  useEffect(() => {
    localStorage.setItem('reflections', JSON.stringify(savedReflections));
  }, [savedReflections]);

  const handleSave = () => {
    if (reflection.trim()) {
      const newReflection = {
        text: reflection,
        mood: selectedMood,
        prompt: currentPrompt,
        date: new Date().toISOString(),
      };
      setSavedReflections([newReflection, ...savedReflections]);
      setReflection('');
      setSelectedMood(null);
      // Get a new random prompt
      const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
      setCurrentPrompt(randomPrompt);
    }
  };

  const handleDelete = (index) => {
    setSavedReflections(savedReflections.filter((_, i) => i !== index));
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Typography
        variant="h3"
        component="h1"
        fontFamily="Patrick Hand"
        gutterBottom
        align="center"
        sx={{ color: theme.palette.primary.main, mb: 4 }}
      >
        Daily Reflection ✨
      </Typography>

      {/* Current Mood */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #FFF4E8 0%, #FFE8F5 100%)',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          fontFamily="Patrick Hand"
          sx={{ color: theme.palette.text.secondary }}
        >
          How are you feeling today?
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {MOODS.map((mood) => (
            <Grid item key={mood.label}>
              <Chip
                label={`${mood.emoji} ${mood.label}`}
                onClick={() => setSelectedMood(mood)}
                sx={{
                  bgcolor: selectedMood?.label === mood.label
                    ? 'rgba(255, 181, 232, 0.2)'
                    : 'transparent',
                  border: selectedMood?.label === mood.label
                    ? '2px solid rgba(255, 181, 232, 0.5)'
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 181, 232, 0.1)',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Reflection Input */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: '#fff',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '20px',
            width: '40px',
            height: '10px',
            background: 'rgba(255, 181, 232, 0.5)',
            borderRadius: '0 0 20px 20px',
          },
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          fontFamily="Patrick Hand"
          sx={{ color: theme.palette.text.secondary }}
        >
          {currentPrompt}
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your thoughts here..."
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: 'rgba(255, 181, 232, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 181, 232, 0.7)',
              },
            },
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!reflection.trim()}
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: 'rgba(255, 181, 232, 0.9)',
              color: '#4A4A4A',
              '&:hover': {
                bgcolor: 'rgba(255, 181, 232, 0.7)',
              },
            }}
          >
            Save Reflection
          </Button>
        </Box>
      </Paper>

      {/* Past Reflections */}
      <Typography
        variant="h5"
        gutterBottom
        fontFamily="Patrick Hand"
        sx={{ color: theme.palette.text.secondary, mt: 6, mb: 3 }}
      >
        Past Reflections
      </Typography>
      <Grid container spacing={3}>
        {savedReflections.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                background: STICKER_COLORS[index % STICKER_COLORS.length],
                position: 'relative',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                transform: 'rotate(-2deg)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'rotate(0deg) scale(1.02)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '20px',
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '3px',
                  boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    mb: 2,
                    color: 'rgba(0,0,0,0.6)',
                  }}
                >
                  {formatDate(item.date)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Patrick Hand',
                    fontSize: '1.1rem',
                    color: 'rgba(0,0,0,0.8)',
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  {item.text}
                </Typography>
                {item.mood && (
                  <Typography
                    variant="h5"
                    sx={{
                      position: 'absolute',
                      bottom: '-10px',
                      right: '-10px',
                      transform: 'rotate(-10deg)',
                    }}
                  >
                    {item.mood.emoji}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleDelete(index)}
                  sx={{
                    color: 'rgba(0,0,0,0.4)',
                    '&:hover': {
                      color: 'rgba(0,0,0,0.6)',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DailyReflection; 