import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Filter, Download, ArrowLeft, Clock, User, FileText,
  ShieldCheck, AlertTriangle, RefreshCw, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileDrawer } from '@/components/dashboard/MobileDrawer';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { useAuth } from '@/hooks/useAuth';
import { getAuditLog, type AuditAction } from '@/data/auditLog';
import { format } from 'date-fns';

const actionMeta: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  STAFF_SIGN_IN: { label: 'Sign In', color: 'bg-accent-blue/10 text-accent-blue', icon: User },
  TRANSACTION_COMPLETED: { label: 'Transaction', color: 'bg-success/10 text-success', icon: FileText },
  REFUND_PROCESSED: { label: 'Refund', color: 'bg-destructive/10 text-destructive', icon: RefreshCw },
  DISCOUNT_APPLIED: { label: 'Discount', color: 'bg-accent-orange/10 text-accent-orange', icon: FileText },
  DISCOUNT_OVERRIDE: { label: 'Override', color: 'bg-warning/10 text-warning', icon: AlertTriangle },
  PRICE_OVERRIDE: { label: 'Price Override', color: 'bg-warning/10 text-warning', icon: AlertTriangle },
  CART_CLEARED: { label: 'Cart Cleared', color: 'bg-muted text-muted-foreground', icon: FileText },
  BILL_HELD: { label: 'Bill Held', color: 'bg-accent-purple/10 text-accent-purple', icon: Clock },
  BILL_RECALLED: { label: 'Bill Recalled', color: 'bg-accent-purple/10 text-accent-purple', icon: Clock },
  STAFF_ADDED: { label: 'Staff Added', color: 'bg-success/10 text-success', icon: ShieldCheck },
  STAFF_EDITED: { label: 'Staff Edited', color: 'bg-accent-blue/10 text-accent-blue', icon: ShieldCheck },
  STAFF_DELETED: { label: 'Staff Deleted', color: 'bg-destructive/10 text-destructive', icon: ShieldCheck },
};

const AuditLog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const entries = getAuditLog();

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        !search ||
        e.staffName.toLowerCase().includes(search.toLowerCase()) ||
        e.details.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        (e.transactionId?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesAction = actionFilter === 'all' || e.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [entries, search, actionFilter]);

  const handleExport = () => {
    const csv = [
      'ID,Timestamp,Staff,Action,Details,Transaction ID',
      ...filtered.map((e) =>
        `"${e.id}","${format(new Date(e.timestamp), 'yyyy-MM-dd HH:mm:ss')}","${e.staffName}","${e.action}","${e.details}","${e.transactionId || ''}"`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MobileDrawer />
            <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Audit Log</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                {entries.length} total entries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex" onClick={handleExport}>
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-4">
        {/* Filters */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by staff, details, ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {Object.entries(actionMeta).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>{meta.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table - Desktop */}
        {filtered.length === 0 ? (
          <Card className="glass-card border-border/50">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No audit entries found</h3>
              <p className="text-sm text-muted-foreground">
                {entries.length === 0
                  ? 'Perform some actions in the POS terminal to generate log entries.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop table */}
            <Card className="glass-card border-border/50 hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Timestamp</TableHead>
                    <TableHead className="w-[130px]">Staff</TableHead>
                    <TableHead className="w-[140px]">Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-[120px]">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((entry) => {
                    const meta = actionMeta[entry.action] || { label: entry.action, color: 'bg-muted text-muted-foreground', icon: FileText };
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(entry.timestamp), 'MMM dd, HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{entry.staffName}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${meta.color} border-0 text-xs`}>
                            {meta.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                          {entry.details}
                        </TableCell>
                        <TableCell>
                          {entry.transactionId && (
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{entry.transactionId}</code>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((entry) => {
                const meta = actionMeta[entry.action] || { label: entry.action, color: 'bg-muted text-muted-foreground', icon: FileText };
                const Icon = meta.icon;
                return (
                  <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="glass-card border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${meta.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="secondary" className={`${meta.color} border-0 text-[10px]`}>
                                {meta.label}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {format(new Date(entry.timestamp), 'HH:mm:ss')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground mb-0.5">{entry.details}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{entry.staffName}</span>
                              {entry.transactionId && (
                                <>
                                  <span>•</span>
                                  <code className="bg-muted px-1 rounded">{entry.transactionId}</code>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default AuditLog;
