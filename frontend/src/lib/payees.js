const LABELS = {
  merchant: 'Merchant',
  gateway: 'Gateway',
  maintenance: 'Maintenance',
  network_peer: 'Network peer',
  pilot_payer: 'Pilot payer',
  operator: 'Operator',
};

/** Build payee list from synced runtime (falls back to demo Hardhat accounts). */
export function buildPayees(runtime) {
  const counterparties = runtime?.counterparties;
  if (counterparties && Object.keys(counterparties).length > 0) {
    return Object.entries(counterparties)
      .filter(([id]) => id !== 'network_peer')
      .map(([id, info]) => ({
        id,
        label: LABELS[id] || id.replace(/_/g, ' '),
        role: info.role,
        address: info.address,
      }));
  }
  return [
    { id: 'merchant', label: 'Merchant', role: 'GOODS', address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' },
    { id: 'gateway', label: 'Gateway', role: 'SERVICE', address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' },
    { id: 'maintenance', label: 'Maintenance', role: 'LABOR', address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' },
  ];
}
