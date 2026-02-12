import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircle, Shield, ShieldCheck, ShieldAlert, Check, X, ArrowLeft,
  LayoutDashboard, Store, Package, Receipt, Users, BarChart3, Settings, LogOut, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { useAuth, roleModules, roleMeta } from '@/hooks/useAuth';
import { staffMembers } from '@/data/staffData';

const permissionLabels: Record<string, string> = {
  canOverridePrice: 'Price Override',
  canApplyDiscount: 'Apply Discount',
  canProcessRefund: 'Process Refund',
  canVoidTransaction: 'Void Transaction',
  canAccessReports: 'Access Reports',
};

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  admin: 'destructive',
  manager: 'default',
  cashier: 'secondary',
};

const StaffManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const allowed = roleModules[user.role];
  const meta = roleMeta[user.role];
  const handleLogout = () => { logout(); navigate('/login'); };

  const BoolIcon = ({ value }: { value: boolean }) =>
    value ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-destructive/50 mx-auto" />;

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-card border-r border-border/50 z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">NexusPOS</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          {allowed.includes('billing') && (
            <Link to="/pos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Store className="w-5 h-5" /> POS Terminal
            </Link>
          )}
          {allowed.includes('staff') && (
            <Link to="/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium">
              <UserCircle className="w-5 h-5" /> Staff
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-border/50">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MobileDrawer />
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Staff Management</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Manage team roles & permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-xs md:text-sm">
                {user.avatar}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {(['admin', 'manager', 'cashier'] as const).map((role) => {
              const count = staffMembers.filter((s) => s.role === role).length;
              return (
                <Card key={role} className="glass-card border-border/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl md:text-3xl font-bold">{count}</p>
                    <p className="text-xs md:text-sm text-muted-foreground capitalize">{role}s</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Staff Table - Desktop */}
          <Card className="glass-card border-border/50 hidden md:block">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">All Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Price Override</TableHead>
                    <TableHead className="text-center">Discount</TableHead>
                    <TableHead className="text-center">Max Discount</TableHead>
                    <TableHead className="text-center">Refund</TableHead>
                    <TableHead className="text-center">Void</TableHead>
                    <TableHead className="text-center">Reports</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>
                        <Badge variant={roleBadgeVariant[staff.role] || 'outline'} className="capitalize">
                          {staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell><BoolIcon value={staff.permissions.canOverridePrice} /></TableCell>
                      <TableCell><BoolIcon value={staff.permissions.canApplyDiscount} /></TableCell>
                      <TableCell className="text-center text-sm">{staff.permissions.maxDiscountPercent}%</TableCell>
                      <TableCell><BoolIcon value={staff.permissions.canProcessRefund} /></TableCell>
                      <TableCell><BoolIcon value={staff.permissions.canVoidTransaction} /></TableCell>
                      <TableCell><BoolIcon value={staff.permissions.canAccessReports} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Staff Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {staffMembers.map((staff) => (
              <Card key={staff.id} className="glass-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{staff.name}</p>
                        <Badge variant={roleBadgeVariant[staff.role] || 'outline'} className="capitalize text-[10px] mt-0.5">
                          {staff.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        {(staff.permissions as any)[key] ? (
                          <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-destructive/40 flex-shrink-0" />
                        )}
                        <span className="text-muted-foreground">{label}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">Max: {staff.permissions.maxDiscountPercent}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default StaffManagement;
