import { useState } from 'react';
import { Check, ChevronsUpDown, Store, Plus, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useBranches, setActiveBranch } from '@/data/branchStore';
import { toast } from 'sonner';

export const BranchSwitcher = () => {
  const { user } = useAuth();
  const { branches, activeBranchId, activeBranch } = useBranches();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;
  // Restrict switcher to owners + super admins
  const canSwitch = user.role === 'super_admin' || user.role === 'owner';
  if (!canSwitch) {
    // Lower roles see read-only badge of the active branch
    return (
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border/50">
        <Store className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium truncate max-w-[120px]">{activeBranch?.name || 'No branch'}</span>
      </div>
    );
  }

  const handleSelect = (id: string, name: string) => {
    setActiveBranch(id);
    setOpen(false);
    toast.success(`Switched to ${name}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="gap-1.5 max-w-[200px]"
        >
          <Store className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate text-xs sm:text-sm">{activeBranch?.name || 'Select branch'}</span>
          <ChevronsUpDown className="w-3 h-3 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="end">
        <div className="p-2 border-b border-border/50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
            Switch Branch
          </p>
        </div>
        <div className="max-h-[280px] overflow-y-auto p-1">
          {branches.map((b) => {
            const isActive = b.id === activeBranchId;
            return (
              <button
                key={b.id}
                onClick={() => handleSelect(b.id, b.name)}
                className={cn(
                  'w-full flex items-start gap-2 px-2 py-2 rounded-md text-left transition-colors',
                  isActive ? 'bg-primary/10' : 'hover:bg-muted'
                )}
              >
                <div className={cn(
                  'mt-0.5 w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0',
                  isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-sm font-medium truncate', isActive && 'text-primary')}>
                      {b.name}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{b.address}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-1 border-t border-border/50 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2 text-xs h-8"
            onClick={() => { setOpen(false); navigate('/branches'); }}
          >
            <SettingsIcon className="w-3.5 h-3.5" /> Manage branches
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
