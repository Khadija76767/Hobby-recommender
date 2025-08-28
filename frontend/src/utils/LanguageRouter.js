import React, { useState, useEffect } from 'react';

// Hook لإدارة اللغة
export const useLanguageRouter = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    // تحديث DOM عند تغيير اللغة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const switchToArabic = () => {
    localStorage.setItem('app_language', 'ar');
    window.location.href = window.location.pathname + '?lang=ar';
  };

  const switchToEnglish = () => {
    localStorage.setItem('app_language', 'en');
    window.location.href = window.location.pathname + '?lang=en';
  };

  const toggleLanguage = () => {
    if (language === 'en') {
      switchToArabic();
    } else {
      switchToEnglish();
    }
  };

  return {
    language,
    switchToArabic,
    switchToEnglish,
    toggleLanguage,
    isArabic: language === 'ar'
  };
};

// Component لتبديل اللغة
export const LanguageToggleButton = ({ variant = "outlined" }) => {
  const { language, toggleLanguage } = useLanguageRouter();
  
  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: '8px 16px',
        border: variant === 'outlined' ? '1px solid #ccc' : 'none',
        borderRadius: '4px',
        background: variant === 'contained' ? '#1976d2' : 'transparent',
        color: variant === 'contained' ? 'white' : '#1976d2',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
      }}
    >
      {language === 'en' ? 'عربي' : 'English'}
    </button>
  );
}; 