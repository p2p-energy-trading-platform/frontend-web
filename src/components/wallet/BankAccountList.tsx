import { AlertTriangle, Building2, Check, Info, Trash2 } from 'lucide-react'

import { Alert, AlertDescription } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import type { BankAccount } from './paymentMethodData'

interface BankAccountListProps {
  accounts: BankAccount[]
}

export function BankAccountList({ accounts }: BankAccountListProps) {
  return (
    <div className="space-y-2">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-secondary border border-default"
        >
          <Building2 size={17} className="text-text-tertiary" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-label-lg text-foreground">
                {account.bankName}
              </span>

              {account.isDefault && (
                <span className="text-caption text-text-tertiary px-1.5 py-0.5 rounded-full border border-default">
                  Default
                </span>
              )}

              {account.verified ? (
                <Badge variant="secondary" className="bg-accent/10">
                  <Check size={9} className="text-accent" />
                  <span className="text-accent">Verified</span>
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-feedback-warning-icon/30"
                >
                  <AlertTriangle
                    size={9}
                    className="text-feedback-warning-icon"
                  />
                  <span className="text-feedback-warning-text">Pending</span>
                </Badge>
              )}
            </div>

            <p className="text-xs text-text-tertiary font-mono mt-0.5">
              {account.maskedIban}
            </p>

            {account.verifiedAt && (
              <p className="text-caption text-text-tertiary">
                Verified {account.verifiedAt}
              </p>
            )}

            {!account.verified && (
              <p className="text-caption text-feedback-warning-text font-medium">
                Micro-deposit verification pending
              </p>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${account.bankName} account`}
                />
              }
            >
              <Trash2 />
            </TooltipTrigger>
            <TooltipContent>Remove account</TooltipContent>
          </Tooltip>
        </div>
      ))}

      <Alert>
        <Info />
        <AlertDescription>
          Bank accounts are verified via two micro-deposits (AED 0.01–0.99).
          Verification typically takes 1–2 business days.
        </AlertDescription>
      </Alert>
    </div>
  )
}
