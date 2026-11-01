import { Badge } from '#/components/ui/badge';
import { cn } from 'cn';

/** Marks demo content that has no backend data behind it yet. */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('border-border-subtle text-text-tertiary', className)}
      title="Shown with sample data until this information is available"
    >
      Sample data
    </Badge>
  );
}
