import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Listen for auth errors (401/403)
    const handleAuthError = (event) => {
      console.warn('Auth error detected:', event.detail);
      setUser(null);
      // Show error message or redirect could be handled here
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login({ correo: email, contraseña: password });

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || { email, role: getRoleFromEmail(email) }));
        setUser(response.user || { email, role: getRoleFromEmail(email) });
        return { success: true };
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const backendUserData = {
        nombre: userData.username,
        correo: userData.email,
        contraseña: userData.password,
      };
      await apiService.register(backendUserData);

      // Note: The backend register doesn't return a token, it just creates the user
      // So we don't set the user as logged in after registration
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await apiService.forgotPassword({ correo: email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password failed:', error);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await apiService.resetPassword({ token, nuevaContraseña: newPassword });
      return { success: true };
    } catch (error) {
      console.error('Reset password failed:', error);
      return { success: false, error: error.message };
    }
  };

  const getRoleFromEmail = (email) => {
    if (email.toLowerCase().includes('admin')) return 'Admin';
    if (email.toLowerCase().includes('mesero')) return 'Mesero';
    if (email.toLowerCase().includes('cocinero')) return 'Cocinero';
    return 'Mesero'; // default
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
