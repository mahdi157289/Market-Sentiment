/**
 * Dashboard-specific TypeScript interfaces
 * Based on client requirements for US Market Sentiment Dashboard
 */

/**
 * Sentiment data structure for the main gauge
 * @interface SentimentData
 */
export interface SentimentData {
  /** Sentiment score from 0-100 */
  score: number;
  /** Status label (e.g., "Bullish", "Neutral", "Bearish") */
  status: string;
  /** Descriptive text about current sentiment */
  description: string;
}

/**
 * Metric data for mini-cards (Fear & Greed, VIX, Put/Call, DXY, 10Y Yield)
 * @interface Metric
 */
export interface Metric {
  /** Name of the metric (e.g., "Fear & Greed Index", "VIX") */
  name: string;
  /** Current value of the metric */
  value: number;
  /** Change from previous period (as decimal, e.g., 0.05 for 5%) */
  change: number;
  /** Whether positive change is good for market sentiment */
  isPositiveGood: boolean;
}

/**
 * Chart data structure for index price and VIX charts
 * @interface ChartData
 */
export interface ChartData {
  /** Index symbol (e.g., "SPX", "IXIC", "DJI") */
  index: string;
  /** Array of price values over time */
  data: number[];
  /** Array of time labels for x-axis */
  labels: string[];
  /** Array of VIX values for parallel display */
  vixData: number[];
}

/**
 * Macro economic indicators (GDP, CPI, Unemployment, Fed Funds Rate)
 * @interface MacroIndicator
 */
export interface MacroIndicator {
  /** Name of the indicator (e.g., "GDP", "CPI", "Unemployment Rate") */
  name: string;
  /** Current value */
  value: number;
  /** Previous period value for comparison */
  previous: number;
  /** Trend direction */
  trend: 'up' | 'down' | 'stable';
}

/**
 * News item from various sources
 * @interface NewsItem
 */
export interface NewsItem {
  /** News source (e.g., "Reuters", "Bloomberg", "CNBC") */
  source: string;
  /** News headline */
  headline: string;
  /** Sentiment analysis result */
  sentiment: 'positive' | 'negative' | 'neutral';
  /** Buzz level (0-100) indicating how much attention the news is getting */
  buzz: number;
}

/**
 * AI-generated market summary
 * @interface AISummary
 */
export interface AISummary {
  /** Natural language analysis text */
  text: string;
  /** When the summary was generated */
  timestamp: Date;
}

/**
 * Dashboard data aggregation interface
 * Combines all dashboard data types
 */
export interface DashboardData {
  /** Main sentiment gauge data */
  sentiment: SentimentData;
  /** Mini-cards metrics */
  metrics: Metric[];
  /** Chart data for price and VIX */
  charts: ChartData;
  /** Macro economic indicators */
  macro: MacroIndicator[];
  /** News and social sentiment */
  news: NewsItem[];
  /** AI market analysis */
  aiSummary: AISummary;
}

