import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFB5E8', // Soft pink
      light: '#FFC8E8',
      dark: '#FF9ED6',
      contrastText: '#4A4A4A',
    },
    secondary: {
      main: '#B5E8FF', // Soft blue
      light: '#D6F3FF',
      dark: '#95D8FF',
      contrastText: '#4A4A4A',
    },
    background: {
      default: '#FFF9F9', // Very light pink
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4A4A4A',
      secondary: '#6B6B6B',
    },
    // Custom pastel colors for various UI elements
    pastel: {
      pink: '#FFB5E8',
      blue: '#B5E8FF',
      purple: '#E8B5FF',
      mint: '#B5FFE8',
      yellow: '#FFE8B5',
      peach: '#FFD5C2',
    },
  },
  typography: {
    fontFamily: [
      'Quicksand',
      'Patrick Hand',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Patrick Hand',
      fontSize: '2.5rem',
      fontWeight: 400,
    },
    h2: {
      fontFamily: 'Patrick Hand',
      fontSize: '2rem',
      fontWeight: 400,
    },
    h3: {
      fontFamily: 'Patrick Hand',
      fontSize: '1.75rem',
      fontWeight: 400,
    },
    h4: {
      fontFamily: 'Patrick Hand',
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h5: {
      fontFamily: 'Patrick Hand',
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    h6: {
      fontFamily: 'Patrick Hand',
      fontSize: '1rem',
      fontWeight: 400,
    },
    body1: {
      fontFamily: 'Quicksand',
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Quicksand',
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 25,
          padding: '10px 20px',
          fontFamily: 'Quicksand',
          fontWeight: 600,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FFB5E8 30%, #FFC8E8 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FFC8E8 30%, #FFB5E8 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#FFB5E8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFB5E8',
            },
          },
        },
      },
    },
  },
});

export default theme; 