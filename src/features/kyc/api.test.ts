import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createKycUploadUrl,
  KycUploadError,
  submitKyc,
  uploadKycDocument,
} from './api';

vi.mock('#/env', () => ({
  env: { VITE_API_BASE_URL: 'http://api.test' },
}));

const fetchMock = vi.fn<typeof fetch>();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('KYC API', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('requests an upload URL with the file type and size', async () => {
    fetchMock.mockResolvedValue(
      json({
        uploadUrl: 'http://storage.test/signed',
        objectKey: 'kyc/user-1/doc.jpg',
        expiresIn: 300,
      }),
    );

    await expect(createKycUploadUrl('image/jpeg', 2048)).resolves.toEqual({
      uploadUrl: 'http://storage.test/signed',
      objectKey: 'kyc/user-1/doc.jpg',
      expiresIn: 300,
    });

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('http://api.test/api/v1/kyc/upload-url');
    expect(options?.method).toBe('POST');
    expect(options?.credentials).toBe('include');
    expect(JSON.parse(String(options?.body))).toEqual({
      contentType: 'image/jpeg',
      sizeBytes: 2048,
    });
  });

  it('uploads the file straight to storage without session cookies', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
    const file = new File(['id-card'], 'id.png', { type: 'image/png' });

    await uploadKycDocument('http://storage.test/signed', file);

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('http://storage.test/signed');
    expect(options?.method).toBe('PUT');
    expect(options?.body).toBe(file);
    expect(options?.headers).toEqual({ 'Content-Type': 'image/png' });
    expect(options?.credentials).toBe('omit');
  });

  it('throws KycUploadError when storage rejects the upload', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 403 }));
    const file = new File(['id-card'], 'id.png', { type: 'image/png' });

    await expect(
      uploadKycDocument('http://storage.test/signed', file),
    ).rejects.toBeInstanceOf(KycUploadError);
  });

  it('throws KycUploadError when storage cannot be reached', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const file = new File(['id-card'], 'id.png', { type: 'image/png' });

    await expect(
      uploadKycDocument('http://storage.test/signed', file),
    ).rejects.toThrow("We couldn't upload your document. Please try again.");
  });

  it('submits the KYC details with the stored object key', async () => {
    fetchMock.mockResolvedValue(
      json(
        {
          id: 'kyc-1',
          state: 'PENDING',
          createdAt: '2026-10-14T10:00:00.000Z',
          updatedAt: '2026-10-14T10:00:00.000Z',
        },
        201,
      ),
    );

    const request = {
      fullName: 'Jane Doe',
      dateOfBirth: '1998-04-12',
      dubaiId: '784-1998-1234567-1',
      documentPath: 'kyc/user-1/doc.jpg',
    };

    await expect(submitKyc(request)).resolves.toMatchObject({
      state: 'PENDING',
    });

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe('http://api.test/api/v1/kyc');
    expect(options?.method).toBe('POST');
    expect(JSON.parse(String(options?.body))).toEqual(request);
  });
});
