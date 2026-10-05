import type { ReactNode } from 'react';

import SignInVisualPanel from './SignInVisualPanel';

interface AuthSplitLayoutProps {
  children: ReactNode;
}

export default function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen overflow-y-auto bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex justify-center bg-background px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="w-full max-w-105">{children}</div>
        </section>

        <SignInVisualPanel />
      </div>
    </main>
  );
}
