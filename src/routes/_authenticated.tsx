import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import PageHeader from '#/components/page-components/Header';
import Sidebar, { MobileNavButton } from '#/components/page-components/Sidebar';
import {
  authUserQueryOptions,
  useAuthUser,
  useLogout,
} from '#/features/auth/hooks';

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async ({ context }) => {
    try {
      const user =
        await context.queryClient.ensureQueryData(authUserQueryOptions);
      if (!user) {
        throw new Error('Authentication required');
      }
    } catch {
      throw redirect({ to: '/sign-in' });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  if (!user) {
    return null;
  }

  const initials = user.email.slice(0, 2).toUpperCase();
  const displayUser = {
    name: user.email,
    property: 'GridX',
    zone: '',
    initials,
    role: user.role,
  };

  return (
    <div className="flex min-h-screen bg-background" data-source="gateway">
      <Sidebar user={displayUser} />
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          leading={<MobileNavButton user={displayUser} />}
          propertyName={displayUser.property}
          zoneLabel={displayUser.zone}
          meterOnline
          user={displayUser}
          onLogoutClick={() => {
            logoutMutation.mutate(undefined, {
              onSettled: () => {
                window.location.assign('/sign-in');
              },
            });
          }}
        />
        <Outlet />
      </div>
    </div>
  );
}
