
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ requiresVerification?: boolean; email?: string }>;
  verifyEmail: (email: string, verificationToken: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('Initial auth check:', { storedToken: !!storedToken, storedUser: !!storedUser });
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        console.log('Auth state restored:', userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', emailOrPhone);
      
      const response = await authAPI.login({ emailOrPhone, password });
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        const { token: authToken, user: userData } = response.data;
        
        console.log('Setting auth data:', { token: !!authToken, user: userData });
        
        // Update state first
        setToken(authToken);
        setUser(userData);
        
        // Then update localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Login successful, user set:', userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      setLoading(true);
      console.log('Attempting registration for:', email);
      
      const response = await authAPI.register({ name, email, password, phone });
      console.log('Register response:', response);
      
      if (response.success) {
        if (response.data?.requiresVerification) {
          // Registration successful but requires email verification
          return { requiresVerification: true, email: response.data.email };
        } else if (response.data?.token && response.data?.user) {
          // Registration successful with immediate login (shouldn't happen with email verification)
          const { token: authToken, user: userData } = response.data;
          
          setToken(authToken);
          setUser(userData);
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(userData));
          
          return {};
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
    
    return {};
  };

  const verifyEmail = async (email: string, verificationToken: string) => {
    try {
      setLoading(true);
      console.log('Attempting email verification for:', email);
      
      const response = await authAPI.verifyEmail({ email, verificationToken });
      console.log('Verification response:', response);
      
      if (response.success && response.data) {
        const { token: authToken, user: userData } = response.data;
        
        console.log('Setting auth data after verification:', { token: !!authToken, user: userData });
        
        // Update state first
        setToken(authToken);
        setUser(userData);
        
        // Then update localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Email verification successful, user set:', userData);
      } else {
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw new Error(error.message || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    try {
      setLoading(true);
      await authAPI.resendVerification(email);
    } catch (error: any) {
      console.error('Resend verification error:', error);
      throw new Error(error.message || 'Failed to resend verification');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    verifyEmail,
    resendVerification,
    logout,
    loading,
  };

  console.log('Auth context value:', { user: !!user, token: !!token, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
