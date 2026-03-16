import { render, screen } from '@testing-library/react';

import TradingInterface from './TradingInterface';

describe('TradingInterface', () => {
  it('shows connect-wallet prompt and disabled action without signer', () => {
    render(<TradingInterface provider={null} signer={null} />);

    expect(screen.getByText(/connect wallet to trade/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute hedge/i })).toBeDisabled();
  });
});
