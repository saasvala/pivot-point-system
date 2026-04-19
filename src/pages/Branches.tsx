import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft, Plus, Edit2, Trash2, Store, MapPin, Phone, User,
  Building2, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useBranches, addBranch, updateBranch, deleteBranch, setActiveBranch, Branch } from '@/data/branchStore';
import { getTransactions } from '@/data/salesStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Branches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { branches, activeBranchId } = useBranches();
  const [editing, setEditing] = useState<Branch | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', manager: '' });

  if (!user) return null;

  const branchStats = (id: string) => {
    const txns = getTransactions(id).filter((t) => t.status === 'completed');
    const revenue = txns.reduce((s, t) => s + t.total, 0);
    return { orders: txns.length, revenue };
  };

  const openAdd = () => {
    setIsNew(true);
    setForm({ name: '', address: '', phone: '', manager: '' });
    setEditing({ id: '', name: '', address: '', phone: '', manager: '', createdAt: new Date() });
  };

  const openEdit = (b: Branch) => {
    setIsNew(false);
    setForm({ name: b.name, address: b.address, phone: b.phone, manager: b.manager });
    setEditing(b);
  };

  const save = () => {
    if (!form.name.trim() || !form.address.trim()) {
      toast.error('Name and address are required');
      return;
    }
    if (isNew) {
      const b = addBranch({
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        manager: form.manager.trim(),
      });
      toast.success(`Added branch: ${b.name}`);
    } else if (editing) {
      updateBranch(editing.id, {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        manager: form.manager.trim(),
      });
      toast.success(`Updated ${form.name}`);
    }
    setEditing(null);
  };

  const remove = (b: Branch) => {
    if (branches.length <= 1) {
      toast.error('At least one branch is required');
      return;
    }
    if (!confirm(`Delete ${b.name}? This cannot be undone.`)) return;
    const ok = deleteBranch(b.id);
    if (ok) toast.success(`Deleted ${b.name}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <MobileDrawer />
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="hidden lg:flex">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate">Branches</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{branches.length} location{branches.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={openAdd} className="gap-1.5">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Branch</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {branches.map((b) => {
            const stats = branchStats(b.id);
            const isActive = b.id === activeBranchId;
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={cn(
                  'glass-card transition-all',
                  isActive ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'
                )}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                        )}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm truncate">{b.name}</h3>
                          <p className="text-[11px] text-muted-foreground">
                            Since {format(new Date(b.createdAt), 'MMM yyyy')}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{b.address}</span>
                      </div>
                      {b.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{b.phone}</span>
                        </div>
                      )}
                      {b.manager && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{b.manager}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase">Orders</div>
                        <div className="font-semibold text-sm">{stats.orders}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase">Revenue</div>
                        <div className="font-semibold text-sm">${stats.revenue.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      {!isActive && (
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 text-xs h-8"
                          onClick={() => { setActiveBranch(b.id); toast.success(`Switched to ${b.name}`); }}
                        >
                          Set Active
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-8 px-2.5" onClick={() => openEdit(b)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 text-destructive hover:bg-destructive/10"
                        onClick={() => remove(b)}
                        disabled={branches.length <= 1}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {branches.length === 0 && (
          <div className="text-center py-16">
            <Store className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No branches yet</p>
            <Button onClick={openAdd}><Plus className="w-4 h-4 mr-1.5" /> Add your first branch</Button>
          </div>
        )}
      </main>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add Branch' : 'Edit Branch'}</DialogTitle>
            <DialogDescription>
              {isNew ? 'Create a new branch location' : 'Update branch information'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="b-name">Branch Name *</Label>
              <Input id="b-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown Store" />
            </div>
            <div>
              <Label htmlFor="b-address">Address *</Label>
              <Input id="b-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, city" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="b-phone">Phone</Label>
                <Input id="b-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-0100" />
              </div>
              <div>
                <Label htmlFor="b-manager">Manager</Label>
                <Input id="b-manager" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="Manager name" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>{isNew ? 'Add Branch' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MobileBottomNav />
    </div>
  );
};

export default Branches;
