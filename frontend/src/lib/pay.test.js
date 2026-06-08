import { describe, expect, it } from 'vitest';
import { ethers } from 'ethers';
import { buildUiInvoiceHash, paymentKindHash } from './pay';

describe('pay helpers', () => {
  it('builds unique invoice hashes', () => {
    const a = buildUiInvoiceHash('merchant');
    const b = buildUiInvoiceHash('merchant');
    expect(a).toMatch(/^0x[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
  });

  it('matches operator payment kind encoding', () => {
    expect(paymentKindHash('SERVICE')).toBe(ethers.id('SERVICE'));
    expect(paymentKindHash('GOODS')).toBe(ethers.id('GOODS'));
  });
});
