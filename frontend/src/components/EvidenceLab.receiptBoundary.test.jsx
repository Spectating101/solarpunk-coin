import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import EvidenceLab from '../components/EvidenceLab';
import CurrencyLab from '../components/CurrencyLab';

const GOOD = `timestamp,generation_kwh,consumption_kwh,export_kwh,meter_id
2026-01-15T08:00:00Z,3.2,0.6,2.5,SAMPLE-01
2026-01-15T09:00:00Z,4.1,0.7,3.3,SAMPLE-01
`;

const BAD = `timestamp,generation_kwh
2026-01-15T08:00:00Z,10
`;

function Harness() {
  const [receipt, setReceipt] = useState(null);
  return (
    <>
      <EvidenceLab
        onReceiptReady={(r) => setReceipt(r)}
        onReceiptInvalidated={() => setReceipt(null)}
      />
      <CurrencyLab receipt={receipt} />
      <div data-testid="receipt-state">{receipt ? 'has-receipt' : 'no-receipt'}</div>
    </>
  );
}

describe('EvidenceLab → CurrencyLab receipt boundary', () => {
  it('clears Currency Lab receipt when a later validation fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, text: async () => GOOD })
      .mockResolvedValueOnce({ ok: true, text: async () => BAD });
    vi.stubGlobal('fetch', fetchMock);

    render(<Harness />);

    fireEvent.click(screen.getByRole('button', { name: /load sample csv/i }));
    await waitFor(() => {
      expect(screen.getByTestId('receipt-state')).toHaveTextContent('has-receipt');
    });
    expect(screen.queryByText(/no active evidence receipt/i)).not.toBeInTheDocument();

    // Second load: generation-only → still builds a receipt but issuance not eligible;
    // force a hard failure via oversized remap by uploading invalid parse through second sample.
    // Use generation-only sample: receipt may exist but Currency Lab should still be usable only if parent keeps it.
    // Spec: failed validation must clear. Generation-only still validates ok=true.
    // Trigger a true failure: malformed CSV via FileReader path is hard; call invalidate by loading then
    // remapping timestamp away.
    fireEvent.click(screen.getByRole('button', { name: /load sample csv/i }));
    await waitFor(() => {
      // second sample is generation-only — still ok validation, receipt restored
      expect(screen.getByTestId('receipt-state')).toHaveTextContent('has-receipt');
    });

    // Clear timestamp mapping to force validation failure and parent invalidation
    const selects = screen.getAllByRole('combobox');
    const timestampSelect = selects[0];
    fireEvent.change(timestampSelect, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByTestId('receipt-state')).toHaveTextContent('no-receipt');
    });
    expect(screen.getByText(/no active evidence receipt/i)).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
