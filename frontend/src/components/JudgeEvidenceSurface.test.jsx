import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import JudgeEvidenceSurface from './JudgeEvidenceSurface';

describe('JudgeEvidenceSurface', () => {
  it('derives the causal matrix from the real controlled-case runtime without promoting evidence', async () => {
    render(<JudgeEvidenceSurface onNavigate={vi.fn()} />);

    expect(await screen.findByText(/unchanged across all four decisions/i)).toBeInTheDocument();

    const table = screen.getByRole('table', { name: /same evidence policy and assurance comparison/i });
    expect(within(table).getAllByText('180')).toHaveLength(2);
    expect(within(table).getByText('126')).toBeInTheDocument();
    expect(within(table).getByText('BLOCKED')).toBeInTheDocument();
    expect(within(table).getByText(/minimum provenance/i)).toBeInTheDocument();
    expect(within(table).getByText(/provenance policy capacity/i)).toBeInTheDocument();

    expect(screen.getByText('0.5×')).toBeInTheDocument();
    expect(screen.getByText('0.7×')).toBeInTheDocument();
    expect(screen.getByText('0.9×')).toBeInTheDocument();
    expect(screen.getByText('4 OPEN')).toBeInTheDocument();
    expect(screen.getAllByText('PARTIAL')).toHaveLength(2);
    expect(screen.getByText(/not certified/i)).toBeInTheDocument();
  });

  it('routes into the full controlled policy comparison', async () => {
    const onNavigate = vi.fn();
    render(<JudgeEvidenceSurface onNavigate={onNavigate} />);
    await screen.findByText(/unchanged across all four decisions/i);

    fireEvent.click(screen.getByRole('button', { name: /inspect the full policy comparison/i }));
    expect(onNavigate).toHaveBeenCalledWith({
      section: 'compare',
      scenarioId: 'PROVENANCE-L0-BASE',
      baselinePolicyId: 'LAB-CASE-OPEN-004',
      comparisonPolicyId: 'ENERGY-CASE-PILOT-005',
    });
  });
});
