import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffMembers } from '@/data/staffData';
import { setActiveBranch, getBranches, setAllowedBranches } from '@/data/branchStore';

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
  super_admin: ['billing', 'products', 'inventory', 'customers', 'reports', 'settings', 'staff', 'branches'],
  owner: ['billing', 'products', 'inventory', 'customers', 'reports', 'settings', 'branches'],
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

const applyBranchLock = (profile: AuthUser) => {
  if (profile.role === 'cashier') {
    const staffRecord =
      staffMembers.find((s) => s.role === 'cashier' && s.name === profile.name) ||
      staffMembers.find((s) => s.role === 'cashier');
    const assigned = staffRecord?.branchIds ?? [];
    // Restrict the visible branch list to the cashier's assignment
    setAllowedBranches(assigned.length ? assigned : null);
    const all = getBranches();
    const target = assigned.find((id) => all.some((b) => b.id === id)) || all[0]?.id;
    if (target) setActiveBranch(target);
  } else {
    // Owners / admins / managers see every branch
    setAllowedBranches(null);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem('pos-auth');
    return saved ? JSON.parse(saved) : null;
  });

  // Re-apply branch lock on mount (e.g. page refresh while cashier logged in)
  useEffect(() => {
    if (user) applyBranchLock(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginAs = useCallback((role: UserRole) => {
    const profile = roleProfiles[role];
    setUser(profile);
    sessionStorage.setItem('pos-auth', JSON.stringify(profile));
    applyBranchLock(profile);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('pos-auth');
    setAllowedBranches(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
