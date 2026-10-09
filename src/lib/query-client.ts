import {
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';

import { toast } from '#/components/ui/toast';

function showGlobalError(error: unknown): void {
  if (error instanceof Error && error.message === 'Cannot reach the server') {
    toast.add({ title: 'Cannot reach the server', type: 'error' });
    return;
  }

  if (
    !(error instanceof Error) ||
    !('status' in error) ||
    typeof error.status !== 'number'
  ) {
    return;
  }

  const retryAfterSeconds =
    'retryAfterSeconds' in error && typeof error.retryAfterSeconds === 'number'
      ? error.retryAfterSeconds
      : 0;

  if (error.status === 429) {
    toast.add({
      title: `Too many attempts, try again in ${retryAfterSeconds} seconds`,
      type: 'error',
    });
  } else if (error.status === 503 || error.status === 504) {
    toast.add({
      title: 'Service temporarily unavailable, please try again',
      type: 'error',
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
