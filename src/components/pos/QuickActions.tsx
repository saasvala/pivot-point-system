import { motion } from 'framer-motion';
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
  const actions = [
    { icon: Pause, label: 'Hold', onClick: onHoldOrder, color: 'text-warning' },
    { icon: RotateCcw, label: 'Recall', onClick: onRecallOrder, color: 'text-info' },
    { icon: Receipt, label: 'Receipts', onClick: onViewReceipts, color: 'text-success' },
    { icon: Users, label: 'Customers', onClick: onManageCustomers, color: 'text-secondary' },
    { icon: Calculator, label: 'Calculator', onClick: () => {}, color: 'text-muted-foreground' },
    { icon: CreditCard, label: 'Pay Out', onClick: () => {}, color: 'text-accent-orange' },
    { icon: Gift, label: 'Gift Card', onClick: () => {}, color: 'text-accent-pink' },
    { icon: FileText, label: 'Reports', onClick: () => {}, color: 'text-primary' },
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
