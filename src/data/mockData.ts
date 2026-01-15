import { Product, Category, Customer } from '@/types/pos';

export const categories: Category[] = [
  { id: '1', name: 'All Items', icon: '🏷️', color: 'from-neon-cyan/20 to-neon-purple/20', productCount: 24 },
  { id: '2', name: 'Beverages', icon: '☕', color: 'from-amber-500/20 to-orange-500/20', productCount: 8 },
  { id: '3', name: 'Food', icon: '🍔', color: 'from-red-500/20 to-pink-500/20', productCount: 6 },
  { id: '4', name: 'Electronics', icon: '📱', color: 'from-blue-500/20 to-cyan-500/20', productCount: 5 },
  { id: '5', name: 'Groceries', icon: '🛒', color: 'from-green-500/20 to-emerald-500/20', productCount: 5 },
];

export const products: Product[] = [
  // Beverages
  { id: '1', name: 'Espresso', price: 3.50, category: '2', sku: 'BEV001', stock: 999, unit: 'cup', taxRate: 5, image: '☕' },
  { id: '2', name: 'Cappuccino', price: 4.50, category: '2', sku: 'BEV002', stock: 999, unit: 'cup', taxRate: 5, image: '☕' },
  { id: '3', name: 'Latte', price: 4.75, category: '2', sku: 'BEV003', stock: 999, unit: 'cup', taxRate: 5, image: '🥛' },
  { id: '4', name: 'Fresh Orange Juice', price: 5.00, category: '2', sku: 'BEV004', stock: 45, unit: 'glass', taxRate: 5, image: '🍊' },
  { id: '5', name: 'Smoothie Bowl', price: 8.50, category: '2', sku: 'BEV005', stock: 30, unit: 'bowl', taxRate: 5, image: '🥤' },
  { id: '6', name: 'Iced Tea', price: 3.25, category: '2', sku: 'BEV006', stock: 60, unit: 'glass', taxRate: 5, image: '🧋' },
  { id: '7', name: 'Hot Chocolate', price: 4.00, category: '2', sku: 'BEV007', stock: 50, unit: 'cup', taxRate: 5, image: '🍫' },
  { id: '8', name: 'Matcha Latte', price: 5.50, category: '2', sku: 'BEV008', stock: 40, unit: 'cup', taxRate: 5, image: '🍵' },
  
  // Food
  { id: '9', name: 'Classic Burger', price: 12.99, category: '3', sku: 'FOD001', stock: 25, unit: 'piece', taxRate: 10, image: '🍔' },
  { id: '10', name: 'Caesar Salad', price: 9.50, category: '3', sku: 'FOD002', stock: 20, unit: 'bowl', taxRate: 10, image: '🥗' },
  { id: '11', name: 'Margherita Pizza', price: 14.99, category: '3', sku: 'FOD003', stock: 15, unit: 'piece', taxRate: 10, image: '🍕' },
  { id: '12', name: 'Club Sandwich', price: 10.50, category: '3', sku: 'FOD004', stock: 30, unit: 'piece', taxRate: 10, image: '🥪' },
  { id: '13', name: 'Pasta Carbonara', price: 13.50, category: '3', sku: 'FOD005', stock: 18, unit: 'plate', taxRate: 10, image: '🍝' },
  { id: '14', name: 'Fish & Chips', price: 15.99, category: '3', sku: 'FOD006', stock: 12, unit: 'plate', taxRate: 10, image: '🐟' },
  
  // Electronics
  { id: '15', name: 'USB-C Cable', price: 15.99, category: '4', sku: 'ELC001', stock: 100, unit: 'piece', taxRate: 18, image: '🔌' },
  { id: '16', name: 'Wireless Earbuds', price: 79.99, category: '4', sku: 'ELC002', stock: 25, unit: 'pair', taxRate: 18, image: '🎧' },
  { id: '17', name: 'Phone Case', price: 24.99, category: '4', sku: 'ELC003', stock: 50, unit: 'piece', taxRate: 18, image: '📱' },
  { id: '18', name: 'Power Bank', price: 39.99, category: '4', sku: 'ELC004', stock: 35, unit: 'piece', taxRate: 18, image: '🔋' },
  { id: '19', name: 'Screen Protector', price: 12.99, category: '4', sku: 'ELC005', stock: 80, unit: 'piece', taxRate: 18, image: '📲' },
  
  // Groceries
  { id: '20', name: 'Organic Milk', price: 4.99, category: '5', sku: 'GRO001', stock: 40, unit: 'liter', taxRate: 0, image: '🥛' },
  { id: '21', name: 'Fresh Bread', price: 3.49, category: '5', sku: 'GRO002', stock: 25, unit: 'loaf', taxRate: 0, image: '🍞' },
  { id: '22', name: 'Free-Range Eggs', price: 6.99, category: '5', sku: 'GRO003', stock: 50, unit: 'dozen', taxRate: 0, image: '🥚' },
  { id: '23', name: 'Butter', price: 5.49, category: '5', sku: 'GRO004', stock: 30, unit: 'pack', taxRate: 0, image: '🧈' },
  { id: '24', name: 'Greek Yogurt', price: 4.29, category: '5', sku: 'GRO005', stock: 45, unit: 'cup', taxRate: 0, image: '🥄' },
];

export const customers: Customer[] = [
  { id: '1', name: 'John Smith', email: 'john@email.com', phone: '+1 555-0101', loyaltyPoints: 1250, totalSpent: 2450.00 },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555-0102', loyaltyPoints: 890, totalSpent: 1780.50 },
  { id: '3', name: 'Michael Brown', email: 'michael@email.com', phone: '+1 555-0103', loyaltyPoints: 2100, totalSpent: 4200.00 },
  { id: '4', name: 'Emily Davis', email: 'emily@email.com', phone: '+1 555-0104', loyaltyPoints: 560, totalSpent: 1120.75 },
  { id: '5', name: 'James Wilson', email: 'james@email.com', phone: '+1 555-0105', loyaltyPoints: 3400, totalSpent: 6800.00 },
];
