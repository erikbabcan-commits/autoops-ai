import { WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnlineStatus } from '@/hooks/use-online-status';

export function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          className="fixed inset-x-3 top-3 z-[80] mx-auto flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-100 shadow-neumorph backdrop-blur-xl"
        >
          <WifiOff className="h-4 w-4" />
          Offline mode active · using cached data from the last 7 days.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
