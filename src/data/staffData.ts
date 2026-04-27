import { StaffMember, Transaction } from '@/types/pos';

export const staffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Alex Johnson',
    pin: '1234',
    role: 'cashier',
    branchIds: ['br-mall'],
    permissions: {
      canOverridePrice: false,
      canApplyDiscount: true,
      maxDiscountPercent: 10,
      canProcessRefund: false,
      canVoidTransaction: false,
      canAccessReports: false,
    },
  },
  {
    id: 'staff-2',
    name: 'Maria Garcia',
    pin: '5678',
    role: 'manager',
    branchIds: ['br-downtown'],
    permissions: {
      canOverridePrice: true,
      canApplyDiscount: true,
      maxDiscountPercent: 50,
      canProcessRefund: true,
      canVoidTransaction: true,
      canAccessReports: true,
    },
  },
  {
    id: 'staff-3',
    name: 'Admin User',
    pin: '0000',
    role: 'admin',
    branchIds: [], // all branches
    permissions: {
      canOverridePrice: true,
      canApplyDiscount: true,
      maxDiscountPercent: 100,
      canProcessRefund: true,
      canVoidTransaction: true,
      canAccessReports: true,
    },
  },
];

// Mock completed transactions for refund lookups
export const completedTransactions: Transaction[] = [
  {
    id: 'TXN-ABC123',
    items: [
      { product: { id: '1', name: 'Espresso', price: 3.50, category: '2', sku: 'BEV001', stock: 999, unit: 'cup', taxRate: 5, image: '☕' }, quantity: 2 },
      { product: { id: '9', name: 'Classic Burger', price: 12.99, category: '3', sku: 'FOD001', stock: 25, unit: 'piece', taxRate: 10, image: '🍔' }, quantity: 1 },
    ],
    subtotal: 19.99,
    tax: 1.65,
    discount: 0,
    total: 21.64,
    amountPaid: 25.00,
    change: 3.36,
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 3600000),
    status: 'completed',
  },
  {
    id: 'TXN-DEF456',
    items: [
      { product: { id: '16', name: 'Wireless Earbuds', price: 79.99, category: '4', sku: 'ELC002', stock: 25, unit: 'pair', taxRate: 18, image: '🎧' }, quantity: 1 },
      { product: { id: '15', name: 'USB-C Cable', price: 15.99, category: '4', sku: 'ELC001', stock: 100, unit: 'piece', taxRate: 18, image: '🔌' }, quantity: 2 },
    ],
    subtotal: 111.97,
    tax: 20.15,
    discount: 5.00,
    total: 127.12,
    amountPaid: 127.12,
    change: 0,
    paymentMethod: 'card',
    customer: { id: '1', name: 'John Smith', email: 'john@email.com', phone: '+1 555-0101', loyaltyPoints: 1250, totalSpent: 2450.00 },
    createdAt: new Date(Date.now() - 7200000),
    status: 'completed',
  },
  {
    id: 'TXN-GHI789',
    items: [
      { product: { id: '11', name: 'Margherita Pizza', price: 14.99, category: '3', sku: 'FOD003', stock: 15, unit: 'piece', taxRate: 10, image: '🍕' }, quantity: 2 },
      { product: { id: '6', name: 'Iced Tea', price: 3.25, category: '2', sku: 'BEV006', stock: 60, unit: 'glass', taxRate: 5, image: '🧋' }, quantity: 3 },
    ],
    subtotal: 39.73,
    tax: 3.49,
    discount: 2.00,
    total: 41.22,
    amountPaid: 50.00,
    change: 8.78,
    paymentMethod: 'cash',
    customer: { id: '3', name: 'Michael Brown', email: 'michael@email.com', phone: '+1 555-0103', loyaltyPoints: 2100, totalSpent: 4200.00 },
    createdAt: new Date(Date.now() - 1800000),
    status: 'completed',
  },
];
