import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  Clock,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const Dashboard = () => {
  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4200, orders: 42, revenue: 3800 },
    { name: 'Tue', sales: 5800, orders: 58, revenue: 5200 },
    { name: 'Wed', sales: 4900, orders: 49, revenue: 4400 },
    { name: 'Thu', sales: 6200, orders: 62, revenue: 5600 },
    { name: 'Fri', sales: 7800, orders: 78, revenue: 7000 },
    { name: 'Sat', sales: 9200, orders: 92, revenue: 8300 },
    { name: 'Sun', sales: 6500, orders: 65, revenue: 5900 },
  ];

  const monthlyRevenue = [
    { name: 'Jan', revenue: 42000 },
    { name: 'Feb', revenue: 38000 },
    { name: 'Mar', revenue: 51000 },
    { name: 'Apr', revenue: 46000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 62000 },
    { name: 'Jul', revenue: 58000 },
    { name: 'Aug', revenue: 71000 },
    { name: 'Sep', revenue: 68000 },
    { name: 'Oct', revenue: 74000 },
    { name: 'Nov', revenue: 82000 },
    { name: 'Dec', revenue: 94000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: 'hsl(219, 79%, 66%)' },
    { name: 'Clothing', value: 25, color: 'hsl(275, 100%, 40%)' },
    { name: 'Food & Beverages', value: 20, color: 'hsl(160, 84%, 39%)' },
    { name: 'Home & Garden', value: 12, color: 'hsl(38, 92%, 50%)' },
    { name: 'Others', value: 8, color: 'hsl(330, 81%, 60%)' },
  ];

  const hourlyTraffic = [
    { hour: '6AM', customers: 12 },
    { hour: '8AM', customers: 45 },
    { hour: '10AM', customers: 78 },
    { hour: '12PM', customers: 120 },
    { hour: '2PM', customers: 95 },
    { hour: '4PM', customers: 88 },
    { hour: '6PM', customers: 145 },
    { hour: '8PM', customers: 110 },
    { hour: '10PM', customers: 42 },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 245, revenue: '$244,755', trend: 12.5, image: '📱' },
    { name: 'MacBook Air M3', sales: 189, revenue: '$226,611', trend: 8.3, image: '💻' },
    { name: 'AirPods Pro', sales: 312, revenue: '$77,688', trend: 15.2, image: '🎧' },
    { name: 'iPad Pro 12.9"', sales: 156, revenue: '$171,444', trend: -2.1, image: '📲' },
    { name: 'Apple Watch Ultra', sales: 203, revenue: '$162,197', trend: 6.7, image: '⌚' },
  ];

  const recentTransactions = [
    { id: 'TXN001', customer: 'John Smith', amount: '$1,249.00', time: '2 min ago', status: 'completed' },
    { id: 'TXN002', customer: 'Sarah Johnson', amount: '$89.99', time: '15 min ago', status: 'completed' },
    { id: 'TXN003', customer: 'Mike Brown', amount: '$549.00', time: '32 min ago', status: 'pending' },
    { id: 'TXN004', customer: 'Emily Davis', amount: '$2,199.00', time: '1 hr ago', status: 'completed' },
    { id: 'TXN005', customer: 'Chris Wilson', amount: '$329.00', time: '2 hr ago', status: 'refunded' },
  ];

  const stats = [
    { 
      title: "Today's Revenue", 
      value: '$12,426', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10'
    },
    { 
      title: 'Total Orders', 
      value: '284', 
      change: '+8.2%', 
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10'
    },
    { 
      title: 'New Customers', 
      value: '48', 
      change: '+24.3%', 
      trend: 'up',
      icon: Users,
      color: 'text-accent-purple',
      bgColor: 'bg-accent-purple/10'
    },
    { 
      title: 'Avg. Order Value', 
      value: '$43.75', 
      change: '-2.4%', 
      trend: 'down',
      icon: TrendingUp,
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-card border-r border-border/50 z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">NexusPOS</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/pos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Store className="w-5 h-5" />
            POS Terminal
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Package className="w-5 h-5" />
            Inventory
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Receipt className="w-5 h-5" />
            Orders
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Users className="w-5 h-5" />
            Customers
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <BarChart3 className="w-5 h-5" />
            Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-border/50">
          <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                Today
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">3</span>
              </Button>
              <ThemeToggle />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div key={stat.title} variants={itemVariants}>
                  <Card className="glass-card border-border/50 hover:shadow-soft-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-3xl font-bold mt-2">{stat.value}</p>
                          <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                            {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            {stat.change}
                            <span className="text-muted-foreground">vs last week</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Sales Overview Chart */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="glass-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(219, 79%, 66%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(219, 79%, 66%)" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(275, 100%, 40%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(275, 100%, 40%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="sales" stroke="hsl(219, 79%, 66%)" fill="url(#salesGradient)" strokeWidth={2} name="Sales ($)" />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(275, 100%, 40%)" fill="url(#revenueGradient)" strokeWidth={2} name="Revenue ($)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Category Distribution */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {categoryData.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-muted-foreground">{cat.name}</span>
                          </div>
                          <span className="font-medium">{cat.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Monthly Revenue */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="glass-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-success">
                      <TrendingUp className="w-4 h-4" />
                      +18.2% YoY
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" fill="hsl(275, 100%, 40%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Hourly Traffic */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Hourly Traffic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={hourlyTraffic}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="customers" 
                          stroke="hsl(160, 84%, 39%)" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary gap-1">
                      View All <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={product.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                            {product.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{product.revenue}</p>
                            <p className={`text-sm flex items-center justify-end gap-1 ${product.trend > 0 ? 'text-success' : 'text-destructive'}`}>
                              {product.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                              {Math.abs(product.trend)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary gap-1">
                      View All <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((txn) => (
                        <div key={txn.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            txn.status === 'completed' ? 'bg-success/10' : 
                            txn.status === 'pending' ? 'bg-warning/10' : 'bg-destructive/10'
                          }`}>
                            <CreditCard className={`w-5 h-5 ${
                              txn.status === 'completed' ? 'text-success' : 
                              txn.status === 'pending' ? 'text-warning' : 'text-destructive'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{txn.customer}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{txn.id}</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{txn.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{txn.amount}</p>
                            <p className={`text-xs px-2 py-0.5 rounded-full ${
                              txn.status === 'completed' ? 'bg-success/10 text-success' : 
                              txn.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                            }`}>
                              {txn.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
