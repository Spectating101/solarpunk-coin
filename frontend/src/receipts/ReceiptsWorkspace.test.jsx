import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CaseWorkbenchProvider } from '../app/CaseWorkbenchProvider';
import ReceiptsWorkspace from './ReceiptsWorkspace';

function renderReceipts() {
  return render(
    <CaseWorkbenchProvider>
      <ReceiptsWorkspace receiptId={null} onOpenReceipt={vi.fn()} />
    </CaseWorkbenchProvider>,
  );
}

describe('ReceiptsWorkspace', () => {
  it('turns browser case decisions into inspectable receipts', async () => {
    renderReceipts();

    expect(await screen.findByRole('heading', { name: /share the decision identity, not a screenshot/i })).toBeInTheDocument();
    expect(screen.getAllByText('TYN-001').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ENERGY-CASE-PILOT-005').length).toBeGreaterThan(0);
    expect(screen.getByText(/runtime receipt/i)).toBeInTheDocument();
    expect(screen.getByText('@solarpunk/constraint-core')).toBeInTheDocument();
  });

  it('builds a capsule manifest with hashed portable files and raw evidence excluded', async () => {
    renderReceipts();

    await screen.findByText(/research capsule/i);
    await waitFor(() => {
      expect(screen.getByText(/10 portable files/i)).toBeInTheDocument();
    });
    expect(screen.getByText('decision-result.json')).toBeInTheDocument();
    expect(screen.getByText('decision-receipt.json')).toBeInTheDocument();
    expect(screen.getByText('lineage.json')).toBeInTheDocument();
    expect(screen.getByText(/raw evidence rows are excluded/i)).toBeInTheDocument();
  });
});
