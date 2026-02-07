import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  RotateCcw,
  AlertTriangle,
  Check,
  ShieldCheck,
  Minus,
  Plus,
  Receipt,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Transaction, RefundItem, PaymentMethod, StaffMember } from '@/types/pos';
import { completedTransactions } from '@/data/staffData';
import { PinAuthModal } from './PinAuthModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStaff?: StaffMember;
}

type RefundStep = 'search' | 'select' | 'confirm' | 'approval' | 'processing' | 'complete';

export const RefundModal = ({ isOpen, onClose, currentStaff }: RefundModalProps) => {
  const [step, setStep] = useState<RefundStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundItems, setRefundItems] = useState<RefundItem[]>([]);
  const [refundReason, setRefundReason] = useState('');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const resetState = useCallback(() => {
    setStep('search');
    setSearchQuery('');
    setSelectedTransaction(null);
    setRefundItems([]);
    setRefundReason('');
    setNeedsApproval(false);
  }, []);

  // Search transactions
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return completedTransactions.filter(
      t =>
        t.id.toLowerCase().includes(q) ||
        t.customer?.name.toLowerCase().includes(q) ||
        t.customer?.phone.includes(q)
    );
  }, [searchQuery]);

  const handleSelectTransaction = useCallback((tx: Transaction) => {
    setSelectedTransaction(tx);
    setRefundItems(
      tx.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        refundQuantity: 0,
        refundAmount: 0,
      }))
    );
    setStep('select');
  }, []);

  const updateRefundQuantity = useCallback((productId: string, delta: number) => {
    setRefundItems(prev =>
      prev.map(item => {
        if (item.product.id !== productId) return item;
        const newQty = Math.max(0, Math.min(item.quantity, item.refundQuantity + delta));
        const unitPrice = item.product.price;
        return { ...item, refundQuantity: newQty, refundAmount: newQty * unitPrice };
      })
    );
  }, []);

  const totalRefund = useMemo(
    () => refundItems.reduce((sum, item) => sum + item.refundAmount, 0),
    [refundItems]
  );

  const hasRefundItems = refundItems.some(i => i.refundQuantity > 0);

  const handleProceedToConfirm = useCallback(() => {
    if (!hasRefundItems) {
      toast.error('Select at least one item to refund');
      return;
    }
    setStep('confirm');
  }, [hasRefundItems]);

  const handleConfirmRefund = useCallback(() => {
    // Check if current staff can process refunds
    const canRefund = currentStaff?.permissions.canProcessRefund;
    if (!canRefund) {
      setNeedsApproval(true);
      setPinModalOpen(true);
      return;
    }
    processRefund(currentStaff!.name);
  }, [currentStaff]);

  const handleManagerApproval = useCallback((staff: StaffMember) => {
    setPinModalOpen(false);
    processRefund(staff.name);
  }, []);

  const processRefund = useCallback((approverName: string) => {
    setStep('processing');
    setTimeout(() => {
      setStep('complete');
      toast.success(`Refund of $${totalRefund.toFixed(2)} processed. Approved by ${approverName}`);
    }, 1500);
  }, [totalRefund]);

  if (!isOpen) return null;

  const paymentLabels: Record<PaymentMethod, string> = {
    cash: 'Cash', card: 'Card', upi: 'UPI', wallet: 'Wallet', split: 'Split', credit: 'Credit',
  };

  return (
    <>
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
            className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Returns & Refunds</h2>
                  <p className="text-sm text-muted-foreground">
                    {step === 'search' && 'Search by invoice ID or customer'}
                    {step === 'select' && `Invoice ${selectedTransaction?.id}`}
                    {step === 'confirm' && 'Review refund details'}
                    {step === 'processing' && 'Processing...'}
                    {step === 'complete' && 'Refund completed'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { resetState(); onClose(); }} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* STEP: Search */}
              {step === 'search' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by Invoice ID, customer name, or phone..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-11 h-12 text-base"
                      autoFocus
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      {searchResults.map(tx => (
                        <button
                          key={tx.id}
                          onClick={() => handleSelectTransaction(tx)}
                          className="w-full text-left rounded-xl border border-border/50 bg-card p-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-semibold text-foreground">{tx.id}</span>
                            <span className="text-lg font-bold text-primary">${tx.total.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{tx.items.length} items</span>
                            <span>{paymentLabels[tx.paymentMethod]}</span>
                            {tx.customer && <span>{tx.customer.name}</span>}
                            <span>{new Date(tx.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No transactions found</p>
                      <p className="text-sm mt-1">Try searching by invoice ID (e.g., TXN-ABC123)</p>
                    </div>
                  )}

                  {!searchQuery && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Enter an invoice ID or customer details</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP: Select items to return */}
              {step === 'select' && selectedTransaction && (
                <div className="space-y-4">
                  {/* Transaction summary */}
                  <div className="rounded-xl bg-muted/30 p-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Original Total</span>
                      <span className="font-bold">${selectedTransaction.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span>{paymentLabels[selectedTransaction.paymentMethod]}</span>
                    </div>
                  </div>

                  {/* Items to return */}
                  <p className="text-sm font-medium text-muted-foreground">Select items to return:</p>
                  <div className="space-y-2">
                    {refundItems.map(item => (
                      <div
                        key={item.product.id}
                        className={cn(
                          "rounded-xl border p-4 transition-all",
                          item.refundQuantity > 0
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-border/50 bg-card"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center text-2xl">
                            {item.product.image}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ${item.product.price.toFixed(2)} × {item.quantity} purchased
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateRefundQuantity(item.product.id, -1)}
                              disabled={item.refundQuantity === 0}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className={cn(
                              "w-8 text-center text-sm font-bold",
                              item.refundQuantity > 0 && "text-destructive"
                            )}>
                              {item.refundQuantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateRefundQuantity(item.product.id, 1)}
                              disabled={item.refundQuantity >= item.quantity}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          {item.refundQuantity > 0 && (
                            <span className="text-sm font-bold text-destructive w-20 text-right">
                              -${item.refundAmount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Reason for return</label>
                    <Input
                      placeholder="e.g., Defective product, wrong item..."
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  {/* Refund total */}
                  {hasRefundItems && (
                    <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Refund</p>
                      <p className="text-3xl font-bold text-destructive">${totalRefund.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Refund to {paymentLabels[selectedTransaction.paymentMethod]}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP: Confirm */}
              {step === 'confirm' && selectedTransaction && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-warning/10 border border-warning/30 p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Confirm Refund</p>
                      <p className="text-sm text-muted-foreground">
                        This action will refund ${totalRefund.toFixed(2)} to {paymentLabels[selectedTransaction.paymentMethod]} and adjust stock automatically.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl bg-muted/30 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Invoice</span>
                      <span className="font-mono font-semibold">{selectedTransaction.id}</span>
                    </div>
                    {refundItems.filter(i => i.refundQuantity > 0).map(item => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span>{item.product.name} × {item.refundQuantity}</span>
                        <span className="text-destructive font-medium">-${item.refundAmount.toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Refund Total</span>
                      <span className="text-destructive">${totalRefund.toFixed(2)}</span>
                    </div>
                    {refundReason && (
                      <div className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Reason:</span> {refundReason}
                      </div>
                    )}
                  </div>

                  {!currentStaff?.permissions.canProcessRefund && (
                    <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 rounded-lg p-3">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Manager approval required for refunds</span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP: Processing */}
              {step === 'processing' && (
                <div className="flex flex-col items-center justify-center py-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-16 h-16 text-primary" />
                  </motion.div>
                  <p className="text-xl font-semibold mt-6">Processing Refund...</p>
                </div>
              )}

              {/* STEP: Complete */}
              {step === 'complete' && (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center shadow-glow-green mb-6"
                  >
                    <Check className="w-10 h-10 text-success" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Refund Complete</h3>
                  <p className="text-muted-foreground text-center">
                    ${totalRefund.toFixed(2)} has been refunded. Stock has been adjusted.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/50 flex gap-3">
              {step === 'search' && (
                <Button variant="outline" className="flex-1 h-12" onClick={() => { resetState(); onClose(); }}>
                  Cancel
                </Button>
              )}
              {step === 'select' && (
                <>
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setStep('search')}>
                    Back
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 h-12 gap-2"
                    onClick={handleProceedToConfirm}
                    disabled={!hasRefundItems}
                  >
                    Review Refund
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              {step === 'confirm' && (
                <>
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setStep('select')}>
                    Back
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 h-12 gap-2"
                    onClick={handleConfirmRefund}
                  >
                    {currentStaff?.permissions.canProcessRefund ? (
                      <>Process Refund</>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Request Approval
                      </>
                    )}
                  </Button>
                </>
              )}
              {step === 'complete' && (
                <Button
                  variant="default"
                  className="flex-1 h-12"
                  onClick={() => { resetState(); onClose(); }}
                >
                  Done
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Manager PIN approval */}
      <PinAuthModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onAuthenticate={handleManagerApproval}
        requiredRole="manager"
        actionLabel="Manager Approval"
      />
    </>
  );
};
