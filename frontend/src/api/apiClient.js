import axios from 'axios';

// Get guest ID from localStorage or create a unique one
const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now();
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization header and guestId
apiClient.interceptors.request.use(
  (config) => {
    const isLoggedOut = localStorage.getItem('isLoggedOut');
    const token = localStorage.getItem('token');
    if (token && isLoggedOut !== 'true') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-guest-id'] = getGuestId();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Keep user and token in localStorage as requested
    return Promise.reject(error);
  }
);

export default apiClient;
