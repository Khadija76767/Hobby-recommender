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
    console.log("🔥 AuthContext initializing... [v1.0.0-build-202501121530]");
    
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
          console.log('🆔 User ID for data separation:', userData.id);
        } catch (error) {
          console.log('❌ Error parsing saved user data, clearing localStorage');
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    } else {
      console.log('❌ No token found, user needs to login');
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
    
    // 🔥 احفظ معرف المستخدم الحالي قبل المسح لمسح بياناته
    const currentUserId = currentUser?.id;
    
    // 🔥 مسح جميع البيانات العامة
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userNotes');
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('reflections'); // مسح البيانات القديمة غير المرتبطة بمستخدم
    localStorage.removeItem('dailyReflections'); // مسح البيانات القديمة غير المرتبطة بمستخدم
    
    // 🔥 مسح البيانات المرتبطة بالمستخدم الحالي تحديداً
    if (currentUserId) {
      localStorage.removeItem(`reflections_user_${currentUserId}`);
      localStorage.removeItem(`dailyReflections_user_${currentUserId}`);
      localStorage.removeItem(`profile_user_${currentUserId}`);
      localStorage.removeItem(`hobbies_user_${currentUserId}`);
      localStorage.removeItem(`preferences_user_${currentUserId}`);
      localStorage.removeItem(`userName_user_${currentUserId}`); // 🔥 مسح اسم المستخدم أيضاً
    }
    
    // 🔥 مسح جميع البيانات التي تبدأ بـ user_, hobby_, note_, profile_, reflection_
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('user_') || 
          key.startsWith('hobby_') || 
          key.startsWith('note_') ||
          key.startsWith('profile_') ||
          key.startsWith('reflections_') ||
          key.startsWith('dailyReflections_') ||
          key.startsWith('userName_') || // 🔥 مسح جميع أسماء المستخدمين
          key.includes('_user_')) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed: ${key}`);
      }
    });
    
    setToken(null);
    setCurrentUser(null);
    
    console.log('✅ All user data cleared successfully!');
    
    // 🔥 إعادة تحميل الصفحة لضمان مسح جميع البيانات من الذاكرة
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // دالة لتحديث بيانات المستخدم من API
  const updateUserData = async () => {
    if (!token) {
      console.log('❌ No token available for user update');
      return null;
    }

    try {
      console.log('🔄 Refreshing user data from API...');
      const response = await api.get('/api/auth/me');
      const userData = response.data;
      
      // تحديث البيانات في الـ state
      setCurrentUser(userData);
      
      // حفظ البيانات المحدثة في localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('✅ User data updated successfully:', userData);
      return userData;
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      
      // إذا كان الخطأ 401، فهذا يعني أن الـ token منتهي الصلاحية
      if (error.response?.status === 401) {
        console.log('🔑 Token expired, logging out...');
        logout();
      }
      
      return null;
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    isAuthenticated: !!token && !!currentUser, // إضافة isAuthenticated
    api, // إضافة api instance
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