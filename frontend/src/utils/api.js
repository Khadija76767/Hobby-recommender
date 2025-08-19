import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // تعطيل الخروج التلقائي - دع AuthContext يتعامل مع الأخطاء
    console.log('⚠️ API Error intercepted but not auto-logging out:', error.response?.status);
    
    // فقط log الخطأ بدون إجراءات
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized detected, but staying logged in');
    }
    
    return Promise.reject(error);
  }
);

export default api; 