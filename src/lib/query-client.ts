import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { toast } from '#/components/ui/toast';

interface GlobalApiError {
  status: number;
  code: string;
  requestId?: string;
  retryAfterSeconds?: number;
}

function isNetworkError(error: unknown): boolean {
  return error instanceof Error && error.name === 'NetworkError';
}

function isApiError(error: unknown): error is GlobalApiError {
  return (
    error instanceof Error &&
    'status' in error &&
    typeof error.status === 'number' &&
    'code' in error &&
    typeof error.code === 'string'
  );
}

function showGlobalError(error: unknown): void {
  if (isNetworkError(error)) {
    toast.add({ title: 'Cannot reach the server', type: 'error' });
    return;
  }

  if (!isApiError(error)) {
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

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: showGlobalError }),
  mutationCache: new MutationCache({ onError: showGlobalError }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function getQueryClient(): QueryClient {
  return queryClient;
}
