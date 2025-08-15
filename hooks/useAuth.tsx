import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../utils/api';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('rimna_token');
    if (token) {
      authAPI.getCurrentUser()
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          Cookies.remove('rimna_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      Cookies.set('rimna_token', token, { expires: 7 });
      setUser(user);
      
      // Return user data so it can be used immediately after login
      return user;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      Cookies.set('rimna_token', token, { expires: 7 });
      setUser(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('rimna_token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoading,
      error,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
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