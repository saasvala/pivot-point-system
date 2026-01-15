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
  ChefHat,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second billing with optimized performance',
      gradient: 'gradient-card-peach',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption & compliance',
      gradient: 'gradient-card-mint',
    },
    {
      icon: Globe,
      title: 'Multi-Branch',
      description: 'Manage unlimited locations from one dashboard',
      gradient: 'gradient-card-purple',
    },
    {
      icon: Cloud,
      title: 'Cloud-Native',
      description: 'Access your data anywhere, anytime',
      gradient: 'gradient-card-blue',
    },
    {
      icon: Smartphone,
      title: 'Offline-First',
      description: 'Works without internet, syncs when connected',
      gradient: 'gradient-card-pink',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Insights that drive business growth',
      gradient: 'gradient-card-peach',
    },
  ];

  const industries = [
    { icon: Store, name: 'Retail', gradient: 'gradient-card-blue' },
    { icon: ChefHat, name: 'Restaurants', gradient: 'gradient-card-peach' },
    { icon: Package, name: 'Supermarkets', gradient: 'gradient-card-mint' },
    { icon: CreditCard, name: 'Services', gradient: 'gradient-card-purple' },
    { icon: Users, name: 'Salons', gradient: 'gradient-card-pink' },
    { icon: Globe, name: 'Franchises', gradient: 'gradient-card-blue' },
  ];

  const productCards = [
    { title: 'Saiplore', subtitle: 'Gamma', gradient: 'from-pink-200 via-purple-200 to-blue-200' },
    { title: 'Total Go', subtitle: 'Exocred Ediness', gradient: 'from-cyan-200 via-teal-200 to-blue-200' },
    { title: 'Totule Plat', subtitle: 'Souringe Shaca', gradient: 'from-pink-100 via-rose-100 to-orange-100' },
    { title: 'Feel Blor', subtitle: 'Gradest Athor', gradient: 'from-purple-200 via-indigo-200 to-blue-200' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background - Soft Organic Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full organic-gradient" />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full morph-shape"
          style={{ background: 'radial-gradient(circle, hsl(270 100% 92% / 0.5), transparent 70%)' }}
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full morph-shape"
          style={{ background: 'radial-gradient(circle, hsl(330 100% 92% / 0.5), transparent 70%)' }}
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(210 100% 94% / 0.4), transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 glass-card border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">NexusPOS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#industries" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Industries</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button>
            <Link to="/pos">
              <Button size="sm" className="gap-2 rounded-full bg-gradient-to-r from-pastel-pink via-pastel-purple to-pastel-blue text-foreground hover:opacity-90 shadow-md">
                Launch POS
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Enterprise-Grade POS SaaS</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              Product Design
              <br />
              <span className="gradient-text">Page Web</span>
              <br />
              <span className="text-foreground">Slider Block</span>
            </h1>

            <p className="text-base text-muted-foreground mb-8 max-w-md leading-relaxed">
              Cloud-native, multi-tenant point of sale software built for retail, 
              restaurants, and service businesses of all sizes.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/pos">
                <Button className="rounded-full px-6 bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:opacity-90 shadow-lg">
                  Try Live Demo
                </Button>
              </Link>
              <Button variant="outline" className="rounded-full px-6 border-2 bg-white/50 backdrop-blur-sm">
                Watch Video
              </Button>
              <span className="text-xs text-muted-foreground ml-2">Some helper notes</span>
            </div>
          </motion.div>

          {/* Right Content - Product Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1 row-span-2 rounded-3xl p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 shadow-xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 via-purple-200/50 to-cyan-200/50" />
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-foreground mb-1">Saiplore</h3>
                <p className="text-lg text-muted-foreground mb-4">Gamma</p>
                <div className="h-2 w-16 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 mb-2" />
                <p className="text-sm text-muted-foreground">Gountnt Onbrew</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex gap-2">
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-300 to-cyan-300 text-sm font-medium text-foreground shadow-sm">Quick View</span>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-300 to-rose-300 text-sm font-medium text-foreground shadow-sm">Learn More</span>
              </div>
            </motion.div>

            {/* Top Right Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl p-5 bg-gradient-to-br from-cyan-100 via-teal-50 to-blue-100 shadow-lg"
            >
              <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-cyan-200 to-blue-200 mb-3" />
              <h4 className="font-semibold text-foreground">Total Go</h4>
              <p className="text-sm text-muted-foreground">Exocred Ediness</p>
              <div className="mt-3 h-1.5 w-12 rounded-full bg-gradient-to-r from-teal-300 to-cyan-300" />
            </motion.div>

            {/* Middle Right Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl p-5 bg-white/70 backdrop-blur-sm shadow-lg border border-white/80"
            >
              <div className="h-12 w-full rounded-2xl bg-gradient-to-r from-pink-100 to-orange-100 mb-3" />
              <h4 className="font-semibold text-foreground">Totule Plat</h4>
              <p className="text-sm text-muted-foreground">Souringe Shaca</p>
            </motion.div>

            {/* Bottom Cards Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="col-span-2 grid grid-cols-2 gap-4"
            >
              <div className="rounded-3xl p-5 bg-white/70 backdrop-blur-sm shadow-lg border border-white/80">
                <p className="text-sm text-muted-foreground mb-1">Gradest Athor</p>
                <h4 className="font-semibold text-foreground">AwlOmss</h4>
              </div>
              <div className="rounded-3xl p-5 bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg">
                <p className="text-sm text-muted-foreground mb-1">Feel Blor</p>
                <div className="h-8 w-full rounded-xl bg-gradient-to-r from-purple-200 to-indigo-200" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
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
                className={`${feature.gradient} rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mb-4 shadow-sm">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
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
                className={`${industry.gradient} rounded-3xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <industry.icon className="w-6 h-6 text-foreground" />
                </div>
                <p className="font-medium text-foreground">{industry.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] p-8 md:p-12 text-center max-w-4xl mx-auto bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start your free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/pos">
                <Button className="rounded-full px-8 py-6 bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:opacity-90 shadow-lg text-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="rounded-full px-8 py-6 bg-white/60 backdrop-blur-sm text-lg">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-foreground">N</span>
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
