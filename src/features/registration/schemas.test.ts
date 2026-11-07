import { describe, expect, it } from 'vitest';

import { smartMeterClaimSchema } from './schemas';

describe('smartMeterClaimSchema', () => {
  it('trims and accepts a non-empty meter ID', () => {
    expect(smartMeterClaimSchema.parse({ meterId: ' MTR-7829-XY ' })).toEqual({
      meterId: 'MTR-7829-XY',
    });
  });

  it('rejects an empty meter ID', () => {
    expect(smartMeterClaimSchema.safeParse({ meterId: ' ' }).success).toBe(false);
  });
});
