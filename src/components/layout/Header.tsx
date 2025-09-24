import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderProps, ClockState, MarketIndex } from '@types';
import { useDashboard } from '@/context/DashboardContext';
import { formatPercent } from '@utils/format';

export function Header({ selectedIndex, onIndexChange, availableIndexes }: HeaderProps) {
  const { setSelectedIndex, timeRange, setTimeRange } = useDashboard();
  const [clock, setClock] = useState<ClockState>({ time: '', date: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Real-time clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock({
        time: now.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        date: now.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleIndexSelect = (index: MarketIndex) => {
    onIndexChange(index);
    setSelectedIndex(index);
    setIsMobileMenuOpen(false);
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${formatPercent(changePercent / 100, 2)})`;
  };

  return (
    <header className="glass sticky top-0 z-50 mx-4 mt-4 px-6 py-5">
      <div className="flex items-center justify-between">
        {/* Title and Selected Index */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            US Market Sentiment
          </h1>
          
          {/* Desktop Index Display */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{selectedIndex.symbol}</span>
              <span className="text-sm text-white/70">{selectedIndex.name}</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <span className={`text-sm font-semibold ${
              selectedIndex.change >= 0 ? 'text-primary' : 'text-error'
            }`}>
              {formatChange(selectedIndex.change, selectedIndex.changePercent)}
            </span>
          </div>
        </div>

        {/* Clock */}
        <div className="hidden md:flex flex-col items-end text-sm">
          <div className="font-mono text-lg font-semibold">{clock.time}</div>
          <div className="text-white/70">{clock.date}</div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Toggle index menu"
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-6 flex flex-col justify-center gap-1"
          >
            <div className="w-full h-0.5 bg-white rounded"></div>
            <div className="w-full h-0.5 bg-white rounded"></div>
            <div className="w-full h-0.5 bg-white rounded"></div>
          </motion.div>
        </button>
      </div>

      {/* Mobile Clock */}
      <div className="md:hidden mt-3 text-center">
        <div className="font-mono text-lg font-semibold">{clock.time}</div>
        <div className="text-sm text-white/70">{clock.date}</div>
      </div>

      {/* Mobile Index Selector */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 overflow-hidden"
          >
            <div className="space-y-2">
              {availableIndexes.map((index) => (
                <button
                  key={index.id}
                  onClick={() => handleIndexSelect(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedIndex.id === index.id
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{index.symbol}</div>
                      <div className="text-sm text-white/70">{index.name}</div>
                    </div>
                    <div className={`text-sm font-medium ${
                      index.change >= 0 ? 'text-primary' : 'text-error'
                    }`}>
                      {formatChange(index.change, index.changePercent)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Index Selector */}
      <div className="hidden md:flex items-center gap-1 mt-4">
        {availableIndexes.map((index, idx) => (
          <button
            key={index.id}
            onClick={() => handleIndexSelect(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleIndexSelect(index);
              }
              if (e.key === 'ArrowRight') {
                const next = availableIndexes[(idx + 1) % availableIndexes.length]!;
                handleIndexSelect(next);
              }
              if (e.key === 'ArrowLeft') {
                const prev = availableIndexes[(idx - 1 + availableIndexes.length) % availableIndexes.length]!;
                handleIndexSelect(prev);
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedIndex.id === index.id
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            role="tab"
            aria-selected={selectedIndex.id === index.id}
          >
            {index.symbol}
          </button>
        ))}
      </div>
    </header>
  );
}
