import { useEffect, useRef } from 'react';

import type { TopicListener } from './client';
import { getRealtimeClient } from './index';

/**
 * Listens to a realtime topic while the component is mounted. No topic (or
 * realtime turned off) does nothing.
 */
export function useRealtimeTopic(
  topic: string | undefined,
  listener: TopicListener,
): void {
  const latest = useRef(listener);

  useEffect(() => {
    latest.current = listener;
  });

  useEffect(() => {
    if (!topic) return;
    const client = getRealtimeClient();
    if (!client) return;
    return client.subscribe(topic, (message) => latest.current(message));
  }, [topic]);
}
