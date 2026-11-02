import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getEnergySeries,
  getEnergySummary,
  getHouse,
  getLatestReading,
  listHouses,
} from './api';

vi.mock('#/env', () => ({
  env: { VITE_API_BASE_URL: 'http://api.test' },
}));

const fetchMock = vi.fn<typeof fetch>();

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

function requestedUrl(call = 0) {
  return new URL(String(fetchMock.mock.calls[call]?.[0]));
}

describe('IoT API', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockImplementation(() => Promise.resolve(json({})));
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('lists the user’s houses', async () => {
    fetchMock.mockResolvedValue(json({ houses: [] }));

    await expect(listHouses()).resolves.toEqual({ houses: [] });
    expect(requestedUrl().pathname).toBe('/api/v1/iot/houses');
  });

  it('encodes the house id in house paths', async () => {
    await getHouse('grid01/house 1');
    await getLatestReading('grid01-house0003');

    expect(requestedUrl(0).pathname).toBe(
      '/api/v1/iot/houses/grid01%2Fhouse%201',
    );
    expect(requestedUrl(1).pathname).toBe(
      '/api/v1/iot/houses/grid01-house0003/latest-reading',
    );
  });

  it('sends the energy series range, bucket and time zone', async () => {
    await getEnergySeries('h1', {
      from: '2026-10-31T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
      bucket: '30m',
      timeZone: 'Asia/Dubai',
    });

    const url = requestedUrl();
    expect(url.pathname).toBe('/api/v1/iot/houses/h1/energy-series');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      from: '2026-10-31T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
      bucket: '30m',
      timeZone: 'Asia/Dubai',
    });
  });

  it('sends the energy summary range', async () => {
    await getEnergySummary('h1', {
      from: '2026-10-31T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
    });

    const url = requestedUrl();
    expect(url.pathname).toBe('/api/v1/iot/houses/h1/energy-summary');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      from: '2026-10-31T20:00:00.000Z',
      to: '2026-11-01T20:00:00.000Z',
    });
  });
});
