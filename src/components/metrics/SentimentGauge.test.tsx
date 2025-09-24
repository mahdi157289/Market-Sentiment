import { render, screen } from '@testing-library/react';
import { SentimentGauge } from './SentimentGauge';

describe('SentimentGauge', () => {
  it('renders value and label', () => {
    render(<SentimentGauge value={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText(/Bullish/i)).toBeInTheDocument();
  });
});



