import { ApiError, apiRequest } from '#/lib/api-client';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  status: string;
  role: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  status: 'PENDING';
  createdAt: string;
}

export function register(name: string, email: string, password: string) {
  return apiRequest<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function verifyEmail(email: string, otp: string) {
  return apiRequest<{ success: boolean; message: string }>(
    '/api/v1/auth/verify-email',
    {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    },
  );
}

export function resendOtp(email: string) {
  return apiRequest<{ success: boolean }>('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function logout() {
  return apiRequest<void>('/api/v1/auth/logout', { method: 'POST' });
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiRequest<AuthUser>('/api/v1/auth/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export function requestPasswordReset(email: string) {
  return apiRequest<{ success: boolean }>('/api/v1/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ success: boolean }>(
    '/api/v1/auth/password-reset/confirm',
    {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    },
  );
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
}

export function fetchProfile() {
  return apiRequest<UserProfile>('/api/v1/auth/profile');
}

export function updateProfile(name: string) {
  return apiRequest<UserProfile>('/api/v1/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<{ success: boolean }>('/api/v1/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function requestEmailChange(newEmail: string) {
  return apiRequest<{ success: boolean }>('/api/v1/auth/email-change', {
    method: 'POST',
    body: JSON.stringify({ newEmail }),
  });
}

export function verifyEmailChange(token: string) {
  return apiRequest<UserProfile>('/api/v1/auth/email-change/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}
