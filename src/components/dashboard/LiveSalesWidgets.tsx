import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getTodayStats, subscribe, getTransactions } from '@/data/salesStore';

const useStoreSnapshot = () => {
  return useSyncExternalStore(
    subscribe,
    () => JSON.stringify(getTodayStats()),
  );
};

export const LiveSalesWidgets = () => {
  const snapshot = useStoreSnapshot();
  const stats = JSON.parse(snapshot);

  const widgets = [
    {
      title: "Today's Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Transactions',
      value: stats.count.toString(),
      icon: ShoppingCart,
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10',
    },
    {
      title: 'Avg. Order',
      value: `$${stats.avg.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="text-xs font-medium text-success">Live</span>
        </div>
        <h3 className="text-sm font-semibold text-foreground">Real-Time Sales</h3>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {widgets.map((w) => (
          <motion.div
            key={w.title}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${w.bgColor}`}>
                    <w.icon className={`w-3.5 h-3.5 ${w.color}`} />
                  </div>
                </div>
                <motion.p
                  key={w.value}
                  initial={{ opacity: 0.5, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg md:text-2xl font-bold text-foreground"
                >
                  {w.value}
                </motion.p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{w.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top items */}
      {stats.topItems.length > 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent-orange" />
              <h4 className="text-sm font-semibold text-foreground">Top Selling Today</h4>
            </div>
            <div className="space-y-2">
              {stats.topItems.map((item: any, i: number) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-4">#{i + 1}</span>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{item.count} sold</span>
                    <span className="text-xs font-semibold text-foreground">${item.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
