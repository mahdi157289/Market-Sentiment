export interface TimeSeriesPoint {
  timestamp: number; // epoch ms
  value: number;
}

export interface SentimentMetric {
  id: string;
  label: string;
  value: number; // 0-100
  direction: 'up' | 'down' | 'flat';
}

// Header Component Types
export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface HeaderProps {
  selectedIndex: MarketIndex;
  onIndexChange: (index: MarketIndex) => void;
  availableIndexes: MarketIndex[];
}

export interface ClockState {
  time: string;
  date: string;
}

// SentimentGauge Component Types
export interface SentimentGaugeProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface GaugeZone {
  min: number;
  max: number;
  color: string;
  label: string;
}

export interface GaugeNeedleProps {
  value: number; // 0-100
  size: number;
}

// MetricCard Types
export interface MetricCardProps {
  id: string;
  title: string;
  value: string;
  change?: number; // e.g., 0.123 => 12.3%
  trend?: 'up' | 'down' | 'flat';
  icon?: React.ReactNode;
  accent?: 'primary' | 'warning' | 'error';
}

// ChartComponent Types
export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';

export interface ChartComponentProps {
  title: string;
  ranges: TimeRange[];
  activeRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  series: Record<TimeRange, TimeSeriesPoint[]>;
  color?: 'primary' | 'warning' | 'error';
}

// Re-export dashboard types
export * from './dashboard';
