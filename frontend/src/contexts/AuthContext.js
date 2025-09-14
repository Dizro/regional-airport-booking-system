import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ role: decoded.role, userId: decoded.userId, fullName: decoded.fullName });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    const res = await authService.login(data);
    const { token } = res.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ role: decoded.role, userId: decoded.userId, fullName: decoded.fullName });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const register = async (data) => {
    await authService.register(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };
  
  const updateUserContext = (newUserData) => {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        const updatedUser = { ...user, ...newUserData, role: decoded.role, userId: decoded.userId };
        setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};