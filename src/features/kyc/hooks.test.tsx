// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createKycUploadUrl, submitKyc, uploadKycDocument } from './api';
import { useSubmitKyc } from './hooks';

vi.mock('./api', () => ({
  createKycUploadUrl: vi.fn(),
  submitKyc: vi.fn(),
  uploadKycDocument: vi.fn(),
}));

vi.mock('#/features/auth/hooks', () => ({
  authUserQueryOptions: {
    queryKey: ['authUser'],
  },
}));

const createUploadUrlMock = vi.mocked(createKycUploadUrl);
const uploadDocumentMock = vi.mocked(uploadKycDocument);
const submitKycMock = vi.mocked(submitKyc);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function createInput(documentPath?: string) {
  return {
    fullName: 'Jane Doe',
    dateOfBirth: '1998-04-12',
    nicNumber: '987654321V',
    document: new File(['NIC image'], 'nic.jpg', {
      type: 'image/jpeg',
    }),
    ...(documentPath ? { documentPath } : {}),
  };
}

describe('useSubmitKyc', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    submitKycMock.mockResolvedValue({
      id: 'kyc-1',
      state: 'PENDING',
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reuses a prepared document without uploading it again', async () => {
    const input = createInput('kyc/user-1/nic.jpg');
    const { result } = renderHook(() => useSubmitKyc(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(input);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(createUploadUrlMock).not.toHaveBeenCalled();
    expect(uploadDocumentMock).not.toHaveBeenCalled();
    expect(submitKycMock).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      dateOfBirth: '1998-04-12',
      nicNumber: '987654321V',
      documentPath: 'kyc/user-1/nic.jpg',
    });
  });

  it('uploads the document when no prepared key is provided', async () => {
    createUploadUrlMock.mockResolvedValue({
      uploadUrl: 'https://storage.test/signed',
      objectKey: 'kyc/user-1/new-nic.jpg',
      expiresIn: 300,
    });

    const input = createInput();
    const { result } = renderHook(() => useSubmitKyc(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(input);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(createUploadUrlMock).toHaveBeenCalledWith(
      'image/jpeg',
      input.document.size,
    );
    expect(uploadDocumentMock).toHaveBeenCalledWith(
      'https://storage.test/signed',
      input.document,
    );
    expect(submitKycMock).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      dateOfBirth: '1998-04-12',
      nicNumber: '987654321V',
      documentPath: 'kyc/user-1/new-nic.jpg',
    });
  });

  it('does not submit KYC details if the document upload fails', async () => {
    createUploadUrlMock.mockResolvedValue({
      uploadUrl: 'https://storage.test/signed',
      objectKey: 'kyc/user-1/new-nic.jpg',
      expiresIn: 300,
    });
    uploadDocumentMock.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useSubmitKyc(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(createInput());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(submitKycMock).not.toHaveBeenCalled();
  });
});
