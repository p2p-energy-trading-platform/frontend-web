import { getQueryClient } from './query-client';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
let refreshPromise: Promise<void> | undefined;

function isRefreshExcluded(path: string): boolean {
  return (
    path === '/api/v1/auth/login' ||
    path === '/api/v1/auth/register' ||
    path === '/api/v1/auth/refresh'
  );
}

function parseRetryAfter(response: Response): number | undefined {
  const value = response.headers.get('retry-after');
  if (!value) return undefined;
  const seconds = Number.parseInt(value, 10);
  return Number.isFinite(seconds) ? seconds : undefined;
}

async function parseApiError(response: Response): Promise<ApiError> {
  let body: GatewayErrorResponse = {};
  try {
    body = (await response.json()) as GatewayErrorResponse;
  } catch {
    // The typed error below still preserves the HTTP status.
  }

  return new ApiError(
    response.status,
    body.error?.code ?? 'UNKNOWN_ERROR',
    body.error?.message ?? 'Request failed',
    response.headers.get('x-request-id') ?? body.error?.requestId,
    body.error?.details ?? [],
    parseRetryAfter(response),
  );
}

async function request<T>(
  path: string,
  options: RequestInit,
  allowRefresh: boolean,
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new NetworkError();
  }

  if (response.ok) {
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  const error = await parseApiError(response);
  if (error.status !== 401 || !allowRefresh || isRefreshExcluded(path)) {
    throw error;
  }

  refreshPromise ??= request<void>(
    '/api/v1/auth/refresh',
    { method: 'POST' },
    false,
  ).finally(() => {
    refreshPromise = undefined;
  });

  try {
    await refreshPromise;
  } catch (refreshError) {
    getQueryClient().setQueryData(['authUser'], null);
    throw refreshError;
  }

  return request<T>(path, options, false);
}

export function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(path, options, true);
}
