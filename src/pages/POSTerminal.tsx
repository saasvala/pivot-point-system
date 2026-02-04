import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { POSHeader } from '@/components/pos/POSHeader';
import { CategoryBar } from '@/components/pos/CategoryBar';
import { EnhancedProductGrid } from '@/components/pos/EnhancedProductGrid';
import { EnhancedCart } from '@/components/pos/EnhancedCart';
import { SearchBar } from '@/components/pos/SearchBar';
import { BottomActionBar } from '@/components/pos/BottomActionBar';
import { EnhancedPaymentModal } from '@/components/pos/EnhancedPaymentModal';
import { EnhancedReceipt } from '@/components/pos/EnhancedReceipt';
import { categories, products } from '@/data/mockData';
import { CartItem, Product, Customer, PaymentMethod } from '@/types/pos';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface HeldBill {
  id: string;
  items: CartItem[];
  customer?: Customer;
  globalDiscount: number;
  timestamp: Date;
}

const POSTerminal = () => {
  // Core state
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [globalDiscount, setGlobalDiscount] = useState(0);
  
  // UI state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  // Held bills
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);
  
  // Last transaction for receipt
  const [lastTransaction, setLastTransaction] = useState<{
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    amountPaid: number;
    change: number;
    method: PaymentMethod;
    customer?: Customer;
  } | null>(null);

  // Calculate totals
  const { subtotal, taxAmount, itemDiscounts, total, itemCount } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemDisc = cartItems.reduce((sum, item) => sum + (item.discount || 0), 0);
    const tax = cartItems.reduce(
      (sum, item) => {
        const itemTotal = item.product.price * item.quantity - (item.discount || 0);
        return sum + (itemTotal * item.product.taxRate) / 100;
      },
      0
    );
    const totalDiscount = itemDisc + globalDiscount;
    const tot = sub + tax - totalDiscount;
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return { 
      subtotal: sub, 
      taxAmount: tax, 
      itemDiscounts: itemDisc,
      total: Math.max(0, tot),
      itemCount: count
    };
  }, [cartItems, globalDiscount]);

  const totalDiscount = itemDiscounts + globalDiscount;

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (selectedCategory !== '1') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(query) || 
             p.sku.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  // Get cart product IDs for highlighting
  const cartProductIds = useMemo(() => 
    cartItems.map(item => item.product.id), 
    [cartItems]
  );

  // Add product to cart
  const handleProductSelect = useCallback((product: Product) => {
    if (product.stock === 0) {
      toast.error('Product out of stock');
      return;
    }
    
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    toast.success(`Added ${product.name}`, {
      duration: 1200,
      position: 'bottom-right',
    });
  }, []);

  // Update cart item quantity
  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  // Remove item from cart
  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    toast.info('Item removed');
  }, []);

  // Update item discount
  const handleUpdateItemDiscount = useCallback((productId: string, discount: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, discount: Math.max(0, discount) } 
          : item
      )
    );
  }, []);

  // Update item note
  const handleUpdateItemNote = useCallback((productId: string, note: string) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, notes: note } 
          : item
      )
    );
  }, []);

  // Clear cart
  const handleClearCart = useCallback(() => {
    if (cartItems.length === 0) return;
    setCartItems([]);
    setSelectedCustomer(undefined);
    setGlobalDiscount(0);
    toast.info('Cart cleared');
  }, [cartItems.length]);

  // Hold bill
  const handleHoldBill = useCallback(() => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    const heldBill: HeldBill = {
      id: `HOLD-${Date.now().toString(36).toUpperCase()}`,
      items: [...cartItems],
      customer: selectedCustomer,
      globalDiscount,
      timestamp: new Date(),
    };
    
    setHeldBills(prev => [...prev, heldBill]);
    setCartItems([]);
    setSelectedCustomer(undefined);
    setGlobalDiscount(0);
    toast.success(`Bill held (${heldBill.id})`);
  }, [cartItems, selectedCustomer, globalDiscount]);

  // Recall bill
  const handleRecallBill = useCallback(() => {
    if (heldBills.length === 0) {
      toast.info('No held bills');
      return;
    }
    
    // Recall the most recent held bill
    const lastHeld = heldBills[heldBills.length - 1];
    setCartItems(lastHeld.items);
    setSelectedCustomer(lastHeld.customer);
    setGlobalDiscount(lastHeld.globalDiscount);
    setHeldBills(prev => prev.slice(0, -1));
    toast.success(`Bill ${lastHeld.id} recalled`);
  }, [heldBills]);

  // Open payment modal
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setIsPaymentModalOpen(true);
  }, [cartItems.length]);

  // Handle payment completion
  const handlePaymentComplete = useCallback((method: PaymentMethod, amountPaid: number, change: number) => {
    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;
    
    setLastTransaction({
      id: transactionId,
      items: [...cartItems],
      subtotal,
      tax: taxAmount,
      discount: totalDiscount,
      total,
      amountPaid,
      change,
      method,
      customer: selectedCustomer,
    });
    
    setIsPaymentModalOpen(false);
    setIsReceiptOpen(true);
  }, [cartItems, subtotal, taxAmount, totalDiscount, total, selectedCustomer]);

  // Handle new sale after receipt
  const handleNewSale = useCallback(() => {
    setCartItems([]);
    setSelectedCustomer(undefined);
    setGlobalDiscount(0);
    setIsReceiptOpen(false);
    setLastTransaction(null);
    toast.success('Ready for new sale');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent if typing in input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      
      switch (e.key) {
        case 'F5':
          e.preventDefault();
          handleHoldBill();
          break;
        case 'F6':
          e.preventDefault();
          handleRecallBill();
          break;
        case 'F9':
          e.preventDefault();
          toast.info('Customer selection');
          break;
        case 'Delete':
          if (e.shiftKey) {
            e.preventDefault();
            handleClearCart();
          }
          break;
        case 'Enter':
          if (e.ctrlKey && cartItems.length > 0) {
            e.preventDefault();
            handleCheckout();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleHoldBill, handleRecallBill, handleClearCart, handleCheckout, cartItems.length]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <POSHeader
        businessName="NexusPOS"
        branchName="Main Branch"
        cashierName="Alex Johnson"
        onMenuClick={() => toast.info('Menu')}
      />

      {/* Main Content - 65/35 Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Products (65%) */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 lg:w-[65%] flex flex-col overflow-hidden"
        >
          {/* Search Bar */}
          <div className="p-4 pb-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onBarcodeClick={() => toast.info('Barcode scanner ready')}
            />
          </div>

          {/* Categories */}
          <div className="px-4 py-2">
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <EnhancedProductGrid
              products={filteredProducts}
              onProductSelect={handleProductSelect}
              cartProductIds={cartProductIds}
            />
          </div>
        </motion.main>

        {/* Right Panel - Cart (35%) - Hidden on mobile */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:w-[35%] p-4 pl-0"
        >
          <EnhancedCart
            items={cartItems}
            customer={selectedCustomer}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onUpdateItemDiscount={handleUpdateItemDiscount}
            onUpdateItemNote={handleUpdateItemNote}
            onCheckout={handleCheckout}
            onSelectCustomer={() => toast.info('Customer selection coming soon')}
            globalDiscount={globalDiscount}
            onGlobalDiscountChange={setGlobalDiscount}
          />
        </motion.aside>
      </div>

      {/* Bottom Action Bar - Desktop */}
      <div className="hidden lg:block">
        <BottomActionBar
          onHoldBill={handleHoldBill}
          onClearCart={handleClearCart}
          onSplitBill={() => toast.info('Split bill')}
          onRecallBill={handleRecallBill}
          onApplyDiscount={() => toast.info('Apply discount')}
          onSelectCustomer={() => toast.info('Select customer')}
          onViewReceipts={() => toast.info('View receipts')}
          cartItemCount={itemCount}
          hasHeldBills={heldBills.length}
        />
      </div>

      {/* Mobile Cart Button & Sheet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
          <SheetTrigger asChild>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-glow-primary relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg p-0">
            <EnhancedCart
              items={cartItems}
              customer={selectedCustomer}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onUpdateItemDiscount={handleUpdateItemDiscount}
              onUpdateItemNote={handleUpdateItemNote}
              onCheckout={() => {
                setIsMobileCartOpen(false);
                handleCheckout();
              }}
              onSelectCustomer={() => toast.info('Customer selection coming soon')}
              globalDiscount={globalDiscount}
              onGlobalDiscountChange={setGlobalDiscount}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Payment Modal */}
      <EnhancedPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        tax={taxAmount}
        discount={totalDiscount}
        total={total}
        customer={selectedCustomer}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Receipt Success */}
      {lastTransaction && (
        <EnhancedReceipt
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          transactionId={lastTransaction.id}
          items={lastTransaction.items}
          subtotal={lastTransaction.subtotal}
          tax={lastTransaction.tax}
          discount={lastTransaction.discount}
          total={lastTransaction.total}
          amountPaid={lastTransaction.amountPaid}
          change={lastTransaction.change}
          paymentMethod={lastTransaction.method}
          customer={lastTransaction.customer}
          onPrint={() => toast.success('Printing receipt...')}
          onEmail={() => toast.success('Receipt sent via email')}
          onNewSale={handleNewSale}
        />
      )}
    </div>
  );
};

export default POSTerminal;
