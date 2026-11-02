import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import SignInVisualPanel from '#/components/auth/SignInVisualPanel';
import { authUserQueryOptions } from '#/features/auth/hooks';

export const Route = createFileRoute('/_auth')({
  ssr: false,
  beforeLoad: async ({ context }) => {
    let user = null;
    try {
      user = await context.queryClient.ensureQueryData(authUserQueryOptions);
    } catch {
      // Public auth pages remain usable while the gateway is unavailable.
    }
    if (user) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main className="min-h-screen bg-background text-foreground lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-full lg:min-h-0 lg:grid-cols-2">
        <section className="flex justify-center bg-background px-6 py-12 sm:px-10 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-16 lg:py-16">
          <div className="w-full max-w-105">
            <Outlet />
          </div>
        </section>

        <SignInVisualPanel />
      </div>
    </main>
  );
}
