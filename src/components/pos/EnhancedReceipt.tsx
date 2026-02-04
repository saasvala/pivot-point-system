import { motion } from 'framer-motion';
import { 
  Check, 
  Printer, 
  Mail, 
  MessageSquare, 
  ArrowRight, 
  Download,
  Copy,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentMethod, CartItem, Customer } from '@/types/pos';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface EnhancedReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: PaymentMethod;
  customer?: Customer;
  onPrint: () => void;
  onEmail: () => void;
  onNewSale: () => void;
}

export const EnhancedReceipt = ({
  isOpen,
  onClose,
  transactionId,
  items,
  subtotal,
  tax,
  discount,
  total,
  amountPaid,
  change,
  paymentMethod,
  customer,
  onPrint,
  onEmail,
  onNewSale,
}: EnhancedReceiptProps) => {
  if (!isOpen) return null;

  const paymentLabels: Record<PaymentMethod, string> = {
    cash: 'Cash',
    card: 'Card',
    upi: 'UPI',
    wallet: 'Wallet',
    split: 'Split Payment',
    credit: 'Credit',
  };

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    toast.success('Transaction ID copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg glass-card rounded-2xl overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-success/20 to-success/5 pt-8 pb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4 shadow-glow-success"
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
            <h2 className="text-2xl font-bold text-foreground mb-1">Payment Successful!</h2>
            <p className="text-muted-foreground">Transaction completed</p>
          </motion.div>
        </div>

        {/* Receipt Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 py-6 space-y-4"
        >
          {/* Transaction ID */}
          <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
            <div>
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono font-semibold text-foreground">{transactionId}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopyTransactionId}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Items Summary */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Items ({items.length})</p>
            <div className="bg-muted/20 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment Method</span>
              <span className="font-medium text-foreground">{paymentLabels[paymentMethod]}</span>
            </div>
            {paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Amount Paid</span>
                  <span>${amountPaid.toFixed(2)}</span>
                </div>
                {change > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-success">
                    <span>Change</span>
                    <span>${change.toFixed(2)}</span>
                  </div>
                )}
              </>
            )}
            {customer && (
              <div className="flex justify-between text-sm text-muted-foreground pt-2">
                <span>Customer</span>
                <span className="font-medium text-foreground">{customer.name}</span>
              </div>
            )}
          </div>

          {/* Receipt Actions */}
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={onPrint}>
              <Printer className="w-5 h-5" />
              <span className="text-xs">Print</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={onEmail}>
              <Mail className="w-5 h-5" />
              <span className="text-xs">Email</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={() => toast.success('Sent via WhatsApp')}>
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={() => toast.success('Receipt downloaded')}>
              <Download className="w-5 h-5" />
              <span className="text-xs">Download</span>
            </Button>
          </div>

          {/* New Sale Button */}
          <Button
            variant="gradient"
            size="xl"
            className="w-full gap-2 h-14"
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
