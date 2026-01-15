import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { POSHeader } from '@/components/pos/POSHeader';
import { CategoryBar } from '@/components/pos/CategoryBar';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { Cart } from '@/components/pos/Cart';
import { SearchBar } from '@/components/pos/SearchBar';
import { QuickStats } from '@/components/pos/QuickStats';
import { QuickActions } from '@/components/pos/QuickActions';
import { PaymentModal } from '@/components/pos/PaymentModal';
import { ReceiptSuccess } from '@/components/pos/ReceiptSuccess';
import { categories, products } from '@/data/mockData';
import { CartItem, Product, Customer, PaymentMethod } from '@/types/pos';
import { toast } from 'sonner';

const POSTerminal = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{
    id: string;
    total: number;
    method: PaymentMethod;
  } | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxAmount = cartItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity * item.product.taxRate) / 100,
    0
  );
  const total = subtotal + taxAmount;

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (selectedCategory !== '1') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  // Add product to cart
  const handleProductSelect = (product: Product) => {
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
      duration: 1500,
      position: 'bottom-right',
    });
  };

  // Update cart item quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
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
  };

  // Remove item from cart
  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
    setSelectedCustomer(undefined);
    toast.info('Cart cleared');
  };

  // Open payment modal
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  // Handle payment completion
  const handlePaymentComplete = (method: PaymentMethod) => {
    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;
    setLastTransaction({
      id: transactionId,
      total,
      method,
    });
    setIsPaymentModalOpen(false);
    setIsReceiptOpen(true);
  };

  // Handle new sale after receipt
  const handleNewSale = () => {
    setCartItems([]);
    setSelectedCustomer(undefined);
    setIsReceiptOpen(false);
    setLastTransaction(null);
    toast.success('Ready for new sale');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <POSHeader
        businessName="NexusPOS"
        branchName="Main Branch"
        cashierName="Alex Johnson"
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Products Section */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col overflow-hidden p-4 gap-4"
        >
          {/* Quick Stats */}
          <QuickStats
            todaySales={4528.50}
            todayTransactions={47}
            avgOrderValue={96.35}
            lastSaleTime="2m ago"
          />

          {/* Search & Quick Actions */}
          <div className="flex flex-col gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <QuickActions
              onHoldOrder={() => toast.info('Order held')}
              onRecallOrder={() => toast.info('Recall orders')}
              onViewReceipts={() => toast.info('View receipts')}
              onManageCustomers={() => toast.info('Manage customers')}
            />
          </div>

          {/* Categories */}
          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto">
            <ProductGrid
              products={filteredProducts}
              onProductSelect={handleProductSelect}
            />
          </div>
        </motion.main>

        {/* Cart Section */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md p-4 hidden lg:block"
        >
          <Cart
            items={cartItems}
            customer={selectedCustomer}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
            onSelectCustomer={() => toast.info('Customer selection coming soon')}
          />
        </motion.aside>
      </div>

      {/* Mobile Cart Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(187,100%,50%)] to-[hsl(270,91%,65%)] shadow-neon-cyan flex items-center justify-center relative"
          onClick={() => toast.info('Mobile cart coming soon')}
        >
          <span className="text-2xl">🛒</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </motion.button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={cartItems}
        total={total}
        tax={taxAmount}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Receipt Success */}
      {lastTransaction && (
        <ReceiptSuccess
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          transactionId={lastTransaction.id}
          total={lastTransaction.total}
          paymentMethod={lastTransaction.method}
          onPrint={() => toast.success('Printing receipt...')}
          onEmail={() => toast.success('Receipt sent via email')}
          onNewSale={handleNewSale}
        />
      )}
    </div>
  );
};

export default POSTerminal;