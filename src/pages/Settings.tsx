import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, User, Store, Shield, Bell, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { BranchSwitcher } from '@/components/branches/BranchSwitcher';
import { useAuth, roleMeta } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';
import { useState } from 'react';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  if (!user) return null;
  const meta = roleMeta[user.role];

  const handleClearLocalData = () => {
    if (!window.confirm('This will clear cached branches, stock, and sales data on this device. Continue?')) return;
    [
      'nexuspos-branches-v1',
      'nexuspos-active-branch-v1',
      'nexuspos-branch-stock-v1',
      'nexuspos-sales-v1',
      'nexuspos-overview-mode-v1',
    ].forEach((k) => localStorage.removeItem(k));
    toast.success('Local cache cleared. Reloading…');
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <MobileDrawer />
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hidden lg:inline-flex">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate">Settings</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Manage your preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BranchSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><User className="w-4 h-4" /> Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                  {user.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className={`text-xs ${meta.color}`}>{meta.label}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }}>
                Sign out
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Theme</Label>
              <p className="text-xs text-muted-foreground">Switch between light, dark, or system</p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Bell className="w-4 h-4" /> Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Push notifications</Label>
                <p className="text-xs text-muted-foreground">Low stock, new sales, refunds</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Sound alerts</Label>
                <p className="text-xs text-muted-foreground">Receipt printer + scanner beeps</p>
              </div>
              <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
            </div>
          </CardContent>
        </Card>

        {(user.role === 'super_admin' || user.role === 'owner') && (
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Store className="w-4 h-4" /> Branches</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Manage branches and the multi-branch overview.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/branches')}>Branches</Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/branches/overview')}>Overview</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(user.role === 'super_admin' || user.role === 'owner' || user.role === 'manager') && (
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Shield className="w-4 h-4" /> Security &amp; Audit</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">View the staff audit log.</p>
              <Button variant="outline" size="sm" onClick={() => navigate('/audit-log')}>Audit Log</Button>
            </CardContent>
          </Card>
        )}

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Database className="w-4 h-4" /> Data</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm">Clear local cache</p>
              <p className="text-xs text-muted-foreground">Removes cached branches, stock, and sales on this device.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleClearLocalData}>Clear</Button>
          </CardContent>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Settings;
