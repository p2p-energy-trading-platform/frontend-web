import { notificationCounts, notificationGroups } from '#/data/notifications';

export function useNotifications() {
  return {
    source: 'demo' as const,
    unreadCount: notificationCounts.All,
    counts: notificationCounts,
    groups: notificationGroups,
  };
}
