import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { toast } from '#/components/ui/toast';
import { ApiError, NetworkError } from './api-client';

const GLOBAL_ERROR_MESSAGES: Partial<
  Record<number, (error: ApiError) => string>
> = {
  429: (error) =>
    `Too many attempts, try again in ${error.retryAfterSeconds ?? 0} seconds`,
  503: () => 'Service temporarily unavailable, please try again',
  504: () => 'Service temporarily unavailable, please try again',
};

export const GLOBALLY_HANDLED_STATUSES = Object.keys(GLOBAL_ERROR_MESSAGES).map(
  Number,
);

function showGlobalError(error: unknown): void {
  if (error instanceof NetworkError) {
    toast.add({ title: 'Cannot reach the server', type: 'error' });
    return;
  }

  if (!(error instanceof ApiError)) {
    return;
  }

  const message = GLOBAL_ERROR_MESSAGES[error.status];
  if (message) {
    toast.add({ title: message(error), type: 'error' });
  }

  if (error.status >= 500) {
    console.error('API request failed', {
      code: error.code,
      requestId: error.requestId,
      status: error.status,
    });
  }
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({ onError: showGlobalError }),
    mutationCache: new MutationCache({ onError: showGlobalError }),
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}
