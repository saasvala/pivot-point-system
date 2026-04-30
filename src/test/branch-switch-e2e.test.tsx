import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * E2E: switching branches in the header dropdown must instantly retarget
 * revenue (sales) and stock (inventory) to the selected branch — and the
 * selection must persist across a simulated page refresh, on both desktop
 * (1280x720) and mobile (390x844) viewports.
 */

const setViewport = (w: number, h: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: h });
  window.dispatchEvent(new Event('resize'));
};

const importFresh = async () => {
  vi.resetModules();
  const branchStore = await import('@/data/branchStore');
  const stockStore = await import('@/data/branchStockStore');
  const salesStore = await import('@/data/salesStore');
  const { BranchSwitcher } = await import('@/components/branches/BranchSwitcher');
  const { AuthProvider } = await import('@/hooks/useAuth');
  return { branchStore, stockStore, salesStore, BranchSwitcher, AuthProvider };
};

const loginAs = (role: 'super_admin' | 'owner') => {
  const profile =
    role === 'super_admin'
      ? { id: 'u1', name: 'Super Admin', role: 'super_admin', avatar: 'SA' }
      : { id: 'u2', name: 'Business Owner', role: 'owner', avatar: 'BO' };
  sessionStorage.setItem('pos-auth', JSON.stringify(profile));
};

const seedSalesPerBranch = async (salesStore: any, branchIds: string[]) => {
  // Give each branch a unique, deterministic revenue today
  branchIds.forEach((bid, i) => {
    salesStore.addTransaction({
      id: `TXN-SEED-${bid}`,
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 100 * (i + 1), // br0=100, br1=200, br2=300
      amountPaid: 100 * (i + 1),
      change: 0,
      paymentMethod: 'cash',
      createdAt: new Date(),
      status: 'completed',
      branchId: bid,
    });
  });
};

const renderSwitcher = (AuthProvider: any, BranchSwitcher: any) =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <BranchSwitcher />
      </AuthProvider>
    </MemoryRouter>
  );

const switchToBranch = async (name: RegExp) => {
  fireEvent.click(screen.getByRole('combobox'));
  const option = await screen.findByRole('button', { name: (n) => n.includes(name.source.replace(/[\\\/^$.*+?()[\]{}|]/g, '')) }).catch(async () => {
    // Fallback: find by visible text inside a button
    const matches = await screen.findAllByText(name);
    return matches.find((el) => el.closest('button')) as HTMLElement;
  });
  const btn = (option as HTMLElement).closest('button')!;
  fireEvent.click(btn);
};

describe.each([
  { label: 'desktop', width: 1280, height: 720 },
  { label: 'mobile', width: 390, height: 844 },
])('E2E branch switcher — $label viewport ($width x $height)', ({ width, height }) => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    setViewport(width, height);
  });
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('Super Admin: switching branch retargets revenue + stock instantly and persists after refresh', async () => {
    const { branchStore, stockStore, salesStore, BranchSwitcher, AuthProvider } = await importFresh();
    loginAs('super_admin');

    const all = branchStore.getAllBranches();
    expect(all.length).toBeGreaterThanOrEqual(3);
    const [b0, b1, b2] = all;

    await seedSalesPerBranch(salesStore, [b0.id, b1.id, b2.id]);

    // Give each branch a distinct stock value for the same product so we can
    // assert scope changes when switching.
    const productId = stockStore.getProductsForBranch(b0.id)[0].id;
    stockStore.setStock(b0.id, productId, 11);
    stockStore.setStock(b1.id, productId, 22);
    stockStore.setStock(b2.id, productId, 33);

    // Capture baseline revenues per branch (seed data already present)
    const rev0 = salesStore.getTodayStats(b0.id).revenue;
    const rev1 = salesStore.getTodayStats(b1.id).revenue;
    const rev2 = salesStore.getTodayStats(b2.id).revenue;
    // Each branch must have a *different* revenue scope
    expect(new Set([rev0, rev1, rev2]).size).toBe(3);

    renderSwitcher(AuthProvider, BranchSwitcher);

    // --- Active = first branch initially ---
    expect(branchStore.getActiveBranchId()).toBe(b0.id);
    let active = branchStore.getActiveBranchId();
    expect(salesStore.getTodayStats(active).revenue).toBe(rev0);
    expect(stockStore.getProductsForBranch(active).find((p) => p.id === productId)!.stock).toBe(11);

    // --- Switch to second branch via dropdown ---
    act(() => {
      fireEvent.click(screen.getByRole('combobox'));
    });
    const optionB1 = (await screen.findAllByText(b1.name))
      .map((el) => el.closest('button'))
      .find(Boolean)!;
    act(() => {
      fireEvent.click(optionB1);
    });

    expect(branchStore.getActiveBranchId()).toBe(b1.id);
    active = branchStore.getActiveBranchId();
    // Revenue scope updated instantly
    expect(salesStore.getTodayStats(active).revenue).toBe(200);
    // Stock scope updated instantly
    expect(stockStore.getProductsForBranch(active).find((p) => p.id === productId)!.stock).toBe(22);
    // Trigger reflects new selection
    expect(within(screen.getByRole('combobox')).getByText(b1.name)).toBeInTheDocument();

    // --- Switch to third branch ---
    act(() => {
      fireEvent.click(screen.getByRole('combobox'));
    });
    const optionB2 = (await screen.findAllByText(b2.name))
      .map((el) => el.closest('button'))
      .find(Boolean)!;
    act(() => {
      fireEvent.click(optionB2);
    });

    expect(branchStore.getActiveBranchId()).toBe(b2.id);
    expect(salesStore.getTodayStats(b2.id).revenue).toBe(300);
    expect(stockStore.getProductsForBranch(b2.id).find((p) => p.id === productId)!.stock).toBe(33);

    // --- Simulate page refresh: localStorage persists, modules re-init ---
    const fresh = await importFresh();
    // Auth session also persists via sessionStorage for Super Admin
    expect(fresh.branchStore.getActiveBranchId()).toBe(b2.id);

    renderSwitcher(fresh.AuthProvider, fresh.BranchSwitcher);
    const triggerAfterRefresh = screen.getAllByRole('combobox').pop()!;
    expect(within(triggerAfterRefresh).getByText(b2.name)).toBeInTheDocument();

    // Stock value rehydrates from localStorage
    expect(
      fresh.stockStore.getProductsForBranch(b2.id).find((p) => p.id === productId)!.stock
    ).toBe(33);
  });

  it('Owner: active branch dropdown selection persists across refresh', async () => {
    const { branchStore, BranchSwitcher, AuthProvider } = await importFresh();
    loginAs('owner');

    const [, b1] = branchStore.getAllBranches();

    renderSwitcher(AuthProvider, BranchSwitcher);

    act(() => {
      fireEvent.click(screen.getByRole('combobox'));
    });
    const opt = (await screen.findAllByText(b1.name))
      .map((el) => el.closest('button'))
      .find(Boolean)!;
    act(() => {
      fireEvent.click(opt);
    });

    expect(branchStore.getActiveBranchId()).toBe(b1.id);
    // localStorage should contain the active-branch key
    expect(localStorage.getItem('nexuspos-active-branch-v1')).toBe(b1.id);

    // Refresh
    const fresh = await importFresh();
    expect(fresh.branchStore.getActiveBranchId()).toBe(b1.id);

    renderSwitcher(fresh.AuthProvider, fresh.BranchSwitcher);
    const trigger = screen.getAllByRole('combobox').pop()!;
    expect(within(trigger).getByText(b1.name)).toBeInTheDocument();
  });
});
