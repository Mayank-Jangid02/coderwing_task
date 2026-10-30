import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const isLoggedOut = localStorage.getItem('isLoggedOut');
      if (isLoggedOut === 'true') return null;
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const isLoggedOut = localStorage.getItem('isLoggedOut');
    if (isLoggedOut === 'true') return null;
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const isLoggedOut = localStorage.getItem('isLoggedOut');
      const storedToken = localStorage.getItem('token');
      if (storedToken && isLoggedOut !== 'true') {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            saveUserDataToStorage(res.data.user, storedToken);
          }
        } catch (err) {
          console.warn('Session verification warning:', err?.response?.data?.message);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const saveUserDataToStorage = (userData, userToken) => {
    localStorage.removeItem('isLoggedOut');
    if (userToken) {
      localStorage.setItem('token', userToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.name) localStorage.setItem('name', userData.name);
      if (userData.email) localStorage.setItem('email', userData.email);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      saveUserDataToStorage(userData, userToken);
      return { success: true, message: res.data.message || 'Logged in successfully' };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      throw new Error(errorMsg);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      saveUserDataToStorage(userData, userToken);
      return { success: true, message: res.data.message || 'Registration successful' };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem('isLoggedOut', 'true');
    // Keep token and user data (name, email, user) in localStorage as requested!
    // We intentionally do NOT call localStorage.removeItem('token') or localStorage.removeItem('user').
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
