import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pedidosup_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pedidosup_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Valida a sessão ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          setUser(res.user);
          localStorage.setItem('pedidosup_user', JSON.stringify(res.user));
        } catch (error) {
          console.error('Sessão expirada ou inválida:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('pedidosup_token', data.token);
    localStorage.setItem('pedidosup_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('pedidosup_token', data.token);
    localStorage.setItem('pedidosup_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pedidosup_token');
    localStorage.removeItem('pedidosup_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
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
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
