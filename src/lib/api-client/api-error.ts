export interface ApiErrorDetail {
  location: string;
  path: string;
  message: string;
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
