import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, TrendingUp, DollarSign, ShoppingCart, AlertTriangle,
  Package, Trophy, Building2, Network, Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/data/branchStore';
import { getTransactions } from '@/data/salesStore';
import { getProductsForBranch } from '@/data/branchStockStore';
import { useSyncExternalStore } from 'react';
import { subscribe as subscribeSales } from '@/data/salesStore';
import { subscribeStock } from '@/data/branchStockStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

const LOW_STOCK_THRESHOLD = 20;

function useReactiveSnapshot() {
  // Re-render whenever sales or stock change
  return useSyncExternalStore(
    (cb) => {
      const u1 = subscribeSales(cb);
      const u2 = subscribeStock(cb);
      return () => { u1(); u2(); };
    },
    () => Date.now().toString()
  );
}

type ViewMode = 'network' | 'active';

const VIEW_STORAGE_KEY = 'nexuspos-overview-view-v1';

const BranchesOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { branches, activeBranchId, activeBranch } = useBranches();
  const [view, setView] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      return saved === 'active' ? 'active' : 'network';
    } catch {
      return 'network';
    }
  });
  // Persist view selection across refreshes
  const updateView = (next: ViewMode) => {
    setView(next);
    try { localStorage.setItem(VIEW_STORAGE_KEY, next); } catch {}
  };
  useReactiveSnapshot();

  const perBranch = useMemo(() => {
    return branches.map((b) => {
      const txns = getTransactions(b.id).filter((t) => t.status === 'completed');
      const revenue = txns.reduce((s, t) => s + t.total, 0);
      const orders = txns.length;
      const avg = orders ? revenue / orders : 0;

      // Top products for this branch
      const itemMap: Record<string, { name: string; qty: number; revenue: number }> = {};
      txns.forEach((t) =>
        t.items.forEach((it) => {
          const key = it.product.id;
          if (!itemMap[key]) itemMap[key] = { name: it.product.name, qty: 0, revenue: 0 };
          itemMap[key].qty += it.quantity;
          itemMap[key].revenue += it.product.price * it.quantity;
        })
      );
      const topItems = Object.values(itemMap)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 3);

      // Stock health
      const products = getProductsForBranch(b.id);
      const totalUnits = products.reduce((s, p) => s + p.stock, 0);
      const lowStock = products.filter((p) => p.stock > 0 && p.stock < LOW_STOCK_THRESHOLD);
      const outOfStock = products.filter((p) => p.stock === 0);

      return { branch: b, revenue, orders, avg, topItems, totalUnits, lowStock, outOfStock };
    });
  }, [branches]);

  const totals = useMemo(() => {
    return perBranch.reduce(
      (acc, p) => ({
        revenue: acc.revenue + p.revenue,
        orders: acc.orders + p.orders,
        lowStock: acc.lowStock + p.lowStock.length,
        outOfStock: acc.outOfStock + p.outOfStock.length,
      }),
      { revenue: 0, orders: 0, lowStock: 0, outOfStock: 0 }
    );
  }, [perBranch]);

  const activeData = useMemo(
    () => perBranch.find((p) => p.branch.id === activeBranchId),
    [perBranch, activeBranchId]
  );

  const isActiveView = view === 'active' && !!activeData;

  // Summary stats swap based on view
  const summary = isActiveView
    ? {
        revenue: activeData!.revenue,
        orders: activeData!.orders,
        lowStock: activeData!.lowStock.length,
        outOfStock: activeData!.outOfStock.length,
      }
    : totals;

  // Chart: full network in network mode; just active branch in active mode
  const chartSource = isActiveView ? [activeData!] : perBranch;
  const chartData = chartSource.map((p) => ({
    name: p.branch.name.length > 14 ? p.branch.name.slice(0, 12) + '…' : p.branch.name,
    Revenue: Math.round(p.revenue),
    Orders: p.orders,
  }));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 overflow-x-hidden">
      <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-3 md:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <MobileDrawer />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/branches')}
              className="hidden lg:flex"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base md:text-2xl font-bold truncate">
                Multi-Branch Overview
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block truncate">
                {isActiveView
                  ? `Viewing: ${activeBranch?.name ?? 'No branch'}`
                  : `Side-by-side comparison across ${branches.length} location${branches.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <Button asChild size="sm" variant="outline" className="gap-1.5 hidden sm:inline-flex">
              <Link to="/branches">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Manage</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-3 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* View mode toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div
            role="tablist"
            aria-label="Overview view mode"
            className="inline-flex items-center p-1 rounded-xl bg-muted/50 border border-border/50 w-full sm:w-auto"
          >
            <button
              role="tab"
              aria-selected={!isActiveView}
              onClick={() => updateView('network')}
              className={cn(
                'flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                !isActiveView
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Network className="w-3.5 h-3.5" />
              Network totals
            </button>
            <button
              role="tab"
              aria-selected={isActiveView}
              onClick={() => activeData && updateView('active')}
              disabled={!activeData}
              title={!activeData ? 'Select an active branch to view branch details' : undefined}
              className={cn(
                'flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                isActiveView
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="truncate max-w-[140px]">
                {activeBranch?.name ?? 'Active branch'}
              </span>
            </button>
          </div>
        </div>

        {/* Empty state when user wants Active branch view but none is set */}
        {view === 'active' && !activeData && (
          <Card className="glass-card border-dashed border-border/60">
            <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                <Store className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-base">No active branch selected</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Pick a branch from the header switcher to see branch-level revenue,
                  orders, and stock health here. Showing network totals in the meantime.
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link to="/branches">Manage branches</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary stats (network or active) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
          <SummaryCard
            label={isActiveView ? 'Branch Revenue' : 'Network Revenue'}
            value={`$${summary.revenue.toFixed(2)}`}
            icon={DollarSign}
            tone="text-success"
          />
          <SummaryCard
            label={isActiveView ? 'Branch Orders' : 'Total Orders'}
            value={summary.orders.toString()}
            icon={ShoppingCart}
            tone="text-primary"
          />
          <SummaryCard
            label="Low-Stock Items"
            value={summary.lowStock.toString()}
            icon={AlertTriangle}
            tone="text-warning"
          />
          <SummaryCard
            label="Out of Stock"
            value={summary.outOfStock.toString()}
            icon={Package}
            tone="text-destructive"
          />
        </div>

        {/* Comparison chart */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardHeader className="p-3 md:p-6 pb-2 md:pb-2">
            <CardTitle className="text-sm md:text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {isActiveView ? 'Revenue & Orders — Active Branch' : 'Revenue & Orders by Branch'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0 md:pt-0">
            <div className="w-full h-[220px] md:h-[300px]">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center px-4">
                  <p className="text-sm text-muted-foreground">
                    No branch data to chart yet.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis yAxisId="l" tick={{ fontSize: 10 }} width={36} />
                    <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 10 }} width={28} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar yAxisId="l" dataKey="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    <Bar yAxisId="r" dataKey="Orders" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Per-branch detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {(isActiveView ? [activeData!] : perBranch).map((p) => {
            const isActive = p.branch.id === activeBranchId;
            return (
              <motion.div
                key={p.branch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={cn(
                  'glass-card transition-all h-full',
                  isActive ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'
                )}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{p.branch.name}</h3>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {p.branch.address}
                        </p>
                      </div>
                      {isActive && (
                        <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] flex-shrink-0">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <Stat label="Revenue" value={`$${p.revenue.toFixed(0)}`} />
                      <Stat label="Orders" value={p.orders.toString()} />
                      <Stat label="Avg" value={`$${p.avg.toFixed(2)}`} />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Top Products
                        </p>
                      </div>
                      {p.topItems.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic py-1">No sales yet</p>
                      ) : (
                        <ul className="space-y-1">
                          {p.topItems.map((it, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="truncate flex-1 mr-2">
                                <span className="text-muted-foreground mr-1.5">#{i + 1}</span>
                                {it.name}
                              </span>
                              <span className="font-medium text-foreground/80 flex-shrink-0">
                                {it.qty}×
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase">Units</div>
                        <div className="font-semibold text-sm">{p.totalUnits.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-warning uppercase">Low</div>
                        <div className="font-semibold text-sm text-warning">{p.lowStock.length}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-destructive uppercase">Out</div>
                        <div className="font-semibold text-sm text-destructive">{p.outOfStock.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

const SummaryCard = ({
  label, value, icon: Icon, tone,
}: { label: string; value: string; icon: any; tone: string }) => (
  <Card className="glass-card border-border/50">
    <CardContent className="p-2.5 md:p-4">
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider truncate min-w-0">
          {label}
        </span>
        <Icon className={cn('w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0', tone)} />
      </div>
      <div className="text-base md:text-2xl font-bold truncate">{value}</div>
    </CardContent>
  </Card>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md bg-muted/40 p-2 text-center">
    <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
    <div className="font-semibold text-sm">{value}</div>
  </div>
);

export default BranchesOverview;
