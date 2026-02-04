import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Wallet,
  QrCode,
  ArrowRight,
  Calculator,
  Clock,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem, PaymentMethod, Customer } from '@/types/pos';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customer?: Customer;
  onPaymentComplete: (method: PaymentMethod, amountPaid: number, change: number) => void;
}

type PaymentStep = 'method' | 'processing' | 'complete';

interface SplitPayment {
  method: PaymentMethod;
  amount: number;
}

export const EnhancedPaymentModal = ({
  isOpen,
  onClose,
  items,
  subtotal,
  tax,
  discount,
  total,
  customer,
  onPaymentComplete,
}: EnhancedPaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cashReceived, setCashReceived] = useState('');
  const [step, setStep] = useState<PaymentStep>('method');
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
  const [splitMode, setSplitMode] = useState(false);
  const [currentSplitAmount, setCurrentSplitAmount] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
      setCashReceived('');
      setStep('method');
      setSplitPayments([]);
      setSplitMode(false);
    }
  }, [isOpen]);

  const paymentMethods: { id: PaymentMethod; icon: typeof CreditCard; label: string; description: string; color: string }[] = [
    { id: 'cash', icon: Banknote, label: 'Cash', description: 'Accept cash payment', color: 'text-success' },
    { id: 'card', icon: CreditCard, label: 'Card', description: 'Credit/Debit card', color: 'text-info' },
    { id: 'upi', icon: Smartphone, label: 'UPI / QR', description: 'Scan & pay', color: 'text-secondary' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', description: 'Digital wallet', color: 'text-warning' },
    { id: 'credit', icon: Clock, label: 'Pay Later', description: 'Credit account', color: 'text-accent-pink' },
  ];

  const quickCashAmounts = [
    { value: Math.ceil(total), label: `$${Math.ceil(total)}` },
    { value: Math.ceil(total / 10) * 10, label: `$${Math.ceil(total / 10) * 10}` },
    { value: 50, label: '$50' },
    { value: 100, label: '$100' },
    { value: 200, label: '$200' },
    { value: 500, label: '$500' },
  ];

  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const cashChange = cashReceivedNum - total;
  const splitTotal = splitPayments.reduce((sum, p) => sum + p.amount, 0);
  const splitRemaining = total - splitTotal;

  const handlePayment = async () => {
    if (!selectedMethod && !splitMode) return;
    
    setStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStep('complete');
    
    setTimeout(() => {
      onPaymentComplete(
        splitMode ? 'split' : selectedMethod!,
        cashReceivedNum || total,
        Math.max(0, cashChange)
      );
    }, 1000);
  };

  const addSplitPayment = () => {
    if (!selectedMethod || !currentSplitAmount) return;
    const amount = parseFloat(currentSplitAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setSplitPayments([...splitPayments, { method: selectedMethod, amount }]);
    setCurrentSplitAmount('');
    setSelectedMethod(null);
  };

  const removeSplitPayment = (index: number) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };

  const canComplete = () => {
    if (splitMode) {
      return Math.abs(splitRemaining) < 0.01;
    }
    if (selectedMethod === 'cash') {
      return cashReceivedNum >= total;
    }
    return selectedMethod !== null;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl glass-card rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Payment</h2>
              <p className="text-sm text-muted-foreground">{items.length} items • {customer?.name || 'Walk-in Customer'}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {step === 'method' && (
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="rounded-xl bg-muted/30 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Due</span>
                    <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Mode Tabs */}
                <Tabs defaultValue="single" className="w-full" onValueChange={(v) => setSplitMode(v === 'split')}>
                  <TabsList className="w-full grid grid-cols-2 h-12">
                    <TabsTrigger value="single" className="text-sm font-medium">Single Payment</TabsTrigger>
                    <TabsTrigger value="split" className="text-sm font-medium">Split Payment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="mt-4 space-y-4">
                    {/* Payment Methods Grid */}
                    <div className="grid grid-cols-5 gap-3">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant="outline"
                          className={cn(
                            "flex-col h-auto py-5 gap-2 transition-all duration-200",
                            selectedMethod === method.id && "border-primary bg-primary/10 shadow-glow-primary scale-[1.02]"
                          )}
                          onClick={() => setSelectedMethod(method.id)}
                        >
                          <method.icon className={cn("w-7 h-7", method.color)} />
                          <span className="text-sm font-semibold">{method.label}</span>
                        </Button>
                      ))}
                    </div>

                    {/* Cash Payment Details */}
                    <AnimatePresence mode="wait">
                      {selectedMethod === 'cash' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Cash Received</label>
                            <Input
                              type="number"
                              placeholder="Enter amount..."
                              value={cashReceived}
                              onChange={e => setCashReceived(e.target.value)}
                              className="text-3xl font-bold h-16 text-center"
                              autoFocus
                            />
                          </div>

                          <div className="grid grid-cols-6 gap-2">
                            {quickCashAmounts.map((amount) => (
                              <Button
                                key={amount.value}
                                variant="outline"
                                className="h-11"
                                onClick={() => setCashReceived(amount.value.toString())}
                              >
                                {amount.label}
                              </Button>
                            ))}
                          </div>

                          {cashChange >= 0 && cashReceivedNum > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center py-4 rounded-xl bg-success/10 border border-success/30"
                            >
                              <p className="text-sm text-muted-foreground mb-1">Change Due</p>
                              <p className="text-4xl font-bold text-success">${cashChange.toFixed(2)}</p>
                            </motion.div>
                          )}

                          {cashReceivedNum > 0 && cashReceivedNum < total && (
                            <div className="text-center py-3 rounded-xl bg-warning/10 border border-warning/30">
                              <div className="flex items-center justify-center gap-2 text-warning">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Amount short by ${(total - cashReceivedNum).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {selectedMethod === 'card' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-10"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-20 h-20 rounded-full bg-info/20 flex items-center justify-center mx-auto mb-4"
                          >
                            <CreditCard className="w-10 h-10 text-info" />
                          </motion.div>
                          <p className="text-lg font-medium text-foreground">Ready for Card Payment</p>
                          <p className="text-sm text-muted-foreground mt-1">Tap, Insert, or Swipe Card</p>
                        </motion.div>
                      )}

                      {selectedMethod === 'upi' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8"
                        >
                          <div className="w-40 h-40 rounded-2xl bg-card border-2 border-dashed border-border flex items-center justify-center mx-auto mb-4">
                            <QrCode className="w-24 h-24 text-muted-foreground" />
                          </div>
                          <p className="text-lg font-medium text-foreground">Scan QR to Pay</p>
                          <p className="text-sm text-muted-foreground">UPI • Google Pay • PhonePe • Paytm</p>
                        </motion.div>
                      )}

                      {selectedMethod === 'credit' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8"
                        >
                          <div className="w-20 h-20 rounded-full bg-accent-pink/20 flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-10 h-10 text-accent-pink" />
                          </div>
                          <p className="text-lg font-medium text-foreground">Credit / Pay Later</p>
                          <p className="text-sm text-muted-foreground">Amount will be added to customer's credit account</p>
                          {!customer && (
                            <p className="text-sm text-warning mt-3 flex items-center justify-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Please select a customer for credit sales
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="split" className="mt-4 space-y-4">
                    {/* Split Payment Summary */}
                    <div className="rounded-xl bg-muted/30 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">Total: ${total.toFixed(2)}</span>
                        <span className={cn(
                          "font-bold",
                          splitRemaining > 0.01 ? "text-warning" : "text-success"
                        )}>
                          Remaining: ${Math.max(0, splitRemaining).toFixed(2)}
                        </span>
                      </div>

                      {/* Added Payments */}
                      {splitPayments.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {splitPayments.map((payment, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-card rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium capitalize">{payment.method}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">${payment.amount.toFixed(2)}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive"
                                  onClick={() => removeSplitPayment(idx)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Split Payment */}
                      {splitRemaining > 0.01 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-5 gap-2">
                            {paymentMethods.slice(0, 4).map((method) => (
                              <Button
                                key={method.id}
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "flex-col h-auto py-2 gap-1",
                                  selectedMethod === method.id && "border-primary bg-primary/10"
                                )}
                                onClick={() => setSelectedMethod(method.id)}
                              >
                                <method.icon className={cn("w-4 h-4", method.color)} />
                                <span className="text-xs">{method.label}</span>
                              </Button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder={`Amount (max $${splitRemaining.toFixed(2)})`}
                              value={currentSplitAmount}
                              onChange={e => setCurrentSplitAmount(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              onClick={addSplitPayment}
                              disabled={!selectedMethod || !currentSplitAmount}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {step === 'processing' && (
              <div className="p-6 flex flex-col items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-16 h-16 text-primary" />
                </motion.div>
                <p className="text-xl font-semibold mt-6">Processing Payment...</p>
                <p className="text-muted-foreground mt-2">Please wait</p>
              </div>
            )}

            {step === 'complete' && (
              <div className="p-6 flex flex-col items-center justify-center py-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center shadow-glow-success"
                >
                  <Check className="w-12 h-12 text-success" />
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mt-6"
                >
                  Payment Successful!
                </motion.p>
              </div>
            )}
          </div>

          {/* Footer */}
          {step === 'method' && (
            <div className="p-6 border-t border-border/50 flex gap-3">
              <Button variant="outline" className="flex-1 h-14" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="posCheckout"
                className="flex-1 h-14 gap-2 text-lg"
                onClick={handlePayment}
                disabled={!canComplete()}
              >
                Complete Payment
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
