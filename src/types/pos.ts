export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sku: string;
  image?: string;
  stock: number;
  unit: string;
  taxRate: number;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  notes?: string;
  discount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  loyaltyPoints: number;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  customer?: Customer;
  createdAt: Date;
  status: 'completed' | 'pending' | 'refunded' | 'voided';
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet' | 'split' | 'credit';

export interface POSStats {
  todaySales: number;
  todayTransactions: number;
  averageOrderValue: number;
  topSellingItems: { name: string; count: number }[];
}
