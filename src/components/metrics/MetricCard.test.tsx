import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('shows title and value', () => {
    render(<MetricCard id="m1" title="Advancers" value="123" change={0.1} trend="up" />);
    expect(screen.getByText(/Advancers/i)).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});



