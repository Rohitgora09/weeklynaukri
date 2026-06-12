import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.success && res.user && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || 'Login failed');
  };

  const signup = async (name, email, password) => {
    return await api.post('/api/auth/signup', { name, email, password });
  };

  const verifyOtp = async (email, otp) => {
    return await api.post('/api/auth/verify-otp', { email, otp });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminPassword');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    signup,
    verifyOtp,
    logout,
    isAdmin: user?.role === 'admin'
  };
}
