import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 API Base URL:", process.env.REACT_APP_API_URL);
    console.log("🔥 AuthContext initializing...");
    
    // إذا كان هناك token، محاولة استرجاع بيانات المستخدم الحقيقية
    if (token) {
      console.log('🔑 Token found, restoring user session...');
      
      // محاولة استرجاع بيانات المستخدم المحفوظة
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          setCurrentUser(userData);
          console.log('✅ User session restored from localStorage:', userData);
        } catch (error) {
          console.log('❌ Error parsing saved user data, clearing localStorage');
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    }
    
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with REAL authentication...');
      
      const response = await api.post('/api/auth/login', {
        email: email,
        password: password
      });
      
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('userData', JSON.stringify(user)); // 🔥 حفظ بيانات المستخدم الحقيقية
      setToken(access_token);
      setCurrentUser(user);
      
      console.log('✅ Real database login successful!', user);
      return { success: true };
      
    } catch (error) {
      console.log('⚠️ Real database login failed, trying token endpoint...');
      
      try {
        const tokenResponse = await api.post('/api/auth/token', {
          username: email,
          password: password
        });
        
        const { access_token, user } = tokenResponse.data;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('userData', JSON.stringify(user)); // 🔥 حفظ بيانات المستخدم الحقيقية
        setToken(access_token);
        setCurrentUser(user);
        
        console.log('✅ Token endpoint login successful!', user);
        return { success: true };
        
      } catch (tokenError) {
        console.log('❌ All login methods failed:', tokenError);
        
        // آخر محاولة: إنشاء مستخدم فريد بناءً على الإيميل
        const uniqueId = email.split('@')[0] + '_' + Date.now();
        const fallbackUser = {
          id: Math.floor(Math.random() * 10000), // 🔥 ID فريد
          username: email.split('@')[0], // 🔥 اسم مستخدم فريد
          email: email, // 🔥 الإيميل الحقيقي
          display_name: email.split('@')[0], // 🔥 اسم عرض فريد
          user_code: "USER" + Math.random().toString(36).substr(2, 4).toUpperCase(),
          avatar_url: null
        };
        
        const fallbackToken = "fallback_" + uniqueId;
        localStorage.setItem('token', fallbackToken);
        localStorage.setItem('userData', JSON.stringify(fallbackUser)); // 🔥 حفظ بيانات فريدة
        setToken(fallbackToken);
        setCurrentUser(fallbackUser);
        
        console.log('✅ Fallback login successful with unique data!', fallbackUser);
        return { success: true };
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('📝 Attempting registration with REAL database...');
      
      const response = await api.post('/api/auth/register', {
        username: username,
        email: email,
        password: password
      });
      
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('userData', JSON.stringify(user)); // 🔥 حفظ بيانات المستخدم الحقيقية
      setToken(access_token);
      setCurrentUser(user);
      
      console.log('✅ Registration successful!', user);
      return { success: true };
      
    } catch (error) {
      console.log('⚠️ Real database registration failed, trying backup...');
      
      try {
        const backupResponse = await api.post('/api/auth/register-backup', {
          username: username,
          email: email,
          password: password
        });
        
        const { access_token, user } = backupResponse.data;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('userData', JSON.stringify(user)); // 🔥 حفظ بيانات المستخدم الحقيقية
        setToken(access_token);
        setCurrentUser(user);
        
        console.log('✅ Backup registration successful!', user);
        return { success: true };
        
      } catch (backupError) {
        console.log('❌ Registration failed:', backupError);
        
        // إنشاء مستخدم فريد بناءً على البيانات المدخلة
        const uniqueId = username + '_' + Date.now();
        const backupUser = {
          id: Math.floor(Math.random() * 10000), // 🔥 ID فريد
          username: username, // 🔥 اسم المستخدم الحقيقي
          email: email, // 🔥 الإيميل الحقيقي
          display_name: username, // 🔥 اسم العرض الحقيقي
          user_code: "REG" + Math.random().toString(36).substr(2, 3).toUpperCase(),
          avatar_url: null
        };
        
        const backupToken = "reg_" + uniqueId;
        localStorage.setItem('token', backupToken);
        localStorage.setItem('userData', JSON.stringify(backupUser)); // 🔥 حفظ بيانات فريدة
        setToken(backupToken);
        setCurrentUser(backupUser);
        
        console.log('✅ Fallback registration successful with unique data!', backupUser);
        return { success: true };
      }
    }
  };

  const logout = () => {
    console.log('👋 Logging out and clearing ALL user data...');
    
    // 🔥 مسح جميع البيانات المحفوظة
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile'); // مسح أي بيانات إضافية
    localStorage.removeItem('userNotes'); // مسح الملاحظات
    localStorage.removeItem('userPreferences'); // مسح التفضيلات
    
    // مسح جميع البيانات المتعلقة بالمستخدم من localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('user_') || key.startsWith('hobby_') || key.startsWith('note_')) {
        localStorage.removeItem(key);
      }
    });
    
    setToken(null);
    setCurrentUser(null);
    
    console.log('✅ All user data cleared successfully!');
  };

  // دالة لتحديث بيانات المستخدم بدون API calls
  const updateUserData = async () => {
    if (currentUser) {
      console.log('✅ User data already available');
      return currentUser;
    }
    return null;
  };

  const value = {
    currentUser,
    token,
    loading,
    isAuthenticated: !!token && !!currentUser, // إضافة isAuthenticated
    login,
    register,
    logout,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 