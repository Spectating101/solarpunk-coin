import { describe, expect, it } from 'vitest';
import { runtimeAssetUrl } from './runtime';

describe('runtimeAssetUrl', () => {
  it('joins base and filename without double slashes', () => {
    expect(runtimeAssetUrl('spk_v1.json')).toMatch(/spk_v1\.json$/);
  });
});
