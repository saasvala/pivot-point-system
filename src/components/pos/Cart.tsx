import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, User, Tag } from 'lucide-react';
import { CartItem, Customer } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface CartProps {
  items: CartItem[];
  customer?: Customer;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onClearCart: () => void;
  onSelectCustomer: () => void;
}

export const Cart = ({
  items,
  customer,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClearCart,
  onSelectCustomer,
}: CartProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxAmount = items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity * item.product.taxRate) / 100,
    0
  );
  const discount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const total = subtotal + taxAmount - discount;

  return (
    <div className="h-full flex flex-col glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Current Order</h2>
              <p className="text-xs text-muted-foreground">{items.length} items</p>
            </div>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearCart} className="text-destructive hover:text-destructive">
              Clear
            </Button>
          )}
        </div>

        {/* Customer Selection */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-12"
          onClick={onSelectCustomer}
        >
          <User className="w-4 h-4 text-muted-foreground" />
          {customer ? (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{customer.name}</p>
              <p className="text-xs text-muted-foreground">{customer.loyaltyPoints} points</p>
            </div>
          ) : (
            <span className="text-muted-foreground">Add Customer</span>
          )}
        </Button>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 p-4">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-48 text-muted-foreground"
            >
              <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs">Tap products to add them</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/30"
                >
                  {/* Product Image */}
                  <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center text-2xl shrink-0">
                    {item.product.image}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${item.product.price.toFixed(2)} × {item.quantity}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-primary mt-1">📝 {item.notes}</p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-primary">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-destructive" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border/50 space-y-3">
          {/* Discount Button */}
          <Button variant="outline" className="w-full gap-2 h-10">
            <Tag className="w-4 h-4" />
            Add Discount / Coupon
          </Button>

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
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="bg-border/50" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary text-glow-cyan">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            variant="posCheckout"
            size="xl"
            className="w-full"
            onClick={onCheckout}
          >
            Checkout — ${total.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
};
