import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { requestPasswordReset, resetPassword } from './api';

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

describe('password-reset API', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('requests a password-reset link using the supplied email', async () => {
    fetchMock.mockResolvedValue(json({ success: true }));

    await expect(requestPasswordReset('user@example.com')).resolves.toEqual({
      success: true,
    });

    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('http://api.test/api/v1/auth/password-reset');
    expect(options?.method).toBe('POST');
    expect(options?.credentials).toBe('include');
    expect(options?.headers).toMatchObject({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(String(options?.body))).toEqual({
      email: 'user@example.com',
    });
  });

  it('confirms a password reset using the token and new password', async () => {
    fetchMock.mockResolvedValue(json({ success: true }));

    await expect(
      resetPassword('reset-token-123', 'NewPassword123!'),
    ).resolves.toEqual({ success: true });

    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('http://api.test/api/v1/auth/password-reset/confirm');
    expect(options?.method).toBe('POST');
    expect(JSON.parse(String(options?.body))).toEqual({
      token: 'reset-token-123',
      newPassword: 'NewPassword123!',
    });
  });

  it('does not attempt session refresh when a reset request returns 401', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
        }),
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
        },
      ),
    );

    await expect(
      resetPassword('expired-token', 'NewPassword123!'),
    ).rejects.toMatchObject({ status: 401 });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      '/api/v1/auth/password-reset/confirm',
    );
  });
});
