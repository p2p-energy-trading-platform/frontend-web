import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { toast } from '#/components/ui/toast';
import { ApiError, NetworkError } from './api-client';

function showGlobalError(error: unknown): void {
  if (error instanceof NetworkError) {
    toast.add({ title: 'Cannot reach the server', type: 'error' });
    return;
  }

  if (!(error instanceof ApiError)) {
    return;
  }

  if (error.status === 429) {
    toast.add({
      title: `Too many attempts, try again in ${error.retryAfterSeconds ?? 0} seconds`,
      type: 'error',
    });
  } else if (error.status === 503 || error.status === 504) {
    toast.add({
      title: 'Service temporarily unavailable, please try again',
      type: 'error',
    });
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
