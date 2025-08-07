import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create an axios instance with default config
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL:', API_BASE_URL); // Debug log

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      console.error('Error fetching user data:', error);
      logout();
      setLoading(false);
      return null;
    }
  };

  const updateUserData = async () => {
    return await fetchUserData();
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/token', 
        new URLSearchParams({
          'username': username,
          'password': password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // The server responded with an error
        const errorMessage = error.response.data?.detail || 'Invalid credentials';
      return { success: false, error: errorMessage };
      } else if (error.request) {
        // The request was made but no response was received
        return { success: false, error: 'No response from server. Please try again.' };
      } else {
        // Something happened in setting up the request
        return { success: false, error: 'An error occurred. Please try again.' };
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Handle validation errors from FastAPI
        if (error.response.data && error.response.data.detail) {
          if (typeof error.response.data.detail === 'string') {
            return { success: false, error: error.response.data.detail };
          }
          if (Array.isArray(error.response.data.detail)) {
            // Join multiple validation errors into a single message
            const errorMessage = error.response.data.detail
              .map(err => err.msg)
              .join('. ');
      return { success: false, error: errorMessage };
          }
        }
        // Handle other error responses
        return { success: false, error: 'Registration failed: ' + (error.response.data?.detail || error.response.statusText) };
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
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    api,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 