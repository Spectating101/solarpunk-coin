import { describe, expect, it } from 'vitest';
import {
  SESSION_RECEIPT_KEY,
  clearSessionReceipt,
  loadSessionReceipt,
  saveSessionReceipt,
  summarizeReceipt,
} from './sessionReceipt';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

const RECEIPT = {
  schema: 'solarpunk.public_lab.evidence_receipt.v1',
  evidence_hash: 'a'.repeat(64),
  hash_algorithm: 'SHA-256',
  rows: [{ timestamp: '2026-01-01T00:00:00Z', meter_id: 'PRIVATE-ROW' }],
  totals: {
    issuance_eligible: true,
    issuance_cap_spk: 10,
    eligible_surplus_kwh: 10,
    accepted_rows: 1,
    rejected_rows: 0,
  },
  diagnostics: {
    accepted_rows: 1,
    rejected_rows: 0,
    gap_warnings: [],
    issuance_eligible: true,
    issuance_reason: 'surplus_basis_present',
    surplus_basis_used: ['export_only'],
  },
  status: {
    validated_locally: true,
    evidence_receipt_generated: true,
    accepted_for_live_minting: false,
  },
  disclaimer: 'Local only.',
};

describe('sessionReceipt', () => {
  it('stores a minimal receipt summary without raw evidence rows', () => {
    const storage = memoryStorage();
    const summary = saveSessionReceipt(RECEIPT, storage);
    expect(summary.session_summary).toBe(true);
    expect(summary.rows).toBeUndefined();
    expect(JSON.parse(storage.getItem(SESSION_RECEIPT_KEY)).rows).toBeUndefined();

    const restored = loadSessionReceipt(storage);
    expect(restored.evidence_hash).toBe(RECEIPT.evidence_hash);
    expect(restored.totals.issuance_cap_spk).toBe(10);
  });

  it('fails closed for a receipt accepted for live minting', () => {
    const unsafe = {
      ...RECEIPT,
      status: { ...RECEIPT.status, accepted_for_live_minting: true },
    };
    expect(summarizeReceipt(unsafe)).toBeNull();
  });

  it('clears the active summary', () => {
    const storage = memoryStorage();
    saveSessionReceipt(RECEIPT, storage);
    clearSessionReceipt(storage);
    expect(loadSessionReceipt(storage)).toBeNull();
  });
});
