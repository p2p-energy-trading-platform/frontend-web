import { test as base, expect } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

export const APP_ORIGIN = 'http://localhost:3000';
export const API_BASE_URL = 'http://localhost:8000';

export interface MockUser {
  userId: string;
  email: string;
  name: string;
  status: string;
  role: string;
}

export const testUser: MockUser = {
  userId: '00000000-0000-4000-8000-000000000001',
  email: 'aisha@example.com',
  name: 'Aisha Rahman',
  status: 'ACTIVE',
  role: 'USER',
};

export interface MockResponse {
  status?: number;
  body?: unknown;
}

type MockHandler = (route: Route) => MockResponse | Promise<MockResponse>;


export function apiError(
  status: number,
  code: string,
  message: string,
): MockResponse {
  return { status, body: { error: { code, message, details: [] } } };
}


export class MockApi {
  private user: MockUser | null = null;
  private readonly handlers = new Map<string, MockHandler>();
  readonly requests: Array<{ method: string; path: string; body: unknown }> =
    [];

  constructor(private readonly page: Page) {}

  async install(): Promise<void> {
    await this.page.route(`${API_BASE_URL}/api/**`, (route) =>
      this.handle(route),
    );
  }

  signIn(user: MockUser = testUser): void {
    this.user = user;
  }

  signOut(): void {
    this.user = null;
  }

 
  on(method: string, path: string, handler: MockHandler | MockResponse): void {
    this.handlers.set(
      `${method} ${path}`,
      typeof handler === 'function' ? handler : () => handler,
    );
  }

  private async handle(route: Route): Promise<void> {
    const request = route.request();
    const method = request.method();
    const path = new URL(request.url()).pathname;

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: await corsHeaders(request) });
      return;
    }

    this.requests.push({ method, path, body: request.postDataJSON() });

    const handler = this.handlers.get(`${method} ${path}`);
    const response = handler
      ? await handler(route)
      : this.defaultResponse(method, path);

    await route.fulfill({
      status: response.status ?? 200,
      headers: await corsHeaders(request),
      contentType: 'application/json',
      body: response.body === undefined ? '' : JSON.stringify(response.body),
    });
  }

  private defaultResponse(method: string, path: string): MockResponse {
    switch (`${method} ${path}`) {
      case 'GET /api/v1/auth/me':
        return this.user
          ? { body: this.user }
          : apiError(401, 'UNAUTHENTICATED', 'Authentication required.');
      case 'POST /api/v1/auth/refresh':
        return this.user
          ? { status: 204 }
          : apiError(401, 'UNAUTHENTICATED', 'Authentication required.');
      case 'POST /api/v1/auth/logout':
        this.user = null;
        return { status: 204 };
      default:
        return apiError(404, 'NOT_FOUND', `No mock for ${method} ${path}`);
    }
  }
}

async function corsHeaders(request: ReturnType<Route['request']>) {
  return {
    'access-control-allow-origin':
      (await request.headerValue('origin')) ?? APP_ORIGIN,
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type',
  };
}

// `auto` installs the mock for every test, so no test can reach a real backend.
export const test = base.extend<{ api: MockApi }>({
  api: [
    async ({ page }, use) => {
      const api = new MockApi(page);
      await api.install();
      await use(api);
    },
    { auto: true },
  ],
});

export { expect };
