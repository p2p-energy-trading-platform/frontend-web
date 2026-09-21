interface PaymentMethodTabsProps {
  tab: 'cards' | 'banks'
  setTab: (tab: 'cards' | 'banks') => void
}

export function PaymentMethodTabs({ tab, setTab }: PaymentMethodTabsProps) {
  return (
    <div className="flex gap-0.5 bg-secondary rounded-lg p-0.5 mb-4 w-fit">
      {(['cards', 'banks'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-3 py-1.5 rounded-md text-label-lg  ${
            tab === t
              ? 'bg-card text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t === 'cards' ? 'Debit / Credit' : 'Bank accounts'}
        </button>
      ))}
    </div>
  )
}
