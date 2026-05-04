import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (credentials: any) => Promise<any>;
  verifyOtp: (data: { user_id: string | number, otp: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await AuthService.getMe();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to restore auth session', err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await AuthService.login(credentials);
      return response; // Return the response to get user_id for OTP step
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const verifyOtp = async (data: { user_id: string | number, otp: string }) => {
    try {
      const response = await AuthService.verifyOtp(data);
      const { token, user: userData } = response;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser(userData || { id: data.user_id });
    } catch (error) {
      console.error('OTP Verification failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
