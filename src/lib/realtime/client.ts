import { ApiError } from '#/lib/api-client';
import { serverMessageSchema } from './schemas';

/**
 * - idle: nothing to watch
 * - connecting / reconnecting: getting a ticket or opening the socket
 * - live: connected
 * - paused: closed while the tab is in the background
 * - offline: signed out; a new subscription (after signing in) starts again
 */
export type RealtimeState =
  'idle' | 'connecting' | 'live' | 'reconnecting' | 'paused' | 'offline';

export type TopicMessage =
  | { kind: 'subscribed' }
  | { kind: 'event'; event: string; payload: unknown }
  | { kind: 'error'; code: string };

export type TopicListener = (message: TopicMessage) => void;

/** The part of the browser WebSocket the client uses. */
export interface SocketLike {
  readonly readyState: number;
  send: (data: string) => void;
  close: (code?: number) => void;
  onopen: (() => void) | null;
  onmessage: ((event: { data: unknown }) => void) | null;
  onclose: ((event: { code: number }) => void) | null;
  onerror: (() => void) | null;
}

export interface RealtimeClientOptions {
  /** The socket endpoint, for example ws://localhost:8000/api/v1/ws. */
  url: string;
  getTicket: () => Promise<string>;
  createSocket?: (url: string) => SocketLike;
  onStateChange?: (state: RealtimeState) => void;
  random?: () => number;
  log?: (message: string, details?: unknown) => void;
}

const OPEN = 1;
const MIN_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const POLICY_BACKOFF_MS = 5_000;
const TOPIC_RETRY_MS = 5_000;
const HIDDEN_CLOSE_MS = 60_000;

const CLOSE = {
  NORMAL: 1000,
  POLICY: 1008,
  REAUTHENTICATE: 4001,
} as const;

/*
 * One WebSocket to the gateway, shared by every listener in the tab. It
 * connects when the first topic is watched, resubscribes after every
 * reconnect, and closes when nothing is watched. Socket problems never throw
 * or toast: listeners just stop receiving events until it reconnects, and
 * after each `subscribed` they resync over REST.
 */
export class RealtimeClient {
  private readonly listeners = new Map<string, Set<TopicListener>>();
  // Subscribe request IDs, so an error reply can be matched to its topic.
  private readonly requests = new Map<string, string>();
  private readonly topicRetries = new Map<string, number>();
  private readonly topicTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  private socket: SocketLike | null = null;
  private connecting = false;
  private attempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  private hiddenTimer: ReturnType<typeof setTimeout> | undefined;
  private paused = false;
  private signedOut = false;
  private nextId = 0;
  private currentState: RealtimeState = 'idle';

  private readonly createSocket: (url: string) => SocketLike;
  private readonly random: () => number;
  private readonly log: (message: string, details?: unknown) => void;

  constructor(private readonly options: RealtimeClientOptions) {
    this.createSocket =
      options.createSocket ?? ((url) => new WebSocket(url) as SocketLike);
    this.random = options.random ?? Math.random;
    this.log =
      options.log ??
      ((message, details) => console.debug(`[realtime] ${message}`, details));
  }

  get state(): RealtimeState {
    return this.currentState;
  }

  /** Listens to a topic until the returned function is called. */
  subscribe(topic: string, listener: TopicListener): () => void {
    let set = this.listeners.get(topic);
    const isNew = set === undefined;

    if (set === undefined) {
      set = new Set();
      this.listeners.set(topic, set);
    }
    set.add(listener);

    if (isNew) {
      // Signing in again remounts the app's listeners, so a new topic means
      // the user may be back: try again instead of staying offline.
      this.signedOut = false;
      if (this.socket?.readyState === OPEN) {
        this.sendSubscribe(topic);
      } else {
        this.ensureConnecting();
      }
    }

    return () => this.removeListener(topic, listener);
  }

  /** Closes the socket after a minute in the background; reconnects when visible. */
  setVisible(visible: boolean): void {
    if (!visible) {
      this.hiddenTimer ??= setTimeout(() => {
        this.hiddenTimer = undefined;
        this.paused = true;
        this.clearReconnect();
        this.closeSocket('paused');
      }, HIDDEN_CLOSE_MS);
      return;
    }

    clearTimeout(this.hiddenTimer);
    this.hiddenTimer = undefined;

    if (this.paused) {
      this.paused = false;
      if (this.listeners.size > 0) {
        this.ensureConnecting();
      } else {
        this.setState('idle');
      }
    }
  }

  private removeListener(topic: string, listener: TopicListener): void {
    const set = this.listeners.get(topic);
    if (!set?.delete(listener) || set.size > 0) return;

    this.listeners.delete(topic);
    clearTimeout(this.topicTimers.get(topic));
    this.topicTimers.delete(topic);
    this.topicRetries.delete(topic);

    if (this.socket?.readyState === OPEN) {
      this.send({ type: 'unsubscribe', id: this.newId(), topic });
    }

    if (this.listeners.size === 0) {
      this.clearReconnect();
      this.closeSocket(
        this.signedOut ? 'offline' : this.paused ? 'paused' : 'idle',
      );
    }
  }

  private ensureConnecting(): void {
    if (
      this.signedOut ||
      this.paused ||
      this.socket !== null ||
      this.connecting ||
      this.reconnectTimer !== undefined
    ) {
      return;
    }
    void this.connect();
  }

  private async connect(): Promise<void> {
    this.connecting = true;
    this.setState(this.attempt > 0 ? 'reconnecting' : 'connecting');

    let ticket: string;
    try {
      ticket = await this.options.getTicket();
    } catch (error) {
      this.connecting = false;
      this.onTicketError(error);
      return;
    }
    this.connecting = false;

    if (this.signedOut || this.paused || this.listeners.size === 0) {
      return;
    }

    const socket = this.createSocket(
      `${this.options.url}?ticket=${encodeURIComponent(ticket)}`,
    );
    this.socket = socket;

    socket.onopen = () => {
      if (socket !== this.socket) return;
      this.attempt = 0;
      this.setState('live');
      for (const topic of this.listeners.keys()) {
        this.sendSubscribe(topic);
      }
    };
    socket.onmessage = (event) => {
      if (socket === this.socket) this.handleMessage(event.data);
    };
    socket.onclose = (event) => {
      if (socket !== this.socket) return;
      this.socket = null;
      this.requests.clear();
      this.scheduleReconnect(this.closeDelay(event.code));
    };
    socket.onerror = () => {
      // A close event always follows; reconnecting happens there.
    };
  }

  private onTicketError(error: unknown): void {
    if (error instanceof ApiError && error.status === 401) {
      // Still unauthenticated after the token refresh: the user is signed out.
      this.signedOut = true;
      this.setState('offline');
      return;
    }

    if (
      error instanceof ApiError &&
      error.status === 429 &&
      error.retryAfterSeconds !== undefined
    ) {
      this.scheduleReconnect(error.retryAfterSeconds * 1_000);
      return;
    }

    this.log('ticket request failed', error);
    this.scheduleReconnect(this.backoff());
  }

  private closeDelay(code: number): number {
    if (code === CLOSE.REAUTHENTICATE) return 0;
    if (code === CLOSE.POLICY)
      return Math.max(POLICY_BACKOFF_MS, this.backoff());
    return this.backoff();
  }

  /** Full jitter: anywhere between 0 and the doubling cap. */
  private backoff(): number {
    const cap = Math.min(MAX_BACKOFF_MS, MIN_BACKOFF_MS * 2 ** this.attempt);
    return Math.round(this.random() * cap);
  }

  private scheduleReconnect(delayMs: number): void {
    if (this.signedOut || this.paused || this.listeners.size === 0) {
      this.setState(
        this.signedOut ? 'offline' : this.paused ? 'paused' : 'idle',
      );
      return;
    }

    this.attempt += 1;
    this.setState('reconnecting');
    this.clearReconnect();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      void this.connect();
    }, delayMs);
  }

  private clearReconnect(): void {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;
  }

  private closeSocket(next: RealtimeState): void {
    const socket = this.socket;
    this.socket = null;
    this.requests.clear();

    if (socket !== null) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.close(CLOSE.NORMAL);
    }

    this.setState(next);
  }

  private handleMessage(data: unknown): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(String(data));
    } catch {
      this.log('ignored a message that is not JSON');
      return;
    }

    const result = serverMessageSchema.safeParse(parsed);
    if (!result.success) {
      this.log('ignored an invalid message', result.error.issues);
      return;
    }

    const message = result.data;
    switch (message.type) {
      case 'subscribed':
        this.requests.delete(message.id);
        this.topicRetries.delete(message.topic);
        this.emit(message.topic, { kind: 'subscribed' });
        break;
      case 'unsubscribed':
        this.requests.delete(message.id);
        break;
      case 'event':
        this.emit(message.topic, {
          kind: 'event',
          event: message.event,
          payload: message.payload,
        });
        break;
      case 'error': {
        const topic =
          message.id === undefined ? undefined : this.requests.get(message.id);
        if (message.id !== undefined) this.requests.delete(message.id);
        if (topic === undefined) {
          this.log('gateway error', message);
          break;
        }
        if (message.code === 'TOPIC_UNAVAILABLE') {
          this.retryTopic(topic);
          break;
        }
        this.emit(topic, { kind: 'error', code: message.code });
        break;
      }
    }
  }

  /** The server could not check the topic yet: try again, backing off. */
  private retryTopic(topic: string): void {
    const tries = this.topicRetries.get(topic) ?? 0;
    this.topicRetries.set(topic, tries + 1);
    const cap = Math.min(MAX_BACKOFF_MS, TOPIC_RETRY_MS * 2 ** tries);
    const delay = Math.round(cap / 2 + (this.random() * cap) / 2);

    clearTimeout(this.topicTimers.get(topic));
    this.topicTimers.set(
      topic,
      setTimeout(() => {
        this.topicTimers.delete(topic);
        if (this.listeners.has(topic) && this.socket?.readyState === OPEN) {
          this.sendSubscribe(topic);
        }
      }, delay),
    );
  }

  private emit(topic: string, message: TopicMessage): void {
    for (const listener of this.listeners.get(topic) ?? []) {
      try {
        listener(message);
      } catch (error) {
        this.log('a listener failed', error);
      }
    }
  }

  private sendSubscribe(topic: string): void {
    const id = this.newId();
    this.requests.set(id, topic);
    this.send({ type: 'subscribe', id, topic });
  }

  private send(message: Record<string, unknown>): void {
    this.socket?.send(JSON.stringify(message));
  }

  private newId(): string {
    this.nextId += 1;
    return `m${this.nextId}`;
  }

  private setState(state: RealtimeState): void {
    if (state === this.currentState) return;
    this.currentState = state;
    this.options.onStateChange?.(state);
  }
}
