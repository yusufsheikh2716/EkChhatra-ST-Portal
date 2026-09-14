import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ekchhatra_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosClient.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        // If token expired, clear
        localStorage.removeItem('ekchhatra_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axiosClient.post('/api/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('ekchhatra_token', access_token);
      setToken(access_token);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}! Johar 🙏`, {
        style: { background: '#1a1a2e', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Login failed' };
    }
  };

  const loginDemo = async () => {
    return await login('demo@ekchhatra.in', 'demo123');
  };

  const register = async (userData) => {
    try {
      const res = await axiosClient.post('/api/auth/register', userData);
      const { access_token, user: newUser } = res.data;
      localStorage.setItem('ekchhatra_token', access_token);
      setToken(access_token);
      setUser(newUser);
      toast.success(`Welcome to EkChhatra, ${newUser.name}! Registration complete 🎉`, {
        style: { background: '#1a1a2e', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ekchhatra_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully', {
      style: { background: '#1a1a2e', color: '#94a3b8' }
    });
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginDemo, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
