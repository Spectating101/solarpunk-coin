import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LabOverview from './LabOverview';
import { useCaseWorkbench } from '../app/CaseWorkbenchProvider';

vi.mock('../app/CaseWorkbenchProvider', () => ({
  useCaseWorkbench: vi.fn(),
}));

const selectCase = vi.fn();
const selectPolicy = vi.fn();
const selectScenario = vi.fn();
const setSettlementMultiplier = vi.fn();

function workbenchValue() {
  return {
    pack: {
      cases: [{ case_id: 'TYN-001', subject: 'Taoyuan controlled energy case' }],
      policies: [{ id: 'ENERGY-CASE-PILOT-005', name: 'Pilot policy' }],
      scenarios: [{ scenario_id: 'PROVENANCE-L2-COUNTERFACTUAL', name: 'L2 counterfactual' }],
    },
    activeCaseId: 'TYN-001',
    activePolicyId: 'ENERGY-CASE-PILOT-005',
    activeScenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    settlementMultiplier: 0.4,
    activeRun: {
      caseManifest: { case_id: 'TYN-001' },
      evidence: {
        evidence_hash: 'evidence-0123456789abcdef',
        summary: { total_eligible_surplus_kwh: 180 },
      },
      policy: { id: 'ENERGY-CASE-PILOT-005', version: '1.0.0' },
      scenario: { scenario_id: 'PROVENANCE-L2-COUNTERFACTUAL' },
      provenance: { level: 'L2' },
      decision: {
        decision: 'ADMIT_WITH_LIMIT',
        decision_id: 'decision-l2-fedcba9876543210',
        boundary: 'Controlled research mechanics only.',
        admission: { blocking_rules: [] },
        capacity: {
          admitted_maximum: 126,
          binding_constraints: ['PROVENANCE_POLICY_CAPACITY'],
        },
      },
    },
    activeStress: {
      available: true,
      settlement: {
        result: 'PARTIAL',
        covered_quantity: 50.4,
        shortfall_quantity: 75.6,
      },
    },
    selectCase,
    selectPolicy,
    selectScenario,
    setSettlementMultiplier,
    loading: false,
    error: null,
  };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('LabOverview paired platform surface', () => {
  it('renders a complete interpreted overview from shared workbench state', () => {
    useCaseWorkbench.mockReturnValue(workbenchValue());
    render(<LabOverview viewMode="overview" onViewModeChange={vi.fn()} onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /can real-world evidence justify a financial claim/i })).toBeInTheDocument();
    expect(screen.getByText('180')).toBeInTheDocument();
    expect(screen.getByText('126')).toBeInTheDocument();
    expect(screen.getByText('50.4')).toBeInTheDocument();
    expect(screen.getByText(/provenance policy capacity/i)).toBeInTheDocument();
  });

  it('switches into Full Analysis through the global view callback', () => {
    useCaseWorkbench.mockReturnValue(workbenchValue());
    const onViewModeChange = vi.fn();
    render(<LabOverview viewMode="overview" onViewModeChange={onViewModeChange} onNavigate={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /open full analysis/i }));
    expect(onViewModeChange).toHaveBeenCalledWith('full');
  });

  it('renders the complete architecture while preserving the same active state', () => {
    useCaseWorkbench.mockReturnValue(workbenchValue());
    render(<LabOverview viewMode="full" onViewModeChange={vi.fn()} onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /see the whole programme behind the active decision/i })).toBeInTheDocument();
    expect(screen.getByText('CaseManifest')).toBeInTheDocument();
    expect(screen.getByText('DecisionReceipt')).toBeInTheDocument();
    expect(screen.getByText(/TYN-001 · PROVENANCE-L2-COUNTERFACTUAL · ENERGY-CASE-PILOT-005/i)).toBeInTheDocument();
    expect(screen.getByText(/one attributable owner\/operator evidence source/i)).toBeInTheDocument();
  });

  it('opens the complete investigation with the active shared state', () => {
    useCaseWorkbench.mockReturnValue(workbenchValue());
    const onNavigate = vi.fn();
    render(<LabOverview viewMode="full" onViewModeChange={vi.fn()} onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole('button', { name: /open complete investigation/i }));
    expect(onNavigate).toHaveBeenCalledWith({
      section: 'case',
      id: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      lens: 'constraints',
    });
  });
});
