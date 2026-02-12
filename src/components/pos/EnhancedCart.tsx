import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Minus, Plus, Trash2, ShoppingCart, User, Tag, Percent,
  MessageSquare, ChevronDown, ChevronUp, X, Gift
} from 'lucide-react';
import { CartItem, Customer, StaffMember } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Collapsible, CollapsibleContent, CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface EnhancedCartProps {
  items: CartItem[];
  customer?: Customer;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateItemDiscount: (productId: string, discount: number) => void;
  onUpdateItemNote: (productId: string, note: string) => void;
  onCheckout: () => void;
  onSelectCustomer: () => void;
  globalDiscount: number;
  onGlobalDiscountChange: (discount: number) => void;
  currentStaff?: StaffMember;
  onManagerOverrideNeeded?: (callback: () => void) => void;
}

export const EnhancedCart = ({
  items,
  customer,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateItemDiscount,
  onUpdateItemNote,
  onCheckout,
  onSelectCustomer,
  globalDiscount,
  onGlobalDiscountChange,
  currentStaff,
  onManagerOverrideNeeded,
}: EnhancedCartProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [discountInput, setDiscountInput] = useState('');

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemDiscounts = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const taxAmount = items.reduce(
    (sum, item) => {
      const itemTotal = item.product.price * item.quantity - (item.discount || 0);
      return sum + (itemTotal * item.product.taxRate) / 100;
    },
    0
  );
  const totalDiscount = itemDiscounts + globalDiscount;
  const total = subtotal + taxAmount - totalDiscount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyGlobalDiscount = () => {
    const discount = parseFloat(discountInput);
    if (!isNaN(discount) && discount > 0) {
      // Check discount limit
      if (currentStaff && subtotal > 0) {
        const discountPercent = (discount / subtotal) * 100;
        if (discountPercent > currentStaff.permissions.maxDiscountPercent) {
          if (!currentStaff.permissions.canApplyDiscount) {
            toast.error('You do not have permission to apply discounts');
            return;
          }
          // Need manager override
          if (onManagerOverrideNeeded) {
            onManagerOverrideNeeded(() => {
              onGlobalDiscountChange(discount);
              setDiscountInput('');
              toast.success(`Discount $${discount.toFixed(2)} applied with manager approval`);
            });
            return;
          }
          toast.error(`Discount exceeds your ${currentStaff.permissions.maxDiscountPercent}% limit. Manager override required.`);
          return;
        }
      }
      onGlobalDiscountChange(discount);
      setDiscountInput('');
    }
  };

  return (
    <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden border border-border/30">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-primary">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-lg">Current Order</h2>
              <p className="text-xs text-muted-foreground">{itemCount} items</p>
            </div>
          </div>
        </div>

        {/* Customer Selection */}
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-14 border-dashed"
          onClick={onSelectCustomer}
        >
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          {customer ? (
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">{customer.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Gift className="w-3 h-3 text-success" />
                <span>{customer.loyaltyPoints} points</span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Add Customer (F9)</span>
          )}
        </Button>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 px-4 py-2">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-muted-foreground"
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 opacity-30" />
              </div>
              <p className="text-base font-medium">Cart is empty</p>
              <p className="text-sm text-muted-foreground/70">Tap or scan products to add</p>
            </motion.div>
          ) : (
            <div className="space-y-2 py-2">
              {items.map((item) => (
                <Collapsible
                  key={item.product.id}
                  open={expandedItem === item.product.id}
                  onOpenChange={(open) => setExpandedItem(open ? item.product.id : null)}
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-xl bg-card border border-border/50 overflow-hidden"
                  >
                    {/* Main Item Row */}
                    <div className="flex gap-3 p-3">
                      {/* Product Image */}
                      <div className="w-14 h-14 rounded-lg bg-muted/50 flex items-center justify-center text-2xl shrink-0 border border-border/30">
                        {item.product.image}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm text-foreground line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ${item.product.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-primary text-base">
                            ${(item.product.price * item.quantity - (item.discount || 0)).toFixed(2)}
                          </p>
                        </div>

                        {/* Quick indicators */}
                        <div className="flex items-center gap-2 mt-1">
                          {item.discount && item.discount > 0 && (
                            <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <Percent className="w-2.5 h-2.5" />
                              -${item.discount.toFixed(2)}
                            </span>
                          )}
                          {item.notes && (
                            <span className="text-[10px] bg-info/20 text-info px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <MessageSquare className="w-2.5 h-2.5" />
                              Note
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              ) : (
                                <Minus className="w-3.5 h-3.5" />
                              )}
                            </Button>
                            <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground">
                              {expandedItem === item.product.id ? (
                                <>
                                  Less <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  More <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Options */}
                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-0 space-y-3 border-t border-border/30 bg-muted/20">
                        {/* Item Discount */}
                        <div className="pt-3">
                          <label className="text-xs text-muted-foreground mb-1.5 block">Item Discount ($)</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={item.discount || ''}
                              onChange={(e) => onUpdateItemDiscount(item.product.id, parseFloat(e.target.value) || 0)}
                              className="h-9 text-sm"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3"
                              onClick={() => onUpdateItemDiscount(item.product.id, 0)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Note */}
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">Item Note</label>
                          <Input
                            type="text"
                            placeholder="Add special instructions..."
                            value={item.notes || ''}
                            onChange={(e) => onUpdateItemNote(item.product.id, e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-9 text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => onRemoveItem(item.product.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Remove Item
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </motion.div>
                </Collapsible>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border/50 space-y-3 bg-muted/10">
          {/* Global Discount */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Add discount..."
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              className="h-10 text-sm"
            />
            <Button 
              variant="outline" 
              className="h-10 gap-2 shrink-0"
              onClick={handleApplyGlobalDiscount}
            >
              <Tag className="w-4 h-4" />
              Apply
            </Button>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span className="flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  Discount
                </span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="bg-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            variant="posCheckout"
            size="xl"
            className="w-full text-xl h-16"
            onClick={onCheckout}
          >
            Pay ${total.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
};
