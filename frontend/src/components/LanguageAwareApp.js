import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import HomeAr from '../pages/HomeAr';
import Dashboard from '../pages/Dashboard';
import DashboardAr from '../pages/DashboardAr';
import Navbar from './layout/Navbar';
import NavbarAr from './layout/NavbarAr';
import Footer from './layout/Footer';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HobbyDetail from '../pages/HobbyDetail';
import ChatBot from '../pages/ChatBot';
import DailyReflection from '../pages/DailyReflection';
import UserProfile from './UserProfile';
import ProtectedRoute from './auth/ProtectedRoute';

const LanguageAwareApp = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    // تحديث اتجاه الصفحة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // الاستماع لتغييرات اللغة
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('app_language') || 'en';
      setLanguage(newLang);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language]);

  // اختيار المكونات حسب اللغة
  const NavigationBar = language === 'ar' ? NavbarAr : Navbar;
  const HomePage = language === 'ar' ? HomeAr : Home;
  const DashboardPage = language === 'ar' ? DashboardAr : Dashboard;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hobby/:id"
            element={
              <ProtectedRoute>
                <HobbyDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reflection"
            element={
              <ProtectedRoute>
                <DailyReflection />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default LanguageAwareApp; 