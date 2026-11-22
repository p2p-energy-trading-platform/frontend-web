import { apiRequest } from '#/lib/api-client';

export interface InitiateMeterClaimRequest {
  meter_id: string;
}

export interface InitiateMeterClaimResponse {
  registration_id: string;
  status: string;
  message: string;
}

export interface ReverifyRegistrationRequest {
  registration_id: string;
  meter_id: string;
}

export interface ReverifyRegistrationResponse {
  registration_id: string;
  meter_id: string;
  message: string;
  status: string;
}

export function initiateMeterClaim(data: InitiateMeterClaimRequest) {
  return apiRequest<InitiateMeterClaimResponse>('/api/v1/registration/claim', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function reverifyRegistration(data: ReverifyRegistrationRequest) {
  return apiRequest<ReverifyRegistrationResponse>(
    '/api/v1/registration/reverify',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}
