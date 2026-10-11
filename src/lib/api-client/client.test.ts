import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, apiRequest } from './api-client';

vi.mock('#/env', () => ({
  env: { VITE_API_BASE_URL: 'http://api.test' },
}));

const fetchMock = vi.fn<typeof fetch>();

function json(status: number, body: unknown = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function calledPaths(): string[] {
  return fetchMock.mock.calls.map(([url]) =>
    String(url).replace('http://api.test', ''),
  );
}

function headersOf(call: number): Record<string, string> {
  return (fetchMock.mock.calls[call]?.[1]?.headers ?? {}) as Record<
    string,
    string
  >;
}

describe('apiRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('sends Content-Type only when there is a body', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await apiRequest('/api/v1/auth/logout', { method: 'POST' });
    await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.c', password: 'x' }),
    });

    expect(headersOf(0)).not.toHaveProperty('Content-Type');
    expect(headersOf(1)).toHaveProperty('Content-Type', 'application/json');
  });

  it('refreshes and retries /me after a 401', async () => {
    fetchMock
      .mockResolvedValueOnce(json(401))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(json(200, { userId: 'user-1' }));

    await expect(apiRequest('/api/v1/auth/me')).resolves.toEqual({
      userId: 'user-1',
    });
    expect(calledPaths()).toEqual([
      '/api/v1/auth/me',
      '/api/v1/auth/refresh',
      '/api/v1/auth/me',
    ]);
    expect(headersOf(1)).not.toHaveProperty('Content-Type');
  });

  it('shares one refresh between parallel requests', async () => {
    fetchMock.mockImplementation(async (url) => {
      const path = String(url).replace('http://api.test', '');
      if (path === '/api/v1/auth/refresh') {
        return new Response(null, { status: 204 });
      }
      const refreshed = calledPaths().includes('/api/v1/auth/refresh');
      return refreshed ? json(200, { ok: true }) : json(401);
    });

    await Promise.all([apiRequest('/api/v1/a'), apiRequest('/api/v1/b')]);

    expect(
      calledPaths().filter((path) => path === '/api/v1/auth/refresh'),
    ).toHaveLength(1);
  });

  it('does not refresh when login returns 401', async () => {
    fetchMock.mockResolvedValue(json(401));

    await expect(
      apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.c', password: 'wrong' }),
      }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(calledPaths()).toEqual(['/api/v1/auth/login']);
  });

  it('gives up when the refresh fails', async () => {
    fetchMock.mockResolvedValue(json(401));

    await expect(apiRequest('/api/v1/auth/me')).rejects.toMatchObject({
      status: 401,
    });
    expect(calledPaths()).toEqual(['/api/v1/auth/me', '/api/v1/auth/refresh']);
  });
});
