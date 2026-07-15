import { evaluateSettlement } from './claim.js';
import { BUILTIN_CALCULATORS, createCalculatorRegistry } from './constraints.js';

export const SETTLEMENT_CAPACITY_CALCULATOR = Object.freeze({
  id: 'SETTLEMENT_CAPACITY',
  version: '1.0.0',
  constraintClass: 'SETTLEMENT_CONSTRAINT',
  boundary: 'Settlement capacity is a declared modeled input unless independently evidenced. The evaluation does not create legal redemption rights or prove reserve custody.',
  evaluate({ claim, parameters }) {
    const settlementCapacity = Number(parameters.settlement_capacity);
    const settlement = evaluateSettlement({
      claim,
      settlement_capacity: settlementCapacity,
    });
    const status = settlement.result === 'SETTLED'
      ? 'PASS'
      : settlement.result === 'PARTIAL'
        ? 'WARNING'
        : 'BLOCK';
    return {
      status,
      unit: null,
      quantity_decimals: null,
      capacity: null,
      input_refs: [claim.claim_id],
      observed_inputs: {
        claim_id: claim.claim_id,
        outstanding_claim_quantity: settlement.outstanding_claim_quantity,
        settlement_capacity: settlement.settlement_capacity,
        covered_quantity: settlement.covered_quantity,
        shortfall_quantity: settlement.shortfall_quantity,
        unit: settlement.unit,
        settlement_result: settlement.result,
      },
      assumptions: [
        'Settlement capacity is treated as an explicit declared research input for this evaluation.',
      ],
      warnings: settlement.shortfall_quantity > 0
        ? [`Declared capacity leaves ${settlement.shortfall_quantity} ${settlement.unit} uncovered.`]
        : [],
      explanation: settlement.result === 'SETTLED'
        ? `Declared settlement capacity covers the full ${settlement.outstanding_claim_quantity} ${settlement.unit} obligation.`
        : `${settlement.result}: ${settlement.covered_quantity} ${settlement.unit} covered and ${settlement.shortfall_quantity} ${settlement.unit} remains uncovered.`,
      boundary: settlement.boundary,
    };
  },
});

export function createWorkbenchCalculatorRegistry() {
  return createCalculatorRegistry([
    ...BUILTIN_CALCULATORS,
    SETTLEMENT_CAPACITY_CALCULATOR,
  ]);
}

export async function evaluateSettlementConstraint({
  claim,
  settlement_capacity,
  calculatorRegistry = createWorkbenchCalculatorRegistry(),
}) {
  return calculatorRegistry.evaluateRule({
    rule: {
      rule_id: 'settlement.capacity.v1',
      calculator_id: 'SETTLEMENT_CAPACITY',
      parameters: { settlement_capacity },
    },
    claim,
  });
}
