/**
 * Canonical counterparty registry — keep in sync with spk_v1/src/spk_v1/counterparties.py
 */
const CANONICAL_COUNTERPARTIES = {
  gateway: {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    role: "SERVICE",
    label: "Gateway",
  },
  maintenance: {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    role: "LABOR",
    label: "Maintenance",
  },
  merchant: {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    role: "GOODS",
    label: "Merchant",
  },
  network_peer: {
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    role: "NETWORK",
    label: "Network peer",
  },
  pilot_payer: {
    address: "0xaC39F4a71A69fF24a6aeEA12A24C45396027Aec0",
    role: "PAYER",
    label: "Pilot payer",
  },
  operator: {
    address: "0x0b90e3a05D794643e1CB0d37Ff6FD9245Bf09f54",
    role: "OPERATOR",
    label: "Operator",
  },
};

/** Operator-cycle payees (excludes pilot_payer / operator). */
const CYCLE_PAYEES = {
  gateway: CANONICAL_COUNTERPARTIES.gateway,
  maintenance: CANONICAL_COUNTERPARTIES.maintenance,
  merchant: CANONICAL_COUNTERPARTIES.merchant,
  network_peer: CANONICAL_COUNTERPARTIES.network_peer,
};

function mergeCounterparties(runtimeCounterparties) {
  const merged = { ...CANONICAL_COUNTERPARTIES };
  for (const [id, info] of Object.entries(runtimeCounterparties || {})) {
    merged[id] = { ...merged[id], ...info };
  }
  return merged;
}

module.exports = {
  CANONICAL_COUNTERPARTIES,
  CYCLE_PAYEES,
  mergeCounterparties,
};
