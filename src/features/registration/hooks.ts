import { useMutation } from '@tanstack/react-query';

import { initiateMeterClaim, reverifyRegistration } from './api';

export function useInitiateMeterClaim() {
  return useMutation({
    mutationFn: initiateMeterClaim,
  });
}

export function useReverifyRegistration() {
  return useMutation({
    mutationFn: reverifyRegistration,
  });
}
