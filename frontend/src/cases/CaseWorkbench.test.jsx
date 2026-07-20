import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CaseWorkbenchProvider } from '../app/CaseWorkbenchProvider';
import CaseExplorer from './CaseExplorer';
import CaseWorkspace from './CaseWorkspace';

function renderWithWorkbench(node) {
  return render(<CaseWorkbenchProvider>{node}</CaseWorkbenchProvider>);
}

describe('case workbench investigation flow', () => {
  it('opens on the four-case research surface with Taoyuan blocked under the default pilot/L0 run', async () => {
    const openCase = vi.fn();
    renderWithWorkbench(<CaseExplorer onOpenCase={openCase} />);

    expect(screen.getByRole('heading', { name: /investigate the rule that blocks or bounds the case/i })).toBeInTheDocument();
    expect(screen.getAllByText('TYN-001').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AUS-001').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PHX-001').length).toBeGreaterThan(0);
    expect(screen.getAllByText('OPS-001').length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('BLOCKED')).toBeInTheDocument();
    });
    expect(screen.getAllByText(/minimum provenance/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/empirical claim: no/i)).toBeInTheDocument();

    const mapToggle = screen.getByRole('button', { name: /show 3 mapped cases/i });
    expect(mapToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(mapToggle);
    expect(mapToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /hide map/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /open case/i }));
    expect(openCase).toHaveBeenCalledWith('TYN-001');
  });

  it('shows quantity evaluation as not executed until the L2 assurance counterfactual is explicitly selected', async () => {
    renderWithWorkbench(<CaseWorkspace caseId="TYN-001" onNavigate={vi.fn()} />);

    await screen.findByText('NOT EXECUTED');
    expect(screen.getByRole('heading', { name: /why is this case blocked/i })).toBeInTheDocument();
    expect(screen.getAllByText(/MIN_PROVENANCE/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /preview l2 without changing the evidence hash/i }));

    await screen.findByRole('heading', { name: /why is this case limited to 126/i });
    await waitFor(() => {
      expect(screen.getAllByText(/provenance policy capacity/i).length).toBeGreaterThan(0);
    });
    expect(screen.queryByText('NOT EXECUTED')).not.toBeInTheDocument();
    expect(screen.getByText(/126 ENERGY_CLAIM_UNIT/i)).toBeInTheDocument();
  });

  it('keeps controlled evidence and modeled context visibly distinct', async () => {
    renderWithWorkbench(<CaseWorkspace caseId="TYN-001" onNavigate={vi.fn()} />);
    await screen.findByText('NOT EXECUTED');

    fireEvent.click(screen.getByRole('button', { name: /^Evidence$/i }));

    expect(await screen.findByText('CONTROLLED EVIDENCE FIXTURE')).toBeInTheDocument();
    expect(screen.getByText('MODELED CONTEXT')).toBeInTheDocument();
    expect(screen.getAllByText(/TMY/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/not observed meter evidence/i)).toBeInTheDocument();
  });

  it('does not fabricate settlement stress for a blocked decision and exposes partial shortfall after admission', async () => {
    renderWithWorkbench(<CaseWorkspace caseId="TYN-001" onNavigate={vi.fn()} />);
    await screen.findByText('NOT EXECUTED');

    fireEvent.click(screen.getByRole('button', { name: /^Stress$/i }));
    expect(await screen.findByRole('heading', { name: /settlement stress is downstream of admission/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/assurance context/i), {
      target: { value: 'PROVENANCE-L2-COUNTERFACTUAL' },
    });
    await screen.findByText(/what happens when declared settlement capacity falls/i);
    fireEvent.click(screen.getByRole('button', { name: /40% capacity/i }));

    await screen.findByText('PARTIAL');
    expect(screen.getAllByText('50.4').length).toBeGreaterThan(0);
    expect(screen.getAllByText('75.6').length).toBeGreaterThan(0);
  });
});
