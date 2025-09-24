import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface MiniTrendProps {
  data: number[];
  color: 'primary' | 'warning' | 'error';
}

export function MiniTrend({ data, color }: MiniTrendProps) {
  const tailwindToRgba: Record<string, string> = {
    primary: '22, 163, 74',
    warning: '202, 138, 4',
    error: '220, 38, 38',
  };

  const datasetColor = tailwindToRgba[color];

  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data,
        fill: true,
        borderColor: `rgba(${datasetColor}, 1)`,
        backgroundColor: `rgba(${datasetColor}, 0.15)`,
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  } as const;

  return (
    <div className="h-24 w-full flex items-center justify-center">
      <div className="w-full h-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}


