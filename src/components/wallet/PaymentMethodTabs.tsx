import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs';

interface PaymentMethodTabsProps {
  tab: 'cards' | 'banks';
  setTab: (tab: 'cards' | 'banks') => void;
}

export function PaymentMethodTabs({ tab, setTab }: PaymentMethodTabsProps) {
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        if (value === 'cards' || value === 'banks') setTab(value);
      }}
      className="mb-4"
    >
      <TabsList>
        <TabsTrigger value="cards">Debit / Credit</TabsTrigger>
        <TabsTrigger value="banks">Bank accounts</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
