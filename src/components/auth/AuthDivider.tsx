export function AuthDivider({
  label = 'or continue with',
}: {
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-text-disabled">
      <span aria-hidden="true" className="h-px flex-1 bg-border-subtle" />
      <span>{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}
