import { apiRequest } from '#/lib/api-client';

export interface InitiateMeterClaimRequest {
  user_reference: string;
  meter_id: string;
}

export interface InitiateMeterClaimResponse {
  registration_id: string;
  status: string;
  message: string;
}

export function initiateMeterClaim(
  data: InitiateMeterClaimRequest,
) {
  return apiRequest<InitiateMeterClaimResponse>(
    '/registration/claim',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}