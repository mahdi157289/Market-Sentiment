import { memo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  TimeScale,
} from 'chart.js';
import { motion } from 'framer-motion';
import { MarketIndex } from '@types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, TimeScale);

interface ChartsSectionProps {
  selectedIndex: MarketIndex;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';

// Mock data generators for realistic trading context
const generateIndexData = (days: number, baseValue: number, volatility: number = 0.02) => {
  const data = [];
  let value = baseValue;
  const now = Date.now();
  
  for (let i = days - 1; i >= 0; i--) {
    // Add realistic market movement with some trend
    const trend = Math.sin(i / days * Math.PI) * 0.01; // Gentle trend
    const random = (Math.random() - 0.5) * volatility;
    value += value * (trend + random);
    
    data.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      value: Math.round(value * 100) / 100
    });
  }
  return data;
};

const generateVIXData = (days: number) => {
  const data = [];
  let vix = 22; // Start at moderate VIX level
  const now = Date.now();
  
  for (let i = days - 1; i >= 0; i--) {
    // VIX tends to be mean-reverting with spikes
    const meanReversion = (20 - vix) * 0.1;
    const spike = Math.random() < 0.05 ? (Math.random() - 0.5) * 15 : 0; // 5% chance of spike
    const random = (Math.random() - 0.5) * 2;
    
    vix += meanReversion + spike + random;
    vix = Math.max(10, Math.min(50, vix)); // Clamp between 10-50
    
    data.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      value: Math.round(vix * 10) / 10
    });
  }
  return data;
};

const generateBreadthData = (days: number) => {
  const data = [];
  let ma50 = 55; // % above MA50
  let ma200 = 48; // % above MA200
  const now = Date.now();
  
  for (let i = days - 1; i >= 0; i--) {
    // Market breadth tends to move together
    const trend = Math.sin(i / days * Math.PI * 2) * 0.1;
    const random = (Math.random() - 0.5) * 0.05;
    
    ma50 += trend + random;
    ma200 += trend + random * 0.8; // MA200 moves slower
    
    ma50 = Math.max(20, Math.min(80, ma50));
    ma200 = Math.max(15, Math.min(75, ma200));
    
    data.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      ma50: Math.round(ma50 * 10) / 10,
      ma200: Math.round(ma200 * 10) / 10
    });
  }
  return data;
};

// Mock data for different time ranges
const getMockData = (range: TimeRange, selectedIndex: MarketIndex) => {
  const days = range === '1D' ? 1 : range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : 365;
  
  return {
    indexData: generateIndexData(days, selectedIndex.value, 0.015),
    vixData: generateVIXData(days),
    breadthData: generateBreadthData(days)
  };
};

// Chart configuration for dark theme
const getChartOptions = (title: string, isVIX = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.9)',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      padding: 12,
      titleColor: 'white',
      bodyColor: 'white',
      callbacks: {
        title: (context: any) => {
          const date = new Date(context[0].parsed.x);
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        },
        label: (context: any) => {
          const value = context.parsed.y;
          if (isVIX) {
            return `VIX: ${value}`;
          }
          return `${title}: ${value.toLocaleString()}`;
        }
      }
    },
  },
  scales: {
    x: {
      display: true,
      grid: { display: false },
      ticks: { 
        color: 'rgba(255,255,255,0.6)',
        maxTicksLimit: 6
      },
    },
    y: {
      display: true,
      grid: { color: 'rgba(255,255,255,0.08)' },
      ticks: { 
        color: 'rgba(255,255,255,0.6)',
        callback: (value: any) => {
          if (isVIX) return value;
          return value.toLocaleString();
        }
      },
    },
  },
});

function IndexChart({ selectedIndex, range, onRangeChange }: { selectedIndex: MarketIndex; range: TimeRange; onRangeChange: (range: TimeRange) => void }) {
  const { indexData } = getMockData(range, selectedIndex);
  const labels = indexData.map(d => new Date(d.timestamp).toLocaleDateString());
  const values = indexData.map(d => d.value);
  
  // Determine color based on trend
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const isBullish = lastValue > firstValue;
  const color = isBullish ? '22, 163, 74' : '220, 38, 38'; // Green or Red
  
  const chartData = {
    labels,
    datasets: [{
      data: values,
      fill: true,
      borderColor: `rgba(${color}, 1)`,
      backgroundColor: `rgba(${color}, 0.15)`,
      pointRadius: 0,
      tension: 0.4,
      borderWidth: 2,
    }],
  };

  const ranges: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y'];

  return (
    <motion.div 
      className="glass p-4 sm:p-5 lg:p-6 rounded-xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex-1">
          <h3 className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
            {selectedIndex.symbol} - {selectedIndex.name}
          </h3>
          <div className="text-xs text-white/50 mt-1">
            Current: {selectedIndex.value.toLocaleString()} 
            <span className={`ml-2 ${selectedIndex.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {selectedIndex.change >= 0 ? '+' : ''}{selectedIndex.change.toFixed(2)} ({selectedIndex.changePercent >= 0 ? '+' : ''}{(selectedIndex.changePercent * 100).toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-colors touch-manipulation ${
                range === r
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 lg:h-80">
        <Line data={chartData} options={getChartOptions(selectedIndex.symbol)} />
      </div>
    </motion.div>
  );
}

function VIXChart({ range }: { range: TimeRange }) {
  const { vixData } = getMockData(range, { value: 4500 } as MarketIndex);
  const labels = vixData.map(d => new Date(d.timestamp).toLocaleDateString());
  const values = vixData.map(d => d.value);
  
  // VIX color coding: Green (low stress), Yellow (moderate), Red (high stress)
  const avgVIX = values.reduce((a, b) => a + b, 0) / values.length;
  const color = avgVIX <= 20 ? '22, 163, 74' : avgVIX <= 30 ? '202, 138, 4' : '220, 38, 38';
  
  const chartData = {
    labels,
    datasets: [{
      data: values,
      fill: true,
      borderColor: `rgba(${color}, 1)`,
      backgroundColor: `rgba(${color}, 0.15)`,
      pointRadius: 0,
      tension: 0.4,
      borderWidth: 2,
    }],
  };

  return (
    <motion.div 
      className="glass p-4 sm:p-5 lg:p-6 rounded-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
            VIX - Volatility Index
          </h3>
          <div className="text-xs text-white/50 mt-1">
            Stress Level: {avgVIX.toFixed(1)} 
            <span className={`ml-2 ${
              avgVIX <= 20 ? 'text-green-400' : 
              avgVIX <= 30 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {avgVIX <= 20 ? 'Low' : avgVIX <= 30 ? 'Moderate' : 'High'}
            </span>
          </div>
        </div>
      </div>

      <div className="h-48 sm:h-56 lg:h-64">
        <Line data={chartData} options={getChartOptions('VIX', true)} />
      </div>
    </motion.div>
  );
}

function MarketBreadthChart({ range }: { range: TimeRange }) {
  const { breadthData } = getMockData(range, { value: 4500 } as MarketIndex);
  const labels = breadthData.map(d => new Date(d.timestamp).toLocaleDateString());
  const ma50Data = breadthData.map(d => d.ma50);
  const ma200Data = breadthData.map(d => d.ma200);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Above MA50',
        data: ma50Data,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        pointRadius: 0,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Above MA200',
        data: ma200Data,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointRadius: 0,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...getChartOptions('Market Breadth'),
    plugins: {
      ...getChartOptions('Market Breadth').plugins,
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255,255,255,0.8)',
          usePointStyle: true,
          pointStyle: 'line',
        },
      },
    },
    scales: {
      ...getChartOptions('Market Breadth').scales,
      y: {
        ...getChartOptions('Market Breadth').scales.y,
        min: 0,
        max: 100,
        ticks: {
          ...getChartOptions('Market Breadth').scales.y.ticks,
          callback: (value: any) => `${value}%`,
        },
      },
    },
  };

  return (
    <motion.div 
      className="glass p-4 sm:p-5 lg:p-6 rounded-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
            Market Breadth
          </h3>
          <div className="text-xs text-white/50 mt-1">
            MA50: {ma50Data[ma50Data.length - 1]?.toFixed(1)}% | 
            MA200: {ma200Data[ma200Data.length - 1]?.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="h-48 sm:h-56 lg:h-64">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}

function ChartsSectionBase({ selectedIndex }: ChartsSectionProps) {
  const [range, setRange] = useState<TimeRange>('1M');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* LEFT COLUMN: Main Index Chart */}
        <IndexChart 
          selectedIndex={selectedIndex} 
          range={range} 
          onRangeChange={setRange}
        />
        
        {/* RIGHT COLUMN: VIX and Market Breadth */}
        <div className="space-y-4 sm:space-y-6">
          <VIXChart range={range} />
          <MarketBreadthChart range={range} />
        </div>
      </div>
    </div>
  );
}

export const ChartsSection = memo(ChartsSectionBase);
