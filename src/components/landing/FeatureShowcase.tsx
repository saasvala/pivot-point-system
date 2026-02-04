import { motion } from 'framer-motion';
import { 
  ScanBarcode, 
  CreditCard, 
  Percent, 
  Calculator, 
  Receipt, 
  WifiOff,
  Banknote,
  FileText,
  Timer,
  Package,
  Barcode,
  Palette,
  Bell,
  Calendar,
  ArrowLeftRight,
  Layers,
  Users,
  History,
  Gift,
  Wallet,
  StickyNote,
  Sparkles,
  BarChart3,
  TrendingUp,
  PieChart,
  LineChart,
  FileSpreadsheet,
  Download,
  Building2,
  MapPin,
  GitCompare,
  DollarSign,
  Globe,
  UserCircle,
  KeyRound,
  Activity,
  ShieldCheck,
  Lock,
  FileCheck,
  Printer,
  Mail,
  RotateCcw,
  FileMinus,
  Crown,
  Rocket,
  Settings,
  ArrowUpDown,
  Headphones,
  type LucideIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Feature {
  icon: LucideIcon;
  title: string;
}

interface FeatureCategory {
  id: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  description: string;
  colorClass: string;
  bgClass: string;
  glowClass: string;
  borderClass: string;
  features: Feature[];
}

const featureCategories: FeatureCategory[] = [
  {
    id: 'pos-billing',
    name: 'Smart POS Billing',
    shortName: 'POS',
    icon: ScanBarcode,
    description: 'Ultra-fast checkout experience with intelligent billing features',
    colorClass: 'text-accent-blue',
    bgClass: 'bg-accent-blue/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--accent-blue)/0.3)]',
    borderClass: 'border-accent-blue/30',
    features: [
      { icon: Timer, title: 'Ultra Fast Billing' },
      { icon: ScanBarcode, title: 'Barcode Scanning' },
      { icon: Package, title: 'Product Search & Categories' },
      { icon: Percent, title: 'Discount & Coupon Support' },
      { icon: Calculator, title: 'Tax Automation (GST/VAT)' },
      { icon: Layers, title: 'Split & Hold Bills' },
      { icon: CreditCard, title: 'Multiple Payment Modes' },
      { icon: Receipt, title: 'Instant Invoice Generation' },
      { icon: WifiOff, title: 'Offline Billing + Auto Sync' },
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory & Products',
    shortName: 'Inventory',
    icon: Package,
    description: 'Complete product and stock management system',
    colorClass: 'text-accent-purple',
    bgClass: 'bg-accent-purple/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--accent-purple)/0.3)]',
    borderClass: 'border-accent-purple/30',
    features: [
      { icon: Package, title: 'Unlimited Products' },
      { icon: Barcode, title: 'SKU & Barcode Management' },
      { icon: Palette, title: 'Variant Support (Size, Color)' },
      { icon: Activity, title: 'Real-time Stock Tracking' },
      { icon: Bell, title: 'Low Stock Alerts' },
      { icon: Calendar, title: 'Batch & Expiry Tracking' },
      { icon: ArrowLeftRight, title: 'Stock Transfer' },
      { icon: Layers, title: 'Combo & Bundle Products' },
    ]
  },
  {
    id: 'crm',
    name: 'Customer CRM & Loyalty',
    shortName: 'CRM',
    icon: Users,
    description: 'Build lasting relationships with your customers',
    colorClass: 'text-accent-green',
    bgClass: 'bg-accent-green/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--accent-green)/0.3)]',
    borderClass: 'border-accent-green/30',
    features: [
      { icon: Users, title: 'Customer Database' },
      { icon: History, title: 'Purchase History' },
      { icon: Gift, title: 'Loyalty Points System' },
      { icon: Wallet, title: 'Wallet & Credit' },
      { icon: StickyNote, title: 'Customer Notes & Tags' },
      { icon: Sparkles, title: 'Birthday Automation' },
    ]
  },
  {
    id: 'analytics',
    name: 'Reports & Analytics',
    shortName: 'Analytics',
    icon: BarChart3,
    description: 'Data-driven insights to grow your business',
    colorClass: 'text-accent-orange',
    bgClass: 'bg-accent-orange/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--accent-orange)/0.3)]',
    borderClass: 'border-accent-orange/30',
    features: [
      { icon: TrendingUp, title: 'Real-time Sales Dashboard' },
      { icon: BarChart3, title: 'Daily/Monthly Reports' },
      { icon: PieChart, title: 'Payment Method Analytics' },
      { icon: Users, title: 'Staff Performance' },
      { icon: LineChart, title: 'Profit & Margin Tracking' },
      { icon: FileSpreadsheet, title: 'Inventory Valuation' },
      { icon: Download, title: 'Export PDF/Excel/CSV' },
    ]
  },
  {
    id: 'multi-branch',
    name: 'Multi-Branch & Franchise',
    shortName: 'Branches',
    icon: Building2,
    description: 'Manage multiple locations from one dashboard',
    colorClass: 'text-accent-indigo',
    bgClass: 'bg-accent-indigo/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--accent-indigo)/0.3)]',
    borderClass: 'border-accent-indigo/30',
    features: [
      { icon: Building2, title: 'Multiple Branch Control' },
      { icon: Package, title: 'Centralized Inventory' },
      { icon: GitCompare, title: 'Branch Comparison' },
      { icon: MapPin, title: 'Location-based Pricing' },
      { icon: Globe, title: 'Franchise Analytics' },
    ]
  },
  {
    id: 'staff',
    name: 'Staff & Roles',
    shortName: 'Staff',
    icon: UserCircle,
    description: 'Complete team and permission management',
    colorClass: 'text-accent-teal',
    bgClass: 'bg-accent-teal/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--accent-teal)/0.3)]',
    borderClass: 'border-accent-teal/30',
    features: [
      { icon: KeyRound, title: 'Staff Login & PIN' },
      { icon: ShieldCheck, title: 'Role-based Permissions' },
      { icon: Activity, title: 'Activity Tracking' },
      { icon: Percent, title: 'Discount Approval' },
      { icon: Lock, title: 'Branch Access Control' },
    ]
  },
  {
    id: 'invoicing',
    name: 'Invoicing & Payments',
    shortName: 'Invoices',
    icon: FileText,
    description: 'Professional invoicing and payment processing',
    colorClass: 'text-info',
    bgClass: 'bg-info/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--info)/0.3)]',
    borderClass: 'border-info/30',
    features: [
      { icon: FileCheck, title: 'GST Compliant Invoices' },
      { icon: Printer, title: 'Thermal & A4 Printing' },
      { icon: Mail, title: 'Email & WhatsApp' },
      { icon: RotateCcw, title: 'Refund Management' },
      { icon: FileMinus, title: 'Credit Notes' },
    ]
  },
  {
    id: 'saas',
    name: 'SaaS & Subscription',
    shortName: 'SaaS',
    icon: Crown,
    description: 'Enterprise-grade subscription management',
    colorClass: 'text-accent-pink',
    bgClass: 'bg-accent-pink/10',
    glowClass: 'shadow-[0_0_30px_hsl(var(--accent-pink)/0.3)]',
    borderClass: 'border-accent-pink/30',
    features: [
      { icon: Building2, title: 'Multi-tenant Accounts' },
      { icon: Rocket, title: 'Free Trial & Plans' },
      { icon: Settings, title: 'Feature-based Pricing' },
      { icon: ArrowUpDown, title: 'Plan Upgrade/Downgrade' },
      { icon: Headphones, title: 'Super Admin Control' },
    ]
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const FeatureCard = ({ category }: { category: FeatureCategory }) => {
  const IconComponent = category.icon;
  
  return (
    <motion.div
      variants={itemVariants}
      className={`
        glass-card rounded-2xl p-6 border ${category.borderClass}
        hover:${category.glowClass} transition-all duration-500
        group cursor-pointer relative overflow-hidden
      `}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Gradient top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${category.bgClass.replace('/10', '')}`} />
      
      {/* Icon */}
      <div className={`
        w-14 h-14 rounded-2xl ${category.bgClass} 
        flex items-center justify-center mb-5
        group-hover:scale-110 transition-transform duration-300
      `}>
        <IconComponent className={`w-7 h-7 ${category.colorClass}`} />
      </div>
      
      {/* Title & Description */}
      <h3 className="text-lg font-bold mb-2 group-hover:text-foreground transition-colors">
        {category.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        {category.description}
      </p>
      
      {/* Feature list */}
      <ul className="space-y-2.5">
        {category.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm">
            <div className={`w-6 h-6 rounded-lg ${category.bgClass} flex items-center justify-center flex-shrink-0`}>
              <feature.icon className={`w-3.5 h-3.5 ${category.colorClass}`} />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {feature.title}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const FeatureShowcase = () => {
  return (
    <section id="features" className="relative z-10 py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Complete Feature Suite</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything Your Business <span className="gradient-text">Needs</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            8 powerful modules, 60+ features. One platform built for modern retail, restaurants, and service businesses.
          </p>
        </motion.div>

        {/* Tabs for Mobile/Tablet, Grid for Desktop */}
        <div className="block lg:hidden">
          <Tabs defaultValue="pos-billing" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent justify-center mb-8">
              {featureCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className={`
                    data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                    rounded-full px-4 py-2 text-sm font-medium
                    border border-border/50 hover:border-primary/50 transition-all
                  `}
                >
                  <cat.icon className="w-4 h-4 mr-2" />
                  {cat.shortName}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {featureCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <FeatureCard category={category} />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Desktop Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden lg:grid lg:grid-cols-4 gap-6"
        >
          {featureCategories.map((category) => (
            <FeatureCard key={category.id} category={category} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">
              Ready to transform your business?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join 50,000+ businesses already using NexusPOS for smarter operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient rounded-full px-8 py-3 font-semibold text-primary-foreground"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline-glow rounded-full px-8 py-3 font-semibold"
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
