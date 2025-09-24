import { MarketIndex } from '@types';

export interface OverviewMockData {
  sentimentScore: number; // 0-100
  marketBreadth: number[]; // small sparkline
  volatilityIndex: number[]; // small sparkline
}

export const mockOverview: OverviewMockData = {
  sentimentScore: 58,
  marketBreadth: [48, 52, 50, 55, 53, 57, 60, 58, 61, 63, 59, 62],
  volatilityIndex: [22, 21, 23, 24, 22, 20, 19, 21, 22, 23, 22, 21],
};

export const mockMarketIndexes: MarketIndex[] = [
  {
    id: 'sp500',
    name: 'S&P 500',
    symbol: 'SPX',
    value: 4567.89,
    change: 12.34,
    changePercent: 0.27
  },
  {
    id: 'nasdaq',
    name: 'NASDAQ Composite',
    symbol: 'IXIC',
    value: 14234.56,
    change: -23.45,
    changePercent: -0.16
  },
  {
    id: 'dow',
    name: 'Dow Jones Industrial',
    symbol: 'DJI',
    value: 34567.89,
    change: 45.67,
    changePercent: 0.13
  },
  {
    id: 'russell2000',
    name: 'Russell 2000',
    symbol: 'RUT',
    value: 1987.65,
    change: -8.90,
    changePercent: -0.45
  }
];

// Generate mock time series for ranges
function generateSeries(days: number, start = 100): { timestamp: number; value: number }[] {
  const series: { timestamp: number; value: number }[] = [];
  let value = start;
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    value += (Math.random() - 0.5) * 2.5; // small random walk
    series.push({ timestamp: now - i * 24 * 60 * 60 * 1000, value: Math.round(value * 100) / 100 });
  }
  return series;
}

export const mockChartSeries = {
  '1D': generateSeries(24),
  '1W': generateSeries(7),
  '1M': generateSeries(30),
  '3M': generateSeries(90),
  '1Y': generateSeries(365),
};



