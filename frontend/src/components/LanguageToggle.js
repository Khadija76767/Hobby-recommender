import React, { useState, useEffect } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageToggle = ({ variant = "button", size = "medium" }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    // حفظ اللغة في localStorage
    localStorage.setItem('app_language', language);
    
    // تحديث اتجاه document
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // إعادة تحميل الصفحة لتطبيق اللغة الجديدة
    if (window.location.pathname !== '/') {
      // تأخير بسيط لضمان حفظ اللغة
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  if (variant === "icon") {
    return (
      <Tooltip title={language === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}>
        <IconButton
          onClick={toggleLanguage}
          color="inherit"
          size={size}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="outlined"
      size={size}
      onClick={toggleLanguage}
      startIcon={<LanguageIcon />}
      sx={{
        minWidth: 'auto',
        px: 2,
        fontWeight: 'bold'
      }}
    >
      {language === 'en' ? 'عربي' : 'English'}
    </Button>
  );
};

export default LanguageToggle; 