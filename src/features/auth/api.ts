import { ApiError, apiRequest } from '#/lib/api-client';

export interface AuthUser {
  userId: string;
  email: string;
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
