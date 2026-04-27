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
  amountPaid: number;
  change: number;
  customer?: Customer;
  createdAt: Date;
  status: 'completed' | 'pending' | 'refunded' | 'voided' | 'partial-refund';
  branchId?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet' | 'split' | 'credit';

export type StaffRole = 'cashier' | 'manager' | 'admin';

export interface StaffMember {
  id: string;
  name: string;
  pin: string;
  role: StaffRole;
  permissions: StaffPermissions;
  /** Branch IDs this staff member is assigned to. Empty = all branches. */
  branchIds?: string[];
}

export interface StaffPermissions {
  canOverridePrice: boolean;
  canApplyDiscount: boolean;
  maxDiscountPercent: number;
  canProcessRefund: boolean;
  canVoidTransaction: boolean;
  canAccessReports: boolean;
}

export interface RefundRequest {
  transactionId: string;
  items: RefundItem[];
  reason: string;
  refundMethod: PaymentMethod;
  totalRefund: number;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface RefundItem {
  product: Product;
  quantity: number;
  refundQuantity: number;
  refundAmount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  staffId: string;
  staffName: string;
  action: string;
  details: string;
  transactionId?: string;
}

export interface POSStats {
  todaySales: number;
  todayTransactions: number;
  averageOrderValue: number;
  topSellingItems: { name: string; count: number }[];
}
