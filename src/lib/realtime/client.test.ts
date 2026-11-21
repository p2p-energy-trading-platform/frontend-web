import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, NetworkError } from '#/lib/api-client';
import { RealtimeClient } from './client';
import type { RealtimeState, SocketLike, TopicMessage } from './client';

vi.mock('#/env', () => ({
  env: { VITE_API_BASE_URL: 'http://api.test' },
}));

class FakeSocket implements SocketLike {
  readyState = 0;
  sent: Array<Record<string, unknown>> = [];
  closedWith: number | undefined;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onclose: ((event: { code: number }) => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(readonly url: string) {}

  send(data: string) {
    this.sent.push(JSON.parse(data) as Record<string, unknown>);
  }

  close(code = 1000) {
    if (this.readyState === 3) return;
    this.closedWith = code;
    this.readyState = 3;
    queueMicrotask(() => this.onclose?.({ code }));
  }

  // Test controls
  open() {
    this.readyState = 1;
    this.onopen?.();
  }

  receive(message: unknown) {
    this.onmessage?.({
      data: typeof message === 'string' ? message : JSON.stringify(message),
    });
  }

  drop(code = 1006) {
    this.readyState = 3;
    this.onclose?.({ code });
  }
}

function setup(
  getTicket: () => Promise<string> = () => Promise.resolve('ticket-1'),
) {
  const sockets: Array<FakeSocket> = [];
  const states: Array<RealtimeState> = [];
  const client = new RealtimeClient({
    url: 'ws://api.test/api/v1/ws',
    getTicket,
    createSocket: (url) => {
      const socket = new FakeSocket(url);
      sockets.push(socket);
      return socket;
    },
    onStateChange: (state) => states.push(state),
    random: () => 1,
    log: () => {},
  });
  const latest = () => {
    const socket = sockets.at(-1);
    if (!socket) throw new Error('no socket');
    return socket;
  };
  return { client, sockets, states, latest };
}

const flush = () => vi.advanceTimersByTimeAsync(0);

function subscribedReply(socket: FakeSocket, topic: string) {
  const request = socket.sent.find(
    (m) => m.type === 'subscribe' && m.topic === topic,
  );
  socket.receive({
    type: 'subscribed',
    id: request?.id,
    topic,
    version: 1,
    timestamp: '2026-11-20T09:30:00.000Z',
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('RealtimeClient connecting', () => {
  it('connects with a ticket on the first subscriber and subscribes', async () => {
    const { client, sockets, latest, states } = setup();

    client.subscribe('iot.house.h1', () => {});
    await flush();

    expect(sockets).toHaveLength(1);
    expect(latest().url).toBe('ws://api.test/api/v1/ws?ticket=ticket-1');
    expect(states).toEqual(['connecting']);

    latest().open();
    expect(latest().sent).toEqual([
      { type: 'subscribe', id: expect.any(String), topic: 'iot.house.h1' },
    ]);
    expect(client.state).toBe('live');
  });

  it('subscribes once per topic however many listeners it has', async () => {
    const { client, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    expect(latest().sent.filter((m) => m.type === 'subscribe')).toHaveLength(1);
  });

  it('subscribes a topic added while the socket is open', async () => {
    const { client, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    client.subscribe('iot.house.h2', () => {});

    expect(latest().sent.map((m) => m.topic)).toEqual([
      'iot.house.h1',
      'iot.house.h2',
    ]);
  });

  it('unsubscribes when the last listener leaves, and closes when nothing is left', async () => {
    const { client, latest } = setup();
    const stopA = client.subscribe('iot.house.h1', () => {});
    const stopB = client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    stopA();
    expect(latest().sent.some((m) => m.type === 'unsubscribe')).toBe(false);

    stopB();
    expect(latest().sent.at(-1)).toMatchObject({
      type: 'unsubscribe',
      topic: 'iot.house.h1',
    });
    expect(latest().closedWith).toBe(1000);
    await flush();
    expect(client.state).toBe('idle');
  });

  it('does not open a socket when the last listener left before the ticket arrived', async () => {
    let resolveTicket!: (ticket: string) => void;
    const { client, sockets } = setup(
      () => new Promise((resolve) => (resolveTicket = resolve)),
    );
    const stop = client.subscribe('iot.house.h1', () => {});
    stop();

    resolveTicket('late');
    await flush();

    expect(sockets).toHaveLength(0);
  });
});

describe('RealtimeClient messages', () => {
  it('delivers subscribed, events and errors to the topic’s listeners only', async () => {
    const { client, latest } = setup();
    const h1: Array<TopicMessage> = [];
    const h2: Array<TopicMessage> = [];
    client.subscribe('iot.house.h1', (m) => h1.push(m));
    client.subscribe('iot.house.h2', (m) => h2.push(m));
    await flush();
    latest().open();

    subscribedReply(latest(), 'iot.house.h1');
    latest().receive({
      type: 'event',
      topic: 'iot.house.h1',
      event: 'reading',
      version: 1,
      timestamp: '2026-11-20T09:30:05.000Z',
      payload: { seq: 1 },
    });
    const h2Request = latest().sent.find((m) => m.topic === 'iot.house.h2');
    latest().receive({
      type: 'error',
      id: h2Request?.id,
      code: 'TOPIC_NOT_ALLOWED',
      message: 'You cannot subscribe to this topic.',
      timestamp: '2026-11-20T09:30:00.000Z',
    });

    expect(h1).toEqual([
      { kind: 'subscribed' },
      { kind: 'event', event: 'reading', payload: { seq: 1 } },
    ]);
    expect(h2).toEqual([{ kind: 'error', code: 'TOPIC_NOT_ALLOWED' }]);
  });

  it.each([
    ['not JSON', 'hello'],
    ['an unknown type', { type: 'surprise' }],
    ['an event without a topic', { type: 'event', event: 'reading' }],
  ])('ignores %s', async (_name, message) => {
    const { client, latest } = setup();
    const seen: Array<TopicMessage> = [];
    client.subscribe('iot.house.h1', (m) => seen.push(m));
    await flush();
    latest().open();

    latest().receive(message);

    expect(seen).toEqual([]);
    expect(client.state).toBe('live');
  });

  it('retries a subscription the server could not check yet', async () => {
    const { client, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();
    const first = latest().sent[0];

    latest().receive({
      type: 'error',
      id: first.id,
      code: 'TOPIC_UNAVAILABLE',
      message: 'Try again later.',
      timestamp: '2026-11-20T09:30:00.000Z',
    });
    expect(latest().sent).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(5_000);
    expect(latest().sent).toHaveLength(2);
    expect(latest().sent[1]).toMatchObject({
      type: 'subscribe',
      topic: 'iot.house.h1',
    });
  });
});

describe('RealtimeClient reconnecting', () => {
  it('reconnects with backoff and a new ticket, then resubscribes', async () => {
    let n = 0;
    const { client, sockets, latest } = setup(() =>
      Promise.resolve(`ticket-${++n}`),
    );
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    latest().drop(1006);
    await flush();
    expect(client.state).toBe('reconnecting');

    // Full jitter: random() = 1 gives the whole first delay of 1 s.
    await vi.advanceTimersByTimeAsync(999);
    expect(sockets).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(sockets).toHaveLength(2);
    expect(latest().url).toContain('ticket=ticket-2');

    latest().open();
    expect(latest().sent).toMatchObject([
      { type: 'subscribe', topic: 'iot.house.h1' },
    ]);
    expect(client.state).toBe('live');
  });

  it('doubles the delay after each failed attempt, up to 30 s', async () => {
    const { client, sockets, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();

    const delays: Array<number> = [];
    for (let i = 0; i < 7; i += 1) {
      latest().drop(1006);
      const before = sockets.length;
      let waited = 0;
      while (sockets.length === before) {
        await vi.advanceTimersByTimeAsync(500);
        waited += 500;
      }
      delays.push(waited);
    }

    expect(delays).toEqual([1000, 2000, 4000, 8000, 16000, 30000, 30000]);
  });

  it('starts the backoff again after a connection succeeded', async () => {
    const { client, sockets, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().drop(1006);
    await vi.advanceTimersByTimeAsync(1_000);
    latest().drop(1006);
    await vi.advanceTimersByTimeAsync(2_000);
    expect(sockets).toHaveLength(3);

    latest().open();
    latest().drop(1006);
    await vi.advanceTimersByTimeAsync(1_000);

    expect(sockets).toHaveLength(4);
  });

  it('reconnects at once when asked to reauthenticate (4001)', async () => {
    const { client, sockets, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    latest().drop(4001);
    await flush();

    expect(sockets).toHaveLength(2);
  });

  it('waits at least 5 s after a policy close (1008)', async () => {
    const { client, sockets, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    latest().drop(1008);
    await vi.advanceTimersByTimeAsync(4_999);
    expect(sockets).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(sockets).toHaveLength(2);
  });

  it('stops when the ticket request says the user is signed out', async () => {
    const { client, sockets } = setup(() =>
      Promise.reject(
        new ApiError(
          401,
          'UNAUTHENTICATED',
          'Sign in.',
          undefined,
          [],
          undefined,
        ),
      ),
    );
    client.subscribe('iot.house.h1', () => {});
    await flush();
    await vi.advanceTimersByTimeAsync(60_000);

    expect(sockets).toHaveLength(0);
    expect(client.state).toBe('offline');
  });

  it('connects again when the user signs back in without a page reload', async () => {
    let signedIn = false;
    const { client, sockets, latest } = setup(() =>
      signedIn
        ? Promise.resolve('ticket-after-sign-in')
        : Promise.reject(
            new ApiError(
              401,
              'UNAUTHENTICATED',
              'Sign in.',
              undefined,
              [],
              undefined,
            ),
          ),
    );
    // The session expired: the ticket request is refused.
    const leave = client.subscribe('iot.house.h1', () => {});
    await flush();
    expect(client.state).toBe('offline');

    // The app sends the user to sign in, which unmounts the signed-in layout.
    leave();
    signedIn = true;
    // After signing in, the dashboard mounts and watches the house again.
    client.subscribe('iot.house.h1', () => {});
    await flush();

    expect(sockets).toHaveLength(1);
    expect(latest().url).toContain('ticket=ticket-after-sign-in');
  });

  it('waits for Retry-After when ticket requests are rate limited', async () => {
    let calls = 0;
    const { client, sockets } = setup(() => {
      calls += 1;
      return calls === 1
        ? Promise.reject(
            new ApiError(429, 'RATE_LIMITED', 'Slow down.', undefined, [], 12),
          )
        : Promise.resolve('ticket-2');
    });
    client.subscribe('iot.house.h1', () => {});
    await flush();

    await vi.advanceTimersByTimeAsync(11_999);
    expect(sockets).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(1);
    expect(sockets).toHaveLength(1);
  });

  it('retries with backoff when the ticket request cannot reach the server', async () => {
    let calls = 0;
    const { client, sockets } = setup(() => {
      calls += 1;
      return calls === 1
        ? Promise.reject(new NetworkError())
        : Promise.resolve('ticket-2');
    });
    client.subscribe('iot.house.h1', () => {});
    await flush();
    expect(client.state).toBe('reconnecting');

    await vi.advanceTimersByTimeAsync(1_000);
    expect(sockets).toHaveLength(1);
  });
});

describe('RealtimeClient visibility', () => {
  it('closes after a minute in the background and reconnects when visible', async () => {
    const { client, sockets, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    client.setVisible(false);
    await vi.advanceTimersByTimeAsync(59_999);
    expect(latest().closedWith).toBeUndefined();
    await vi.advanceTimersByTimeAsync(1);
    expect(latest().closedWith).toBe(1000);
    await flush();
    expect(client.state).toBe('paused');
    await vi.advanceTimersByTimeAsync(120_000);
    expect(sockets).toHaveLength(1);

    client.setVisible(true);
    await flush();
    expect(sockets).toHaveLength(2);
    latest().open();
    expect(latest().sent).toMatchObject([{ type: 'subscribe' }]);
  });

  it('keeps the socket when the tab comes back within the minute', async () => {
    const { client, sockets, latest } = setup();
    client.subscribe('iot.house.h1', () => {});
    await flush();
    latest().open();

    client.setVisible(false);
    await vi.advanceTimersByTimeAsync(30_000);
    client.setVisible(true);
    await vi.advanceTimersByTimeAsync(120_000);

    expect(latest().closedWith).toBeUndefined();
    expect(sockets).toHaveLength(1);
  });
});
