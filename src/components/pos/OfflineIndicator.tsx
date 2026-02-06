import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  onSync: () => void;
}

export const OfflineIndicator = ({
  isOnline,
  pendingCount,
  isSyncing,
  onSync,
}: OfflineIndicatorProps) => {
  if (isOnline && pendingCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          !isOnline
            ? "bg-destructive/15 text-destructive border border-destructive/30"
            : "bg-warning/15 text-warning border border-warning/30"
        )}
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline</span>
            {pendingCount > 0 && (
              <span className="bg-destructive/20 px-1.5 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </>
        ) : (
          <>
            <Cloud className="w-3.5 h-3.5" />
            <span>{pendingCount} pending sync</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              onClick={onSync}
              disabled={isSyncing}
            >
              <RefreshCw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
            </Button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
