import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Pause,
  RotateCcw,
  Receipt,
  Users,
  Calculator,
  CreditCard,
  Gift,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuickActionsProps {
  onHoldOrder: () => void;
  onRecallOrder: () => void;
  onViewReceipts: () => void;
  onManageCustomers: () => void;
}

export const QuickActions = ({
  onHoldOrder,
  onRecallOrder,
  onViewReceipts,
  onManageCustomers
}: QuickActionsProps) => {
  const navigate = useNavigate();

  const openCalculator = () => {
    const expr = window.prompt('Calculator — enter an expression (e.g. 12.5 * 3 + 2):');
    if (!expr) return;
    try {
      if (!/^[-+/*().\d\s]+$/.test(expr)) throw new Error('Invalid characters');
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr});`)();
      toast.success(`Result: ${result}`);
    } catch {
      toast.error('Invalid expression');
    }
  };

  const handlePayOut = () => {
    const amount = window.prompt('Cash Pay Out — enter amount removed from drawer:');
    if (!amount) return;
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Enter a valid positive amount');
      return;
    }
    toast.success(`Pay out recorded: $${value.toFixed(2)}`);
  };

  const handleGiftCard = () => {
    const code = window.prompt('Gift Card — enter card code to redeem:');
    if (!code) return;
    toast.success(`Gift card ${code.toUpperCase()} applied`);
  };

  const actions = [
    { icon: Pause, label: 'Hold', onClick: onHoldOrder, color: 'text-warning' },
    { icon: RotateCcw, label: 'Recall', onClick: onRecallOrder, color: 'text-info' },
    { icon: Receipt, label: 'Receipts', onClick: onViewReceipts, color: 'text-success' },
    { icon: Users, label: 'Customers', onClick: onManageCustomers, color: 'text-secondary' },
    { icon: Calculator, label: 'Calculator', onClick: openCalculator, color: 'text-muted-foreground' },
    { icon: CreditCard, label: 'Pay Out', onClick: handlePayOut, color: 'text-accent-orange' },
    { icon: Gift, label: 'Gift Card', onClick: handleGiftCard, color: 'text-accent-pink' },
    { icon: FileText, label: 'Reports', onClick: () => navigate('/reports'), color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <Button
            variant="ghost"
            className="w-full h-auto flex-col gap-1 py-3 hover:bg-muted/50"
            onClick={action.onClick}
          >
            <action.icon className={`w-5 h-5 ${action.color}`} />
            <span className="text-xs text-muted-foreground">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
