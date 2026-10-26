import { ChevronLeft } from 'lucide-react';
import { Button } from '#/components/ui/button';

export function AuthBackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Go back"
      className="size-10 rounded-full border-border-default bg-bg-surface text-text-primary hover:bg-background-well"
      onClick={onClick}
    >
      <ChevronLeft className="size-5" aria-hidden="true" />
    </Button>
  );
}
