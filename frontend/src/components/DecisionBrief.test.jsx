import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DecisionBrief from './DecisionBrief';

const summary = {
  study_id: 'constraint-market-capacity-v1-public-aggregate',
  study_name: 'Market Collateral Capacity — historical policy evaluation',
  source_dataset_id: 'constraint_market_capacity_v1',
  source_dataset_sha256: '792c3ad99311cff2b18e9dcdb58fbfedcf74a1bf95c1a0691673d06492b5e0e5',
  public_data_boundary: 'Aggregated, normalized research outputs only.',
  interpretation_boundary: 'Historical coverage is an empirical diagnostic, not proof of future adequacy.',
  peak_stress_run_id: 'CP-MKT-STRESS-0002',
  period: { start: '2018-01-02', end: '2024-12-31' },
  conservative_evaluation_view: { ambiguous_rics_excluded_count: 7 },
  binding_constraint_attribution: {
    volatility_capacity_binding_rate: 0.652377,
    liquidity_capacity_binding_rate: 0.347623,
  },
  policy_metrics: [
    {
      policy_id: 'COLLATERAL-FIXED-20',
      horizon_sessions: 20,
      observation_count: 734379,
      coverage_rate: 0.972518,
      shortfall_event_rate: 0.027487,
      mean_permitted_capacity_ratio: 0.8,
    },
    {
      policy_id: 'COLLATERAL-VOL-LIQ-003',
      horizon_sessions: 20,
      observation_count: 734379,
      coverage_rate: 0.988626,
      shortfall_event_rate: 0.011374,
      mean_permitted_capacity_ratio: 0.716849,
    },
    {
      policy_id: 'COLLATERAL-FIXED-20',
      horizon_sessions: 60,
      observation_count: 716659,
      coverage_rate: 0.89399,
      shortfall_event_rate: 0.106027,
      mean_permitted_capacity_ratio: 0.8,
    },
    {
      policy_id: 'COLLATERAL-VOL-LIQ-003',
      horizon_sessions: 60,
      observation_count: 716659,
      coverage_rate: 0.949118,
      shortfall_event_rate: 0.050882,
      mean_permitted_capacity_ratio: 0.716617,
    },
  ],
};

const stressRuns = {
  runs: [
    {
      run_id: 'CP-MKT-STRESS-0002',
      date: '2020-02-21',
      horizon_sessions: 20,
      policy_results: [
        {
          policy_id: 'COLLATERAL-FIXED-20',
          coverage_rate: 0.086854,
          shortfall_event_rate: 0.913146,
        },
        {
          policy_id: 'COLLATERAL-VOL-LIQ-003',
          coverage_rate: 0.194836,
          shortfall_event_rate: 0.805164,
        },
      ],
    },
  ],
};

function response(value) {
  return { ok: true, json: async () => value };
}

describe('DecisionBrief', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url) => Promise.resolve(
      String(url).includes('stress-reference-runs') ? response(stressRuns) : response(summary),
    )));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the answer-first 20-session decision from the committed bundle', async () => {
    render(<DecisionBrief onOpenStudy={() => {}} onOpenReproduce={() => {}} onOpenProtocol={() => {}} />);

    await screen.findByRole('heading', { name: /what did the stricter rule buy/i });

    expect(screen.getAllByText('+1.61 pp').length).toBeGreaterThan(0);
    expect(screen.getAllByText('8.32 pp').length).toBeGreaterThan(0);
    expect(screen.getByText('734,379 observations')).toBeInTheDocument();
    expect(screen.getAllByText('80.52%').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /download decision memo/i })).toBeInTheDocument();
  });

  it('switches to the 60-session decision view without refetching the bundle', async () => {
    render(<DecisionBrief onOpenStudy={() => {}} onOpenReproduce={() => {}} onOpenProtocol={() => {}} />);
    await screen.findByRole('heading', { name: /what did the stricter rule buy/i });

    fireEvent.click(screen.getByRole('button', { name: /use 60-session horizon/i }));

    expect(screen.getAllByText('+5.51 pp').length).toBeGreaterThan(0);
    expect(screen.getAllByText('8.34 pp').length).toBeGreaterThan(0);
    expect(screen.getAllByText('5.09%').length).toBeGreaterThan(0);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('routes reviewers into the deeper inspection surfaces', async () => {
    const openStudy = vi.fn();
    const openReproduce = vi.fn();
    const openProtocol = vi.fn();
    render(
      <DecisionBrief
        onOpenStudy={openStudy}
        onOpenReproduce={openReproduce}
        onOpenProtocol={openProtocol}
      />,
    );
    await screen.findByRole('heading', { name: /what did the stricter rule buy/i });

    fireEvent.click(screen.getByRole('button', { name: /open full study/i }));
    fireEvent.click(screen.getByRole('button', { name: /verify published bytes/i }));
    fireEvent.click(screen.getByRole('button', { name: /inspect claim flow/i }));

    expect(openStudy).toHaveBeenCalledOnce();
    expect(openReproduce).toHaveBeenCalledOnce();
    expect(openProtocol).toHaveBeenCalledOnce();
  });

  it('offers a retry when the published bundle is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    render(<DecisionBrief onOpenStudy={() => {}} onOpenReproduce={() => {}} onOpenProtocol={() => {}} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to load/i);
    });
    expect(screen.getByRole('button', { name: /retry published bundle/i })).toBeInTheDocument();
  });
});
