import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, ShieldCheck, ShieldAlert, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffMember, StaffRole } from '@/types/pos';
import { staffMembers } from '@/data/staffData';

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (staff: StaffMember) => void;
  requiredRole?: StaffRole;
  actionLabel?: string;
}

export const PinAuthModal = ({
  isOpen,
  onClose,
  onAuthenticate,
  requiredRole,
  actionLabel = 'Sign In',
}: PinAuthModalProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
    }
  }, [isOpen]);

  const roleHierarchy: Record<StaffRole, number> = {
    cashier: 1,
    manager: 2,
    admin: 3,
  };

  const handleDigit = useCallback((digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError('');

    if (newPin.length === 4) {
      const staff = staffMembers.find(s => s.pin === newPin);
      if (!staff) {
        setError('Invalid PIN');
        setShake(true);
        setTimeout(() => { setShake(false); setPin(''); }, 600);
        return;
      }
      if (requiredRole && roleHierarchy[staff.role] < roleHierarchy[requiredRole]) {
        setError(`Requires ${requiredRole} or higher access`);
        setShake(true);
        setTimeout(() => { setShake(false); setPin(''); }, 600);
        return;
      }
      onAuthenticate(staff);
      setPin('');
    }
  }, [pin, onAuthenticate, requiredRole]);

  const handleDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  }, []);

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === 'Backspace') handleDelete();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleDigit, handleDelete, onClose]);

  if (!isOpen) return null;

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-sm glass-card rounded-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{actionLabel}</h2>
            {requiredRole && (
              <div className="flex items-center justify-center gap-1.5 mt-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Requires {requiredRole} access</span>
              </div>
            )}
          </div>

          {/* PIN Dots */}
          <motion.div
            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-4 py-4"
          >
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  i < pin.length
                    ? 'bg-primary scale-110 shadow-glow-purple'
                    : 'bg-muted border-2 border-border'
                }`}
              />
            ))}
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mb-2 flex items-center justify-center gap-2 text-sm text-destructive"
            >
              <ShieldAlert className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          {/* Numpad */}
          <div className="p-6 pt-2 grid grid-cols-3 gap-3">
            {digits.map((d, i) => {
              if (d === '') return <div key={i} />;
              if (d === 'del') {
                return (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-14 text-lg"
                    onClick={handleDelete}
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                );
              }
              return (
                <Button
                  key={i}
                  variant="outline"
                  className="h-14 text-xl font-semibold hover:bg-primary/10 active:scale-95 transition-all touch-manipulation"
                  onClick={() => handleDigit(d)}
                >
                  {d}
                </Button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-6 pb-6 text-center">
            <p className="text-xs text-muted-foreground">
              Demo PINs: 1234 (Cashier) • 5678 (Manager) • 0000 (Admin)
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
