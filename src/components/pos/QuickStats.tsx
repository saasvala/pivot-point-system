import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, DollarSign, Clock } from 'lucide-react';

interface QuickStatsProps {
  todaySales: number;
  todayTransactions: number;
  avgOrderValue: number;
  lastSaleTime: string;
}

export const QuickStats = ({ todaySales, todayTransactions, avgOrderValue, lastSaleTime }: QuickStatsProps) => {
  const stats = [
    {
      label: "Today's Sales",
      value: `$${todaySales.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan/10',
    },
    {
      label: 'Transactions',
      value: todayTransactions.toString(),
      icon: ShoppingBag,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
    },
    {
      label: 'Avg. Order',
      value: `$${avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
    },
    {
      label: 'Last Sale',
      value: lastSaleTime,
      icon: Clock,
      color: 'text-neon-orange',
      bgColor: 'bg-neon-orange/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="glass-card rounded-xl p-4 flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
