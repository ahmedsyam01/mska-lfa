import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Function to get the correct API URL dynamically
const getApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const isRailway = typeof window !== 'undefined' && window.location.hostname.includes('railway.app');
  
  // Temporary: Force Railway URL when on Railway domain (regardless of env var)
  const finalUrl = isRailway 
    ? 'https://rimna-backend-production.up.railway.app'
    : envUrl || 'http://localhost:3001';
    
  // Debug logging for Railway
  if (typeof window !== 'undefined') {
    console.log('🔍 API Configuration Debug:');
    console.log('NEXT_PUBLIC_API_URL:', envUrl);
    console.log('Window hostname:', window.location.hostname);
    console.log('Is Railway?:', isRailway);
    console.log('Is localhost env?:', envUrl === 'http://localhost:3001');
    console.log('API_BASE_URL (final):', finalUrl);
    console.log('Final API URL:', `${finalUrl}/api`);
    console.log('🚨 FORCED Railway URL when on Railway domain');
  }
  
  return finalUrl;
};

// Create axios instance with dynamic URL
export const api = axios.create({
  timeout: 30000, // 30 second timeout for Railway
  withCredentials: false, // Disable for Railway CORS compatibility
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and set dynamic baseURL
api.interceptors.request.use(
  (config) => {
    // Set the baseURL dynamically for each request
    const apiUrl = getApiUrl();
    config.baseURL = `${apiUrl}/api`;
    
    // Extra debug logging for each request
    if (typeof window !== 'undefined') {
      console.log(`🚀 Making request to: ${config.baseURL}${config.url || ''}`);
      console.log(`🔗 Full URL: ${config.baseURL}${config.url || ''}${config.params ? '?' + new URLSearchParams(config.params).toString() : ''}`);
    }
    
    const token = Cookies.get('rimna_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling with Railway support
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Enhanced error handling for Railway deployment
    if (error.response?.status === 401) {
      Cookies.remove('rimna_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    // Handle Railway-specific errors
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout - Railway service may be sleeping');
    }
    
    if (error.response?.status >= 500) {
      console.error('Server error - Railway service may be restarting');
    }
    
    return Promise.reject(error);
  }
);

// API Functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => api.post('/auth/register', userData),
  
  getCurrentUser: () => api.get('/auth/me'),
};

export const articlesAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => api.get('/articles', { params }),
  
  getById: (id: string) => api.get(`/articles/${id}`),
  
  create: (articleData: any) => api.post('/articles', articleData),
  
  update: (id: string, articleData: any) => api.put(`/articles/${id}`, articleData),
  
  delete: (id: string) => api.delete(`/articles/${id}`),
  
  like: (id: string) => api.post(`/articles/${id}/like`),
  
  addComment: (id: string, comment: { content: string; contentAr?: string }) =>
    api.post(`/articles/${id}/comments`, comment),
};

export const celebritiesAPI = {
  getAll: () => api.get('/celebrities'),
  
  getById: (id: string) => api.get(`/celebrities/${id}`),
  
  create: (data: any) => api.post('/celebrities', data),
  
  update: (id: string, data: any) => api.put(`/celebrities/${id}`, data),
  
  delete: (id: string) => api.delete(`/celebrities/${id}`),
};

export const newsSourcesAPI = {
  getAll: () => api.get('/news-sources'),
  
  getRankings: () => api.get('/news-sources/rankings'),
};

export const trendingAPI = {
  getTopics: (weekOf?: string) => api.get('/trending', { params: { weekOf } }),
  
  createTopic: (data: any) => api.post('/trending', data),
};

export const reportsAPI = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/reports', { params }),
  
  getById: (id: string) => api.get(`/reports/${id}`),
  
  create: (data: any) => api.post('/reports', data),
  
  update: (id: string, data: any) => api.put(`/reports/${id}`, data),
  
  approve: (id: string) => api.patch(`/reports/${id}/approve`),
  
  reject: (id: string, reason: string) => api.patch(`/reports/${id}/reject`, { reason }),
};

export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  approveContent: (contentType: string, contentId: string) => 
    api.post(`/admin/${contentType}/${contentId}/approve`),
  
  rejectContent: (contentType: string, contentId: string, reason?: string) => 
    api.post(`/admin/${contentType}/${contentId}/reject`, { reason }),
}; 