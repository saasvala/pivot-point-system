import { Transaction } from '@/types/pos';
import { completedTransactions } from '@/data/staffData';
import { getBranches, getActiveBranchId } from '@/data/branchStore';

// Distribute seed transactions across branches for realistic demo
const seedBranches = getBranches();
const seedWithBranches: Transaction[] = completedTransactions.map((t, i) => ({
  ...t,
  branchId: seedBranches[i % seedBranches.length]?.id,
}));

// Reactive in-memory sales store
let transactions: Transaction[] = [...seedWithBranches];
let listeners: (() => void)[] = [];

export function addTransaction(txn: Transaction) {
  // Auto-tag with active branch if not specified
  const tagged: Transaction = { ...txn, branchId: txn.branchId || getActiveBranchId() };
  transactions = [tagged, ...transactions];
  listeners.forEach((fn) => fn());
}

export function getTransactions(branchId?: string): Transaction[] {
  if (!branchId) return transactions;
  return transactions.filter((t) => t.branchId === branchId);
}

export function getTodayStats(branchId?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTxns = transactions.filter(
    (t) =>
      t.status === 'completed' &&
      new Date(t.createdAt) >= today &&
      (!branchId || t.branchId === branchId)
  );

  const revenue = todayTxns.reduce((sum, t) => sum + t.total, 0);
  const count = todayTxns.length;
  const avg = count > 0 ? revenue / count : 0;

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
  return { getTodayStats, getTransactions, subscribe, addTransaction };
}
