import { CircleDollarSign, Link2, Mail, RadioTower } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function ExternalServices() {
    return (
        <Card>
            <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                    <Link2 className="size-4 text-brand-primary" />
                    Integrations
                </CardTitle>
                <CardDescription>
                    Control external services that can access your GridX account.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="divide-y divide-border rounded-xl border border-border">
                    <IntegrationRow
                        icon={RadioTower}
                        name='Utility Smart Meter API'
                        description='Connection request not approved yet'
                        status='completed'
                    />
                    <IntegrationRow
                        icon={Mail}
                        name='Email delivery'
                        description='Account and trading notifications enabled'
                        status='completed'
                    />
                    <IntegrationRow
                        icon={CircleDollarSign}
                        name='Payment rail'
                        description='Connect a payment provider for settlements'
                        status='completed'
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function IntegrationRow({
  icon: Icon,
  name,
  description,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>
  name: string
  description: string
  status: 'pending' | 'completed'
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-elevated">
        <Icon className="size-4.5 text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="mt-1 text-xs text-text-tertiary">{description}</p>
      </div>
      <Badge
        variant={status === 'completed' ? "default" : "destructive"}
      >
        {status}
      </Badge>
      <Button type="button" variant="outline">
        {status === 'completed' ? 'manage' : 'connect'}
      </Button>
    </div>
  )
}