import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCaseWorkbench } from '../../app/CaseWorkbenchProvider';
import AnalysisLab from './AnalysisLab';
import FieldUseSurface from './FieldUseSurface';
import InvestigationSurface from './InvestigationSurface';
import ProgrammeSurface from './ProgrammeSurface';
import ResearchSurface from './ResearchSurface';
import VerificationHub from './VerificationHub';

vi.mock('../../app/CaseWorkbenchProvider', () => ({
  useCaseWorkbench: vi.fn(),
}));

vi.mock('../../cases/CaseExplorer', () => ({
  default: () => <div>Case explorer mock</div>,
}));

vi.mock('../../compare/CompareWorkspace', () => ({
  default: () => <div>Compare workspace mock</div>,
}));

vi.mock('../ResearchPanel', () => ({
  default: () => <div>Research reference mock</div>,
}));

vi.mock('../../receipts/ReceiptsWorkspace', () => ({
  default: () => <div>Receipts workspace mock</div>,
}));

vi.mock('../../lib/researchCapsule', () => ({
  buildResearchCapsule: vi.fn(async () => ({
    manifest: {
      capsule_id: 'capsule-001',
      files: [{ path: 'decision-result.json', bytes: 128, sha256: 'hash-001' }],
      raw_evidence_included: false,
      decision_id: 'decision-001',
      source_revision: 'test-revision',
    },
    files: {},
  })),
}));

const selectCase = vi.fn();
const selectPolicy = vi.fn();
const selectScenario = vi.fn();
const setSettlementMultiplier = vi.fn();
const compare = vi.fn();

function admittedRun({ caseId = 'TYN-001', maximum = 126 } = {}) {
  return {
    caseManifest: {
      case_id: caseId,
      subject: `${caseId} controlled case`,
      evidence_refs: ['evidence-001'],
    },
    evidence: {
      schema: 'solarpunk.constraint.evidence_envelope.v1',
      evidence_hash: 'evidence-001',
      adapter: { id: 'generic-interval-csv', version: '1.0.0' },
      source: {
        kind: 'generic_interval_csv',
        custody: 'synthetic_public_lab_operator_csv_fixture',
      },
      summary: {
        interval_count: 7,
        total_eligible_surplus_kwh: caseId === 'OPS-001' ? 103.8 : 180,
        warning_count: 1,
        blocker_count: 0,
      },
    },
    contexts: [{
      context_id: 'context-001',
      context_hash: 'context-hash-001',
      label: 'Modeled resource context',
    }],
    provenance: { level: 'L2' },
    policy: {
      id: 'ENERGY-CASE-PILOT-005',
      version: '1.0.0',
      name: 'Pilot policy',
    },
    scenario: {
      scenario_id: 'PROVENANCE-L2-COUNTERFACTUAL',
      name: 'L2 counterfactual',
    },
    decision: {
      decision: 'ADMIT_WITH_LIMIT',
      decision_id: 'decision-001',
      policy_manifest_hash: 'policy-hash-001',
      boundary: 'Controlled research mechanics only.',
      admission: {
        blocking_rules: [],
        evaluations: [],
      },
      capacity: {
        admitted_maximum: maximum,
        binding_constraints: ['PROVENANCE_POLICY_CAPACITY'],
        evaluations: [],
      },
    },
  };
}

function blockedRun({ caseId = 'OPS-001' } = {}) {
  const run = admittedRun({ caseId, maximum: null });
  return {
    ...run,
    provenance: { level: 'L0' },
    scenario: {
      scenario_id: 'PROVENANCE-L0-BASE',
      name: 'L0 baseline',
    },
    decision: {
      ...run.decision,
      decision: 'BLOCKED',
      decision_id: 'decision-blocked-001',
      admission: {
        blocking_rules: ['MIN_PROVENANCE'],
        evaluations: [],
      },
      capacity: {
        admitted_maximum: null,
        binding_constraints: [],
        evaluations: [],
      },
    },
  };
}

function packFixture() {
  const opsEvidence = admittedRun({ caseId: 'OPS-001', maximum: 103.8 }).evidence;
  return {
    cases: [
      { case_id: 'TYN-001', subject: 'Taoyuan controlled case' },
      { case_id: 'OPS-001', subject: 'Operator-format sample', evidence_refs: ['evidence-001'] },
    ],
    policies: [
      { id: 'LAB-CASE-OPEN-004', name: 'Open policy' },
      { id: 'ENERGY-CASE-PILOT-005', name: 'Pilot policy' },
    ],
    scenarios: [
      { scenario_id: 'PROVENANCE-L0-BASE', name: 'L0 baseline' },
      { scenario_id: 'PROVENANCE-L2-COUNTERFACTUAL', name: 'L2 counterfactual' },
      { scenario_id: 'PROVENANCE-L4-COUNTERFACTUAL', name: 'L4 counterfactual' },
    ],
    casesById: {
      'OPS-001': {
        case_id: 'OPS-001',
        subject: 'Operator-format sample',
        evidence_refs: ['evidence-001'],
      },
    },
    evidenceByHash: {
      'evidence-001': opsEvidence,
    },
  };
}

function providerValue(overrides = {}) {
  const run = admittedRun();
  return {
    pack: packFixture(),
    activeCaseId: 'TYN-001',
    activePolicyId: 'ENERGY-CASE-PILOT-005',
    activeScenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    activeRun: run,
    activeReceipt: {
      schema: 'solarpunk.constraint.decision_receipt.v1',
      evaluated_at: '2026-08-05T00:00:00Z',
      decision_id: run.decision.decision_id,
    },
    activeStress: {
      available: true,
      settlement: {
        result: 'PARTIAL',
        outstanding_claim_quantity: 126,
        settlement_capacity: 50.4,
        covered_quantity: 50.4,
        shortfall_quantity: 75.6,
      },
    },
    settlementMultiplier: 0.4,
    receiptsById: {},
    selectCase,
    selectPolicy,
    selectScenario,
    setSettlementMultiplier,
    compare,
    loading: false,
    error: null,
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('paired platform surfaces', () => {
  it('teaches a guided investigation and applies a saved research mission', () => {
    useCaseWorkbench.mockReturnValue(providerValue());
    render(<InvestigationSurface onNavigate={vi.fn()} onOpenFullAnalysis={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /find what blocks the claim/i })).toBeInTheDocument();
    expect(screen.getByText('126')).toBeInTheDocument();
    expect(screen.getByText('50.4')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /find a blocked result/i }));
    expect(selectCase).toHaveBeenCalledWith('TYN-001');
    expect(selectPolicy).toHaveBeenCalledWith('ENERGY-CASE-PILOT-005');
    expect(selectScenario).toHaveBeenCalledWith('PROVENANCE-L0-BASE');
    expect(setSettlementMultiplier).toHaveBeenCalledWith(1);
  });

  it('turns the research doctrine into selectable explanations', () => {
    const onNavigate = vi.fn();
    render(<ResearchSurface viewMode="overview" onNavigate={onNavigate} onOpenFullAnalysis={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Evidence ≠ authority' }));
    expect(screen.getByText(/valid evidence object can exist/i)).toBeInTheDocument();
    expect(screen.getByText(/existence of data is mistaken for permission/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /run the associated case/i }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({
      section: 'case',
      id: 'TYN-001',
      lens: 'constraints',
    }));
  });

  it('keeps source L0 separate from declared field counterfactuals', async () => {
    compare.mockResolvedValue([{
      case_id: 'OPS-001',
      runs: [
        blockedRun({ caseId: 'OPS-001' }),
        {
          ...admittedRun({ caseId: 'OPS-001', maximum: 103.8 }),
          policy: { id: 'LAB-CASE-OPEN-004', version: '1.0.0', name: 'Open policy' },
        },
      ],
    }]);
    useCaseWorkbench.mockReturnValue(providerValue());

    render(<FieldUseSurface viewMode="overview" onNavigate={vi.fn()} onOpenFullAnalysis={vi.fn()} />);

    expect(screen.getByText(/source evidence: l0/i)).toBeInTheDocument();
    expect(screen.getByText(/source remains l0 in every option/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('103.8 admitted')).toBeInTheDocument());
  });

  it('lets users challenge programme claims instead of reading a static progress page', () => {
    useCaseWorkbench.mockReturnValue(providerValue());
    render(<ProgrammeSurface viewMode="overview" onNavigate={vi.fn()} onOpenFullAnalysis={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Field-ready alpha' }));
    expect(screen.getByText(/first owner-supplied source/i)).toBeInTheDocument();
    expect(screen.getByText(/OPS-001 Gate 1A/i)).toBeInTheDocument();
  });

  it('replays settlement stress in the consolidated Analysis Lab', () => {
    useCaseWorkbench.mockReturnValue(providerValue());
    render(<AnalysisLab initialTool="stress" onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Settlement capacity' })).toBeInTheDocument();
    expect(screen.getByText('75.6')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.7' } });
    expect(setSettlementMultiplier).toHaveBeenCalledWith('0.7');
  });

  it('exposes actual runtime objects in the consolidated Verification Hub', () => {
    useCaseWorkbench.mockReturnValue(providerValue());
    render(<VerificationHub initialTool="objects" onNavigate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'DecisionResult' })).toBeInTheDocument();
    expect(screen.getByText(/decision-001/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'EvidenceEnvelope' }));
    expect(screen.getByText(/evidence-001/i)).toBeInTheDocument();
  });

  it('keeps Analysis Lab and Verification Hub to a single main landmark', () => {
    useCaseWorkbench.mockReturnValue(providerValue());

    const { unmount: unmountAnalysis } = render(
      <AnalysisLab initialTool="stress" onNavigate={vi.fn()} />,
    );
    expect(document.querySelector('.analysis-lab-intro')?.tagName).toBe('SECTION');
    expect(document.querySelectorAll('main')).toHaveLength(1);
    unmountAnalysis();

    const { unmount: unmountVerify } = render(
      <VerificationHub initialTool="lineage" onNavigate={vi.fn()} />,
    );
    expect(document.querySelector('.verification-hub-intro')?.tagName).toBe('SECTION');
    expect(document.querySelectorAll('main')).toHaveLength(1);
    unmountVerify();

    render(<VerificationHub initialTool="objects" onNavigate={vi.fn()} />);
    expect(document.querySelectorAll('main')).toHaveLength(1);
  });
});
