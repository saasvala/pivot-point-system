import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3,
  Smartphone,
  Cloud,
  Users,
  CreditCard,
  Package,
  Store,
  ChefHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second billing with optimized performance',
      color: 'text-neon-cyan',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption & compliance',
      color: 'text-neon-green',
    },
    {
      icon: Globe,
      title: 'Multi-Branch',
      description: 'Manage unlimited locations from one dashboard',
      color: 'text-neon-purple',
    },
    {
      icon: Cloud,
      title: 'Cloud-Native',
      description: 'Access your data anywhere, anytime',
      color: 'text-neon-cyan',
    },
    {
      icon: Smartphone,
      title: 'Offline-First',
      description: 'Works without internet, syncs when connected',
      color: 'text-neon-orange',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Insights that drive business growth',
      color: 'text-neon-pink',
    },
  ];

  const industries = [
    { icon: Store, name: 'Retail', color: 'from-blue-500/20 to-cyan-500/20' },
    { icon: ChefHat, name: 'Restaurants', color: 'from-orange-500/20 to-red-500/20' },
    { icon: Package, name: 'Supermarkets', color: 'from-green-500/20 to-emerald-500/20' },
    { icon: CreditCard, name: 'Services', color: 'from-purple-500/20 to-pink-500/20' },
    { icon: Users, name: 'Salons', color: 'from-pink-500/20 to-rose-500/20' },
    { icon: Globe, name: 'Franchises', color: 'from-cyan-500/20 to-blue-500/20' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-green/5 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 glass-card border-b border-border/30"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold gradient-text">NexusPOS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#industries" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Industries</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Link to="/pos">
              <Button variant="default" size="sm" className="gap-2">
                Launch POS
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-muted-foreground">Enterprise-Grade POS SaaS</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            The World's Most
            <br />
            <span className="gradient-text text-glow-cyan">Powerful POS</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Cloud-native, multi-tenant point of sale software built for retail, 
            restaurants, and service businesses of all sizes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pos">
              <Button variant="neonCyan" size="xl" className="gap-2 min-w-[200px]">
                Try Live Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="min-w-[200px]">
              Watch Video
            </Button>
          </div>
        </motion.div>

        {/* Preview Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative"
        >
          <div className="glass-card rounded-2xl p-2 md:p-4 shadow-2xl mx-auto max-w-5xl neon-glow-cyan">
            <div className="bg-card rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">POS Terminal Preview</h3>
                <p className="text-muted-foreground mb-4">Experience the next generation of point of sale</p>
                <Link to="/pos">
                  <Button variant="default" className="gap-2">
                    Launch Demo <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 top-1/4 glass-card rounded-xl p-4 hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today's Sales</p>
                <p className="text-lg font-bold text-success">$12,450</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-1/3 glass-card rounded-xl p-4 hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Users</p>
                <p className="text-lg font-bold text-primary">2,847</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="gradient-text">Modern Businesses</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run your business, in one powerful platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="relative z-10 py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Platform, <span className="gradient-text">Every Industry</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for retail, hospitality, and service businesses.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br ${industry.color}`}
              >
                <industry.icon className="w-8 h-8 mx-auto mb-3 text-foreground" />
                <p className="font-medium text-foreground">{industry.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto neon-glow-purple"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start your free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/pos">
                <Button variant="neonCyan" size="xl" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">N</span>
              </div>
              <span className="font-semibold text-foreground">NexusPOS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 NexusPOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;