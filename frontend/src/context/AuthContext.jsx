import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('task_token');
    const storedUser = localStorage.getItem('task_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem('task_token');
        localStorage.removeItem('task_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('task_token', receivedToken);
      localStorage.setItem('task_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, confirmPassword) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ name, email, password, confirmPassword });
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('task_token');
    localStorage.removeItem('task_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        isLoading,
        login,
        register,
        logout
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
