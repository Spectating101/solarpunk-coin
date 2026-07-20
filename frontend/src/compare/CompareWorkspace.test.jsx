import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CaseWorkbenchProvider } from '../app/CaseWorkbenchProvider';
import CompareWorkspace from './CompareWorkspace';

function renderCompare(openDecision = vi.fn()) {
  return render(
    <CaseWorkbenchProvider>
      <CompareWorkspace onOpenDecision={openDecision} />
    </CaseWorkbenchProvider>,
  );
}

describe('CompareWorkspace', () => {
  it('renders a policy manifest diff and 4 × 3 decision matrix under one assurance scenario', async () => {
    renderCompare();

    expect(screen.getByRole('heading', { name: /where do policies disagree/i })).toBeInTheDocument();
    expect(screen.getByText(/12 deterministic decisions are evaluated from 4 committed cases and 3 V2 policies/i)).toBeInTheDocument();
    expect(screen.getByText('4 cases × 3 policies')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what changed in the policy before the outcomes changed/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/baseline policy/i)).toHaveValue('LAB-CASE-OPEN-004');
    expect(screen.getByLabelText(/comparison policy/i)).toHaveValue('ENERGY-CASE-PILOT-005');
    expect(screen.getAllByText('SIGNED_EVIDENCE').length).toBeGreaterThan(0);

    const table = await screen.findByRole('table', { name: /case policy decision matrix/i });
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(4);
    expect(within(table).getByText('TYN-001')).toBeInTheDocument();
    expect(within(table).getByText('AUS-001')).toBeInTheDocument();
    expect(within(table).getByText('PHX-001')).toBeInTheDocument();
    expect(within(table).getByText('OPS-001')).toBeInTheDocument();
    expect(within(table).getAllByRole('button')).toHaveLength(12);
  });

  it('reports blocking rules separately from admitted binding ceilings', async () => {
    renderCompare();
    const table = await screen.findByRole('table', { name: /case policy decision matrix/i });

    expect(within(table).getAllByText(/minimum provenance/i).length).toBeGreaterThan(0);
    expect(within(table).getAllByText(/quantity not evaluated/i).length).toBeGreaterThan(0);
    expect(within(table).getAllByText(/evidence backed capacity/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/admission state is not called coverage/i)).toBeInTheDocument();
  });

  it('opens the selected case decision from a matrix cell', async () => {
    const openDecision = vi.fn();
    renderCompare(openDecision);
    const table = await screen.findByRole('table', { name: /case policy decision matrix/i });
    const cells = within(table).getAllByRole('button');

    fireEvent.click(cells[0]);
    expect(openDecision).toHaveBeenCalledWith('TYN-001');
  });
});
