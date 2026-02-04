import { motion } from 'framer-motion';
import { 
  Pause, 
  Trash2, 
  Split, 
  Keyboard, 
  RotateCcw,
  Percent,
  User,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BottomActionBarProps {
  onHoldBill: () => void;
  onClearCart: () => void;
  onSplitBill: () => void;
  onRecallBill: () => void;
  onApplyDiscount: () => void;
  onSelectCustomer: () => void;
  onViewReceipts: () => void;
  cartItemCount: number;
  hasHeldBills?: number;
}

export const BottomActionBar = ({
  onHoldBill,
  onClearCart,
  onSplitBill,
  onRecallBill,
  onApplyDiscount,
  onSelectCustomer,
  onViewReceipts,
  cartItemCount,
  hasHeldBills = 0,
}: BottomActionBarProps) => {
  const actions = [
    { 
      icon: Pause, 
      label: 'Hold', 
      shortcut: 'F5',
      onClick: onHoldBill, 
      color: 'text-warning',
      bgColor: 'bg-warning/10 hover:bg-warning/20',
      disabled: cartItemCount === 0
    },
    { 
      icon: RotateCcw, 
      label: 'Recall', 
      shortcut: 'F6',
      onClick: onRecallBill, 
      color: 'text-info',
      bgColor: 'bg-info/10 hover:bg-info/20',
      badge: hasHeldBills > 0 ? hasHeldBills : undefined
    },
    { 
      icon: Split, 
      label: 'Split', 
      shortcut: 'F7',
      onClick: onSplitBill, 
      color: 'text-secondary',
      bgColor: 'bg-secondary/10 hover:bg-secondary/20',
      disabled: cartItemCount < 2
    },
    { 
      icon: Percent, 
      label: 'Discount', 
      shortcut: 'F8',
      onClick: onApplyDiscount, 
      color: 'text-success',
      bgColor: 'bg-success/10 hover:bg-success/20',
      disabled: cartItemCount === 0
    },
    { 
      icon: User, 
      label: 'Customer', 
      shortcut: 'F9',
      onClick: onSelectCustomer, 
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20'
    },
    { 
      icon: Receipt, 
      label: 'Receipts', 
      shortcut: 'F10',
      onClick: onViewReceipts, 
      color: 'text-accent-teal',
      bgColor: 'bg-accent-teal/10 hover:bg-accent-teal/20'
    },
    { 
      icon: Trash2, 
      label: 'Clear', 
      shortcut: 'Del',
      onClick: onClearCart, 
      color: 'text-destructive',
      bgColor: 'bg-destructive/10 hover:bg-destructive/20',
      disabled: cartItemCount === 0
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-t border-border/50 px-4 py-3"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-1">
            {actions.map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`relative h-12 px-4 gap-2 ${action.bgColor} ${action.disabled ? 'opacity-50' : ''}`}
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                    <span className="text-sm font-medium hidden sm:inline">{action.label}</span>
                    {action.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                        {action.badge}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{action.label} <span className="text-muted-foreground">({action.shortcut})</span></p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
            <Keyboard className="w-4 h-4" />
            <span>Press F1 for shortcuts</span>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};
