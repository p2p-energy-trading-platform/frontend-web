import { apiRequest } from '#/lib/api-client';

export interface InitiateMeterClaimRequest {
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
    '/api/v1/registration/claim',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}