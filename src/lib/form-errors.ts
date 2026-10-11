import { ApiError, NetworkError } from '#/lib/api-client';
import { GLOBALLY_HANDLED_STATUSES } from '#/lib/query-client';

export interface FormErrorOptions {
  conflictField?: string;
}

export function formatFieldError(error: unknown): { message: string } {
  return {
    message:
      typeof error === 'string'
        ? error
        : error instanceof Error
          ? error.message
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
            ? error.message
            : '',
  };
}

/**
 * Extracts field-specific errors from a 400 Bad Request or 409 Conflict API error.
 */
export function getApiFieldErrors(
  error: unknown,
  fieldName: string,
  options: FormErrorOptions = {},
): Array<{ message: string }> {
  if (!(error instanceof ApiError)) return [];

  if (error.status === 409 && options.conflictField === fieldName) {
    return [{ message: error.message }];
  }

  if (error.status !== 400) return [];

  return error.details
    .filter((detail) => detail.path === `/${fieldName}`)
    .map((detail) => ({ message: detail.message }));
}

/**
 * Extracts a general form error message from an API error, excluding field-specific errors.
 * Returns undefined if the error is not an ApiError or if it is a globally handled status.
 */
export function getGeneralFormError(
  error: unknown,
  handledFields: string[] = [],
  options: FormErrorOptions = {},
): string | undefined {
  if (!(error instanceof Error) || error instanceof NetworkError) {
    return undefined;
  }

  if (!(error instanceof ApiError)) return error.message || undefined;

  if (GLOBALLY_HANDLED_STATUSES.includes(error.status)) return undefined;

  if (
    error.status === 409 &&
    options.conflictField !== undefined &&
    handledFields.includes(options.conflictField)
  ) {
    return undefined;
  }

  if (error.status === 400 && error.details.length > 0) {
    const handledPaths = handledFields.map((field) => `/${field}`);
    const messages = error.details
      .filter((detail) => !handledPaths.includes(detail.path))
      .map((detail) => detail.message);

    return messages.length > 0 ? messages.join(' ') : undefined;
  }

  return error.message;
}

export function getRequestIdError(error: unknown): string | undefined {
  if (error instanceof ApiError && error.status >= 500 && error.requestId) {
    return `Request ID: ${error.requestId}`;
  }
  return undefined;
}
