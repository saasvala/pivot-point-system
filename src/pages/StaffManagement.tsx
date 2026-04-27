import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle, Shield, ShieldCheck, Check, X, Plus, Pencil, Trash2,
  LayoutDashboard, Store, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { useAuth, roleModules } from '@/hooks/useAuth';
import { staffMembers as initialStaff } from '@/data/staffData';
import { addAuditEntry } from '@/data/auditLog';
import { useBranches } from '@/data/branchStore';
import { Checkbox } from '@/components/ui/checkbox';
import { StaffMember, StaffPermissions, StaffRole } from '@/types/pos';
import { toast } from 'sonner';

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

const defaultPermissions: StaffPermissions = {
  canOverridePrice: false,
  canApplyDiscount: true,
  maxDiscountPercent: 10,
  canProcessRefund: false,
  canVoidTransaction: false,
  canAccessReports: false,
};

const StaffManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { branches } = useBranches();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPin, setFormPin] = useState('');
  const [formRole, setFormRole] = useState<StaffRole>('cashier');
  const [formPerms, setFormPerms] = useState<StaffPermissions>(defaultPermissions);
  const [formBranchIds, setFormBranchIds] = useState<string[]>([]);

  if (!user) return null;

  const allowed = roleModules[user.role];

  const openAddForm = () => {
    setEditingStaff(null);
    setFormName('');
    setFormPin('');
    setFormRole('cashier');
    setFormPerms({ ...defaultPermissions });
    setFormBranchIds([]);
    setIsFormOpen(true);
  };

  const openEditForm = (s: StaffMember) => {
    setEditingStaff(s);
    setFormName(s.name);
    setFormPin(s.pin);
    setFormRole(s.role);
    setFormPerms({ ...s.permissions });
    setFormBranchIds(s.branchIds ?? []);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || formPin.length !== 4) {
      toast.error('Name and 4-digit PIN are required');
      return;
    }
    // Check PIN uniqueness
    const pinConflict = staff.find(s => s.pin === formPin && s.id !== editingStaff?.id);
    if (pinConflict) {
      toast.error('PIN already in use by another staff member');
      return;
    }

    if (editingStaff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? {
        ...s, name: formName, pin: formPin, role: formRole, permissions: { ...formPerms }, branchIds: [...formBranchIds],
      } : s));
      addAuditEntry(user.id, user.name, 'STAFF_EDITED', `Edited staff: ${formName} (${formRole})`);
      toast.success(`Updated ${formName}`);
    } else {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: formName,
        pin: formPin,
        role: formRole,
        permissions: { ...formPerms },
        branchIds: [...formBranchIds],
      };
      setStaff(prev => [...prev, newStaff]);
      addAuditEntry(user.id, user.name, 'STAFF_ADDED', `Added staff: ${formName} (${formRole})`);
      toast.success(`Added ${formName}`);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStaff(prev => prev.filter(s => s.id !== deleteTarget.id));
    addAuditEntry(user.id, user.name, 'STAFF_DELETED', `Deleted staff: ${deleteTarget.name}`);
    toast.success(`Removed ${deleteTarget.name}`);
    setDeleteTarget(null);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const BoolIcon = ({ value }: { value: boolean }) =>
    value ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-destructive/50 mx-auto" />;

  const togglePerm = (key: keyof StaffPermissions) => {
    setFormPerms(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
              <Button size="sm" className="gap-1.5" onClick={openAddForm}>
                <Plus className="w-4 h-4" /> Add Staff
              </Button>
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
              const count = staff.filter((s) => s.role === role).length;
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
            <CardHeader className="flex flex-row items-center justify-between">
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
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <Badge variant={roleBadgeVariant[s.role] || 'outline'} className="capitalize">{s.role}</Badge>
                      </TableCell>
                      <TableCell><BoolIcon value={s.permissions.canOverridePrice} /></TableCell>
                      <TableCell><BoolIcon value={s.permissions.canApplyDiscount} /></TableCell>
                      <TableCell className="text-center text-sm">{s.permissions.maxDiscountPercent}%</TableCell>
                      <TableCell><BoolIcon value={s.permissions.canProcessRefund} /></TableCell>
                      <TableCell><BoolIcon value={s.permissions.canVoidTransaction} /></TableCell>
                      <TableCell><BoolIcon value={s.permissions.canAccessReports} /></TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(s)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(s)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Staff Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {staff.map((s) => (
              <Card key={s.id} className="glass-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{s.name}</p>
                        <Badge variant={roleBadgeVariant[s.role] || 'outline'} className="capitalize text-[10px] mt-0.5">{s.role}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(s)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(s)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        {(s.permissions as any)[key] ? (
                          <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-destructive/40 flex-shrink-0" />
                        )}
                        <span className="text-muted-foreground">{label}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">Max: {s.permissions.maxDiscountPercent}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <MobileBottomNav />

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
            <DialogDescription>
              {editingStaff ? 'Update staff details and permissions.' : 'Add a new team member with role-based permissions.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>PIN (4 digits)</Label>
                <Input placeholder="1234" maxLength={4} value={formPin} onChange={(e) => setFormPin(e.target.value.replace(/\D/g, '').slice(0, 4))} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={formRole} onValueChange={(v) => setFormRole(v as StaffRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Branch Assignments</Label>
                <span className="text-[10px] text-muted-foreground">
                  {formBranchIds.length === 0 ? 'All branches' : `${formBranchIds.length} selected`}
                </span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto rounded-md border border-border/50 p-2">
                {branches.map((b) => {
                  const checked = formBranchIds.includes(b.id);
                  return (
                    <label
                      key={b.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          setFormBranchIds((prev) =>
                            v ? [...prev, b.id] : prev.filter((id) => id !== b.id)
                          );
                        }}
                      />
                      <span className="text-sm flex-1 truncate">{b.name}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Leave empty to grant access to all branches. Cashiers will be locked to their assigned branch on login.
              </p>
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              {Object.entries(permissionLabels).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <Switch
                    checked={(formPerms as any)[key]}
                    onCheckedChange={() => togglePerm(key as keyof StaffPermissions)}
                  />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Max Discount %</span>
                <Input
                  type="number"
                  className="w-20 h-8 text-sm text-center"
                  value={formPerms.maxDiscountPercent}
                  onChange={(e) => setFormPerms(prev => ({ ...prev, maxDiscountPercent: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingStaff ? 'Save Changes' : 'Add Staff'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this staff member. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;
