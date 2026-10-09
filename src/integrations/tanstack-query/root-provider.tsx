import { createQueryClient } from '#/lib/query-client';

export function getContext() {
  return {
    queryClient: createQueryClient(),
  };
}
export default function TanstackQueryProvider() {}
