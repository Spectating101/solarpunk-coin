import { render, screen } from '@testing-library/react';

import Navbar from './Navbar';

describe('Navbar', () => {
  it('shows connect button when wallet is disconnected', () => {
    render(<Navbar account={null} connectWallet={() => {}} isConnecting={false} />);
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('shows shortened address when wallet is connected', () => {
    render(
      <Navbar
        account="0x1234567890abcdef1234567890abcdef12345678"
        connectWallet={() => {}}
        isConnecting={false}
      />
    );
    expect(screen.getByText(/0x1234\.\.\.5678/i)).toBeInTheDocument();
  });
});
