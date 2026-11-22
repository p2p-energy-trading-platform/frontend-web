import { env } from '#/env';
import { apiRequest } from '#/lib/api-client';
import { RealtimeClient } from './client';
import { useRealtimeStore } from './store';

let client: RealtimeClient | null | undefined;

/** The socket endpoint: VITE_API_BASE_URL with ws(s) instead of http(s). */
export function realtimeUrl(apiBaseUrl: string): string {
  return `${apiBaseUrl.replace(/\/$/, '').replace(/^http/, 'ws')}/api/v1/ws`;
}

/** The tab's one realtime client, created on first use. Null outside a browser. */
export function getRealtimeClient(): RealtimeClient | null {
  if (client !== undefined) return client;

  if (typeof window === 'undefined') {
    client = null;
    return client;
  }

  const created = new RealtimeClient({
    url: realtimeUrl(env.VITE_API_BASE_URL),
    // apiRequest refreshes an expired access token, so tickets do too.
    getTicket: () =>
      apiRequest<{ ticket: string }>('/api/v1/ws/ticket', {
        method: 'POST',
      }).then((response) => response.ticket),
    onStateChange: (state) => useRealtimeStore.setState({ state }),
  });

  document.addEventListener('visibilitychange', () => {
    created.setVisible(document.visibilityState === 'visible');
  });

  client = created;
  return client;
}
