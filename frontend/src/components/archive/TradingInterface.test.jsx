import { render, screen } from '@testing-library/react';

import TradingInterface from './TradingInterface';

describe('TradingInterface', () => {
  it('shows connect-wallet prompt and disabled action without signer', () => {
    render(<TradingInterface provider={null} signer={null} />);

    expect(screen.getAllByText(/connect wallet to execute/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/read-only/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect wallet to execute/i })).toBeDisabled();
  });
});
