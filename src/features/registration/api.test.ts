import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { initiateMeterClaim } from './api';

const fetchMock = vi.fn<typeof fetch>();

describe('initiateMeterClaim', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('posts the meter id to the API gateway registration endpoint', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          registration_id: 'registration-123',
          status: 'pending',
          message: 'Approval request sent',
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    await expect(
      initiateMeterClaim({ meter_id: 'MTR-7829-XY' }),
    ).resolves.toEqual({
      registration_id: 'registration-123',
      status: 'pending',
      message: 'Approval request sent',
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/v1/registration/claim');
    expect(options?.method).toBe('POST');
    expect(JSON.parse(String(options?.body))).toEqual({
      meter_id: 'MTR-7829-XY',
    });
  });
});
