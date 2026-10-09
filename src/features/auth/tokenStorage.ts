import type { LoginResponse } from './api';

export interface AuthSession {
  userId: string;
  email: string;
  expiresAt: number;
}

let accessToken: string | undefined;
let session: AuthSession | undefined;

// The refresh token is kept in sessionStorage for now; this single boundary can later be replaced with an httpOnly cookie.
const REFRESH_TOKEN_KEY = 'gridx.refreshToken';

export function storeSession(response: LoginResponse): void {
  accessToken = response.accessToken;
  session = {
    userId: response.userId,
    email: response.email,
    expiresAt: Date.now() + response.expiresIn * 1000,
  };
  sessionStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
}

export function getAccessToken(): string | undefined {
  return accessToken;
}

export function getSession(): AuthSession | undefined {
  return session;
}
