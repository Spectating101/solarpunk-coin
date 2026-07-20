import { afterEach, describe, expect, it, vi } from 'vitest';
import { ethers } from 'ethers';
import { buildUiInvoiceHash, paymentKindHash } from './pay';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('pay helpers', () => {
  it('builds unique invoice hashes even within the same millisecond', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_721_459_200_000);
    const a = buildUiInvoiceHash('merchant');
    const b = buildUiInvoiceHash('merchant');
    expect(a).toMatch(/^0x[0-9a-f]{64}$/);
    expect(b).toMatch(/^0x[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
  });

  it('matches operator payment kind encoding', () => {
    expect(paymentKindHash('SERVICE')).toBe(ethers.id('SERVICE'));
    expect(paymentKindHash('GOODS')).toBe(ethers.id('GOODS'));
  });
});
