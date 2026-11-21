import type { Page, WebSocketRoute } from '@playwright/test';

import { expect, test } from './fixtures';
import type { MockApi } from './fixtures';
import { HOUSE_ID, mockIot, testHouse } from './iot-fixtures';

const TOPIC = `iot.house.${HOUSE_ID}`;

interface FakeGateway {
  /** Every socket the app opened, newest last. */
  sockets: Array<WebSocketRoute>;
  /** Every message the app sent, across sockets. */
  received: Array<Record<string, unknown>>;
}

/*
 * Plays the gateway's WebSocket: hands out tickets, answers subscribe with
 * subscribed, and lets the test push events.
 */
async function fakeGateway(page: Page, api: MockApi): Promise<FakeGateway> {
  let tickets = 0;
  api.on('POST', '/api/v1/ws/ticket', () => {
    tickets += 1;
    return {
      status: 201,
      body: { ticket: String(tickets).padStart(43, 't'), expiresIn: 30 },
    };
  });

  const gateway: FakeGateway = { sockets: [], received: [] };
  // Only the gateway's socket, not the dev server's own (HMR) socket.
  await page.routeWebSocket(
    (url) => url.port === '8000' && url.pathname === '/api/v1/ws',
    (ws) => {
      gateway.sockets.push(ws);
      ws.onMessage((raw) => {
        const message = JSON.parse(String(raw)) as Record<string, unknown>;
        gateway.received.push(message);
        if (message.type === 'subscribe') {
          ws.send(
            JSON.stringify({
              type: 'subscribed',
              id: message.id,
              topic: message.topic,
              version: 1,
              timestamp: new Date().toISOString(),
            }),
          );
        }
      });
    },
  );
  return gateway;
}

function sendEvent(
  ws: WebSocketRoute | undefined,
  event: string,
  payload: unknown,
) {
  if (!ws) throw new Error('the app has not opened a socket');
  ws.send(
    JSON.stringify({
      type: 'event',
      topic: TOPIC,
      event,
      version: 1,
      timestamp: new Date().toISOString(),
      payload,
    }),
  );
}

function liveReading(seq: number, solarKw: number) {
  return {
    meterId: testHouse.meterId,
    measuredAt: new Date(Date.now() + seq * 1000).toISOString(),
    seq,
    solarKw,
    consumptionKw: 1.6,
    netKw: 2.1,
    storageAssets: [
      {
        assetId: 'bess-1',
        assetType: 'bess',
        socPct: 72,
        powerKw: 0.5,
        capacityKwh: 10,
      },
    ],
  };
}

/*
 * Opens the dashboard and waits until it is live and its REST resync after
 * subscribing has finished, so later events are not overwritten by the
 * (always "online") mock responses. The first visit after the dev server
 * starts compiles the app, hence the longer wait.
 */
async function openLiveDashboard(page: Page, api: MockApi) {
  await page.goto('/dashboard');
  await expect(page.getByLabel('Live updates: Live')).toBeVisible({
    timeout: 20_000,
  });
  await expect
    .poll(
      () => api.requests.filter((r) => r.path === '/api/v1/iot/houses').length,
    )
    .toBeGreaterThanOrEqual(2);
  await page.waitForLoadState('networkidle');
}

test.describe('IoT live updates', () => {
  test.beforeEach(({ api }) => {
    api.signIn();
    mockIot(api);
  });

  test('the dashboard subscribes to the house and shows live readings without a reload', async ({
    page,
    api,
  }) => {
    const gateway = await fakeGateway(page, api);
    await openLiveDashboard(page, api);
    expect(gateway.received).toContainEqual(
      expect.objectContaining({ type: 'subscribe', topic: TOPIC }),
    );
    await expect(page.getByText('4.2 kW').first()).toBeVisible();

    sendEvent(gateway.sockets.at(-1), 'reading', liveReading(100, 3.3));

    await expect(page.getByText('3.3 kW').first()).toBeVisible();
    expect(
      api.requests.filter((r) => r.path.endsWith('/latest-reading')).length,
    ).toBeLessThanOrEqual(2); // the first load and the resync after subscribing
  });

  test('the header shows the meter going offline and back online', async ({
    page,
    api,
  }) => {
    const gateway = await fakeGateway(page, api);
    await openLiveDashboard(page, api);
    await expect(page.getByText('Meter online')).toBeVisible();

    sendEvent(gateway.sockets.at(-1), 'status', { meterStatus: 'offline' });
    await expect(page.getByText('Meter offline')).toBeVisible();

    sendEvent(gateway.sockets.at(-1), 'status', {
      meterStatus: 'online',
      lastHeartbeatAt: new Date().toISOString(),
    });
    await expect(page.getByText('Meter online')).toBeVisible();
  });

  test('shows when the gateway’s feed is interrupted', async ({
    page,
    api,
  }) => {
    const gateway = await fakeGateway(page, api);
    await openLiveDashboard(page, api);

    sendEvent(gateway.sockets.at(-1), 'stream-state', { state: 'interrupted' });
    await expect(page.getByLabel('Live updates: Reconnecting')).toBeVisible();

    sendEvent(gateway.sockets.at(-1), 'stream-state', { state: 'live' });
    await expect(page.getByLabel('Live updates: Live')).toBeVisible();
  });

  test('reconnects with a new ticket when the gateway asks to reauthenticate', async ({
    page,
    api,
  }) => {
    const gateway = await fakeGateway(page, api);
    await openLiveDashboard(page, api);

    await gateway.sockets
      .at(-1)
      ?.close({ code: 4001, reason: 'Reauthenticate' });

    await expect.poll(() => gateway.sockets.length).toBe(2);
    await expect
      .poll(() => gateway.received.filter((m) => m.type === 'subscribe').length)
      .toBe(2);
    expect(
      api.requests.filter((r) => r.path === '/api/v1/ws/ticket'),
    ).toHaveLength(2);
    await expect(page.getByLabel('Live updates: Live')).toBeVisible();

    sendEvent(gateway.sockets.at(-1), 'reading', liveReading(200, 5.5));
    await expect(page.getByText('5.5 kW').first()).toBeVisible();
  });

  test('without a socket the app still shows the REST data', async ({
    page,
    api,
  }) => {
    api.on('POST', '/api/v1/ws/ticket', {
      status: 503,
      body: { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'Down.' } },
    });
    await page.goto('/dashboard');

    await expect(page.getByText('4.2 kW').first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.getByLabel(/Live updates: (Connecting|Reconnecting)/),
    ).toBeVisible();
    await expect(page.getByText('Service temporarily unavailable')).toHaveCount(
      0,
    );
  });
});
