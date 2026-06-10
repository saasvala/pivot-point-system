import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2, Sparkles, Check,
  ShieldCheck, Crown, BarChart3, Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { toast } from 'sonner';
import posHero3D from '@/assets/pos-hero-3d.png';

const roleButtons: { role: UserRole; label: string; icon: typeof ShieldCheck; desc: string }[] = [
  { role: 'super_admin', label: 'Super Admin', icon: ShieldCheck, desc: 'Full system access' },
  { role: 'owner', label: 'Owner', icon: Crown, desc: 'Business management' },
  { role: 'manager', label: 'Manager', icon: BarChart3, desc: 'Operations & reports' },
  { role: 'cashier', label: 'Cashier', icon: Receipt, desc: 'Billing & sales' },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleRoleLogin = (role: UserRole) => {
    loginAs(role);
    navigate('/dashboard');
  };

  const features = [
    'Cloud-based POS for all devices',
    'Real-time sales analytics',
    'Inventory & staff management',
    'Secure payment processing',
    'Multi-branch support',
    '24/7 customer support'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-20 py-8 bg-background relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">NexusPOS</span>
          </Link>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Sign in to access your POS dashboard' : 'Start your 14-day free trial today'}
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="flex p-1 mb-6 bg-muted rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <motion.form
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="business" className="text-sm font-medium">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="business" type="text" placeholder="My Retail Store" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="pl-10 h-11 rounded-xl" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11 rounded-xl" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</Label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const e = window.prompt('Enter the email to receive a reset link:');
                    if (e && /\S+@\S+\.\S+/.test(e)) toast.success(`Reset link sent to ${e}`);
                    else if (e) toast.error('Invalid email address');
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-xl btn-gradient text-sm font-semibold gap-2"
              onClick={() => {
                if (isLogin) toast.info('Use the Quick Demo Login below to enter');
                else toast.info('Demo mode — use Quick Demo Login below to explore roles');
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.form>

          {/* Quick Role Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-muted-foreground bg-background">Quick Demo Login</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {roleButtons.map((rb) => (
              <motion.button
                key={rb.role}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleLogin(rb.role)}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all touch-manipulation text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <rb.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight truncate">{rb.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{rb.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - 3D Graphic & Info (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent-indigo" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full border border-white/10" />
          <motion.div animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full border border-white/10" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="mb-10">
            <img src={posHero3D} alt="POS System" className="w-full max-w-lg drop-shadow-2xl" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted by 50,000+ businesses</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">All-in-One POS for Modern Business</h2>
            <p className="text-white/80 mb-8">From checkout to inventory, manage your entire business from one powerful platform.</p>
            <ul className="space-y-3 text-left">
              {features.map((feature, index) => (
                <motion.li key={feature} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.1 }} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3" /></div>
                  <span className="text-sm text-white/90">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
