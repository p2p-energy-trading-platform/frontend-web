export interface ApiErrorDetail {
  location: string;
  path: string;
  message: string;
}

interface GatewayErrorResponse {
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
    timestamp?: string;
    details?: ApiErrorDetail[];
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly details: ApiErrorDetail[];
  readonly retryAfterSeconds?: number;

  constructor(
    status: number,
    code: string,
    message: string,
    requestId: string | undefined,
    details: ApiErrorDetail[],
    retryAfterSeconds: number | undefined,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Cannot reach the server');
    this.name = 'NetworkError';
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new NetworkError();
  }

  if (response.ok) {
    return (await response.json()) as T;
  }

  const requestId = response.headers.get('x-request-id') ?? undefined;
  const retryAfterHeader = response.headers.get('retry-after');
  const retryAfterSeconds = retryAfterHeader
    ? Number.parseInt(retryAfterHeader, 10)
    : undefined;

  let errorResponse: GatewayErrorResponse = {};
  try {
    errorResponse = (await response.json()) as GatewayErrorResponse;
  } catch {
    // Preserve the HTTP status when the gateway response is not JSON.
  }

  throw new ApiError(
    response.status,
    errorResponse.error?.code ?? 'UNKNOWN_ERROR',
    errorResponse.error?.message ?? 'Request failed',
    requestId ?? errorResponse.error?.requestId,
    errorResponse.error?.details ?? [],
    Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : undefined,
  );
}
