import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, UserPlus, Gift, Phone, Mail,
  Star, DollarSign, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/types/pos';
import { customers as mockCustomers } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomer?: Customer;
}

export const CustomerModal = ({
  isOpen,
  onClose,
  onSelectCustomer,
  selectedCustomer,
}: CustomerModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [allCustomers, setAllCustomers] = useState<Customer[]>(mockCustomers);

  // New customer form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery) return allCustomers;
    const q = searchQuery.toLowerCase();
    return allCustomers.filter(
      c => c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [searchQuery, allCustomers]);

  const handleAddCustomer = () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      loyaltyPoints: 0,
      totalSpent: 0,
    };
    setAllCustomers(prev => [newCustomer, ...prev]);
    onSelectCustomer(newCustomer);
    toast.success(`${newCustomer.name} added & selected`);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setShowAddForm(false);
  };

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer);
    toast.success(`Selected ${customer.name}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-card rounded-2xl overflow-hidden max-h-[85vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <h2 className="text-xl font-bold text-foreground">Select Customer</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search + Add Toggle */}
          <div className="p-4 space-y-3 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
                autoFocus
              />
            </div>
            <Button
              variant={showAddForm ? 'secondary' : 'outline'}
              className="w-full gap-2"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <UserPlus className="w-4 h-4" />
              {showAddForm ? 'Cancel' : 'Add New Customer'}
            </Button>
          </div>

          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-border/30"
              >
                <div className="p-4 space-y-3 bg-muted/20">
                  <div>
                    <Label className="text-xs mb-1.5">Full Name *</Label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Doe" className="h-10" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5">Phone *</Label>
                    <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+1 555-0000" className="h-10" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5">Email</Label>
                    <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="john@email.com" className="h-10" />
                  </div>
                  <Button className="w-full gap-2" onClick={handleAddCustomer}>
                    <Check className="w-4 h-4" />
                    Add & Select Customer
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Customer List */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No customers found</p>
                  <p className="text-sm">Try a different search or add a new customer</p>
                </div>
              ) : (
                filtered.map(customer => (
                  <motion.button
                    key={customer.id}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full rounded-xl p-4 text-left transition-all duration-150",
                      "bg-card border border-border/50 hover:border-primary/50 hover:shadow-md",
                      selectedCustomer?.id === customer.id && "border-primary bg-primary/5 shadow-glow-primary"
                    )}
                    onClick={() => handleSelect(customer)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                        {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>
                          {customer.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-xs font-medium text-warning">
                            <Gift className="w-3 h-3" />
                            {customer.loyaltyPoints} pts
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-success">
                            <DollarSign className="w-3 h-3" />
                            ${customer.totalSpent.toLocaleString()}
                          </span>
                          {customer.loyaltyPoints > 2000 && (
                            <span className="flex items-center gap-1 text-xs font-medium text-accent-pink">
                              <Star className="w-3 h-3" />
                              VIP
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedCustomer?.id === customer.id && (
                        <Check className="w-5 h-5 text-primary shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
