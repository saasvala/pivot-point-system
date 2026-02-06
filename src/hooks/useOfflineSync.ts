import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

const DB_NAME = 'nexuspos-offline';
const DB_VERSION = 1;
const STORE_TRANSACTIONS = 'pending_transactions';
const STORE_QUEUE = 'sync_queue';

interface OfflineTransaction {
  id: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
        db.createObjectStore(STORE_TRANSACTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbPut = async (storeName: string, data: any) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(data);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const dbGetAll = async (storeName: string): Promise<any[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const dbDelete = async (storeName: string, id: string) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const dbClear = async (storeName: string) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored — syncing pending transactions...');
      syncPendingTransactions();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Transactions will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial pending count
    refreshPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, []);

  // Periodic sync attempt when online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncIntervalRef.current = setInterval(() => {
        syncPendingTransactions();
      }, 30000);
    }
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [isOnline, pendingCount]);

  const refreshPendingCount = async () => {
    try {
      const items = await dbGetAll(STORE_TRANSACTIONS);
      const pending = items.filter(i => !i.synced);
      setPendingCount(pending.length);
    } catch {
      setPendingCount(0);
    }
  };

  const saveTransaction = useCallback(async (transactionData: any) => {
    const offlineTx: OfflineTransaction = {
      id: transactionData.id || `offline-${Date.now()}`,
      data: transactionData,
      timestamp: Date.now(),
      synced: false,
    };

    try {
      await dbPut(STORE_TRANSACTIONS, offlineTx);
      await refreshPendingCount();

      if (navigator.onLine) {
        // Try immediate sync
        setTimeout(() => syncPendingTransactions(), 500);
      }

      return offlineTx.id;
    } catch (err) {
      console.error('Failed to save offline transaction:', err);
      toast.error('Failed to save transaction locally');
      throw err;
    }
  }, []);

  const syncPendingTransactions = useCallback(async () => {
    if (isSyncing || !navigator.onLine) return;

    try {
      setIsSyncing(true);
      const items = await dbGetAll(STORE_TRANSACTIONS);
      const pending = items.filter(i => !i.synced);

      if (pending.length === 0) {
        setPendingCount(0);
        return;
      }

      let synced = 0;
      for (const item of pending) {
        try {
          // Simulate API sync (replace with real API call when backend is connected)
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Mark as synced
          await dbPut(STORE_TRANSACTIONS, { ...item, synced: true });
          synced++;
        } catch (err) {
          console.error(`Failed to sync transaction ${item.id}:`, err);
        }
      }

      if (synced > 0) {
        toast.success(`${synced} transaction${synced > 1 ? 's' : ''} synced`);
      }

      await refreshPendingCount();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  const clearSynced = useCallback(async () => {
    try {
      const items = await dbGetAll(STORE_TRANSACTIONS);
      for (const item of items) {
        if (item.synced) {
          await dbDelete(STORE_TRANSACTIONS, item.id);
        }
      }
      toast.info('Cleared synced transactions');
    } catch (err) {
      console.error('Failed to clear synced:', err);
    }
  }, []);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    saveTransaction,
    syncPendingTransactions,
    clearSynced,
  };
};
