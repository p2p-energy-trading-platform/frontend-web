import { describe, expect, it } from 'vitest';

import { iotStatus } from './status';

const ready = {
  housesLoading: false,
  housesFailed: false,
  hasHouse: true,
  loading: false,
  failed: false,
  missing: false,
};

describe('iotStatus', () => {
  it('waits for the houses before anything else', () => {
    expect(iotStatus({ ...ready, housesLoading: true, hasHouse: false })).toBe(
      'loading',
    );
  });

  it('reports a failed house lookup as an error', () => {
    expect(iotStatus({ ...ready, housesFailed: true, hasHouse: false })).toBe(
      'error',
    );
  });

  it('asks the user to link a meter when they have no house', () => {
    expect(iotStatus({ ...ready, hasHouse: false })).toBe('no-house');
  });

  it('reflects the data query once a house is known', () => {
    expect(iotStatus({ ...ready, failed: true })).toBe('error');
    expect(iotStatus({ ...ready, loading: true })).toBe('loading');
    expect(iotStatus({ ...ready, missing: true })).toBe('no-reading');
    expect(iotStatus(ready)).toBe('ready');
  });
});
