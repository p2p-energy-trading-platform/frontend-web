export function BalanceOverview() {

  return (
    
    <div className="border border-red-500 flex flex-col gap-2">

            <h2 className="text-heading-3 text-text-secondary">
              Available balance
            </h2>

            <h1 className="text-display-xl text-text-primary">
              AED 284.50
            </h1>

            <p className="text-text-secondary max-w-xl">
              1 GridX credit = AED 1.00 · balance shown in AED
            </p>

    </div>

  )

}