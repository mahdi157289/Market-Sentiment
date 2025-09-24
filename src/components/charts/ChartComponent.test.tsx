import { render, screen, fireEvent } from '@testing-library/react';
import { ChartComponent } from './ChartComponent';
import type { TimeRange, TimeSeriesPoint } from '@types';

const ranges: TimeRange[] = ['1D','1W','1M'];
const now = Date.now();
const makeSeries = (n: number): TimeSeriesPoint[] => Array.from({ length: n }, (_, i) => ({ timestamp: now - i * 86400000, value: 100 + i }));
const series = {
  '1D': makeSeries(10),
  '1W': makeSeries(7),
  '1M': makeSeries(30)
} as const;

describe('ChartComponent', () => {
  it('renders title and range buttons', () => {
    const onRangeChange = vi.fn();
    render(<ChartComponent title="Test Chart" ranges={ranges} activeRange={'1M'} onRangeChange={onRangeChange} series={series as any} />);
    expect(screen.getByText(/Test Chart/i)).toBeInTheDocument();
    ranges.forEach(r => expect(screen.getByText(r)).toBeInTheDocument());
  });

  it('calls onRangeChange when range clicked', () => {
    const onRangeChange = vi.fn();
    render(<ChartComponent title="Test Chart" ranges={ranges} activeRange={'1M'} onRangeChange={onRangeChange} series={series as any} />);
    fireEvent.click(screen.getByText('1W'));
    expect(onRangeChange).toHaveBeenCalledWith('1W');
  });
});



