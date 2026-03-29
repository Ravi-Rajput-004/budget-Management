import axios from 'axios';

const getApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  if (!envUrl.includes('/api')) {
    envUrl = envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`;
  }
  
  return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the User ID
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('budget_user');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    config.headers['x-user-id'] = user._id;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  login: (credentials) => api.post('auth/login', credentials),
  register: (userData) => api.post('auth/register', userData),
};

export const budgetService = {
  getBudget: (month, year) => api.get(`budget?month=${month}&year=${year}`),
  updateBudget: (budgetData) => api.post('budget', budgetData), // amount, threshold, month, year
};

export const expenseService = {
  getExpenses: (month, year) => api.get(`expenses?month=${month}&year=${year}`),
  addExpense: (expenseData) => api.post('expenses', expenseData),
  deleteExpense: (id) => api.delete(`expenses/${id}`),
  getStats: (month, year) => api.get(`expenses/stats?month=${month}&year=${year}`),
};

export default api;
