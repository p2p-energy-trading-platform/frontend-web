import { z } from 'zod';

// Messages from the gateway (api-gateway docs/websocket-protocol.md). Unknown
// fields are ignored, so the gateway can add fields without breaking clients.
const subscribed = z.object({
  type: z.literal('subscribed'),
  id: z.string(),
  topic: z.string(),
});

const unsubscribed = z.object({
  type: z.literal('unsubscribed'),
  id: z.string(),
  topic: z.string(),
});

const event = z.object({
  type: z.literal('event'),
  topic: z.string(),
  event: z.string(),
  payload: z.unknown(),
});

const error = z.object({
  type: z.literal('error'),
  id: z.string().optional(),
  code: z.string(),
  message: z.string().optional(),
});

export const serverMessageSchema = z.discriminatedUnion('type', [
  subscribed,
  unsubscribed,
  event,
  error,
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;
