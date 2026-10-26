import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

import SignInVisualPanel from '#/components/auth/SignInVisualPanel';

export const Route = createFileRoute('/_auth')({
  ssr: false,
  component: AuthLayout,
});

function AuthLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isSignIn = pathname === '/sign-in';

  return (
    <main className="min-h-[100dvh] overflow-y-auto bg-bg-canvas text-text-primary">
      <div className="grid min-h-[100dvh] lg:grid-cols-2">
        <section
          className={
            isSignIn
              ? 'flex min-h-[100dvh] justify-center bg-bg-canvas px-0 py-0 lg:px-12 lg:py-12'
              : 'flex min-h-[100dvh] justify-center bg-background px-6 py-12 sm:px-10 lg:px-16 lg:py-16'
          }
        >
          <div
            className={
              isSignIn
                ? 'flex min-h-[100dvh] w-full max-w-[393px] flex-col px-6 sm:max-w-[460px] sm:px-10 lg:max-w-105 lg:px-0'
                : 'w-full max-w-105'
            }
          >
            <Outlet />
          </div>
        </section>

        <SignInVisualPanel />
      </div>
    </main>
  );
}
