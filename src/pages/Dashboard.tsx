import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUp, ArrowDown, ArrowRight, TrendingUp, DollarSign, ShoppingCart,
  Users, Package, CreditCard, Clock, Calendar, MoreHorizontal, ChevronDown,
  LayoutDashboard, Receipt, BarChart3, Settings, LogOut, Store, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { LiveSalesWidgets } from '@/components/dashboard/LiveSalesWidgets';
import { useAuth, roleModules, roleMeta } from '@/hooks/useAuth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const allowed = roleModules[user.role];
  const meta = roleMeta[user.role];

  // Mock data
  const salesData = [
    { name: 'Mon', sales: 4200, revenue: 3800 },
    { name: 'Tue', sales: 5800, revenue: 5200 },
    { name: 'Wed', sales: 4900, revenue: 4400 },
    { name: 'Thu', sales: 6200, revenue: 5600 },
    { name: 'Fri', sales: 7800, revenue: 7000 },
    { name: 'Sat', sales: 9200, revenue: 8300 },
    { name: 'Sun', sales: 6500, revenue: 5900 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: 'hsl(219, 79%, 66%)' },
    { name: 'Clothing', value: 25, color: 'hsl(275, 100%, 40%)' },
    { name: 'Food', value: 20, color: 'hsl(160, 84%, 39%)' },
    { name: 'Home', value: 12, color: 'hsl(38, 92%, 50%)' },
    { name: 'Others', value: 8, color: 'hsl(330, 81%, 60%)' },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 245, revenue: '$244,755', trend: 12.5, image: '📱' },
    { name: 'MacBook Air M3', sales: 189, revenue: '$226,611', trend: 8.3, image: '💻' },
    { name: 'AirPods Pro', sales: 312, revenue: '$77,688', trend: 15.2, image: '🎧' },
    { name: 'Apple Watch', sales: 203, revenue: '$162,197', trend: 6.7, image: '⌚' },
  ];

  const recentTransactions = [
    { id: 'TXN001', customer: 'John Smith', amount: '$1,249', time: '2 min ago', status: 'completed' },
    { id: 'TXN002', customer: 'Sarah J.', amount: '$89.99', time: '15 min ago', status: 'completed' },
    { id: 'TXN003', customer: 'Mike Brown', amount: '$549', time: '32 min ago', status: 'pending' },
    { id: 'TXN004', customer: 'Emily Davis', amount: '$2,199', time: '1 hr ago', status: 'completed' },
  ];

  const stats = [
    { title: "Today's Revenue", value: '$12,426', change: '+12.5%', trend: 'up' as const, icon: DollarSign, color: 'text-accent-green', bgColor: 'bg-accent-green/10' },
    { title: 'Total Orders', value: '284', change: '+8.2%', trend: 'up' as const, icon: ShoppingCart, color: 'text-accent-blue', bgColor: 'bg-accent-blue/10' },
    { title: 'New Customers', value: '48', change: '+24.3%', trend: 'up' as const, icon: Users, color: 'text-accent-purple', bgColor: 'bg-accent-purple/10' },
    { title: 'Avg. Order', value: '$43.75', change: '-2.4%', trend: 'down' as const, icon: TrendingUp, color: 'text-accent-orange', bgColor: 'bg-accent-orange/10' },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const handleLogout = () => { logout(); navigate('/login'); };

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
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          {allowed.includes('billing') && (
            <Link to="/pos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Store className="w-5 h-5" /> POS Terminal
            </Link>
          )}
          {allowed.includes('inventory') && (
            <Link to="/inventory" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Package className="w-5 h-5" /> Inventory
            </Link>
          )}
          {allowed.includes('products') && (
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Receipt className="w-5 h-5" /> Products
            </a>
          )}
          {allowed.includes('customers') && (
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Users className="w-5 h-5" /> Customers
            </a>
          )}
          {allowed.includes('reports') && (
            <Link to="/audit-log" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <BarChart3 className="w-5 h-5" /> Audit Log
            </Link>
          )}
          {allowed.includes('settings') && (
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" /> Settings
            </a>
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
        {/* Header */}
        <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MobileDrawer />
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Dashboard</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
                <Calendar className="w-4 h-4" /> Today <ChevronDown className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="relative w-9 h-9">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">3</span>
              </Button>
              <ThemeToggle />
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-xs md:text-sm">
                {user.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 md:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat) => (
                <motion.div key={stat.title} variants={itemVariants}>
                  <Card className="glass-card border-border/50">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-xl md:text-3xl font-bold mt-1">{stat.value}</p>
                          <div className={`flex items-center gap-1 mt-1 text-xs md:text-sm ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                            {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {stat.change}
                          </div>
                        </div>
                        <div className={`p-2 md:p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts - Responsive */}
            {allowed.includes('reports') && (
              <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <Card className="glass-card border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base md:text-lg font-semibold">Sales Overview</CardTitle>
                      <Button variant="ghost" size="icon" className="w-8 h-8"><MoreHorizontal className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={salesData}>
                          <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(219, 79%, 66%)" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(219, 79%, 66%)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                          <Area type="monotone" dataKey="sales" stroke="hsl(219, 79%, 66%)" fill="url(#salesGradient)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-border/50 h-full">
                    <CardHeader><CardTitle className="text-base md:text-lg font-semibold">By Category</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value">
                            {categoryData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-3 space-y-1.5">
                        {categoryData.map((cat) => (
                          <div key={cat.name} className="flex items-center justify-between text-xs md:text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
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
            )}

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
              {/* Top Products */}
              {allowed.includes('products') && (
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base md:text-lg font-semibold">Top Products</CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary gap-1 text-xs">View All <ArrowRight className="w-3 h-3" /></Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topProducts.map((product) => (
                          <div key={product.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg">{product.image}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">{product.revenue}</p>
                              <p className={`text-xs ${product.trend > 0 ? 'text-success' : 'text-destructive'}`}>
                                {product.trend > 0 ? '+' : ''}{product.trend}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Recent Transactions */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base md:text-lg font-semibold">Recent Transactions</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary gap-1 text-xs">View All <ArrowRight className="w-3 h-3" /></Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentTransactions.map((txn) => (
                        <div key={txn.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            txn.status === 'completed' ? 'bg-success/10' : 'bg-warning/10'
                          }`}>
                            <CreditCard className={`w-4 h-4 ${txn.status === 'completed' ? 'text-success' : 'text-warning'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{txn.customer}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span>{txn.id}</span>
                              <span>•</span>
                              <span>{txn.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{txn.amount}</p>
                            <p className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              txn.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>{txn.status}</p>
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

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
};

export default Dashboard;
