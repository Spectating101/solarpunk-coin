import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = '../../../frontend/public/empirical/market-capacity-v1/';
const readJson = async (name) => JSON.parse(await readFile(new URL(`${root}${name}`, import.meta.url), 'utf8'));
const study = {
  summary: await readJson('market-capacity-summary.json'),
  frontier: await readJson('policy-frontier.json'),
  yearly: await readJson('yearly-policy-results.json'),
  stress_runs: await readJson('stress-reference-runs.json'),
  methods: await readJson('methods-manifest.json'),
};

const metric = (policyId, horizon) => study.summary.policy_metrics.find(
  (row) => row.policy_id === policyId && row.horizon_sessions === horizon,
);

test('market-capacity empirical bundle stays aggregate-only and license bounded', () => {
  assert.equal(study.summary.source_license, 'internal_yzu_licensed_no_redistribution');
  assert.match(study.summary.public_data_boundary, /No licensed CRSP\/Refinitiv row-level observations/i);

  const serialized = JSON.stringify(study).toLowerCase();
  for (const prohibited of ['"permno"', '"ric"', '"security_id"', '"close_price"', '"company_name"']) {
    assert.equal(serialized.includes(prohibited), false, `public bundle leaked row-level field ${prohibited}`);
  }
});

test('empirical policy comparison uses a common sample by horizon', () => {
  for (const horizon of [20, 60]) {
    const rows = study.summary.policy_metrics.filter((row) => row.horizon_sessions === horizon);
    assert.equal(rows.length, 3);
    assert.equal(new Set(rows.map((row) => row.observation_count)).size, 1);
    assert.ok(rows[0].observation_count > 700_000);
  }
});

test('guarded reference policy exposes the capacity-versus-coverage tradeoff', () => {
  for (const horizon of [20, 60]) {
    const fixed = metric('COLLATERAL-FIXED-20', horizon);
    const guarded = metric('COLLATERAL-VOL-LIQ-003', horizon);
    assert.ok(guarded.coverage_rate > fixed.coverage_rate);
    assert.ok(guarded.mean_permitted_capacity_ratio < fixed.mean_permitted_capacity_ratio);
  }

  const attribution = study.summary.binding_constraint_attribution;
  assert.ok(attribution.volatility_capacity_binding_rate > 0);
  assert.ok(attribution.liquidity_capacity_binding_rate > 0);
  assert.ok(Math.abs(
    attribution.volatility_capacity_binding_rate + attribution.liquidity_capacity_binding_rate - 1,
  ) < 1e-9);
});

test('published stress runs remain cross-sectional aggregates', () => {
  assert.ok(study.stress_runs.runs.length >= 3);
  for (const run of study.stress_runs.runs) {
    assert.equal(run.study_type, 'cross_sectional_stress_replay');
    assert.equal(run.horizon_sessions, 20);
    assert.equal(run.policy_results.length, 3);
    for (const result of run.policy_results) {
      assert.ok(result.observation_count >= 300);
      assert.ok(result.coverage_rate >= 0 && result.coverage_rate <= 1);
      assert.ok(result.shortfall_event_rate >= 0 && result.shortfall_event_rate <= 1);
    }
  }
});
