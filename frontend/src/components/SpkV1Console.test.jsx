import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SpkV1Console from './SpkV1Console';

vi.mock('../hooks/useSpkV1Live', () => ({
  default: () => ({ status: 'idle', data: null, error: null }),
}));

const mockRuntime = {
  network: 'sepolia',
  explorer_base: 'https://sepolia.etherscan.io',
  synced_at: '2026-06-07T16:27:40.740Z',
  contracts: {
    solar_punk_coin: '0x8e189002228Fd4C6fA7611bA49FBe1d9C3412128',
    currency_system: '0x520162252F9B94824417678525FFd69145014970',
  },
  on_chain: { total_supply_spk: 5404.01 },
  genesis: { metrics: { network_payment_count: 14, total_settled_spk: 383, circulation_share_percent: 97.45 } },
  counterparties: {
    merchant: { address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', role: 'GOODS' },
  },
  chain_index: { payment_ledger: [] },
};

describe('SpkV1Console', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRuntime,
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders demo stats after runtime loads', async () => {
    const mockProvider = { send: vi.fn() };
    render(
      <SpkV1Console
        provider={mockProvider}
        signer={null}
        account={null}
        onConnect={() => {}}
        connecting={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Advanced — Sepolia Proof/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/5,404/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /send spk/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect wallet|install metamask/i })).toBeInTheDocument();
  });

  it('shows error state when runtime fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    render(
      <SpkV1Console
        provider={null}
        signer={null}
        account={null}
        onConnect={() => {}}
        connecting={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Could not load SPK v1 data/i)).toBeInTheDocument();
    });
  });
});
