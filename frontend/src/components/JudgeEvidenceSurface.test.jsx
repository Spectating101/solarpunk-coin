import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import JudgeEvidenceSurface from './JudgeEvidenceSurface';

describe('JudgeEvidenceSurface', () => {
  it('derives the visual causal comparison from the real runtime without promoting evidence', async () => {
    render(<JudgeEvidenceSurface onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'PUB-AUSGRID-001P' })).toBeInTheDocument();
    expect(screen.getByLabelText(/settlement coverage and shortfall/i)).toBeInTheDocument();

    const matrix = screen.getByRole('table', { name: /same evidence policy and assurance comparison/i });
    expect(await within(matrix).findByText('126')).toBeInTheDocument();
    expect(within(matrix).getAllByText('180')).toHaveLength(2);
    expect(within(matrix).getByText('BLOCKED')).toBeInTheDocument();
    expect(within(matrix).getByText(/min provenance/i)).toBeInTheDocument();
    expect(within(matrix).getByText(/provenance policy capacity/i)).toBeInTheDocument();

    expect(screen.getByText(/same evidence/i)).toBeInTheDocument();
    expect(screen.getByText('0.5×')).toBeInTheDocument();
    expect(screen.getByText(/0.7× · current/)).toBeInTheDocument();
    expect(screen.getByText('0.9×')).toBeInTheDocument();
    expect(screen.getByText(/NOT_ASSESSED · PARTIAL · PARTIAL · UNTESTED/)).toBeInTheDocument();
    expect(screen.getByText(/public-data operability only/i)).toBeInTheDocument();
  });

  it('routes into the full controlled policy comparison', async () => {
    const onNavigate = vi.fn();
    render(<JudgeEvidenceSurface onNavigate={onNavigate} />);
    const matrix = screen.getByRole('table', { name: /same evidence policy and assurance comparison/i });
    await within(matrix).findByText('126');

    fireEvent.click(screen.getByRole('button', { name: /compare policies/i }));
    expect(onNavigate).toHaveBeenCalledWith({
      section: 'compare',
      scenarioId: 'PROVENANCE-L0-BASE',
      baselinePolicyId: 'LAB-CASE-OPEN-004',
      comparisonPolicyId: 'ENERGY-CASE-PILOT-005',
    });
  });
});
