import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LanguageAwareApp from './components/LanguageAwareApp';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LanguageProvider>
          <LanguageAwareApp />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 