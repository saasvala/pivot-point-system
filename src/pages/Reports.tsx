import { useState, useMemo, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft, CalendarIcon, Download, FileText, DollarSign, ShoppingCart,
  TrendingUp, Users, FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';
import { getTransactions, subscribe } from '@/data/salesStore';
import { staffMembers } from '@/data/staffData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(160, 84%, 39%)',
  'hsl(38, 92%, 50%)',
  'hsl(330, 81%, 60%)',
];

type Preset = 'today' | '7d' | '30d' | 'custom';

const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const transactions = useSyncExternalStore(subscribe, getTransactions, getTransactions);

  const [preset, setPreset] = useState<Preset>('7d');
  const [from, setFrom] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [to, setTo] = useState<Date>(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  });

  if (!user) return null;

  const applyPreset = (p: Preset) => {
    setPreset(p);
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    if (p === 'today') {
      // start already today
    } else if (p === '7d') {
      start.setDate(start.getDate() - 7);
    } else if (p === '30d') {
      start.setDate(start.getDate() - 30);
    }
    if (p !== 'custom') {
      setFrom(start);
      setTo(end);
    }
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (t.status !== 'completed') return false;
      const d = new Date(t.createdAt);
      return d >= from && d <= to;
    });
  }, [transactions, from, to]);

  const summary = useMemo(() => {
    const revenue = filtered.reduce((s, t) => s + t.total, 0);
    const orders = filtered.length;
    const avg = orders > 0 ? revenue / orders : 0;
    const customers = new Set(filtered.filter((t) => t.customer).map((t) => t.customer!.id)).size;
    const tax = filtered.reduce((s, t) => s + t.tax, 0);
    const discount = filtered.reduce((s, t) => s + t.discount, 0);
    return { revenue, orders, avg, customers, tax, discount };
  }, [filtered]);

  const dailyData = useMemo(() => {
    const map: Record<string, { date: string; revenue: number; orders: number }> = {};
    filtered.forEach((t) => {
      const key = format(new Date(t.createdAt), 'MMM dd');
      if (!map[key]) map[key] = { date: key, revenue: 0, orders: 0 };
      map[key].revenue += t.total;
      map[key].orders += 1;
    });
    return Object.values(map);
  }, [filtered]);

  const paymentMix = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((t) => {
      map[t.paymentMethod] = (map[t.paymentMethod] || 0) + t.total;
    });
    return Object.entries(map).map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(value.toFixed(2)),
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [filtered]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number; image: string }> = {};
    filtered.forEach((t) =>
      t.items.forEach((it) => {
        const k = it.product.id;
        if (!map[k]) map[k] = { name: it.product.name, qty: 0, revenue: 0, image: it.product.image || '📦' };
        map[k].qty += it.quantity;
        map[k].revenue += it.product.price * it.quantity;
      })
    );
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [filtered]);

  const staffPerformance = useMemo(() => {
    // Mock-distribute transactions across staff members for demo
    const staff = staffMembers.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      orders: 0,
      revenue: 0,
    }));
    filtered.forEach((t, idx) => {
      const target = staff[idx % staff.length];
      target.orders += 1;
      target.revenue += t.total;
    });
    return staff.sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  const exportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Items', 'Subtotal', 'Tax', 'Discount', 'Total', 'Payment', 'Customer'];
    const rows = filtered.map((t) => [
      t.id,
      format(new Date(t.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      t.items.reduce((s, i) => s + i.quantity, 0),
      t.subtotal.toFixed(2),
      t.tax.toFixed(2),
      t.discount.toFixed(2),
      t.total.toFixed(2),
      t.paymentMethod,
      t.customer?.name || 'Walk-in',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${format(from, 'yyyyMMdd')}-${format(to, 'yyyyMMdd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV report downloaded');
  };

  const exportPDF = () => {
    const win = window.open('', '_blank');
    if (!win) {
      toast.error('Popup blocked — allow popups to export PDF');
      return;
    }
    const html = `
      <!DOCTYPE html><html><head><title>Sales Report</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding: 40px; color: #1a1a1a; }
        h1 { margin: 0 0 4px; }
        .meta { color: #666; margin-bottom: 24px; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .stat { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 22px; font-weight: 700; margin-top: 4px; }
        h2 { margin-top: 32px; border-bottom: 2px solid #333; padding-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; }
        th { background: #f5f5f5; }
        @media print { body { padding: 20px; } }
      </style></head><body>
        <h1>Sales Report</h1>
        <div class="meta">${format(from, 'MMM dd, yyyy')} – ${format(to, 'MMM dd, yyyy')} · Generated ${format(new Date(), 'PPpp')}</div>
        <div class="grid">
          <div class="stat"><div class="stat-label">Revenue</div><div class="stat-value">$${summary.revenue.toFixed(2)}</div></div>
          <div class="stat"><div class="stat-label">Orders</div><div class="stat-value">${summary.orders}</div></div>
          <div class="stat"><div class="stat-label">Avg Order</div><div class="stat-value">$${summary.avg.toFixed(2)}</div></div>
          <div class="stat"><div class="stat-label">Customers</div><div class="stat-value">${summary.customers}</div></div>
        </div>
        <h2>Top Products</h2>
        <table><thead><tr><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead><tbody>
        ${topProducts.map((p) => `<tr><td>${p.name}</td><td>${p.qty}</td><td>$${p.revenue.toFixed(2)}</td></tr>`).join('')}
        </tbody></table>
        <h2>Staff Performance</h2>
        <table><thead><tr><th>Staff</th><th>Role</th><th>Orders</th><th>Revenue</th></tr></thead><tbody>
        ${staffPerformance.map((s) => `<tr><td>${s.name}</td><td>${s.role}</td><td>${s.orders}</td><td>$${s.revenue.toFixed(2)}</td></tr>`).join('')}
        </tbody></table>
        <h2>Transactions (${filtered.length})</h2>
        <table><thead><tr><th>ID</th><th>Date</th><th>Payment</th><th>Total</th></tr></thead><tbody>
        ${filtered.slice(0, 50).map((t) => `<tr><td>${t.id}</td><td>${format(new Date(t.createdAt), 'MMM dd, HH:mm')}</td><td>${t.paymentMethod}</td><td>$${t.total.toFixed(2)}</td></tr>`).join('')}
        </tbody></table>
        <script>window.onload = () => window.print();</script>
      </body></html>`;
    win.document.write(html);
    win.document.close();
    toast.success('PDF report opened — use browser print dialog to save');
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
              <h1 className="text-lg md:text-2xl font-bold truncate">Reports</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Sales analytics & performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={exportPDF} className="gap-1.5">
              <FileDown className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
        {/* Filters */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Select value={preset} onValueChange={(v) => applyPreset(v as Preset)}>
              <SelectTrigger className="sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('flex-1 justify-start gap-2 font-normal', !from && 'text-muted-foreground')}>
                    <CalendarIcon className="w-4 h-4" />
                    {format(from, 'MMM dd, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={from}
                    onSelect={(d) => { if (d) { setFrom(d); setPreset('custom'); } }}
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground text-sm">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start gap-2 font-normal">
                    <CalendarIcon className="w-4 h-4" />
                    {format(to, 'MMM dd, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={to}
                    onSelect={(d) => { if (d) { const e = new Date(d); e.setHours(23,59,59,999); setTo(e); setPreset('custom'); } }}
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Revenue', value: `$${summary.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Orders', value: summary.orders.toString(), icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Avg. Order', value: `$${summary.avg.toFixed(2)}`, icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10' },
            { label: 'Customers', value: summary.customers.toString(), icon: Users, color: 'text-accent-foreground', bg: 'bg-accent' },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-border/50">
                <CardContent className="p-4 md:p-5 flex items-center gap-3">
                  <div className={cn('p-2.5 rounded-xl', s.bg)}>
                    <s.icon className={cn('w-5 h-5', s.color)} />
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

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="glass-card border-border/50 lg:col-span-2">
            <CardHeader><CardTitle className="text-base md:text-lg">Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              {dailyData.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No data in range</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader><CardTitle className="text-base md:text-lg">Payment Mix</CardTitle></CardHeader>
            <CardContent>
              {paymentMix.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={paymentMix} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                      {paymentMix.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Staff Performance */}
        <Card className="glass-card border-border/50">
          <CardHeader><CardTitle className="text-base md:text-lg">Staff Performance</CardTitle></CardHeader>
          <CardContent>
            {staffPerformance.every((s) => s.orders === 0) ? (
              <div className="text-sm text-muted-foreground text-center py-6">No transactions in range</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={staffPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Orders</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffPerformance.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell><Badge variant="outline" className="capitalize">{s.role}</Badge></TableCell>
                          <TableCell className="text-right">{s.orders}</TableCell>
                          <TableCell className="text-right font-mono">${s.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top products */}
        <Card className="glass-card border-border/50">
          <CardHeader><CardTitle className="text-base md:text-lg">Top Products</CardTitle></CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">No sales in range</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((p) => (
                      <TableRow key={p.name}>
                        <TableCell className="flex items-center gap-2">
                          <span className="text-lg">{p.image}</span>
                          <span className="font-medium">{p.name}</span>
                        </TableCell>
                        <TableCell className="text-right">{p.qty}</TableCell>
                        <TableCell className="text-right font-mono">${p.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Reports;
