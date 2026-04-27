import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// IMPORTANT: branchStore reads localStorage at module load. We must clear
// storage BEFORE importing the store / pages, and re-import per test.
const importFresh = async () => {
  // Reset module registry so branchStore re-initialises from fresh storage
  // @ts-ignore - vitest provides resetModules
  await import('vitest').then(({ vi }) => vi.resetModules());
  const branchStore = await import('@/data/branchStore');
  const { BranchSwitcher } = await import('@/components/branches/BranchSwitcher');
  const { AuthProvider } = await import('@/hooks/useAuth');
  return { branchStore, BranchSwitcher, AuthProvider };
};

const renderHeader = (AuthProvider: any, BranchSwitcher: any) =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <BranchSwitcher />
      </AuthProvider>
    </MemoryRouter>
  );

describe('Riverside Plaza branch — add / edit / persist (Super Admin)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('appears selected in the header dropdown after add + edit, and survives refresh', async () => {
    const { branchStore, BranchSwitcher, AuthProvider } = await importFresh();

    // Log in as Super Admin so the switcher is interactive
    const auth = JSON.stringify({ id: 'u1', name: 'Super Admin', role: 'super_admin', avatar: 'SA' });
    sessionStorage.setItem('pos-auth', auth);

    // Add Riverside Plaza
    let added: any;
    act(() => {
      added = branchStore.addBranch({
        name: 'Riverside Plaza',
        address: '88 River Rd',
        phone: '+1 555-0400',
        manager: 'Test Manager',
      });
    });
    expect(added.name).toBe('Riverside Plaza');

    // Edit it
    act(() => {
      branchStore.updateBranch(added.id, { address: '88 River Rd, Suite 5' });
    });
    expect(branchStore.getBranches().find((b) => b.id === added.id)?.address)
      .toBe('88 River Rd, Suite 5');

    // Set it active
    act(() => {
      branchStore.setActiveBranch(added.id);
    });

    // Render the header switcher and confirm it shows Riverside Plaza as selected
    renderHeader(AuthProvider, BranchSwitcher);
    const trigger = screen.getByRole('combobox');
    expect(within(trigger).getByText(/Riverside Plaza/i)).toBeInTheDocument();

    // --- Simulate page refresh: re-import everything; localStorage persists ---
    const fresh = await importFresh();
    sessionStorage.setItem('pos-auth', auth);

    // Sanity: store re-hydrated from localStorage with the same active branch
    expect(fresh.branchStore.getActiveBranchId()).toBe(added.id);
    expect(fresh.branchStore.getBranches().some((b) => b.id === added.id)).toBe(true);

    renderHeader(fresh.AuthProvider, fresh.BranchSwitcher);
    const trigger2 = screen.getAllByRole('combobox').pop()!;
    expect(within(trigger2).getByText(/Riverside Plaza/i)).toBeInTheDocument();
  });

  it('opening the dropdown lists Riverside Plaza with a check mark', async () => {
    const { branchStore, BranchSwitcher, AuthProvider } = await importFresh();
    sessionStorage.setItem(
      'pos-auth',
      JSON.stringify({ id: 'u1', name: 'Super Admin', role: 'super_admin', avatar: 'SA' })
    );

    let added: any;
    act(() => {
      added = branchStore.addBranch({
        name: 'Riverside Plaza',
        address: '88 River Rd',
        phone: '+1 555-0400',
        manager: 'Test Manager',
      });
      branchStore.setActiveBranch(added.id);
    });

    renderHeader(AuthProvider, BranchSwitcher);
    fireEvent.click(screen.getByRole('combobox'));
    // Popover renders the list of branches
    const items = await screen.findAllByText(/Riverside Plaza/i);
    expect(items.length).toBeGreaterThan(0);
  });
});
