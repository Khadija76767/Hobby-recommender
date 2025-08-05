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
  CardActions,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: <ExploreIcon fontSize="large" color="primary" />,
    title: 'Daily Inspiration',
    description: 'Discover a new hobby every day that matches your interests and brings joy to your life.',
  },
  {
    icon: <PsychologyIcon fontSize="large" color="primary" />,
    title: 'Personalized Experience',
    description: 'Get personalized hobby recommendations based on your interests and preferences.',
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
    description: 'Embark on a spiritual journey of memorizing and understanding the Holy Qur\'an.',
    image: '/assets/images/quran.jpg',
  },
  {
    title: 'Teabag Art',
    description: 'Create stunning miniature paintings on used teabags, transforming them into unique pieces of art.',
    image: '/assets/images/teabag-art.jpg',
  },
  {
    title: 'Nature Journaling',
    description: 'Document your outdoor discoveries through artistic sketches of mushrooms, ferns, and flora while reflecting on your experiences.',
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
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
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