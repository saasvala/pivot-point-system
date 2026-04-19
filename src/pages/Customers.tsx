import { useState, useMemo, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Search, ArrowLeft, Plus, Edit2, Trash2, Users, Star, DollarSign,
  Phone, Mail, Award, ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';
import { customers as initialCustomers } from '@/data/mockData';
import { getTransactions, subscribe } from '@/data/salesStore';
import { Customer } from '@/types/pos';
import { toast } from 'sonner';

const VIP_THRESHOLD = 2000;

const Customers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const transactions = useSyncExternalStore(subscribe, getTransactions, getTransactions);

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Customer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', loyaltyPoints: 0, totalSpent: 0 });

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [customers, search]);

  const stats = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter((c) => c.totalSpent >= VIP_THRESHOLD).length;
    const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
    const totalPoints = customers.reduce((s, c) => s + c.loyaltyPoints, 0);
    return { total, vip, totalSpent, totalPoints };
  }, [customers]);

  const purchaseHistory = useMemo(() => {
    if (!viewing) return [];
    return transactions
      .filter((t) => t.customer?.id === viewing.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, viewing]);

  if (!user) return null;

  const openAdd = () => {
    setIsNew(true);
    setForm({ name: '', email: '', phone: '', loyaltyPoints: 0, totalSpent: 0 });
    setEditing({ id: '', name: '', email: '', phone: '', loyaltyPoints: 0, totalSpent: 0 });
  };

  const openEdit = (c: Customer) => {
    setIsNew(false);
    setForm({
      name: c.name,
      email: c.email || '',
      phone: c.phone,
      loyaltyPoints: c.loyaltyPoints,
      totalSpent: c.totalSpent,
    });
    setEditing(c);
  };

  const save = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    if (isNew) {
      const newC: Customer = {
        id: `c-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        loyaltyPoints: Number(form.loyaltyPoints) || 0,
        totalSpent: Number(form.totalSpent) || 0,
      };
      setCustomers((prev) => [newC, ...prev]);
      toast.success(`Added ${newC.name}`);
    } else if (editing) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                name: form.name.trim(),
                email: form.email.trim() || undefined,
                phone: form.phone.trim(),
                loyaltyPoints: Number(form.loyaltyPoints) || 0,
                totalSpent: Number(form.totalSpent) || 0,
              }
            : c
        )
      );
      toast.success(`Updated ${form.name}`);
    }
    setEditing(null);
  };

  const remove = (c: Customer) => {
    if (!confirm(`Delete ${c.name}? This cannot be undone.`)) return;
    setCustomers((prev) => prev.filter((x) => x.id !== c.id));
    toast.success(`Deleted ${c.name}`);
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
              <h1 className="text-lg md:text-2xl font-bold truncate">Customers</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">CRM & loyalty management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={openAdd} className="gap-1.5">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Customer</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Total Customers', value: stats.total.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'VIP Members', value: stats.vip.toString(), icon: Star, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Total Revenue', value: `$${stats.totalSpent.toFixed(0)}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Loyalty Points', value: stats.totalPoints.toLocaleString(), icon: Award, color: 'text-secondary', bg: 'bg-secondary/10' },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-border/50">
                <CardContent className="p-4 md:p-5 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${s.bg}`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg md:text-2xl font-bold truncate">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer list — Desktop table */}
        <Card className="glass-card border-border/50 hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const isVip = c.totalSpent >= VIP_THRESHOLD;
                  return (
                    <TableRow key={c.id} className="cursor-pointer" onClick={() => setViewing(c)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold text-sm flex items-center justify-center">
                            {c.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                          </div>
                          <div className="font-medium">{c.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{c.phone}</div>
                        {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                      </TableCell>
                      <TableCell className="text-right font-mono">{c.loyaltyPoints.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">${c.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        {isVip ? (
                          <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/20"><Star className="w-3 h-3 mr-1" />VIP</Badge>
                        ) : (
                          <Badge variant="outline">Regular</Badge>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => remove(c)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No customers found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((c) => {
            const isVip = c.totalSpent >= VIP_THRESHOLD;
            return (
              <Card key={c.id} className="glass-card border-border/50" onClick={() => setViewing(c)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold text-sm flex items-center justify-center flex-shrink-0">
                        {c.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{c.phone}</div>
                      </div>
                    </div>
                    {isVip && <Badge className="bg-warning/15 text-warning border-warning/30 flex-shrink-0"><Star className="w-3 h-3 mr-1" />VIP</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Points</div>
                      <div className="font-medium">{c.loyaltyPoints.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Spent</div>
                      <div className="font-medium">${c.totalSpent.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => openEdit(c)}>
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => remove(c)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">No customers found</div>
          )}
        </div>
      </main>

      {/* Add/Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add Customer' : 'Edit Customer'}</DialogTitle>
            <DialogDescription>{isNew ? 'Create a new customer profile' : 'Update customer information'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="c-name">Name *</Label>
              <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="c-phone">Phone *</Label>
              <Input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="c-points">Loyalty Points</Label>
                <Input id="c-points" type="number" value={form.loyaltyPoints} onChange={(e) => setForm({ ...form, loyaltyPoints: Number(e.target.value) })} />
              </div>
              <div>
                <Label htmlFor="c-spent">Total Spent ($)</Label>
                <Input id="c-spent" type="number" step="0.01" value={form.totalSpent} onChange={(e) => setForm({ ...form, totalSpent: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>{isNew ? 'Add Customer' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile / purchase history dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold flex items-center justify-center">
                    {viewing.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <DialogTitle>{viewing.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-3 mt-1">
                      {viewing.totalSpent >= VIP_THRESHOLD && (
                        <Badge className="bg-warning/15 text-warning border-warning/30"><Star className="w-3 h-3 mr-1" />VIP</Badge>
                      )}
                      <span className="text-xs">Customer since {format(new Date(), 'MMM yyyy')}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Card className="border-border/50"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3" />Phone</div>
                  <div className="font-medium text-sm mt-0.5">{viewing.phone}</div>
                </CardContent></Card>
                <Card className="border-border/50"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3" />Email</div>
                  <div className="font-medium text-sm mt-0.5 truncate">{viewing.email || '—'}</div>
                </CardContent></Card>
                <Card className="border-border/50"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Award className="w-3 h-3" />Loyalty Points</div>
                  <div className="font-bold text-lg mt-0.5">{viewing.loyaltyPoints.toLocaleString()}</div>
                </CardContent></Card>
                <Card className="border-border/50"><CardContent className="p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-3 h-3" />Total Spent</div>
                  <div className="font-bold text-lg mt-0.5">${viewing.totalSpent.toFixed(2)}</div>
                </CardContent></Card>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-4 h-4" /> Purchase History
                  <Badge variant="outline" className="ml-1">{purchaseHistory.length}</Badge>
                </h3>
                {purchaseHistory.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                    No purchases yet
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[260px] overflow-y-auto">
                    {purchaseHistory.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                        <div className="min-w-0">
                          <div className="font-medium text-sm">{t.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(t.createdAt), 'MMM dd, yyyy · HH:mm')} · {t.items.length} items · {t.paymentMethod}
                          </div>
                        </div>
                        <div className="font-semibold text-sm">${t.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { openEdit(viewing); setViewing(null); }}>
                  <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                </Button>
                <Button onClick={() => setViewing(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <MobileBottomNav />
    </div>
  );
};

export default Customers;
