import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CaseWorkbenchProvider, useCaseWorkbench } from '../app/CaseWorkbenchProvider';
import ReceiptsWorkspace from './ReceiptsWorkspace';
import * as capsuleExports from '../lib/researchCapsule';
import * as runtimeExports from '../lib/caseWorkbenchRuntime';

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


function ContextReceipt({ scenarioId }) {
  const { activeRun } = useCaseWorkbench();
  return <>
    <output data-testid="active-decision">{activeRun?.decision.decision_id}</output>
    <ReceiptsWorkspace receiptId={activeRun?.decision.decision_id || null}
      routeContext={{ caseId: 'TYN-001', policyId: 'LAB-CASE-OPEN-004', scenarioId }} />
  </>;
}

it('revisiting a shared decision identity restores the requested scenario and exports its receipt', async () => {
  const build = vi.spyOn(capsuleExports, 'buildResearchCapsule');
  const download = vi.spyOn(runtimeExports, 'downloadJson').mockImplementation(() => {});
  const context = (scenarioId) => <CaseWorkbenchProvider><ContextReceipt scenarioId={scenarioId} /></CaseWorkbenchProvider>;
  const { rerender } = render(context('PROVENANCE-L0-BASE'));
  await waitFor(() => expect(document.querySelector('.receipt-detail')).toHaveTextContent('PROVENANCE-L0-BASE'));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Capsule bundle' })).toBeEnabled(), { timeout: 5000 });
  const firstId = screen.getByTestId('active-decision').textContent;
  rerender(context('PROVENANCE-L2-COUNTERFACTUAL'));
  await waitFor(() => expect(document.querySelector('.receipt-detail')).toHaveTextContent('PROVENANCE-L2-COUNTERFACTUAL'));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Capsule bundle' })).toBeEnabled(), { timeout: 5000 });
  expect(screen.getByTestId('active-decision').textContent).toBe(firstId);
  rerender(context('PROVENANCE-L0-BASE'));
  await waitFor(() => expect(document.querySelector('.receipt-detail')).toHaveTextContent('PROVENANCE-L0-BASE'));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Capsule bundle' })).toBeEnabled(), { timeout: 5000 });
  const [run, receipt] = build.mock.calls.at(-1);
  expect(run.scenario.scenario_id).toBe('PROVENANCE-L0-BASE');
  expect(receipt).toBe(run.receipt);
  expect(receipt.decision_id).toBe(firstId);
  fireEvent.click(screen.getByRole('button', { name: 'Receipt JSON' }));
  expect(download.mock.calls.at(-1)[1]).toBe(receipt);
  build.mockRestore(); download.mockRestore();
});

it('capsule runtime identity follows the supplied receipt outside the browser build', async () => {
  const run = await runtimeExports.evaluateCaseRun({ caseId: 'TYN-001', policyId: 'LAB-CASE-OPEN-004', scenarioId: 'PROVENANCE-L0-BASE' });
  const receipt = { ...run.receipt, runtime: { ...run.receipt.runtime, source_revision: 'external-import-revision' } };
  const capsule = await capsuleExports.buildResearchCapsule({ ...run, receipt }, receipt);
  expect(capsule.manifest.source_revision).toBe(receipt.runtime.source_revision);
  expect(JSON.parse(capsule.files['reproduction.json']).runtime).toEqual(receipt.runtime);
  expect(capsule.files['prov.jsonld']).toContain(receipt.runtime.source_revision);
  expect(capsule.files['ro-crate-metadata.json']).toContain(receipt.runtime.source_revision);
});
