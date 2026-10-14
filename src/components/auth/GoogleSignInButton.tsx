import { useEffect, useState } from 'react';

import { Button } from '#/components/ui/button';
import { getGoogleSignInUrl } from '#/features/auth/api';

interface GoogleSignInButtonProps {
  returnTo?: string;
}

export function GoogleSignInButton({
  returnTo = '/dashboard',
}: GoogleSignInButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Coming back from Google with the Back button restores this page from the
  // browser cache; re-enable the button instead of leaving it "redirecting".
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setIsRedirecting(false);
    };

    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 cursor-pointer gap-2.5 rounded-2xl bg-card text-sm font-semibold hover:bg-card/80"
      disabled={isRedirecting}
      onClick={() => {
        setIsRedirecting(true);
        window.location.assign(getGoogleSignInUrl(returnTo));
      }}
    >
      <img
        src="/auth/google.svg"
        alt=""
        aria-hidden="true"
        className="size-4.5"
      />
      {isRedirecting ? 'Redirecting to Google...' : 'Continue with Google'}
    </Button>
  );
}
