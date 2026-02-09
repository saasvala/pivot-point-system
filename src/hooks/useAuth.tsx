import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'super_admin' | 'owner' | 'manager' | 'cashier';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

const roleProfiles: Record<UserRole, AuthUser> = {
  super_admin: { id: 'u1', name: 'Super Admin', role: 'super_admin', avatar: 'SA' },
  owner: { id: 'u2', name: 'Business Owner', role: 'owner', avatar: 'BO' },
  manager: { id: 'u3', name: 'Maria Garcia', role: 'manager', avatar: 'MG' },
  cashier: { id: 'u4', name: 'Alex Johnson', role: 'cashier', avatar: 'AJ' },
};

export const roleModules: Record<UserRole, string[]> = {
  super_admin: ['billing', 'products', 'inventory', 'customers', 'reports', 'settings', 'staff'],
  owner: ['billing', 'products', 'inventory', 'customers', 'reports', 'settings'],
  manager: ['billing', 'products', 'inventory', 'customers', 'reports'],
  cashier: ['billing', 'products', 'customers'],
};

export const roleMeta: Record<UserRole, { label: string; color: string; icon: string }> = {
  super_admin: { label: 'Super Admin', color: 'text-destructive', icon: '🛡️' },
  owner: { label: 'Business Owner', color: 'text-primary', icon: '👑' },
  manager: { label: 'Manager', color: 'text-secondary', icon: '📊' },
  cashier: { label: 'Cashier', color: 'text-success', icon: '🧾' },
};

interface AuthContextType {
  user: AuthUser | null;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginAs: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem('pos-auth');
    return saved ? JSON.parse(saved) : null;
  });

  const loginAs = useCallback((role: UserRole) => {
    const profile = roleProfiles[role];
    setUser(profile);
    sessionStorage.setItem('pos-auth', JSON.stringify(profile));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('pos-auth');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
