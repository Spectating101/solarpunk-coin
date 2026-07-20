import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LabOverview from './LabOverview';
import { evaluateCaseSet } from '../lib/caseWorkbenchRuntime';

vi.mock('../lib/caseWorkbenchRuntime', () => ({
  evaluateCaseSet: vi.fn(({ scenarioId }) => Promise.resolve([{
    key: `TYN-001::ENERGY-CASE-PILOT-005::${scenarioId}`,
    decision: scenarioId === 'PROVENANCE-L0-BASE'
      ? {
        decision: 'BLOCKED',
        decision_id: 'decision-l0-0123456789abcdef',
        admission: {
          blocking_rules: ['MIN_PROVENANCE'],
          evaluations: [
            { evaluation_id: 'positive', calculator_id: 'POSITIVE_SURPLUS', status: 'PASS' },
            { evaluation_id: 'diagnostics', calculator_id: 'ZERO_BLOCKING_DIAGNOSTICS', status: 'PASS' },
            { evaluation_id: 'provenance', calculator_id: 'MIN_PROVENANCE', status: 'BLOCK' },
          ],
        },
        capacity: { binding_constraints: [], admitted_maximum: null, unit: 'ENERGY_CLAIM_UNIT' },
      }
      : {
        decision: 'ADMIT_WITH_LIMIT',
        decision_id: 'decision-l2-fedcba9876543210',
        admission: {
          blocking_rules: [],
          evaluations: [
            { evaluation_id: 'positive', calculator_id: 'POSITIVE_SURPLUS', status: 'PASS' },
            { evaluation_id: 'diagnostics', calculator_id: 'ZERO_BLOCKING_DIAGNOSTICS', status: 'PASS' },
            { evaluation_id: 'provenance', calculator_id: 'MIN_PROVENANCE', status: 'PASS' },
          ],
        },
        capacity: {
          binding_constraints: ['PROVENANCE_POLICY_CAPACITY'],
          admitted_maximum: 126,
          unit: 'ENERGY_CLAIM_UNIT',
        },
      },
  }])),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('LabOverview flagship decision experience', () => {
  it('opens with a consequential blocked decision rather than an architecture summary', async () => {
    render(<LabOverview onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /a solar claim enters/i })).toBeInTheDocument();
    expect(screen.getByText('180 eligible kWh')).toBeInTheDocument();
    expect(await screen.findByText('BLOCKED')).toBeInTheDocument();
    expect(screen.getByText('NOT CALCULATED')).toBeInTheDocument();
    expect(screen.getByText('minimum provenance')).toBeInTheDocument();
    expect(screen.getByText(/evidence remains unchanged/i)).toBeInTheDocument();
  });

  it('shows the L0 to L2 investigation update without changing the evidence claim', async () => {
    render(<LabOverview onNavigate={vi.fn()} />);
    await screen.findByText('BLOCKED');

    fireEvent.click(screen.getByRole('button', { name: /preview l2 assurance/i }));

    expect(await screen.findByText('ADMIT WITH LIMIT')).toBeInTheDocument();
    expect(screen.getByText('126')).toBeInTheDocument();
    expect(screen.getByText('provenance policy capacity')).toBeInTheDocument();
    expect(screen.getByText(/nothing about the solar intervals changes/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(evaluateCaseSet).toHaveBeenLastCalledWith({
        caseIds: ['TYN-001'],
        policyId: 'ENERGY-CASE-PILOT-005',
        scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      });
    });
  });

  it('carries the selected decision state into the full investigation', async () => {
    const onNavigate = vi.fn();
    render(<LabOverview onNavigate={onNavigate} />);
    await screen.findByText('BLOCKED');

    fireEvent.click(screen.getByRole('button', { name: 'L2 counterfactual' }));
    await screen.findByText('ADMIT WITH LIMIT');
    fireEvent.click(screen.getByRole('button', { name: /open full investigation/i }));

    expect(onNavigate).toHaveBeenCalledWith({
      section: 'case',
      id: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      lens: 'constraints',
    });
  });

  it('seeds policy comparison from the controlled L2 state', async () => {
    const onNavigate = vi.fn();
    render(<LabOverview onNavigate={onNavigate} />);
    await screen.findByText('BLOCKED');

    fireEvent.click(screen.getByRole('button', { name: /compare policies/i }));

    expect(onNavigate).toHaveBeenCalledWith({
      section: 'compare',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      baselinePolicyId: 'LAB-CASE-OPEN-004',
      comparisonPolicyId: 'ENERGY-CASE-PILOT-005',
    });
  });
});
