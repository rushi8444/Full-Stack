import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
    : 'https://full-stack-t4rd.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthorized / expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (error.response.data?.message?.toLowerCase().includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to extract human-readable error messages
export const getErrorMessage = (error) => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((e) => e.message).join(' | ');
  }
  return error.response?.data?.message || error.response?.data?.error || error.message || 'An unexpected error occurred.';
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

export const usersApi = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updatePassword: (data) => api.put('/users/update-password', data),
};

export const storesApi = {
  getStores: (params) => api.get('/stores', { params }),
  createStore: (data, role) => {
    // System Administrator uses /create-store, Store Owner uses /
    if (role === 'System Administrator') {
      return api.post('/stores/create-store', data);
    }
    return api.post('/stores', data);
  },
};

export const ratingsApi = {
  submitRating: (data) => api.post('/ratings', data),
  getOwnerDashboard: () => api.get('/ratings/owner-dashboard'),
  getAdminDashboard: () => api.get('/ratings/admin-dashboard'),
};

export default api;
