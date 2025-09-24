import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { DashboardProvider } from '@/context/DashboardContext';
import type { MarketIndex } from '@types';

const indexes: MarketIndex[] = [
  { id: 'sp500', name: 'S&P 500', symbol: 'SPX', value: 4500, change: 5, changePercent: 0.11 },
  { id: 'nasdaq', name: 'NASDAQ', symbol: 'IXIC', value: 14000, change: -10, changePercent: -0.07 },
];

function renderHeader() {
  const onIndexChange = vi.fn();
  render(
    <DashboardProvider initialIndex={indexes[0]!}>
      <Header selectedIndex={indexes[0]!} onIndexChange={onIndexChange} availableIndexes={indexes} />
    </DashboardProvider>
  );
  return { onIndexChange };
}

describe('Header', () => {
  it('renders title and selected index', () => {
    renderHeader();
    expect(screen.getByText(/US Market Sentiment/i)).toBeInTheDocument();
    // SPX appears in the desktop pill and in the tabs; ensure at least one is rendered
    expect(screen.getAllByText(/SPX/i).length).toBeGreaterThan(0);
  });

  it('opens mobile menu and selects index', () => {
    const { onIndexChange } = renderHeader();
    const button = screen.getByRole('button', { name: /toggle index menu/i });
    fireEvent.click(button);
    fireEvent.click(screen.getAllByText('IXIC')[0]!);
    expect(onIndexChange).toHaveBeenCalled();
  });
});


