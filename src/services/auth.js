import api from './api';

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/api/auth/signin', {
        username,
        password
      });
      
      // Handle the response cookie (JWT token will be set automatically via cookie)
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/auth/signout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  isAuthenticated: () => {
    // Check if we have a token (either in cookies or localStorage)
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] || localStorage.getItem('token');
    
    return !!token;
  },

  isAdmin: async () => {
    try {
      const response = await api.get('/api/auth/user');
      return response.data.roles.includes('ROLE_ADMIN');
    } catch (error) {
      return false;
    }
  }
};

export default authService;