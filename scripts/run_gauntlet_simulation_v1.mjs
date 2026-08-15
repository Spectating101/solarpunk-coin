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

function validateManifest(manifest) {
  if (manifest.schema !== 'solarpunk.gauntlet_simulation_manifest.v1') {
    throw new Error('unexpected gauntlet manifest schema');
  }
  if (!Array.isArray(manifest.dimensions) || manifest.dimensions.length < 2) {
    throw new Error('manifest.dimensions must contain at least two dimensions');
  }
  for (const [profileId, profile] of Object.entries(manifest.judge_profiles || {})) {
    const sum = manifest.dimensions.reduce((total, dimension) => total + Number(profile.weights?.[dimension] || 0), 0);
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

function chooseArchetype(random, archetypes) {
  const roll = random();
  let cursor = 0;
  for (const [id, archetype] of archetypes) {
    cursor += Number(archetype.weight || 0);
    if (roll <= cursor) return [id, archetype];
  }
  return archetypes[archetypes.length - 1];
}

function sampleCompetitor(random, manifest, archetypes) {
  const [id, archetype] = chooseArchetype(random, archetypes);
  const scores = {};
  for (const dimension of manifest.dimensions) {
    const center = Number(archetype.scores[dimension]);
    scores[dimension] = clamp(center + normal(random) * Number(archetype.sd || 0));
  }
  return { id, scores };
}

function weightedScore(scores, weights, dimensions) {
  return dimensions.reduce((total, dimension) => total + Number(scores[dimension]) * Number(weights[dimension]), 0);
}

function percentileFromRank(rank, poolSize) {
  if (poolSize <= 1) return 1;
  return 1 - ((rank - 1) / (poolSize - 1));
}

function topDecileThreshold(poolSize) {
  return Math.max(1, Math.ceil(poolSize * 0.10));
}

function seedFor(baseSeed, profileIndex, poolSize, scenarioIndex = 0) {
  return (Number(baseSeed) ^ (profileIndex * 0x9E3779B1) ^ (poolSize * 0x85EBCA6B) ^ (scenarioIndex * 0xC2B2AE35)) >>> 0;
}

function simulateOne({ manifest, profileId, profileIndex, poolSize, trials, scenarioId = 'current', scenario = {}, scenarioIndex = 0 }) {
  const profile = manifest.judge_profiles[profileId];
  const random = mulberry32(seedFor(manifest.seed, profileIndex, poolSize, scenarioIndex));
  const archetypes = Object.entries(manifest.competitor_archetypes);
  let top1 = 0;
  let top3 = 0;
  let top10pct = 0;
  let scoreSum = 0;
  let winnerMarginSum = 0;
  const percentiles = [];
  const lossWinners = Object.fromEntries(archetypes.map(([id]) => [id, 0]));

  for (let trial = 0; trial < trials; trial += 1) {
    const candidate = samplePolicyLab(random, manifest, scenario);
    const candidateScore = weightedScore(candidate, profile.weights, manifest.dimensions);
    let rank = 1;
    let bestCompetitorScore = -Infinity;
    let bestCompetitorType = null;

    for (let index = 1; index < poolSize; index += 1) {
      const competitor = sampleCompetitor(random, manifest, archetypes);
      const score = weightedScore(competitor.scores, profile.weights, manifest.dimensions);
      if (score > candidateScore) rank += 1;
      if (score > bestCompetitorScore) {
        bestCompetitorScore = score;
        bestCompetitorType = competitor.id;
      }
    }

    if (rank === 1) top1 += 1;
    if (rank <= Math.min(3, poolSize)) top3 += 1;
    if (rank <= topDecileThreshold(poolSize)) top10pct += 1;
    if (rank > 1 && bestCompetitorType) lossWinners[bestCompetitorType] += 1;

    const percentile = percentileFromRank(rank, poolSize);
    percentiles.push(percentile);
    scoreSum += candidateScore;
    winnerMarginSum += candidateScore - bestCompetitorScore;
  }

  const lossTotal = Object.values(lossWinners).reduce((sum, value) => sum + value, 0);
  const lossWinnerShares = Object.fromEntries(
    Object.entries(lossWinners)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => [id, lossTotal ? round(count / lossTotal, 4) : 0]),
  );

  return {
    judge_profile: profileId,
    judge_label: profile.label,
    scenario: scenarioId,
    pool_size: poolSize,
    trials,
    candidate_score_mean: round(scoreSum / trials, 4),
    top1_rate: round(top1 / trials, 4),
    top3_rate: round(top3 / trials, 4),
    top10pct_rate: round(top10pct / trials, 4),
    mean_percentile: round(mean(percentiles), 4),
    median_percentile: round(median(percentiles), 4),
    mean_margin_to_best_competitor: round(winnerMarginSum / trials, 4),
    loss_winner_archetype_share: lossWinnerShares,
  };
}

function summarizeCurrent(rows, judgeProfiles, poolSizes) {
  const summaries = [];
  for (const poolSize of poolSizes) {
    const poolRows = rows.filter((row) => row.scenario === 'current' && row.pool_size === poolSize);
    summaries.push({
      pool_size: poolSize,
      mean_top1_rate_across_judges: round(mean(poolRows.map((row) => row.top1_rate)), 4),
      mean_top3_rate_across_judges: round(mean(poolRows.map((row) => row.top3_rate)), 4),
      mean_top10pct_rate_across_judges: round(mean(poolRows.map((row) => row.top10pct_rate)), 4),
      mean_percentile_across_judges: round(mean(poolRows.map((row) => row.mean_percentile)), 4),
      by_judge: Object.fromEntries(judgeProfiles.map((id) => {
        const row = poolRows.find((item) => item.judge_profile === id);
        return [id, {
          top1_rate: row.top1_rate,
          top3_rate: row.top3_rate,
          top10pct_rate: row.top10pct_rate,
          mean_percentile: row.mean_percentile,
        }];
      })),
    });
  }
  return summaries;
}

function scenarioSummary(rows, sensitivityPoolSize, judgeProfiles) {
  const scenarioIds = [...new Set(rows.filter((row) => row.pool_size === sensitivityPoolSize).map((row) => row.scenario))];
  return scenarioIds.map((scenarioId) => {
    const selected = rows.filter((row) => row.pool_size === sensitivityPoolSize && row.scenario === scenarioId);
    return {
      scenario: scenarioId,
      pool_size: sensitivityPoolSize,
      mean_top1_rate_across_judges: round(mean(selected.map((row) => row.top1_rate)), 4),
      mean_top3_rate_across_judges: round(mean(selected.map((row) => row.top3_rate)), 4),
      mean_percentile_across_judges: round(mean(selected.map((row) => row.mean_percentile)), 4),
      by_judge: Object.fromEntries(judgeProfiles.map((id) => {
        const row = selected.find((item) => item.judge_profile === id);
        return [id, {
          top1_rate: row.top1_rate,
          top3_rate: row.top3_rate,
          mean_percentile: row.mean_percentile,
        }];
      })),
    };
  });
}

function markdown(report) {
  const lines = [];
  lines.push('# Gauntlet Simulation v1');
  lines.push('');
  lines.push('Synthetic stress test only. These are not real-entry scores or award probabilities.');
  lines.push('');
  lines.push(`Manifest SHA-256: \`${report.manifest_sha256}\``);
  lines.push(`Trials per cell: **${report.trials_per_cell}**`);
  lines.push('');
  lines.push('## Current profile — scaling with entry-pool size');
  lines.push('');
  lines.push('| Pool | Mean top-1 | Mean top-3 | Mean top-10% | Mean percentile |');
  lines.push('|---:|---:|---:|---:|---:|');
  for (const item of report.current_scale_summary) {
    lines.push(`| ${item.pool_size} | ${(item.mean_top1_rate_across_judges * 100).toFixed(1)}% | ${(item.mean_top3_rate_across_judges * 100).toFixed(1)}% | ${(item.mean_top10pct_rate_across_judges * 100).toFixed(1)}% | ${(item.mean_percentile_across_judges * 100).toFixed(1)}th |`);
  }
  lines.push('');
  lines.push(`## Sensitivity at ${report.sensitivity_pool_size} entries`);
  lines.push('');
  lines.push('| Scenario | Mean top-1 | Mean top-3 | Mean percentile |');
  lines.push('|---|---:|---:|---:|');
  for (const item of report.sensitivity_summary) {
    lines.push(`| ${item.scenario} | ${(item.mean_top1_rate_across_judges * 100).toFixed(1)}% | ${(item.mean_top3_rate_across_judges * 100).toFixed(1)}% | ${(item.mean_percentile_across_judges * 100).toFixed(1)}th |`);
  }
  lines.push('');
  lines.push('## Judge-profile view at 50 entries — current profile');
  lines.push('');
  lines.push('| Judge profile | Top-1 | Top-3 | Top-10% | Mean percentile |');
  lines.push('|---|---:|---:|---:|---:|');
  for (const row of report.rows.filter((item) => item.scenario === 'current' && item.pool_size === report.sensitivity_pool_size)) {
    lines.push(`| ${row.judge_profile} | ${(row.top1_rate * 100).toFixed(1)}% | ${(row.top3_rate * 100).toFixed(1)}% | ${(row.top10pct_rate * 100).toFixed(1)}% | ${(row.mean_percentile * 100).toFixed(1)}th |`);
  }
  lines.push('');
  lines.push('## Interpretation boundary');
  lines.push('');
  for (const boundary of report.claim_boundary) lines.push(`- ${boundary}`);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const manifestPath = path.resolve(arg('manifest', 'benchmark/gauntlet/gauntlet-manifest.v1.json'));
  const outDir = path.resolve(arg('out', 'benchmark/gauntlet/reports'));
  const manifestText = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestText);
  validateManifest(manifest);
  const trials = Number(arg('trials', manifest.default_trials));
  if (!Number.isInteger(trials) || trials < 100) throw new Error('--trials must be an integer >= 100');

  const judgeProfiles = Object.keys(manifest.judge_profiles);
  const poolSizes = manifest.pool_sizes.map(Number);
  const rows = [];

  for (let profileIndex = 0; profileIndex < judgeProfiles.length; profileIndex += 1) {
    const profileId = judgeProfiles[profileIndex];
    for (const poolSize of poolSizes) {
      rows.push(simulateOne({
        manifest,
        profileId,
        profileIndex,
        poolSize,
        trials,
        scenarioId: 'current',
        scenario: manifest.sensitivity_scenarios.current || {},
        scenarioIndex: 0,
      }));
    }
  }

  const sensitivityPoolSize = poolSizes.includes(50) ? 50 : poolSizes[Math.floor(poolSizes.length / 2)];
  const sensitivityEntries = Object.entries(manifest.sensitivity_scenarios)
    .filter(([scenarioId]) => scenarioId !== 'current');
  for (let scenarioOffset = 0; scenarioOffset < sensitivityEntries.length; scenarioOffset += 1) {
    const [scenarioId, scenario] = sensitivityEntries[scenarioOffset];
    for (let profileIndex = 0; profileIndex < judgeProfiles.length; profileIndex += 1) {
      const profileId = judgeProfiles[profileIndex];
      rows.push(simulateOne({
        manifest,
        profileId,
        profileIndex,
        poolSize: sensitivityPoolSize,
        trials,
        scenarioId,
        scenario,
        scenarioIndex: scenarioOffset + 1,
      }));
    }
  }

  const report = {
    schema: 'solarpunk.gauntlet_simulation_report.v1',
    manifest_schema: manifest.schema,
    manifest_version: manifest.version,
    manifest_sha256: sha256(manifestText),
    seed: manifest.seed,
    trials_per_cell: trials,
    policy_lab_profile: manifest.policy_lab.id,
    claim_boundary: manifest.claim_boundary,
    pool_sizes: poolSizes,
    judge_profiles: judgeProfiles,
    sensitivity_pool_size: sensitivityPoolSize,
    current_scale_summary: summarizeCurrent(rows, judgeProfiles, poolSizes),
    sensitivity_summary: scenarioSummary(rows, sensitivityPoolSize, judgeProfiles),
    rows,
  };

  await mkdir(outDir, { recursive: true });
  const jsonPath = path.join(outDir, 'gauntlet-simulation-v1.json');
  const mdPath = path.join(outDir, 'gauntlet-simulation-v1.md');
  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(mdPath, markdown(report));
  console.log(JSON.stringify({
    ok: true,
    manifest_sha256: report.manifest_sha256,
    trials_per_cell: trials,
    current_scale_summary: report.current_scale_summary,
    sensitivity_summary: report.sensitivity_summary,
    outputs: { json: jsonPath, markdown: mdPath },
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
