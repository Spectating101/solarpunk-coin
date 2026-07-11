export const PROVENANCE_LEVELS = [
  {
    id: 'L0',
    rank: 0,
    label: 'Adapter sample or fixture',
    stage: 'public_lab_only',
    haircut_pct: 100,
    cap_kwh_day: 0,
    closed_pilot: false,
    paid_launch: false,
  },
  {
    id: 'L1',
    rank: 1,
    label: 'Operator-signed export',
    stage: 'shadow_pilot_or_review',
    haircut_pct: 60,
    cap_kwh_day: 250,
    closed_pilot: false,
    paid_launch: false,
  },
  {
    id: 'L2',
    rank: 2,
    label: 'Live inverter or gateway signed counter',
    stage: 'closed_pilot_candidate',
    haircut_pct: 30,
    cap_kwh_day: 2500,
    closed_pilot: true,
    paid_launch: false,
  },
  {
    id: 'L3',
    rank: 3,
    label: 'Revenue-grade meter with gateway custody',
    stage: 'risk_boxed_pilot',
    haircut_pct: 12,
    cap_kwh_day: 10000,
    closed_pilot: true,
    paid_launch: false,
  },
  {
    id: 'L4',
    rank: 4,
    label: 'Utility or settlement-corroborated meter',
    stage: 'production_candidate_after_audit',
    haircut_pct: 5,
    cap_kwh_day: 50000,
    closed_pilot: true,
    paid_launch: true,
  },
];

export function provenanceById(id) {
  return PROVENANCE_LEVELS.find((level) => level.id === id) || PROVENANCE_LEVELS[0];
}

export function provenanceRank(id) {
  return provenanceById(id).rank;
}

function upgradeRequirements(level) {
  switch (level) {
    case 'L0':
      return [
        'named real operator source',
        'device or gateway identity',
        'signed operator evidence',
      ];
    case 'L1':
      return [
        'automated live inverter/gateway counter source',
        'duplicate-window controls and source archive retention',
        'gateway or device key custody procedure',
      ];
    case 'L2':
      return [
        'revenue-grade meter accuracy basis',
        'controlled gateway custody and auditable logs',
        'dispute and correction workflow',
      ];
    case 'L3':
      return [
        'utility, settlement, or equivalent external corroboration for the same site/window',
        'third-party adapter/custody review',
      ];
    default:
      return [
        'formal audit',
        'legal/commercial scope',
        'reserve and settlement governance',
      ];
  }
}

export function classifyProvenance(normalized, context = {}) {
  let id = 'L0';
  const reasons = [];

  if (context.external_corroboration && context.revenue_grade) {
    id = 'L4';
    reasons.push('Revenue-grade source is externally corroborated for the same claim window.');
  } else if (context.revenue_grade && context.gateway_custody) {
    id = 'L3';
    reasons.push('Revenue-grade measurement is tied to controlled gateway custody and auditable logs.');
  } else if (
    context.real_operator_source &&
    context.signed &&
    (context.live_gateway || normalized?.capabilities?.live_gateway_candidate)
  ) {
    id = 'L2';
    reasons.push('Named real operator source uses signed live inverter/gateway counter evidence.');
  } else if (context.operator_signed || (context.real_operator_source && context.signed)) {
    id = 'L1';
    reasons.push('Named operator evidence is signed, but hardware custody/finality is not established.');
  } else {
    reasons.push('Sample, fixture, browser-local, or otherwise uncorroborated evidence remains public-lab only.');
  }

  const level = provenanceById(id);
  return {
    schema: 'solarpunk.constraint.provenance_decision.v1',
    level: level.id,
    rank: level.rank,
    label: level.label,
    stage: level.stage,
    default_haircut_pct: level.haircut_pct,
    default_cap_kwh_day: level.cap_kwh_day,
    closed_pilot_candidate: level.closed_pilot,
    paid_launch_hardware_candidate: level.paid_launch,
    reasons,
    missing_for_next_level: upgradeRequirements(level.id),
    explicit_boundary:
      'Provenance class is an evidence-assurance classification, not proof of legal ownership, environmental-attribute ownership, redemption enforceability, or production audit completion.',
  };
}
