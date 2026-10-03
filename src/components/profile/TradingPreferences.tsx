import { tradeValueCurrency } from '#/data/profile'
import { Activity, Gauge, Save, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

export default function TradingPreferences() {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4 text-brand-primary" />
          Trading preferences
        </CardTitle>
        <CardDescription>
          Defaults are applied when you open the Trading Terminal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5">
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="orderType">Default Order Type</FieldLabel>
                <Select name="orderType">
                  <SelectTrigger id="orderType" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limit">Limit order</SelectItem>
                    <SelectItem value="market">Market order</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="priceMode">Default Price Mode</FieldLabel>
                <Select name="priceMode">
                  <SelectTrigger id="priceMode" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">
                      Recommended price
                    </SelectItem>
                    <SelectItem value="manual">Manual price</SelectItem>
                    <SelectItem value="market">Market price</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="energyLimit">
                  Monthly Energy Limit
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="energyLimit"
                    name="energyLimit"
                    type="number"
                    min="0"
                    required
                    className="pr-14"
                  />
                  <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-text-tertiary">
                    kWh
                  </span>
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="tradeValue">Max Trade Value</FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-2.5 text-xs text-text-tertiary">
                    {tradeValueCurrency}
                  </span>
                  <Input
                    id="tradeValue"
                    name="tradeValue"
                    type="number"
                    min="0"
                    required
                    className="pl-10"
                  />
                </div>
              </Field>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border">
              <PreferenceToggle
                id="recommendPrice"
                icon={Gauge}
                title="Auto-recommend sell price"
                description="Suggest a price using live order book depth."
              />
              <PreferenceToggle
                id="dispatchAutomation"
                icon={Zap}
                title="Allow dispatch automation"
                description="Let GridX optimise battery and EV usage within your limits."
              />
            </div>
            <Field orientation="horizontal">
              <Button className="px-4">
                <Save className="size-4" />
                Save
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function PreferenceToggle({
  id,
  icon: Icon,
  title,
  description,
}: {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary-muted">
        <Icon className="size-4 text-brand-primary" />
      </div>
      <Label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-sm font-medium text-text-primary">
          {title}
        </span>
        <span className="mt-1 block text-xs font-normal text-text-tertiary">
          {description}
        </span>
      </Label>
      <Switch id={id} name={id} />
    </div>
  )
}
