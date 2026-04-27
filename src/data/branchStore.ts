import { useSyncExternalStore } from 'react';

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  createdAt: Date;
}

const STORAGE_KEY = 'nexuspos-branches-v1';
const ACTIVE_KEY = 'nexuspos-active-branch-v1';

const seedBranches: Branch[] = [
  { id: 'br-downtown', name: 'Downtown Flagship', address: '123 Main St, Downtown', phone: '+1 555-0100', manager: 'Maria Garcia', createdAt: new Date('2024-01-15') },
  { id: 'br-mall', name: 'Westfield Mall', address: '500 Mall Plaza, Suite 204', phone: '+1 555-0200', manager: 'Alex Johnson', createdAt: new Date('2024-03-22') },
  { id: 'br-airport', name: 'Airport Terminal 2', address: 'Gate B14, International Airport', phone: '+1 555-0300', manager: 'Admin User', createdAt: new Date('2024-06-10') },
];

const loadBranches = (): Branch[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedBranches;
    const parsed = JSON.parse(raw) as Branch[];
    return parsed.map((b) => ({ ...b, createdAt: new Date(b.createdAt) }));
  } catch {
    return seedBranches;
  }
};

const loadActive = (initial: Branch[]): string => {
  const stored = localStorage.getItem(ACTIVE_KEY);
  if (stored && initial.some((b) => b.id === stored)) return stored;
  return initial[0]?.id || '';
};

let branches: Branch[] = loadBranches();
let activeId: string = loadActive(branches);
let listeners: (() => void)[] = [];

const persist = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(branches));
  localStorage.setItem(ACTIVE_KEY, activeId);
};

const notify = () => listeners.forEach((fn) => fn());

export const subscribeBranches = (l: () => void) => {
  listeners.push(l);
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
};

export const getBranches = (): Branch[] => {
  if (allowedIds) return branches.filter((b) => allowedIds!.includes(b.id));
  return branches;
};
export const getAllBranches = (): Branch[] => branches;
export const getActiveBranchId = (): string => activeId;
export const getActiveBranch = (): Branch | undefined => branches.find((b) => b.id === activeId);

export const setActiveBranch = (id: string) => {
  if (!branches.some((b) => b.id === id)) return;
  // Enforce cashier branch lock — silently reject switches to disallowed branches
  if (allowedIds && !allowedIds.includes(id)) return;
  activeId = id;
  persist();
  notify();
};

// Cashier branch-lock: when set, hooks expose only these branch IDs and
// reject switches to other branches.
let allowedIds: string[] | null = null;

export const setAllowedBranches = (ids: string[] | null) => {
  allowedIds = ids && ids.length ? ids : null;
  // If currently active branch is not allowed, snap to first allowed
  if (allowedIds && !allowedIds.includes(activeId)) {
    const target = branches.find((b) => allowedIds!.includes(b.id))?.id;
    if (target) {
      activeId = target;
      persist();
    }
  }
  notify();
};

export const getAllowedBranches = (): string[] | null => allowedIds;

export const addBranch = (input: Omit<Branch, 'id' | 'createdAt'>): Branch => {
  const branch: Branch = {
    ...input,
    id: `br-${Date.now().toString(36)}`,
    createdAt: new Date(),
  };
  branches = [...branches, branch];
  persist();
  notify();
  return branch;
};

export const updateBranch = (id: string, patch: Partial<Omit<Branch, 'id' | 'createdAt'>>) => {
  branches = branches.map((b) => (b.id === id ? { ...b, ...patch } : b));
  persist();
  notify();
};

export const deleteBranch = (id: string) => {
  if (branches.length <= 1) return false;
  branches = branches.filter((b) => b.id !== id);
  if (activeId === id) activeId = branches[0].id;
  persist();
  notify();
  return true;
};

// Hook for components
export const useBranches = () => {
  const snapshot = useSyncExternalStore(
    subscribeBranches,
    () => `${activeId}|${branches.length}|${branches.map((b) => b.id + b.name).join(',')}`
  );
  return {
    branches: getBranches(),
    activeBranchId: getActiveBranchId(),
    activeBranch: getActiveBranch(),
    _snap: snapshot,
  };
};
