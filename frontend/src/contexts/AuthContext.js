import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true
});

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 API Base URL:", process.env.REACT_APP_API_URL);
    console.log("🔥 Using REAL database system!");
    
    // If we have a token, set up axios headers and fetch user data
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const [meResponse, profileResponse] = await Promise.all([
        api.get('/api/auth/me'),
        api.get('/api/auth/profile')
      ]);
      
      // Merge me and profile data
      const userData = {
        ...meResponse.data,
        ...profileResponse.data
      };
      
      setCurrentUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      console.log('🔄 Falling back to backup endpoints if needed...');
      logout();
      setLoading(false);
      return null;
    }
  };

  const updateUserData = async () => {
    return await fetchUserData();
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with REAL authentication...');
      
      // Try the real database login first
      try {
        const response = await api.post('/api/auth/login', {
          username: email,  // استخدام username للتوافق مع Backend
          password: password
        });
        
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setCurrentUser(user);
        console.log('✅ Real database login successful!');
        return { success: true };
      } catch (realError) {
        console.log('⚠️ Real database login failed, trying token endpoint...');
        
        // Fallback to token endpoint
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await api.post('/api/auth/token', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setCurrentUser(user);
        console.log('✅ Token-based login successful!');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ All login methods failed:', error);
      if (error.response) {
        const errorMessage = error.response.data?.detail || 'Invalid credentials';
        return { success: false, error: errorMessage };
      } else if (error.request) {
        return { success: false, error: 'No response from server. Please try again.' };
      } else {
        return { success: false, error: 'An error occurred. Please try again.' };
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('📝 Attempting registration with REAL database...');
      
      // Try real database registration first
      try {
        const response = await api.post('/api/auth/register', {
          username: username,
          email: email,
          password: password
        });
        
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setCurrentUser(user);
        console.log('✅ Real database registration successful!');
        return { success: true };
      } catch (realError) {
        console.log('⚠️ Real database registration failed, trying backup...');
        
        // Fallback for registration
        const response = await api.post('/api/auth/register-backup', {
          username: username,
          email: email,
          password: password
        });
        
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setCurrentUser(user);
        console.log('✅ Backup registration successful!');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Registration failed:', error);
      if (error.response) {
        const errorMessage = error.response.data?.detail || 'Registration failed';
        return { success: false, error: errorMessage };
      } else if (error.request) {
        return { success: false, error: 'No response from server. Please try again.' };
      } else {
        return { success: false, error: 'An error occurred. Please try again.' };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    console.log('�� User logged out');
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    updateUserData,
    api // Export the configured axios instance
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 