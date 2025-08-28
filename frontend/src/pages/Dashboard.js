import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  Tab,
  Tabs,
  useTheme,
  Avatar,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ChatIcon from '@mui/icons-material/Chat';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import RobotAssistant from '../components/RobotAssistant';
import HobbySuggestion from '../components/HobbySuggestion';
import DailyHobbies from '../components/DailyHobbies';
import ConnectWithFriends from '../components/ConnectWithFriends';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [welcomeImageOffset, setWelcomeImageOffset] = useState(0);
  const [dailyHobby, setDailyHobby] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const [currentMood, setCurrentMood] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentHobbyForSharing, setCurrentHobbyForSharing] = useState("Daily Hobby");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch daily hobby
        const dailyResponse = await axios.get('/api/hobbies/daily');
        setDailyHobby(dailyResponse.data);
        
        // Fetch recommendations
        const recommendationsResponse = await axios.get('/api/hobbies/recommend', {
          params: { limit: 5 }
        });
        setRecommendations(recommendationsResponse.data);
        
        // Fetch in-progress hobbies
        const progressResponse = await axios.get('/api/progress');
        // setInProgress(progressResponse.data); // This line was removed as per the edit hint
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setWelcomeImageOffset(window.pageYOffset * 0.5);
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Placeholder image for hobbies without images
  const getHobbyImage = (category) => {
    const categories = {
      'Arts & Media': 'https://source.unsplash.com/random/300x200/?art',
      'Outdoors': 'https://source.unsplash.com/random/300x200/?outdoors',
      'Sports': 'https://source.unsplash.com/random/300x200/?sports',
      'Crafts': 'https://source.unsplash.com/random/300x200/?crafts',
      'Technology': 'https://source.unsplash.com/random/300x200/?technology',
      'Culinary': 'https://source.unsplash.com/random/300x200/?cooking'
    };
    
    return categories[category] || 'https://source.unsplash.com/random/300x200/?hobby';
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Welcome Section with Parallax */}
      <Box
        className="parallax"
        sx={{
          height: '60vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url("/assets/images/welcome.png")',
          backgroundSize: 'cover',
          transform: `translateY(${scrollPosition * 0.5}px)`,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // White background with 80% opacity
            padding: '10px 25px',
            borderRadius: '15px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
        <Typography
          variant="h2"
          component="h1"
          fontFamily="Patrick Hand"
          sx={{
              color: '#FFB6C1', // Light pink
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
              whiteSpace: 'nowrap', // Prevents text from wrapping
          }}
        >
          Your Hobby Corner ✨
        </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 3 }}>
        <Grid container spacing={4}>
          {/* Robot Assistant */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #E8F5FF 0%, #FFF4F9 100%)',
              }}
            >
              <RobotAssistant onMoodChange={setCurrentMood} />
            </Paper>
          </Grid>

          {/* Hobby Suggestion */}
          <Grid item xs={12} md={8}>
            <HobbySuggestion 
              mood={currentMood} 
              onHobbySelect={setCurrentHobbyForSharing}
            />
          </Grid>

          {/* Daily Reflection Button */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #FFF4E8 0%, #FFE8F5 100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h5"
                fontFamily="Patrick Hand"
                gutterBottom
                sx={{ color: theme.palette.primary.main }}
              >
                Share Your Daily Thoughts ✨
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Take a moment to reflect on your day and capture your thoughts
              </Typography>
              <Button
                component={RouterLink}
                to="/reflection"
                variant="contained"
                startIcon={<CreateIcon />}
                sx={{
                  bgcolor: 'rgba(255, 181, 232, 0.9)',
                  color: '#4A4A4A',
                  '&:hover': {
                    bgcolor: 'rgba(255, 181, 232, 0.7)',
                  },
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                }}
              >
                              Write Today's Reflection
            </Button>
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
              🤝 Connect & Share with Friends
            </Typography>
            <ConnectWithFriends currentHobby={currentHobbyForSharing} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
};

export default Dashboard; 