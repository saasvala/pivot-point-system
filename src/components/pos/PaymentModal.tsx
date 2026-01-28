import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Wallet,
  QrCode,
  ArrowRight,
  Check,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem, PaymentMethod } from '@/types/pos';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  tax: number;
  onPaymentComplete: (method: PaymentMethod) => void;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  items,
  total,
  tax,
  onPaymentComplete,
}: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: { id: PaymentMethod; icon: typeof CreditCard; label: string; color: string }[] = [
    { id: 'cash', icon: Banknote, label: 'Cash', color: 'text-success' },
    { id: 'card', icon: CreditCard, label: 'Card', color: 'text-info' },
    { id: 'upi', icon: Smartphone, label: 'UPI', color: 'text-secondary' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', color: 'text-warning' },
    { id: 'split', icon: Calculator, label: 'Split', color: 'text-accent-pink' },
  ];

  const quickCashAmounts = [10, 20, 50, 100, 200, 500];

  const cashChange = cashReceived ? parseFloat(cashReceived) - total : 0;

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    onPaymentComplete(selectedMethod);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-xl font-bold text-foreground">Payment</h2>
              <p className="text-sm text-muted-foreground">{items.length} items in cart</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Total Display */}
            <div className="text-center py-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-4xl font-bold gradient-text text-glow-cyan">${total.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Including ${tax.toFixed(2)} tax</p>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Select Payment Method</p>
              <div className="grid grid-cols-5 gap-3">
                {paymentMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant="outline"
                    className={cn(
                      "flex-col h-auto py-4 gap-2",
                      selectedMethod === method.id && "border-primary bg-primary/10 shadow-glow-primary"
                    )}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <method.icon className={cn("w-6 h-6", method.color)} />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Cash Payment Details */}
            {selectedMethod === 'cash' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Cash Received</p>
                  <Input
                    type="number"
                    placeholder="Enter amount..."
                    value={cashReceived}
                    onChange={e => setCashReceived(e.target.value)}
                    className="text-2xl font-bold h-14 text-center"
                  />
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {quickCashAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setCashReceived(amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                {cashChange > 0 && (
                  <div className="text-center py-3 rounded-xl bg-success/10 border border-success/30">
                    <p className="text-sm text-muted-foreground">Change Due</p>
                    <p className="text-2xl font-bold text-success">${cashChange.toFixed(2)}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Card Payment */}
            {selectedMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium">Tap, Insert, or Swipe Card</p>
                <p className="text-sm text-muted-foreground">Waiting for card reader...</p>
              </motion.div>
            )}

            {/* UPI Payment */}
            {selectedMethod === 'upi' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-32 h-32 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-20 h-20 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Scan QR Code to Pay</p>
                <p className="text-sm text-muted-foreground">Or enter UPI ID manually</p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border/50 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="posCheckout"
              className="flex-1 gap-2"
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing || (selectedMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total))}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  Complete Payment
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
