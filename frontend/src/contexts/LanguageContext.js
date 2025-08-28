import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // استرجاع اللغة المحفوظة أو الافتراضية (الإنجليزية)
    const savedLanguage = localStorage.getItem('app_language');
    return savedLanguage || 'en';
  });

  const [direction, setDirection] = useState(language === 'ar' ? 'rtl' : 'ltr');

  useEffect(() => {
    // حفظ اللغة في localStorage
    localStorage.setItem('app_language', language);
    
    // تحديث الاتجاه
    setDirection(language === 'ar' ? 'rtl' : 'ltr');
    
    // تحديث اتجاه document
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key) => {
    return translations[key] && translations[key][language] 
      ? translations[key][language] 
      : key;
  };

  const value = {
    language,
    direction,
    setLanguage,
    toggleLanguage,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// قاموس الترجمات
const translations = {
  // Navigation
  'navbar.dashboard': {
    en: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  'navbar.profile': {
    en: 'Profile',
    ar: 'الملف الشخصي'
  },
  'navbar.logout': {
    en: 'Logout',
    ar: 'تسجيل الخروج'
  },
  'navbar.login': {
    en: 'Login',
    ar: 'تسجيل الدخول'
  },
  'navbar.register': {
    en: 'Register',
    ar: 'التسجيل'
  },

  // Home Page
  'home.welcome': {
    en: 'Welcome to Celeste',
    ar: 'مرحباً بك في سليست'
  },
  'home.description': {
    en: 'Your hobby corner to discover delightful activities that bring joy and meaning to your daily life. Let\'s explore together! ✨',
    ar: 'ركن الهوايات الخاص بك لاكتشاف الأنشطة الممتعة التي تجلب البهجة والمعنى لحياتك اليومية. دعنا نستكشف معاً! ✨'
  },
  'home.startExploring': {
    en: 'Start Exploring',
    ar: 'ابدأ الاستكشاف'
  },
  'home.joinCommunity': {
    en: 'Join Our Community',
    ar: 'انضم لمجتمعنا'
  },
  'home.journeyTitle': {
    en: 'Your Journey Begins Here',
    ar: 'رحلتك تبدأ هنا'
  },
  'home.dailyInspiration': {
    en: 'Daily Inspiration',
    ar: 'الإلهام اليومي'
  },
  'home.dailyInspirationDesc': {
    en: 'Discover a new hobby every day that matches your interests and brings joy to your life.',
    ar: 'اكتشف هواية جديدة كل يوم تناسب اهتماماتك وتجلب السعادة لحياتك.'
  },
  'home.journeyTracking': {
    en: 'Journey Tracking',
    ar: 'تتبع الرحلة'
  },
  'home.journeyTrackingDesc': {
    en: 'Keep track of your progress and celebrate your achievements as you explore new hobbies.',
    ar: 'تابع تقدمك واحتفل بإنجازاتك أثناء استكشاف هوايات جديدة.'
  },
  'home.smartDailySystem': {
    en: 'Smart Daily System',
    ar: 'النظام اليومي الذكي'
  },
  'home.smartDailySystemDesc': {
    en: 'Get 4 unique hobbies every day - no duplicates for 2 weeks, then a fresh cycle starts!',
    ar: 'احصل على 4 هوايات فريدة كل يوم - لا تكرار لمدة أسبوعين، ثم تبدأ دورة جديدة!'
  },

  // Featured Activities
  'home.featuredActivities': {
    en: 'Featured Activities',
    ar: 'الأنشطة المميزة'
  },
  'home.quranMemorization': {
    en: 'Qur\'an Memorization',
    ar: 'حفظ القرآن الكريم'
  },
  'home.quranDesc': {
    en: 'Embark on a spiritual journey of memorizing the Holy Qur\'an.',
    ar: 'ابدأ رحلة روحانية لحفظ القرآن الكريم.'
  },
  'home.teabagArt': {
    en: 'Teabag Art',
    ar: 'فن أكياس الشاي'
  },
  'home.teabagDesc': {
    en: 'Create stunning miniature paintings on used teabags.',
    ar: 'اصنع لوحات مصغرة مذهلة على أكياس الشاي المستعملة.'
  },
  'home.natureJournaling': {
    en: 'Nature Journaling',
    ar: 'يوميات الطبيعة'
  },
  'home.natureDesc': {
    en: 'Document outdoor discoveries through artistic sketches and reflections.',
    ar: 'وثق اكتشافات الطبيعة من خلال الرسوم الفنية والتأملات.'
  },

  // Dashboard
  'dashboard.title': {
    en: 'Your Hobby Journey',
    ar: 'رحلة الهوايات الخاصة بك'
  },
  'dashboard.dailyMood': {
    en: 'How are you feeling today?',
    ar: 'كيف تشعر اليوم؟'
  },
  'dashboard.dailyHobbies': {
    en: 'Daily Hobbies',
    ar: 'الهوايات اليومية'
  },
  'dashboard.connectFriends': {
    en: 'Connect & Share with Friends',
    ar: 'تواصل وشارك مع الأصدقاء'
  },
  'dashboard.reflection': {
    en: 'Daily Reflection',
    ar: 'التأمل اليومي'
  },
  'dashboard.assistant': {
    en: 'Your Personal Assistant',
    ar: 'مساعدك الشخصي'
  },

  // Profile
  'profile.title': {
    en: 'My Profile',
    ar: 'ملفي الشخصي'
  },
  'profile.displayName': {
    en: 'Display Name',
    ar: 'الاسم المعروض'
  },
  'profile.username': {
    en: 'Username',
    ar: 'اسم المستخدم'
  },
  'profile.email': {
    en: 'Email',
    ar: 'البريد الإلكتروني'
  },
  'profile.avatar': {
    en: 'Profile Picture',
    ar: 'صورة الملف الشخصي'
  },
  'profile.uploadPhoto': {
    en: 'Upload Photo',
    ar: 'رفع صورة'
  },
  'profile.save': {
    en: 'Save Changes',
    ar: 'حفظ التغييرات'
  },

  // Common
  'common.loading': {
    en: 'Loading...',
    ar: 'جاري التحميل...'
  },
  'common.error': {
    en: 'Error',
    ar: 'خطأ'
  },
  'common.retry': {
    en: 'Try Again',
    ar: 'حاول مرة أخرى'
  },
  'common.save': {
    en: 'Save',
    ar: 'حفظ'
  },
  'common.cancel': {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  'common.close': {
    en: 'Close',
    ar: 'إغلاق'
  },
  'common.next': {
    en: 'Next',
    ar: 'التالي'
  },
  'common.previous': {
    en: 'Previous',
    ar: 'السابق'
  },

  // Language Toggle
  'language.current': {
    en: 'عربي',
    ar: 'English'
  }
}; 