export function BalanceOverview({
  available,
  creditNote,
}: {
  available: string
  creditNote: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-heading-3 text-text-secondary">Available balance</h2>

      <h1 className="text-display-xl text-text-primary">{available}</h1>

      <p className="max-w-xl text-text-secondary">{creditNote}</p>
    </div>
  )
}
