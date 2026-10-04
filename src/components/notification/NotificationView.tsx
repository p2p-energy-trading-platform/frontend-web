import { useState } from 'react';

import { NotificationFilterBar } from '#/components/notification/NotificationFilterBar';
import type { NotificationCategory } from '#/components/notification/NotificationFilterBar';
import { NotificationFeed } from '#/components/notification/NotificationFeed';
import { useNotifications } from '#/hooks/useNotifications';

export default function NotificationView() {
  const [category, setCategory] = useState<NotificationCategory>('All');
  const notifications = useNotifications();

  return (
    <main
      className="mx-auto flex w-full max-w-225 flex-col gap-4 p-6"
      data-source={notifications.source}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-heading-2 text-text-primary">Notifications</h1>
        <span className="flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
          {notifications.unreadCount}
        </span>
      </div>

      <NotificationFilterBar
        category={category}
        onCategoryChange={setCategory}
        counts={notifications.counts}
      />

      <NotificationFeed groups={notifications.groups} />
    </main>
  );
}
