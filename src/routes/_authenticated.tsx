import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import PageHeader from '#/components/page-components/Header';
import Sidebar, { MobileNavButton } from '#/components/page-components/Sidebar';
import {
  authUserQueryOptions,
  useAuthUser,
  useLogout,
} from '#/features/auth/hooks';
import { useSelectedHouse } from '#/features/iot/hooks';
import { gridLabel } from '#/features/iot/view-model';
import { getFirstName } from '#/lib/user';

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
  const { house } = useSelectedHouse();

  if (!user) {
    return null;
  }

  const displayName = user.name.trim() || user.email;
  const firstName = getFirstName(displayName);
  const initials = getInitials(displayName);
  const displayUser = {
    name: firstName,
    property: house?.houseId ?? 'GridX',
    zone: house ? gridLabel(house) : '',
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
          meterOnline={house?.meterStatus === 'online'}
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

function getInitials(displayName: string): string {
  const words = displayName.split(/\s+/).filter(Boolean);
  const initials =
    words.length > 1
      ? `${words[0][0]}${words[words.length - 1][0]}`
      : displayName.slice(0, 2);
  return initials.toUpperCase();
}
