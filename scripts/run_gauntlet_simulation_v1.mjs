#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((item) => item.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function clamp(value, min = 0, max = 10) {
  return Math.max(min, Math.min(max, value));
}

function round(value, digits = 4) {
  return Number(Number(value).toFixed(digits));
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random) {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function weightSum(weights, dimensions) {
  return dimensions.reduce((total, dimension) => total + Number(weights?.[dimension] || 0), 0);
}

function validateManifest(manifest) {
  if (manifest.schema !== 'solarpunk.gauntlet_simulation_manifest.v1') {
    throw new Error('unexpected gauntlet manifest schema');
  }
  if (!Array.isArray(manifest.dimensions) || manifest.dimensions.length < 2) {
    throw new Error('manifest.dimensions must contain at least two dimensions');
  }
  for (const [profileId, profile] of Object.entries(manifest.judge_profiles || {})) {
    const sum = weightSum(profile.weights, manifest.dimensions);
    if (Math.abs(sum - 1) > 1e-9) {
      throw new Error(`judge profile ${profileId} weights sum to ${sum}, expected 1`);
    }
  }
  const archetypeWeight = Object.values(manifest.competitor_archetypes || {})
    .reduce((total, archetype) => total + Number(archetype.weight || 0), 0);
  if (Math.abs(archetypeWeight - 1) > 1e-9) {
    throw new Error(`competitor archetype weights sum to ${archetypeWeight}, expected 1`);
  }
}

function validateOpportunityModels(models, manifest) {
  if (models.schema !== 'solarpunk.gauntlet_opportunity_models.v1') {
    throw new Error('unexpected opportunity-model schema');
  }
  for (const [populationId, population] of Object.entries(models.populations || {})) {
    const entries = Object.entries(population.archetype_weights || {});
    const sum = entries.reduce((total, [, weight]) => total + Number(weight || 0), 0);
    if (Math.abs(sum - 1) > 1e-9) {
      throw new Error(`population ${populationId} archetype weights sum to ${sum}, expected 1`);
    }
    for (const [archetypeId] of entries) {
      if (!manifest.competitor_archetypes[archetypeId]) {
        throw new Error(`population ${populationId} references unknown archetype ${archetypeId}`);
      }
    }
  }
  for (const [opportunityId, opportunity] of Object.entries(models.opportunities || {})) {
    if (!models.populations[opportunity.population]) {
      throw new Error(`opportunity ${opportunityId} references unknown population ${opportunity.population}`);
    }
    const modeled = weightSum(opportunity.simulator_weights, manifest.dimensions);
    const declaredCoverage = Number(opportunity.rubric_coverage ?? modeled);
    if (modeled <= 0 || modeled > 1 + 1e-9) {
      throw new Error(`opportunity ${opportunityId} simulator weight sum ${modeled} must be in (0, 1]`);
    }
    if (Math.abs(modeled - declaredCoverage) > 1e-9) {
      throw new Error(`opportunity ${opportunityId} rubric_coverage ${declaredCoverage} does not match modeled weight sum ${modeled}`);
    }
  }
}

function samplePolicyLab(random, manifest, scenario = {}) {
  const scores = {};
  for (const dimension of manifest.dimensions) {
    const spec = manifest.policy_lab.scores[dimension];
    const sampled = Number(spec.mean) + normal(random) * Number(spec.sd || 0);
    const uplift = Number(scenario[dimension] || 0);
    scores[dimension] = clamp(sampled + uplift, Number(spec.min ?? 0), Number(spec.max ?? 10));
  }
  return scores;
}

function chooseWeighted(random, entries) {
  const roll = random();
  let cursor = 0;
  for (const entry of entries) {
    cursor += Number(entry[1] || 0);
    if (roll <= cursor) return entry;
  }
  return entries[entries.length - 1];
}

function sampleGenericCompetitor(random, manifest, archetypes) {
  const [id, archetype] = chooseWeighted(random, archetypes.map(([key, value]) => [key, value.weight, value]));
  const source = archetypes.find(([key]) => key === id)?.[1];
  const scores = {};
  for (const dimension of manifest.dimensions) {
    const center = Number(source.scores[dimension]);
    scores[dimension] = clamp(center + normal(random) * Number(source.sd || 0));
  }
  return { id, scores };
}

function populationEntries(manifest, population) {
  return Object.entries(population.archetype_weights).map(([id, weight]) => [id, Number(weight), manifest.competitor_archetypes[id]]);
}

function samplePopulationCompetitor(random, manifest, population, entries) {
  const [id, , archetype] = chooseWeighted(random, entries);
  const scores = {};
  for (const dimension of manifest.dimensions) {
    const center = Number(archetype.scores[dimension]) + Number(population.score_shift?.[dimension] || 0);
    const sd = Number(archetype.sd || 0) * Number(population.sd_scale ?? 1);
    scores[dimension] = clamp(center + normal(random) * sd);
  }
  return { id, scores };
}

function weightedScore(scores, weights, dimensions) {
  const denominator = weightSum(weights, dimensions);
  if (denominator <= 0) throw new Error('score weights must sum above zero');
  return dimensions.reduce((total, dimension) => total + Number(scores[dimension]) * Number(weights[dimension] || 0), 0) / denominator;
}

function percentileFromRank(rank, poolSize) {
  if (poolSize <= 1) return 1;
  return 1 - ((rank - 1) / (poolSize - 1));
}

function topDecileThreshold(poolSize) {
  return Math.max(1, Math.ceil(poolSize * 0.10));
}

function hashStringToUint32(text) {
  const digest = createHash('sha256').update(text).digest();
  return digest.readUInt32LE(0);
}

function seedFor(baseSeed, ...parts) {
  let value = Number(baseSeed) >>> 0;
  for (const part of parts) value ^= hashStringToUint32(String(part));
  return value >>> 0;
}

function simulateRank({ random, candidateScore, poolSize, sampleCompetitor, weights, dimensions, archetypeIds }) {
  let rank = 1;
  let bestCompetitorScore = -Infinity;
  let bestCompetitorType = null;
  const lossWinners = Object.fromEntries(archetypeIds.map((id) => [id, 0]));

  for (let index = 1; index < poolSize; index += 1) {
    const competitor = sampleCompetitor(random);
    const score = weightedScore(competitor.scores, weights, dimensions);
    if (score > candidateScore) rank += 1;
    if (score > bestCompetitorScore) {
      bestCompetitorScore = score;
      bestCompetitorType = competitor.id;
    }
  }
  if (rank > 1 && bestCompetitorType) lossWinners[bestCompetitorType] += 1;
  return { rank, bestCompetitorScore, lossWinners };
}

function collapseLossWinners(accumulator) {
  const total = Object.values(accumulator).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(
    Object.entries(accumulator)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => [id, total ? round(count / total, 4) : 0]),
  );
}

function simulateGeneric({ manifest, profileId, poolSize, trials, scenarioId = 'current', scenario = {} }) {
  const profile = manifest.judge_profiles[profileId];
  const random = mulberry32(seedFor(manifest.seed, 'generic', profileId, poolSize, scenarioId));
  const archetypes = Object.entries(manifest.competitor_archetypes);
  const archetypeIds = archetypes.map(([id]) => id);
  let top1 = 0;
  let top3 = 0;
  let top10pct = 0;
  let scoreSum = 0;
  let winnerMarginSum = 0;
  const percentiles = [];
  const lossWinners = Object.fromEntries(archetypeIds.map((id) => [id, 0]));

  for (let trial = 0; trial < trials; trial += 1) {
    const candidate = samplePolicyLab(random, manifest, scenario);
    const candidateScore = weightedScore(candidate, profile.weights, manifest.dimensions);
    const rankResult = simulateRank({
      random,
      candidateScore,
      poolSize,
      sampleCompetitor: (rng) => sampleGenericCompetitor(rng, manifest, archetypes),
      weights: profile.weights,
      dimensions: manifest.dimensions,
      archetypeIds,
    });
    for (const [id, count] of Object.entries(rankResult.lossWinners)) lossWinners[id] += count;
    if (rankResult.rank === 1) top1 += 1;
    if (rankResult.rank <= Math.min(3, poolSize)) top3 += 1;
    if (rankResult.rank <= topDecileThreshold(poolSize)) top10pct += 1;
    percentiles.push(percentileFromRank(rankResult.rank, poolSize));
    scoreSum += candidateScore;
    winnerMarginSum += candidateScore - rankResult.bestCompetitorScore;
  }

  return {
    judge_profile: profileId,
    judge_label: profile.label,
    scenario: scenarioId,
    pool_size: poolSize,
    trials,
    candidate_score_mean: round(scoreSum / trials),
    top1_rate: round(top1 / trials),
    top3_rate: round(top3 / trials),
    top10pct_rate: round(top10pct / trials),
    mean_percentile: round(mean(percentiles)),
    median_percentile: round(median(percentiles)),
    mean_margin_to_best_competitor: round(winnerMarginSum / trials),
    loss_winner_archetype_share: collapseLossWinners(lossWinners),
  };
}

function opportunityGateStatus(opportunity) {
  if (opportunity.eligibility === 'FAIL' || opportunity.semantic_fit === 'FAIL_CURRENT') return 'NOT_SCORED_CURRENT';
  if (opportunity.eligibility !== 'PASS' || opportunity.semantic_fit !== 'PASS') return 'CONDITIONAL_ON_GATE';
  return 'ACTIVE_SIMULATION';
}

function simulateOpportunity({ manifest, models, opportunityId, poolSize, trials, scenarioId = 'current', scenario = {} }) {
  const opportunity = models.opportunities[opportunityId];
  const population = models.populations[opportunity.population];
  const gateStatus = opportunityGateStatus(opportunity);
  if (gateStatus === 'NOT_SCORED_CURRENT') {
    return {
      opportunity: opportunityId,
      opportunity_label: opportunity.label,
      population: opportunity.population,
      scenario: scenarioId,
      pool_size: poolSize,
      gate_status: gateStatus,
      eligibility: opportunity.eligibility,
      semantic_fit: opportunity.semantic_fit,
      current_fit: opportunity.current_fit,
      rubric_provenance: opportunity.rubric_provenance,
      rubric_coverage: opportunity.rubric_coverage,
      semantic_condition: opportunity.semantic_condition || null,
      result: null,
    };
  }

  const random = mulberry32(seedFor(manifest.seed, 'opportunity', opportunityId, poolSize, scenarioId));
  const entries = populationEntries(manifest, population);
  const archetypeIds = entries.map(([id]) => id);
  let top1 = 0;
  let top3 = 0;
  let top10pct = 0;
  let scoreSum = 0;
  let winnerMarginSum = 0;
  const percentiles = [];
  const lossWinners = Object.fromEntries(archetypeIds.map((id) => [id, 0]));

  for (let trial = 0; trial < trials; trial += 1) {
    const candidate = samplePolicyLab(random, manifest, scenario);
    const candidateScore = weightedScore(candidate, opportunity.simulator_weights, manifest.dimensions);
    const rankResult = simulateRank({
      random,
      candidateScore,
      poolSize,
      sampleCompetitor: (rng) => samplePopulationCompetitor(rng, manifest, population, entries),
      weights: opportunity.simulator_weights,
      dimensions: manifest.dimensions,
      archetypeIds,
    });
    for (const [id, count] of Object.entries(rankResult.lossWinners)) lossWinners[id] += count;
    if (rankResult.rank === 1) top1 += 1;
    if (rankResult.rank <= Math.min(3, poolSize)) top3 += 1;
    if (rankResult.rank <= topDecileThreshold(poolSize)) top10pct += 1;
    percentiles.push(percentileFromRank(rankResult.rank, poolSize));
    scoreSum += candidateScore;
    winnerMarginSum += candidateScore - rankResult.bestCompetitorScore;
  }

  return {
    opportunity: opportunityId,
    opportunity_label: opportunity.label,
    population: opportunity.population,
    population_label: population.label,
    scenario: scenarioId,
    pool_size: poolSize,
    gate_status: gateStatus,
    eligibility: opportunity.eligibility,
    semantic_fit: opportunity.semantic_fit,
    semantic_condition: opportunity.semantic_condition || null,
    eligibility_condition: opportunity.eligibility_condition || null,
    current_fit: opportunity.current_fit,
    rubric_provenance: opportunity.rubric_provenance,
    rubric_coverage: opportunity.rubric_coverage,
    unmodeled_criteria: opportunity.unmodeled_criteria || [],
    maturity_expectation: population.maturity_expectation,
    result: {
      trials,
      candidate_score_mean: round(scoreSum / trials),
      top1_rate: round(top1 / trials),
      top3_rate: round(top3 / trials),
      top10pct_rate: round(top10pct / trials),
      mean_percentile: round(mean(percentiles)),
      median_percentile: round(median(percentiles)),
      mean_margin_to_best_competitor: round(winnerMarginSum / trials),
      loss_winner_archetype_share: collapseLossWinners(lossWinners),
    },
  };
}

function summarizeGeneric(rows, judgeProfiles, poolSizes) {
  return poolSizes.map((poolSize) => {
    const selected = rows.filter((row) => row.scenario === 'current' && row.pool_size === poolSize);
    return {
      pool_size: poolSize,
      mean_top1_rate_across_judges: round(mean(selected.map((row) => row.top1_rate))),
      mean_top3_rate_across_judges: round(mean(selected.map((row) => row.top3_rate))),
      mean_top10pct_rate_across_judges: round(mean(selected.map((row) => row.top10pct_rate))),
      mean_percentile_across_judges: round(mean(selected.map((row) => row.mean_percentile))),
      by_judge: Object.fromEntries(judgeProfiles.map((id) => {
        const row = selected.find((item) => item.judge_profile === id);
        return [id, {
          top1_rate: row.top1_rate,
          top3_rate: row.top3_rate,
          top10pct_rate: row.top10pct_rate,
          mean_percentile: row.mean_percentile,
        }];
      })),
    };
  });
}

function opportunityMatrix(rows, opportunities, poolSize) {
  return opportunities.map((opportunityId) => {
    const row = rows.find((item) => item.opportunity === opportunityId && item.scenario === 'current' && item.pool_size === poolSize);
    const result = row?.result || null;
    const killer = result ? Object.entries(result.loss_winner_archetype_share)[0]?.[0] || null : null;
    return {
      opportunity: opportunityId,
      label: row?.opportunity_label || opportunityId,
      gate_status: row?.gate_status || 'UNKNOWN',
      eligibility: row?.eligibility || null,
      semantic_fit: row?.semantic_fit || null,
      current_fit: row?.current_fit || null,
      rubric_provenance: row?.rubric_provenance || null,
      rubric_coverage: row?.rubric_coverage ?? null,
      mean_percentile: result?.mean_percentile ?? null,
      top1_rate: result?.top1_rate ?? null,
      top3_rate: result?.top3_rate ?? null,
      top10pct_rate: result?.top10pct_rate ?? null,
      dominant_loss_winner: killer,
    };
  });
}

function opportunitySensitivity(rows, opportunities, poolSize, scenarioIds) {
  const output = [];
  for (const opportunityId of opportunities) {
    const current = rows.find((item) => item.opportunity === opportunityId && item.pool_size === poolSize && item.scenario === 'current');
    if (!current?.result) continue;
    for (const scenarioId of scenarioIds) {
      if (scenarioId === 'current') continue;
      const row = rows.find((item) => item.opportunity === opportunityId && item.pool_size === poolSize && item.scenario === scenarioId);
      if (!row?.result) continue;
      output.push({
        opportunity: opportunityId,
        label: current.opportunity_label,
        scenario: scenarioId,
        gate_status: current.gate_status,
        baseline_percentile: current.result.mean_percentile,
        scenario_percentile: row.result.mean_percentile,
        percentile_delta: round(row.result.mean_percentile - current.result.mean_percentile),
        baseline_top3_rate: current.result.top3_rate,
        scenario_top3_rate: row.result.top3_rate,
        top3_delta: round(row.result.top3_rate - current.result.top3_rate),
      });
    }
  }
  return output;
}

function pct(value) {
  return value == null ? '—' : `${(value * 100).toFixed(1)}%`;
}

function percentile(value) {
  return value == null ? '—' : `${(value * 100).toFixed(1)}th`;
}

function markdown(report) {
  const lines = [];
  lines.push('# Gauntlet Simulation v1.1');
  lines.push('');
  lines.push('Venue-aware synthetic stress test only. These are not real-entry scores or award probabilities.');
  lines.push('');
  lines.push(`Core manifest SHA-256: \`${report.manifest_sha256}\``); 
  lines.push(`Opportunity model SHA-256: \`${report.opportunity_models_sha256}\``); 
  lines.push(`Trials per scored cell: **${report.trials_per_cell}**`);
  lines.push('');
  lines.push(`## Opportunity matrix at ${report.sensitivity_pool_size} entries`);
  lines.push('');
  lines.push('| Route | Gate | Current fit | Rubric basis | Coverage | Mean percentile | Top 10% | Dominant loss winner |');
  lines.push('|---|---|---|---|---:|---:|---:|---|');
  for (const item of report.opportunity_matrix) {
    lines.push(`| ${item.label} | ${item.gate_status} | ${item.current_fit} | ${item.rubric_provenance} | ${item.rubric_coverage == null ? '—' : `${(item.rubric_coverage * 100).toFixed(0)}%`} | ${percentile(item.mean_percentile)} | ${pct(item.top10pct_rate)} | ${item.dominant_loss_winner || '—'} |`);
  }
  lines.push('');
  lines.push('Conditional results answer **how Policy Lab ranks if the stated eligibility/semantic gate is satisfied**. `NOT_SCORED_CURRENT` stops before weighted scoring.');
  lines.push('');
  lines.push('## Scaling by opportunity — mean percentile');
  lines.push('');
  lines.push(`| Route | ${report.pool_sizes.map((size) => `${size} entries`).join(' | ')} |`);
  lines.push(`|---|${report.pool_sizes.map(() => '---:').join('|')}|`);
  for (const opportunityId of report.opportunities) {
    const opportunityRows = report.opportunity_rows.filter((row) => row.opportunity === opportunityId && row.scenario === 'current');
    const label = opportunityRows[0]?.opportunity_label || opportunityId;
    const values = report.pool_sizes.map((size) => {
      const row = opportunityRows.find((item) => item.pool_size === size);
      return percentile(row?.result?.mean_percentile ?? null);
    });
    lines.push(`| ${label} | ${values.join(' | ')} |`);
  }
  lines.push('');
  lines.push(`## Sensitivity at ${report.sensitivity_pool_size} entries`);
  lines.push('');
  lines.push('| Route | Scenario | Baseline percentile | Scenario percentile | Δ percentile | Δ top-3 |');
  lines.push('|---|---|---:|---:|---:|---:|');
  for (const item of report.opportunity_sensitivity) {
    lines.push(`| ${item.label} | ${item.scenario} | ${percentile(item.baseline_percentile)} | ${percentile(item.scenario_percentile)} | ${item.percentile_delta >= 0 ? '+' : ''}${(item.percentile_delta * 100).toFixed(1)} pts | ${item.top3_delta >= 0 ? '+' : ''}${(item.top3_delta * 100).toFixed(1)} pts |`);
  }
  lines.push('');
  lines.push('## Generic v1 calibration — retained for comparison');
  lines.push('');
  lines.push('| Pool | Mean top-1 | Mean top-3 | Mean top-10% | Mean percentile |');
  lines.push('|---:|---:|---:|---:|---:|');
  for (const item of report.generic_scale_summary) {
    lines.push(`| ${item.pool_size} | ${pct(item.mean_top1_rate_across_judges)} | ${pct(item.mean_top3_rate_across_judges)} | ${pct(item.mean_top10pct_rate_across_judges)} | ${percentile(item.mean_percentile_across_judges)} |`);
  }
  lines.push('');
  lines.push('## Interpretation boundary');
  lines.push('');
  for (const boundary of report.claim_boundary) lines.push(`- ${boundary}`);
  lines.push('- Official criteria are distinguished from simulator translations. Inferred weights and field distributions are modeling assumptions.');
  lines.push('- A semantic/category failure is not repairable by a high numerical score; the simulator stops before scoring when current fit fails.');
  lines.push('- Unmodeled rubric coverage is surfaced rather than silently imputed.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const manifestPath = path.resolve(arg('manifest', 'benchmark/gauntlet/gauntlet-manifest.v1.json'));
  const opportunityPath = path.resolve(arg('opportunities', 'benchmark/gauntlet/opportunity-models.v1.json'));
  const outDir = path.resolve(arg('out', 'benchmark/gauntlet/reports'));
  const [manifestText, opportunityText] = await Promise.all([
    readFile(manifestPath, 'utf8'),
    readFile(opportunityPath, 'utf8'),
  ]);
  const manifest = JSON.parse(manifestText);
  const models = JSON.parse(opportunityText);
  validateManifest(manifest);
  validateOpportunityModels(models, manifest);

  const trials = Number(arg('trials', manifest.default_trials));
  if (!Number.isInteger(trials) || trials < 100) throw new Error('--trials must be an integer >= 100');

  const judgeProfiles = Object.keys(manifest.judge_profiles);
  const poolSizes = manifest.pool_sizes.map(Number);
  const scenarioIds = Object.keys(manifest.sensitivity_scenarios);
  const sensitivityPoolSize = poolSizes.includes(50) ? 50 : poolSizes[Math.floor(poolSizes.length / 2)];

  const genericRows = [];
  for (const profileId of judgeProfiles) {
    for (const poolSize of poolSizes) {
      genericRows.push(simulateGeneric({ manifest, profileId, poolSize, trials }));
    }
  }

  const opportunities = Object.keys(models.opportunities);
  const opportunityRows = [];
  for (const opportunityId of opportunities) {
    for (const poolSize of poolSizes) {
      opportunityRows.push(simulateOpportunity({ manifest, models, opportunityId, poolSize, trials }));
    }
    for (const scenarioId of scenarioIds.filter((id) => id !== 'current')) {
      opportunityRows.push(simulateOpportunity({
        manifest,
        models,
        opportunityId,
        poolSize: sensitivityPoolSize,
        trials,
        scenarioId,
        scenario: manifest.sensitivity_scenarios[scenarioId] || {},
      }));
    }
  }

  const report = {
    schema: 'solarpunk.gauntlet_simulation_report.v1',
    model_version: '0.2.0-opportunity-aware',
    manifest_schema: manifest.schema,
    manifest_version: manifest.version,
    manifest_sha256: sha256(manifestText),
    opportunity_models_schema: models.schema,
    opportunity_models_version: models.version,
    opportunity_models_sha256: sha256(opportunityText),
    source_basis: models.source_basis,
    seed: manifest.seed,
    trials_per_cell: trials,
    policy_lab_profile: manifest.policy_lab.id,
    claim_boundary: manifest.claim_boundary,
    pool_sizes: poolSizes,
    sensitivity_pool_size: sensitivityPoolSize,
    judge_profiles: judgeProfiles,
    opportunities,
    generic_scale_summary: summarizeGeneric(genericRows, judgeProfiles, poolSizes),
    opportunity_matrix: opportunityMatrix(opportunityRows, opportunities, sensitivityPoolSize),
    opportunity_sensitivity: opportunitySensitivity(opportunityRows, opportunities, sensitivityPoolSize, scenarioIds),
    generic_rows: genericRows,
    opportunity_rows: opportunityRows,
  };

  await mkdir(outDir, { recursive: true });
  const jsonPath = path.join(outDir, 'gauntlet-simulation-v1.json');
  const mdPath = path.join(outDir, 'gauntlet-simulation-v1.md');
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(mdPath, markdown(report));

  console.log(JSON.stringify({
    ok: true,
    model_version: report.model_version,
    manifest_sha256: report.manifest_sha256,
    opportunity_models_sha256: report.opportunity_models_sha256,
    trials_per_cell: trials,
    opportunity_matrix: report.opportunity_matrix,
    opportunity_sensitivity: report.opportunity_sensitivity,
    outputs: { json: jsonPath, markdown: mdPath },
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
