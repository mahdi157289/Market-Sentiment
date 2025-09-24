import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass px-6 py-4 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="size-3 rounded-full bg-white/70 animate-pulse"></span>
          <span className="text-sm text-white/80">Loading data...</span>
        </div>
      </motion.div>
    </div>
  );
}



