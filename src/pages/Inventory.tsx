import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowLeft, Package, AlertTriangle, Plus, Minus, Filter, TrendingDown,
  CheckCircle, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';
import { categories } from '@/data/mockData';
import { useBranches } from '@/data/branchStore';
import { useBranchProducts, adjustStock } from '@/data/branchStockStore';
import { BranchSwitcher } from '@/components/branches/BranchSwitcher';
import { Product } from '@/types/pos';
import { toast } from 'sonner';

const LOW_STOCK_THRESHOLD = 20;

const Inventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeBranchId, activeBranch } = useBranches();
  const inventory = useBranchProducts(activeBranchId);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [adjustModal, setAdjustModal] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const filtered = useMemo(() => {
    return inventory.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD) ||
        (stockFilter === 'out' && p.stock === 0);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [inventory, search, categoryFilter, stockFilter]);

  const stats = useMemo(() => {
    const total = inventory.length;
    const low = inventory.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
    const out = inventory.filter((p) => p.stock === 0).length;
    const totalValue = inventory.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { total, low, out, totalValue };
  }, [inventory]);

  const handleAdjust = () => {
    if (!adjustModal || !adjustQty) return;
    const delta = parseInt(adjustQty);
    if (isNaN(delta)) {
      toast.error('Enter a valid number');
      return;
    }

    adjustStock(activeBranchId, adjustModal.id, delta);

    const action = delta > 0 ? 'Added' : 'Removed';
    toast.success(`${action} ${Math.abs(delta)} units of ${adjustModal.name} at ${activeBranch?.name}`);
    setAdjustModal(null);
    setAdjustQty('');
    setAdjustReason('');
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive" className="text-[10px]">Out of Stock</Badge>;
    if (stock <= LOW_STOCK_THRESHOLD) return <Badge className="bg-warning/10 text-warning border-0 text-[10px]">Low Stock</Badge>;
    return <Badge className="bg-success/10 text-success border-0 text-[10px]">In Stock</Badge>;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MobileDrawer />
            <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Inventory</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                {stats.total} products tracked
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Products', value: stats.total, icon: Package, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
            { label: 'Low Stock', value: stats.low, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Out of Stock', value: stats.out, icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
            { label: 'Inventory Value', value: `$${stats.totalValue.toFixed(0)}`, icon: TrendingDown, color: 'text-success', bg: 'bg-success/10' },
          ].map((s) => (
            <Card key={s.label} className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl md:text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`p-2 rounded-xl ${s.bg}`}>
                    <s.icon className={`w-4 h-4 md:w-5 md:h-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.filter(c => c.id !== '1').map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as any)}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Low stock alert */}
        {stats.low > 0 && stockFilter === 'all' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {stats.low} product{stats.low > 1 ? 's' : ''} running low on stock
                  </p>
                  <p className="text-xs text-muted-foreground">Below {LOW_STOCK_THRESHOLD} units remaining</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto text-xs"
                  onClick={() => setStockFilter('low')}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Desktop Table */}
        <Card className="glass-card border-border/50 hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.category);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.image}</span>
                        <span className="font-medium text-sm">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{p.sku}</code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cat?.name || '-'}</TableCell>
                    <TableCell className="text-right text-sm font-medium">${p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-semibold ${
                        p.stock === 0 ? 'text-destructive' : p.stock <= LOW_STOCK_THRESHOLD ? 'text-warning' : 'text-foreground'
                      }`}>
                        {p.stock}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">{p.unit}</span>
                    </TableCell>
                    <TableCell>{getStockBadge(p.stock)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => {
                            setAdjustModal(p);
                            setAdjustQty('');
                            setAdjustReason('');
                          }}
                        >
                          Adjust
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((p) => {
            const cat = categories.find((c) => c.id === p.category);
            return (
              <Card key={p.id} className="glass-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{p.image}</span>
                      <div>
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.sku} • {cat?.name}</p>
                      </div>
                    </div>
                    {getStockBadge(p.stock)}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-sm font-medium">${p.price.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground"> / {p.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        p.stock === 0 ? 'text-destructive' : p.stock <= LOW_STOCK_THRESHOLD ? 'text-warning' : 'text-foreground'
                      }`}>
                        {p.stock}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          setAdjustModal(p);
                          setAdjustQty('');
                          setAdjustReason('');
                        }}
                      >
                        Adjust
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <MobileBottomNav />

      {/* Adjust Stock Dialog */}
      <Dialog open={!!adjustModal} onOpenChange={(open) => !open && setAdjustModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              {adjustModal?.name} — Current: {adjustModal?.stock} {adjustModal?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setAdjustQty((prev) => String((parseInt(prev) || 0) - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                placeholder="e.g. +10 or -5"
                className="text-center text-lg font-semibold"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => setAdjustQty((prev) => String((parseInt(prev) || 0) + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              New stock: <span className="font-semibold text-foreground">
                {Math.max(0, (adjustModal?.stock || 0) + (parseInt(adjustQty) || 0))}
              </span> {adjustModal?.unit}
            </div>
            <div className="space-y-1.5">
              <Label>Reason (optional)</Label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g. Restock delivery, damaged goods"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustModal(null)}>Cancel</Button>
            <Button onClick={handleAdjust} disabled={!adjustQty || parseInt(adjustQty) === 0}>
              Apply Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
