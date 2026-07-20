import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
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
  it('turns browser case decisions into inspectable receipts with explicit wayfinding', async () => {
    renderReceipts();

    expect(await screen.findByRole('heading', { name: /share the decision identity, not a screenshot/i })).toBeInTheDocument();
    expect(screen.getByText(/browser-session decisions/i)).toBeInTheDocument();
    expect(screen.getAllByText('TYN-001').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ENERGY-CASE-PILOT-005').length).toBeGreaterThan(0);
    expect(screen.getByText(/runtime receipt/i)).toBeInTheDocument();
    expect(screen.getByText('@solarpunk/constraint-core')).toBeInTheDocument();

    const readingMap = screen.getByRole('navigation', { name: /receipt reading map/i });
    expect(within(readingMap).getByRole('link', { name: /identity/i })).toHaveAttribute('href', '#receipt-summary');
    expect(within(readingMap).getByRole('link', { name: /rules/i })).toHaveAttribute('href', '#receipt-rules');
    expect(within(readingMap).getByRole('link', { name: /inputs/i })).toHaveAttribute('href', '#receipt-inputs');
    expect(within(readingMap).getByRole('link', { name: /capsule/i })).toHaveAttribute('href', '#receipt-capsule');
  });

  it('builds a standards-mapped capsule with hashed portable files and raw evidence excluded', async () => {
    renderReceipts();

    await screen.findByText(/research capsule/i);
    await waitFor(() => {
      expect(screen.getAllByText(/12 portable files/i).length).toBeGreaterThanOrEqual(2);
    });
    expect(screen.getByText('decision-result.json')).toBeInTheDocument();
    expect(screen.getByText('decision-receipt.json')).toBeInTheDocument();
    expect(screen.getByText('lineage.json')).toBeInTheDocument();
    expect(screen.getByText('prov.jsonld')).toBeInTheDocument();
    expect(screen.getByText('ro-crate-metadata.json')).toBeInTheDocument();
    expect(screen.getByText(/raw evidence rows are excluded/i)).toBeInTheDocument();
  });
});
