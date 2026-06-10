import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Store, Package, Receipt, Users, BarChart3, Settings, LogOut, Menu, X, UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth, roleModules, roleMeta } from '@/hooks/useAuth';

const allMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'billing', label: 'POS Terminal', icon: Store, path: '/pos' },
  { id: 'inventory', label: 'Inventory', icon: Receipt, path: '/inventory' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'branches', label: 'Branches', icon: Store, path: '/branches' },
  { id: 'branches', label: 'Multi-Branch View', icon: BarChart3, path: '/branches/overview', key: 'branches-overview' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'staff', label: 'Staff', icon: UserCircle, path: '/staff' },
];

export const MobileDrawer = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const allowed = ['dashboard', ...roleModules[user.role]];
  const menuItems = allMenuItems.filter((item) => allowed.includes(item.id));
  const meta = roleMeta[user.role];

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        {/* User info */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className={`text-xs ${meta.color}`}>{meta.label}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors touch-manipulation ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full touch-manipulation"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
