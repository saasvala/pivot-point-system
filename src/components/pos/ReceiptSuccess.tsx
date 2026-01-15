import { motion } from 'framer-motion';
import { Check, Printer, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/pos';

interface ReceiptSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  total: number;
  paymentMethod: PaymentMethod;
  onPrint: () => void;
  onEmail: () => void;
  onNewSale: () => void;
}

export const ReceiptSuccess = ({
  isOpen,
  onClose,
  transactionId,
  total,
  paymentMethod,
  onPrint,
  onEmail,
  onNewSale,
}: ReceiptSuccessProps) => {
  if (!isOpen) return null;

  const paymentLabels: Record<PaymentMethod, string> = {
    cash: 'Cash',
    card: 'Card',
    upi: 'UPI',
    wallet: 'Wallet',
    split: 'Split Payment',
    credit: 'Credit',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-2xl overflow-hidden text-center"
      >
        {/* Success Animation */}
        <div className="pt-10 pb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4 neon-glow-green"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Check className="w-10 h-10 text-success" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground">Transaction completed</p>
          </motion.div>
        </div>

        {/* Transaction Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 pb-6 space-y-4"
        >
          <div className="py-4 rounded-xl bg-muted/30 space-y-2">
            <div className="flex justify-between px-4 text-sm">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-foreground">{transactionId}</span>
            </div>
            <div className="flex justify-between px-4 text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="text-foreground">{paymentLabels[paymentMethod]}</span>
            </div>
            <div className="flex justify-between px-4 text-lg font-bold">
              <span className="text-muted-foreground">Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Receipt Options */}
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={onPrint}>
              <Printer className="w-5 h-5" />
              <span className="text-xs">Print</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={onEmail}>
              <Mail className="w-5 h-5" />
              <span className="text-xs">Email</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 gap-1">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">WhatsApp</span>
            </Button>
          </div>

          {/* New Sale Button */}
          <Button
            variant="neonCyan"
            size="xl"
            className="w-full gap-2"
            onClick={onNewSale}
          >
            New Sale
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
