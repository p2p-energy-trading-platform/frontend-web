import { create } from 'zustand';

import type { RealtimeState } from './client';

/** The shared socket's state, for UI labels. */
export const useRealtimeStore = create<{ state: RealtimeState }>(() => ({
  state: 'idle',
}));
