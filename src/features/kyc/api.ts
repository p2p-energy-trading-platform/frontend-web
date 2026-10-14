import { apiRequest } from '#/lib/api-client';

export type KycState = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface KycUploadUrl {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
}

export interface KycSubmitRequest {
  fullName: string;
  dateOfBirth: string;
  dubaiId: string;
  /** Object key returned by createKycUploadUrl. */
  documentPath: string;
}

export interface KycSubmission {
  id: string;
  state: KycState;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

/** Thrown when the browser cannot upload the document to storage. */
export class KycUploadError extends Error {
  constructor() {
    super("We couldn't upload your document. Please try again.");
    this.name = 'KycUploadError';
  }
}

export function createKycUploadUrl(contentType: string, sizeBytes: number) {
  return apiRequest<KycUploadUrl>('/api/v1/kyc/upload-url', {
    method: 'POST',
    body: JSON.stringify({ contentType, sizeBytes }),
  });
}

/**
 * Uploads the file straight to object storage with a presigned URL. This does
 * not go through the API gateway, so it uses fetch without session cookies.
 */
export async function uploadKycDocument(uploadUrl: string, file: File) {
  let response: Response;

  try {
    response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
      credentials: 'omit',
    });
  } catch {
    throw new KycUploadError();
  }

  if (!response.ok) {
    throw new KycUploadError();
  }
}

export function submitKyc(request: KycSubmitRequest) {
  return apiRequest<KycSubmission>('/api/v1/kyc', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
