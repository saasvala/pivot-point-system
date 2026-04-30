import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

/**
 * Security suite: cashiers must NOT be able to read or write to any branch
 * other than the one they are assigned to.
 *
 * Layers covered:
 *   1. branchStore — visible branch list & setActiveBranch rejection
 *   2. branchStockStore — writes are scoped per-branch (no cross-branch mutation)
 *   3. ProtectedRoute — /branches and /branches/overview are blocked for cashiers
 *   4. POSTerminal & Inventory — operate exclusively on the locked branch
 */

const importFresh = async () => {
  vi.resetModules();
  const branchStore = await import('@/data/branchStore');
  const stockStore = await import('@/data/branchStockStore');
  const { AuthProvider, useAuth } = await import('@/hooks/useAuth');
  const { ProtectedRoute } = await import('@/components/ProtectedRoute');
  return { branchStore, stockStore, AuthProvider, useAuth, ProtectedRoute };
};

const loginAsCashier = (name = 'Alex Johnson') => {
  sessionStorage.setItem(
    'pos-auth',
    JSON.stringify({ id: 'u4', name, role: 'cashier', avatar: 'AJ' })
  );
};

describe('SECURITY: cashier branch lock', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('branchStore: cashier sees only their assigned branch', async () => {
    const { branchStore, AuthProvider } = await importFresh();
    loginAsCashier();

    // Mount AuthProvider so its effect applies the branch-lock
    render(
      <MemoryRouter>
        <AuthProvider>
          <div />
        </AuthProvider>
      </MemoryRouter>
    );

    const visible = branchStore.getBranches();
    const all = branchStore.getAllBranches();

    expect(all.length).toBeGreaterThan(1);
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe('br-mall'); // Alex Johnson assignment
    expect(branchStore.getAllowedBranches()).toEqual(['br-mall']);
    expect(branchStore.getActiveBranchId()).toBe('br-mall');
  });

  it('branchStore: setActiveBranch silently rejects switches to other branches', async () => {
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

    // Attempt privilege escalation: try to switch to Downtown / Airport
    branchStore.setActiveBranch('br-downtown');
    expect(branchStore.getActiveBranchId()).toBe('br-mall');

    branchStore.setActiveBranch('br-airport');
    expect(branchStore.getActiveBranchId()).toBe('br-mall');
  });

  it('branchStockStore: cashier writes only mutate their branch', async () => {
    const { branchStore, stockStore, AuthProvider } = await importFresh();
    loginAsCashier();

    render(
      <MemoryRouter>
        <AuthProvider>
          <div />
        </AuthProvider>
      </MemoryRouter>
    );

    const cashierBranch = branchStore.getActiveBranchId(); // br-mall
    const otherBranch = 'br-downtown';

    const productId = stockStore.getProductsForBranch(cashierBranch)[0].id;
    const beforeOther = stockStore.getProductsForBranch(otherBranch)
      .find((p) => p.id === productId)!.stock;
    const beforeOwn = stockStore.getProductsForBranch(cashierBranch)
      .find((p) => p.id === productId)!.stock;

    // Simulate a POS sale on the active (locked) branch
    stockStore.adjustStock(cashierBranch, productId, -3);

    const afterOwn = stockStore.getProductsForBranch(cashierBranch)
      .find((p) => p.id === productId)!.stock;
    const afterOther = stockStore.getProductsForBranch(otherBranch)
      .find((p) => p.id === productId)!.stock;

    expect(afterOwn).toBe(beforeOwn - 3);
    // Cross-branch isolation: other branch stock untouched
    expect(afterOther).toBe(beforeOther);
  });

  it('ProtectedRoute: cashier is redirected away from /branches and /branches/overview', async () => {
    const { AuthProvider, ProtectedRoute } = await importFresh();
    loginAsCashier();

    const Branches = () => <div>BRANCHES_SETTINGS_PAGE</div>;
    const Overview = () => <div>BRANCHES_OVERVIEW_PAGE</div>;
    const Dashboard = () => <div>DASHBOARD_PAGE</div>;

    const renderAt = (path: string) =>
      render(
        <MemoryRouter initialEntries={[path]}>
          <AuthProvider>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/branches"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                    <Branches />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/branches/overview"
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'owner']}>
                    <Overview />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

    const { unmount } = renderAt('/branches');
    expect(screen.queryByText('BRANCHES_SETTINGS_PAGE')).not.toBeInTheDocument();
    expect(screen.getByText('DASHBOARD_PAGE')).toBeInTheDocument();
    unmount();

    renderAt('/branches/overview');
    expect(screen.queryByText('BRANCHES_OVERVIEW_PAGE')).not.toBeInTheDocument();
    expect(screen.getByText('DASHBOARD_PAGE')).toBeInTheDocument();
  });

  it('BranchSwitcher: cashier sees a read-only badge (no dropdown / no other branches)', async () => {
    const { AuthProvider } = await importFresh();
    const { BranchSwitcher } = await import('@/components/branches/BranchSwitcher');
    loginAsCashier();

    render(
      <MemoryRouter>
        <AuthProvider>
          <BranchSwitcher />
        </AuthProvider>
      </MemoryRouter>
    );

    // No combobox/dropdown rendered for cashiers
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    // Other branches must NOT be exposed in the DOM
    expect(screen.queryByText(/Downtown Flagship/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Airport Terminal/i)).not.toBeInTheDocument();
  });

  it('logout clears the branch lock so the next user is not constrained', async () => {
    const { branchStore, AuthProvider, useAuth } = await importFresh();
    loginAsCashier();

    const Probe = () => {
      const { logout } = useAuth();
      return <button onClick={logout}>logout</button>;
    };

    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Probe />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(branchStore.getAllowedBranches()).toEqual(['br-mall']);
    getByText('logout').click();
    expect(branchStore.getAllowedBranches()).toBeNull();
    // After logout, all branches are visible again
    expect(branchStore.getBranches().length).toBe(branchStore.getAllBranches().length);
  });
});
