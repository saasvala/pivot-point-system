import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * E2E: switching the active branch in the header dropdown must instantly
 * update the Inventory screen — total stock counts, per-row stock numbers,
 * and the low-stock alert — on both desktop (1280x720) and mobile (390x844).
 */

const setViewport = (w: number, h: number) => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: w });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: h });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (q: string) => ({
      matches: false,
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  window.dispatchEvent(new Event('resize'));
};

const importFresh = async () => {
  vi.resetModules();
  const branchStore = await import('@/data/branchStore');
  const stockStore = await import('@/data/branchStockStore');
  const { AuthProvider } = await import('@/hooks/useAuth');
  const { ThemeProvider } = await import('@/components/ThemeProvider');
  const { TooltipProvider } = await import('@/components/ui/tooltip');
  const Inventory = (await import('@/pages/Inventory')).default;
  return { branchStore, stockStore, AuthProvider, ThemeProvider, TooltipProvider, Inventory };
};

const loginAsSuperAdmin = () => {
  sessionStorage.setItem(
    'pos-auth',
    JSON.stringify({ id: 'u1', name: 'Super Admin', role: 'super_admin', avatar: 'SA' })
  );
};

const renderInventory = (
  AuthProvider: any,
  ThemeProvider: any,
  TooltipProvider: any,
  Inventory: any
) =>
  render(
    <ThemeProvider defaultTheme="light" storageKey="nexuspos-theme">
      <TooltipProvider>
        <MemoryRouter initialEntries={['/inventory']}>
          <AuthProvider>
            <Inventory />
          </AuthProvider>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  );

const switchBranchInHeader = async (currentBranchName: string, targetBranchName: string) => {
  // The header BranchSwitcher trigger is a <button role="combobox"> whose
  // visible text is the currently selected branch name. Multiple comboboxes
  // exist on the page (Category / Stock Select), so disambiguate by name.
  const triggers = screen.getAllByRole('combobox');
  const branchTrigger = triggers.find((t) => t.textContent?.includes(currentBranchName));
  expect(branchTrigger, `BranchSwitcher trigger for "${currentBranchName}" not found`).toBeTruthy();
  act(() => {
    fireEvent.click(branchTrigger!);
  });
  const matches = await screen.findAllByText(targetBranchName);
  const button = matches.map((el) => el.closest('button')).find(Boolean) as HTMLButtonElement;
  expect(button).toBeTruthy();
  act(() => {
    fireEvent.click(button);
  });
};

describe.each([
  { label: 'desktop', width: 1280, height: 720 },
  { label: 'mobile', width: 390, height: 844 },
])(
  'E2E /inventory branch switch — $label viewport ($width x $height)',
  ({ width, height }) => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
      setViewport(width, height);
    });
    afterEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it('stock counts and low-stock alert update instantly when switching branches', async () => {
      const { branchStore, stockStore, AuthProvider, ThemeProvider, TooltipProvider, Inventory } =
        await importFresh();
      loginAsSuperAdmin();

      const all = branchStore.getAllBranches();
      expect(all.length).toBeGreaterThanOrEqual(2);
      const [bA, bB] = all;

      const productsA = stockStore.getProductsForBranch(bA.id);
      const productsB = stockStore.getProductsForBranch(bB.id);
      const target = productsA[0];

      // --- Engineer distinct, distinguishable stock profiles per branch ---
      // Branch A: target product is HEALTHY (50 units), 1 product is LOW (5 units), 0 OUT
      stockStore.setStock(bA.id, target.id, 50);
      stockStore.setStock(bA.id, productsA[1].id, 5); // low
      // Make every other product healthy on A
      productsA.slice(2).forEach((p) => stockStore.setStock(bA.id, p.id, 80));

      // Branch B: target product is OUT OF STOCK (0), 3 products are LOW (10), rest healthy
      stockStore.setStock(bB.id, target.id, 0);
      stockStore.setStock(bB.id, productsB[1].id, 10);
      stockStore.setStock(bB.id, productsB[2].id, 8);
      stockStore.setStock(bB.id, productsB[3].id, 15);
      productsB.slice(4).forEach((p) => stockStore.setStock(bB.id, p.id, 80));

      // Force start at branch A
      act(() => {
        branchStore.setActiveBranch(bA.id);
      });

      renderInventory(AuthProvider, ThemeProvider, TooltipProvider, Inventory);

      // Read the stat-card value next to a given label. The label lives in a
      // <p class="text-xs text-muted-foreground"> inside a Card. Filter to
      // that <p> to avoid matching the same text in Select options.
      const findStat = (label: string) => {
        const labelEl = screen
          .getAllByText(label)
          .find((el) => el.tagName === 'P' && el.className.includes('text-muted-foreground'));
        expect(labelEl, `stat label "${label}" not found`).toBeTruthy();
        const valueEl = labelEl!.nextElementSibling as HTMLElement | null;
        return valueEl?.textContent?.trim() || '';
      };

      const lowOnA = findStat('Low Stock');
      const outOnA = findStat('Out of Stock');

      // Sanity: matches what the store says for branch A
      expect(Number(lowOnA)).toBe(1);
      expect(Number(outOnA)).toBe(0);

      // Header subtitle reflects branch A
      expect(screen.getAllByText(new RegExp(bA.name)).length).toBeGreaterThan(0);

      // ---- Switch to branch B via header dropdown ----
      await switchBranchInHeader(bB.name);

      // Active branch updated in store
      expect(branchStore.getActiveBranchId()).toBe(bB.id);

      // ---- Stats must instantly reflect branch B ----
      const lowOnB = findStat('Low Stock');
      const outOnB = findStat('Out of Stock');

      expect(Number(lowOnB)).toBe(3);
      expect(Number(outOnB)).toBe(1);
      expect(lowOnB).not.toBe(lowOnA);
      expect(outOnB).not.toBe(outOnA);

      // Header subtitle now reflects branch B
      expect(screen.getAllByText(new RegExp(bB.name)).length).toBeGreaterThan(0);

      // Low-stock alert banner shows the correct branch-B count
      expect(
        screen.getByText(new RegExp(`${Number(lowOnB)} products? running low on stock`, 'i'))
      ).toBeInTheDocument();

      // ---- Switch back to branch A: counts revert ----
      await switchBranchInHeader(bA.name);
      expect(branchStore.getActiveBranchId()).toBe(bA.id);
      expect(findStat('Low Stock')).toBe(lowOnA);
      expect(findStat('Out of Stock')).toBe(outOnA);
    });
  }
);
