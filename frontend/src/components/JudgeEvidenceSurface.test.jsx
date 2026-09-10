import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import JudgeEvidenceSurface from './JudgeEvidenceSurface';

describe('JudgeEvidenceSurface', () => {
  it('derives the controlled comparison from the real runtime without promoting evidence', async () => {
    render(<JudgeEvidenceSurface onNavigate={vi.fn()} />);

    expect(await screen.findByText('UNCHANGED')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PUB-AUSGRID-001P' })).toBeInTheDocument();
    expect(screen.getByText(/public-data operability and deterministic reproduction only/i)).toBeInTheDocument();

    const table = screen.getByRole('table', { name: /same evidence policy and assurance comparison/i });
    expect(within(table).getAllByText('180')).toHaveLength(2);
    expect(within(table).getByText('126')).toBeInTheDocument();
    expect(within(table).getByText('BLOCKED')).toBeInTheDocument();
    expect(within(table).getByText(/min provenance/i)).toBeInTheDocument();
    expect(within(table).getByText(/provenance policy capacity/i)).toBeInTheDocument();

    expect(screen.getByText('0.5×')).toBeInTheDocument();
    expect(screen.getByText(/0.7× \(current\)/)).toBeInTheDocument();
    expect(screen.getByText('0.9×')).toBeInTheDocument();
    expect(screen.getByText(/NOT_ASSESSED \/ PARTIAL \/ PARTIAL \/ UNTESTED/)).toBeInTheDocument();
  });

  it('routes into the full controlled policy comparison', async () => {
    const onNavigate = vi.fn();
    render(<JudgeEvidenceSurface onNavigate={onNavigate} />);
    await screen.findByText('UNCHANGED');

    fireEvent.click(screen.getByRole('button', { name: /open full policy comparison/i }));
    expect(onNavigate).toHaveBeenCalledWith({
      section: 'compare',
      scenarioId: 'PROVENANCE-L0-BASE',
      baselinePolicyId: 'LAB-CASE-OPEN-004',
      comparisonPolicyId: 'ENERGY-CASE-PILOT-005',
    });
  });
});
