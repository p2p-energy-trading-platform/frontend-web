import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import PageHeader from '#/components/page-components/Header';
import Sidebar, { MobileNavButton } from '#/components/page-components/Sidebar';
import { authUserQueryOptions } from '#/features/auth/hooks';
import { useSession } from '#/hooks/useProfile';

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      authUserQueryOptions,
    );
    if (!user) {
      throw redirect({ to: '/sign-in' });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, source } = useSession();

  return (
    <div className="flex min-h-screen bg-background" data-source={source}>
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          leading={<MobileNavButton user={user} />}
          propertyName={user.property}
          zoneLabel={user.zone}
          meterOnline
          notificationCount={user.notificationCount}
          user={user}
        />
        <Outlet />
      </div>
    </div>
  );
}
