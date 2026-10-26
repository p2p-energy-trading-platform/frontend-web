import { useEffect, useState } from 'react';
import { cn } from 'cn';

import { Button } from '#/components/ui/button';
import { getGoogleSignInUrl } from '#/features/auth/api';

interface GoogleSignInButtonProps {
  returnTo?: string;
  className?: string;
  onClick?: () => void;
}

export function GoogleSignInButton({
  returnTo = '/dashboard',
  className,
  onClick,
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
      className={cn(
        'h-[52px] cursor-pointer gap-2.5 rounded-2xl border-border-input bg-bg-surface text-sm font-semibold text-text-primary hover:bg-background-well',
        className,
      )}
      disabled={isRedirecting}
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
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
