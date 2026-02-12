import { AuditLogEntry } from '@/types/pos';

// In-memory audit log store (would be persisted to DB in production)
let auditLog: AuditLogEntry[] = [];

export type AuditAction = 
  | 'STAFF_SIGN_IN'
  | 'TRANSACTION_COMPLETED'
  | 'REFUND_PROCESSED'
  | 'DISCOUNT_APPLIED'
  | 'DISCOUNT_OVERRIDE'
  | 'PRICE_OVERRIDE'
  | 'CART_CLEARED'
  | 'BILL_HELD'
  | 'BILL_RECALLED'
  | 'STAFF_ADDED'
  | 'STAFF_EDITED'
  | 'STAFF_DELETED';

export function addAuditEntry(
  staffId: string,
  staffName: string,
  action: AuditAction,
  details: string,
  transactionId?: string
) {
  const entry: AuditLogEntry = {
    id: `AUD-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date(),
    staffId,
    staffName,
    action,
    details,
    transactionId,
  };
  auditLog.unshift(entry);
  // Keep last 500 entries in memory
  if (auditLog.length > 500) auditLog = auditLog.slice(0, 500);
  return entry;
}

export function getAuditLog(): AuditLogEntry[] {
  return [...auditLog];
}

export function clearAuditLog() {
  auditLog = [];
}
