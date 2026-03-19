import { Link, useLocation } from 'react-router-dom';
import { Store, Package, Users, BarChart3, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth, roleModules } from '@/hooks/useAuth';

const allNavItems = [
  { id: 'billing', label: 'Billing', icon: Store, path: '/pos' },
  { id: 'products', label: 'Products', icon: Package, path: '/dashboard' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/dashboard' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard' },
];

export const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const allowed = roleModules[user.role];
  // Always show dashboard + billing first, then filter rest
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    ...allNavItems.filter((item) => allowed.includes(item.id)),
  ].slice(0, 5); // Max 5 items for bottom nav

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && item.id !== 'dashboard' 
            ? false 
            : location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-colors touch-manipulation min-w-[56px] ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
