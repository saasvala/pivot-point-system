import { Transaction } from '@/types/pos';
import { completedTransactions } from '@/data/staffData';

// Reactive in-memory sales store
let transactions: Transaction[] = [...completedTransactions];
let listeners: (() => void)[] = [];

export function addTransaction(txn: Transaction) {
  transactions = [txn, ...transactions];
  listeners.forEach((fn) => fn());
}

export function getTransactions(): Transaction[] {
  return transactions;
}

export function getTodayStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTxns = transactions.filter(
    (t) => t.status === 'completed' && new Date(t.createdAt) >= today
  );

  const revenue = todayTxns.reduce((sum, t) => sum + t.total, 0);
  const count = todayTxns.length;
  const avg = count > 0 ? revenue / count : 0;

  // Top items
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  todayTxns.forEach((t) =>
    t.items.forEach((item) => {
      const key = item.product.id;
      if (!itemCounts[key]) {
        itemCounts[key] = { name: item.product.name, count: 0, revenue: 0 };
      }
      itemCounts[key].count += item.quantity;
      itemCounts[key].revenue += item.product.price * item.quantity;
    })
  );

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { revenue, count, avg, topItems };
}

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function useSalesStore() {
  // Hook-compatible - components can call getTodayStats() and subscribe
  return { getTodayStats, getTransactions, subscribe, addTransaction };
}
