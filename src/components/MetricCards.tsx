import { memo } from 'react';
import { motion } from 'framer-motion';
import { Metric } from '@types';

interface MetricCardsProps {
  metrics: Metric[];
}

// Mock data for realistic trading values
const mockMetrics: Metric[] = [
  {
    name: "Fear & Greed Index",
    value: 58,
    change: 0.12, // +12%
    isPositiveGood: true
  },
  {
    name: "VIX",
    value: 22.1,
    change: -0.08, // -8%
    isPositiveGood: false
  },
  {
    name: "Put/Call Ratio",
    value: 0.85,
    change: 0.15,
    isPositiveGood: false
  },
  {
    name: "DXY",
    value: 103.45,
    change: 0.03, // +3%
    isPositiveGood: false
  },
  {
    name: "10Y Yield",
    value: 4.25,
    change: 0.05, // +5%
    isPositiveGood: false
  }
];

// Icons for each metric
const getMetricIcon = (name: string) => {
  const icons: Record<string, string> = {
    "Fear & Greed Index": "😨",
    "VIX": "📈",
    "Put/Call Ratio": "⚖️",
    "DXY": "💵",
    "10Y Yield": "📊"
  };
  return icons[name] || "📊";
};

// Get color coding based on metric and change
const getMetricColor = (metric: Metric) => {
  const { name, change, isPositiveGood } = metric;
  
  // For Fear & Greed Index: Higher is better (greed = good)
  if (name === "Fear & Greed Index") {
    if (metric.value >= 70) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (metric.value >= 40) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  }
  
  // For VIX: Lower is better (less volatility = good)
  if (name === "VIX") {
    if (metric.value <= 20) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (metric.value <= 30) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  }
  
  // For Put/Call Ratio: Lower is better (more calls = bullish)
  if (name === "Put/Call Ratio") {
    if (metric.value <= 0.7) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (metric.value <= 1.0) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  }
  
  // For DXY: Moderate is better (extreme moves = bad)
  if (name === "DXY") {
    if (metric.value >= 100 && metric.value <= 110) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (metric.value >= 95 && metric.value <= 115) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  }
  
  // For 10Y Yield: Moderate is better (extreme yields = bad)
  if (name === "10Y Yield") {
    if (metric.value >= 3.5 && metric.value <= 5.0) return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (metric.value >= 2.5 && metric.value <= 6.0) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  }
  
  // Default color coding based on change direction
  const isPositiveChange = change > 0;
  const isGoodChange = isPositiveChange === isPositiveGood;
  
  if (isGoodChange) {
    return { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
  } else if (change === 0) {
    return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
  } else {
    return { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  }
};

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const colors = getMetricColor(metric);
  const icon = getMetricIcon(metric.name);
  const arrow = metric.change > 0 ? '↑' : metric.change < 0 ? '↓' : '→';
  const changePercent = Math.abs(metric.change * 100);
  
  // Format value based on metric type
  const formatValue = (name: string, value: number) => {
    if (name === "Put/Call Ratio") return value.toFixed(2);
    if (name === "DXY") return value.toFixed(2);
    if (name === "10Y Yield") return `${value.toFixed(2)}%`;
    if (name === "VIX") return value.toFixed(1);
    return value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -2, 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={`glass p-4 sm:p-5 lg:p-6 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-md touch-manipulation`}
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`size-8 sm:size-9 lg:size-10 grid place-items-center rounded-lg ${colors.bg} ${colors.border} border`}>
            <span className="text-sm sm:text-base lg:text-lg">{icon}</span>
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
            {metric.name}
          </h3>
        </div>
      </div>

      {/* Value and change */}
      <div className="space-y-1 sm:space-y-2">
        <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colors.color}`}>
          {formatValue(metric.name, metric.value)}
        </div>
        
        {metric.change !== 0 && (
          <div className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium ${colors.color}`}>
            <span className="text-sm sm:text-base lg:text-lg">{arrow}</span>
            <span>{changePercent.toFixed(1)}%</span>
          </div>
        )}
        
        {metric.change === 0 && (
          <div className="text-xs sm:text-sm text-white/60">
            No change
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MetricCardsBase({ metrics = mockMetrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {metrics.map((metric, index) => (
        <MetricCard 
          key={metric.name} 
          metric={metric} 
          index={index}
        />
      ))}
    </div>
  );
}

export const MetricCards = memo(MetricCardsBase);
