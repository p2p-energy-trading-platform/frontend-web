import { sessionUser } from '#/data/profile';
import type { PersonalProfile } from '#/data/profile';

export type { PersonalProfile };

export function useSession() {
  return {
    source: 'demo' as const,
    user: sessionUser,
  };
}

export function useProfile() {
  return {
    source: 'demo' as const,
    user: sessionUser,
  };
}
