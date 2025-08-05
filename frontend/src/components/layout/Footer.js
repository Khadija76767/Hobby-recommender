import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        background: 'linear-gradient(45deg, #FFB5E8 30%, #B5E8FF 90%)',
        boxShadow: '0 -3px 5px 2px rgba(255, 181, 232, .3)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SpaIcon sx={{ mr: 1, color: '#4A4A4A' }} />
              <Typography 
                variant="h6" 
                color="#4A4A4A"
                fontFamily="Patrick Hand"
                fontSize="1.5rem"
              >
                Celeste
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="#4A4A4A"
              fontFamily="Quicksand"
              sx={{ mb: 2 }}
            >
              Discover new hobbies tailored to your interests and preferences.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              color="#4A4A4A" 
              gutterBottom
              fontFamily="Patrick Hand"
              fontSize="1.3rem"
            >
              Quick Links
            </Typography>
            <Link 
              component={RouterLink} 
              to="/" 
              sx={{
                color: '#4A4A4A',
                display: 'block',
                mb: 1,
                fontFamily: 'Quicksand',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Home
            </Link>
            <Link 
              component={RouterLink} 
              to="/dashboard" 
              sx={{
                color: '#4A4A4A',
                display: 'block',
                mb: 1,
                fontFamily: 'Quicksand',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Dashboard
            </Link>
            <Link 
              component={RouterLink} 
              to="/quiz" 
              sx={{
                color: '#4A4A4A',
                display: 'block',
                mb: 1,
                fontFamily: 'Quicksand',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Preference Quiz
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              color="#4A4A4A" 
              gutterBottom
              fontFamily="Patrick Hand"
              fontSize="1.3rem"
            >
              Legal
            </Typography>
            <Link 
              href="#" 
              sx={{
                color: '#4A4A4A',
                display: 'block',
                mb: 1,
                fontFamily: 'Quicksand',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              sx={{
                color: '#4A4A4A',
                display: 'block',
                mb: 1,
                fontFamily: 'Quicksand',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Terms of Service
            </Link>
          </Grid>
        </Grid>
        
        <Box 
          sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid rgba(74, 74, 74, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="body2" 
            color="#4A4A4A"
            fontFamily="Quicksand"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            Made with <FavoriteIcon sx={{ color: '#FF9ED6', fontSize: '1rem' }} /> by Celeste
            {' © '}
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 