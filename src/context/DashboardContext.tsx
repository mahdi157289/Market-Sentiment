import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import type { MarketIndex, TimeRange } from '@types';

interface DashboardContextValue {
  selectedIndex: MarketIndex | null;
  setSelectedIndex: (idx: MarketIndex) => void;
  timeRange: TimeRange;
  setTimeRange: (r: TimeRange) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  error: string | null;
  setError: (e: string | null) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  initialIndex: MarketIndex;
  initialRange?: TimeRange;
  children: ReactNode;
}

export function DashboardProvider({ initialIndex, initialRange = '1M', children }: DashboardProviderProps) {
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(initialIndex);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialRange);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(
    () => ({ selectedIndex, setSelectedIndex, timeRange, setTimeRange, loading, setLoading, error, setError }),
    [selectedIndex, timeRange, loading, error]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}



