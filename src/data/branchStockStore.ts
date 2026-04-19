import { useSyncExternalStore } from 'react';
import { products as seedProducts } from '@/data/mockData';
import { getBranches, subscribeBranches } from '@/data/branchStore';
import { Product } from '@/types/pos';

const STORAGE_KEY = 'nexuspos-branch-stock-v1';

// branchId -> productId -> stock count
type StockMap = Record<string, Record<string, number>>;

const load = (): StockMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
};

let stockMap: StockMap = load();
let listeners: (() => void)[] = [];

// Ensure every branch has stock initialized for every product
const ensureBranchSeeded = (branchId: string) => {
  if (!stockMap[branchId]) stockMap[branchId] = {};
  let dirty = false;
  for (const p of seedProducts) {
    if (stockMap[branchId][p.id] == null) {
      // Vary stock slightly per branch for demo realism
      const variance = Math.floor((Math.random() - 0.3) * 10);
      stockMap[branchId][p.id] = Math.max(0, p.stock + variance);
      dirty = true;
    }
  }
  if (dirty) persist();
};

const persist = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stockMap));
};

const notify = () => listeners.forEach((fn) => fn());

// Re-seed on branch list changes
subscribeBranches(() => {
  for (const b of getBranches()) ensureBranchSeeded(b.id);
  notify();
});

// Initial seed
for (const b of getBranches()) ensureBranchSeeded(b.id);

export const subscribeStock = (l: () => void) => {
  listeners.push(l);
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
};

export const getProductsForBranch = (branchId: string): Product[] => {
  ensureBranchSeeded(branchId);
  const branchStock = stockMap[branchId] || {};
  return seedProducts.map((p) => ({ ...p, stock: branchStock[p.id] ?? p.stock }));
};

export const adjustStock = (branchId: string, productId: string, delta: number) => {
  ensureBranchSeeded(branchId);
  const current = stockMap[branchId][productId] ?? 0;
  stockMap[branchId][productId] = Math.max(0, current + delta);
  persist();
  notify();
};

export const setStock = (branchId: string, productId: string, value: number) => {
  ensureBranchSeeded(branchId);
  stockMap[branchId][productId] = Math.max(0, value);
  persist();
  notify();
};

export const useBranchProducts = (branchId: string): Product[] => {
  useSyncExternalStore(subscribeStock, () => `${branchId}|${JSON.stringify(stockMap[branchId] || {})}`);
  return getProductsForBranch(branchId);
};
