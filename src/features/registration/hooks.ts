import { useMutation } from '@tanstack/react-query';

import { initiateMeterClaim } from './api';

export function useInitiateMeterClaim() {
  return useMutation({
    mutationFn: initiateMeterClaim,
  });
}