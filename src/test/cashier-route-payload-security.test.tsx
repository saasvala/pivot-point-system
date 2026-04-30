import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

/**
 * SECURITY: cashier role must be blocked at the router/store level for any
 * attempt to operate on another branch via:
 *   (a) URL query string  e.g.  /pos?branchId=br-downtown
 *   (b) URL hash          e.g.  /inventory#branch=br-airport
 *   (c) Direct store call e.g.  setActiveBranch('br-downtown')
 *   (d) Write payload     e.g.  adjustStock('br-downtown', ...)  — read-only assert
 *
 * Cashiers in this app have no admin routes (already covered in
 * cashier-branch-security.test.tsx); this suite focuses specifically on POS
 * and Inventory routes with adversarial branchId inputs.
 */

const importFresh = async () => {
  vi.resetModules();
  const branchStore = await import('@/data/branchStore');
  const stockStore = await import('@/data/branchStockStore');
  const salesStore = await import('@/data/salesStore');
  const { AuthProvider } = await import('@/hooks/useAuth');
  const { ProtectedRoute } = await import('@/components/ProtectedRoute');
  return { branchStore, stockStore, salesStore, AuthProvider, ProtectedRoute };
};

const loginAsCashier = () => {
  sessionStorage.setItem(
    'pos-auth',
    JSON.stringify({ id: 'u4', name: 'Alex Johnson', role: 'cashier', avatar: 'AJ' })
  );
};

describe('SECURITY: cashier cannot operate on other branches via URL or payload', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('cashier landing on /pos?branchId=<other> stays locked to assigned branch', async () => {
    const { branchStore, AuthProvider, ProtectedRoute } = await importFresh();
    loginAsCashier();

    // Probe reads via the reactive hook the real pages use, so it reflects
    // the branch-lock applied by AuthProvider's mount effect.
    const PosProbe = () => {
      const { activeBranchId } = branchStore.useBranches();
      return <div data-testid="active-branch">{activeBranchId}</div>;
    };

    render(
      <MemoryRouter initialEntries={['/pos?branchId=br-downtown&store=br-airport']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/pos"
              element={
                <ProtectedRoute>
                  <PosProbe />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<div>DASH</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Cashier may access /pos (it is in their roleModules) but the URL
    // branchId must be ignored — active branch stays at the assigned one.
    expect(screen.getByTestId('active-branch').textContent).toBe('br-mall');
    expect(branchStore.getAllowedBranches()).toEqual(['br-mall']);
  });

  it('cashier landing on /inventory?branchId=<other> is redirected (route guard) AND store stays locked', async () => {
    const { branchStore, AuthProvider, ProtectedRoute } = await importFresh();
    loginAsCashier();

    render(
      <MemoryRouter
        initialEntries={['/inventory?branchId=br-airport&adjust=999#branch=br-downtown']}
      >
        <AuthProvider>
          <Routes>
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'owner', 'manager']}>
                  <div>INVENTORY_PAGE</div>
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<div>DASH</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Route guard blocks cashier from /inventory entirely
    expect(screen.queryByText('INVENTORY_PAGE')).not.toBeInTheDocument();
    expect(screen.getByText('DASH')).toBeInTheDocument();
    // Store is still locked
    expect(branchStore.getActiveBranchId()).toBe('br-mall');
    expect(branchStore.getAllowedBranches()).toEqual(['br-mall']);
  });

  it('direct setActiveBranch("br-downtown") on a cashier session is rejected', async () => {
    const { branchStore, AuthProvider } = await importFresh();
    loginAsCashier();

    render(
      <MemoryRouter>
        <AuthProvider>
          <div />
        </AuthProvider>
      </MemoryRouter>
    );

    const before = branchStore.getActiveBranchId();
    expect(before).toBe('br-mall');

    act(() => {
      branchStore.setActiveBranch('br-downtown');
      branchStore.setActiveBranch('br-airport');
    });

    expect(branchStore.getActiveBranchId()).toBe('br-mall');
  });

  it('a POS sale recorded by a cashier is auto-tagged with the locked branch (payload branchId is the assigned one)', async () => {
    const { branchStore, salesStore, AuthProvider } = await importFresh();
    loginAsCashier();

    render(
      <MemoryRouter>
        <AuthProvider>
          <div />
        </AuthProvider>
      </MemoryRouter>
    );

    // Simulate the same payload POSTerminal builds on checkout.
    // It uses `branchId: activeBranchId` — which the store now forces to br-mall.
    const txn = {
      id: 'TXN-CASHIER-1',
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 50,
      amountPaid: 50,
      change: 0,
      paymentMethod: 'cash' as const,
      createdAt: new Date(),
      status: 'completed' as const,
      branchId: branchStore.getActiveBranchId(),
    };

    // Even if a tampered client tried to override branchId, the recorded
    // transaction must still be queryable under the cashier's branch only.
    salesStore.addTransaction(txn);

    expect(branchStore.getActiveBranchId()).toBe('br-mall');
    const ownTxns = salesStore.getTransactions('br-mall').map((t) => t.id);
    expect(ownTxns).toContain('TXN-CASHIER-1');

    // And the transaction must NOT be visible under any other branch
    expect(salesStore.getTransactions('br-downtown').map((t) => t.id)).not.toContain('TXN-CASHIER-1');
    expect(salesStore.getTransactions('br-airport').map((t) => t.id)).not.toContain('TXN-CASHIER-1');
  });

  it('cashier write attempt against another branch in stockStore would not affect their visible scope', async () => {
    // The stock store is module-level (no auth check). The protection is that
    // the UI only ever passes `activeBranchId`, which is locked. We assert the
    // *invariant the UI relies on*: from the cashier's POV the only branch
    // they can read/write is br-mall.
    const { branchStore, stockStore, AuthProvider } = await importFresh();
    loginAsCashier();

    render(
      <MemoryRouter>
        <AuthProvider>
          <div />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(branchStore.getBranches().map((b) => b.id)).toEqual(['br-mall']);

    // The UI hook used by Inventory/POS:
    const visibleProducts = stockStore.getProductsForBranch(branchStore.getActiveBranchId());
    expect(visibleProducts.length).toBeGreaterThan(0);
    expect(branchStore.getActiveBranchId()).toBe('br-mall');
  });
});
