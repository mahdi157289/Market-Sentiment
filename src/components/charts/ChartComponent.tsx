import { memo } from 'react';
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
import type { ChartComponentProps, TimeRange, TimeSeriesPoint } from '@types';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, TimeScale);

const colorMap: Record<NonNullable<ChartComponentProps['color']>, string> = {
  primary: '22, 163, 74',
  warning: '202, 138, 4',
  error: '220, 38, 38',
};

function ChartComponentBase({ title, ranges, activeRange, onRangeChange, series, color = 'primary' }: ChartComponentProps) {
  const rgb = colorMap[color];

  const dataForRange: TimeSeriesPoint[] = series[activeRange] ?? [];
  const labels = dataForRange.map(p => new Date(p.timestamp).toLocaleDateString());
  const values = dataForRange.map(p => p.value);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        fill: true,
        borderColor: `rgba(${rgb}, 1)`,
        backgroundColor: `rgba(${rgb}, 0.12)`,
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.5)' },
      },
      y: {
        display: true,
        grid: { color: 'rgba(255,255,255,0.08)' },
        ticks: { color: 'rgba(255,255,255,0.5)' },
      },
    },
  } as const;

  return (
    <motion.div 
      className="glass p-6 rounded-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">{title}</h3>
        <div className="flex items-center gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => onRangeChange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeRange === range
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
}

export const ChartComponent = memo(ChartComponentBase);


