import { ApiError } from '#/lib/api-client';

export function formatFieldError(error: unknown): { message: string } {
  return {
    message:
      typeof error === 'string'
        ? error
        : error instanceof Error
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
): Array<{ message: string }> {
  if (!(error instanceof ApiError)) return [];

  // Handle specific conflict mappings
  if (error.status === 409 && fieldName === 'email') {
    return [{ message: error.message }];
  }

  if (error.status !== 400) return [];

  return error.details
    .filter((detail) => detail.path === `/${fieldName}`)
    .map((detail) => ({ message: detail.message }));
}

/**
 * Extracts general form-level errors by ignoring specific field paths that are already handled.
 */
export function getGeneralFormError(
  error: unknown,
  handledFields: string[] = [],
): string | undefined {
  if (!(error instanceof ApiError) || error.status !== 400) return undefined;

  const handledPaths = handledFields.map((field) => `/${field}`);

  const messages = error.details
    .filter((detail) => !handledPaths.includes(detail.path))
    .map((detail) => detail.message);

  return messages.length > 0 ? messages.join(' ') : undefined;
}

export function getRequestIdError(error: unknown): string | undefined {
  if (
    error instanceof ApiError &&
    [500, 502, 503, 504].includes(error.status) &&
    error.requestId
  ) {
    return `Request ID: ${error.requestId}`;
  }
  return undefined;
}
