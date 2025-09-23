import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: 'free' | 'pro';
    notesCount: number;
    notesLimit?: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  updateTenant: (updates: Partial<User['tenant']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication service - Replace with Supabase integration
const mockAuth = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data based on predefined test accounts
    const users: Record<string, User> = {
      'admin@acme.test': {
        id: '1',
        email: 'admin@acme.test',
        role: 'admin',
        tenant: {
          id: 'acme',
          name: 'Acme Corporation',
          slug: 'acme',
          plan: 'free',
          notesCount: 2,
          notesLimit: 3,
        },
      },
      'user@acme.test': {
        id: '2',
        email: 'user@acme.test',
        role: 'member',
        tenant: {
          id: 'acme',
          name: 'Acme Corporation',
          slug: 'acme',
          plan: 'free',
          notesCount: 2,
          notesLimit: 3,
        },
      },
      'admin@globex.test': {
        id: '3',
        email: 'admin@globex.test',
        role: 'admin',
        tenant: {
          id: 'globex',
          name: 'Globex Corporation',
          slug: 'globex',
          plan: 'pro',
          notesCount: 15,
        },
      },
      'user@globex.test': {
        id: '4',
        email: 'user@globex.test',
        role: 'member',
        tenant: {
          id: 'globex',
          name: 'Globex Corporation',
          slug: 'globex',
          plan: 'pro',
          notesCount: 15,
        },
      },
    };

    if (password !== 'password') {
      throw new Error('Invalid password');
    }

    const user = users[email];
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await mockAuth.login(email, password);
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateTenant = (updates: Partial<User['tenant']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        tenant: { ...user.tenant, ...updates },
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      error,
      updateTenant,
    }}>
      {children}
    </AuthContext.Provider>
  );
};