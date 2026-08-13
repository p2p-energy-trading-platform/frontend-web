import { Check, CreditCard, Trash2 } from "lucide-react";

import type { PaymentCard } from "./paymentMethodData";
import { CardLogo } from "./CardLogo";

interface CardListProps {
   cards: PaymentCard[];
}

export function CardList({ cards }: CardListProps) {

  return (

        <div className="space-y-2">

            {cards.map((card) => (

                <div key={card.id} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-secondary border border-border-default">
                    
                    <CreditCard size={17} className="text-muted-foreground"/>

                    <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2 flex-wrap">

                            <CardLogo brand={card.brand} />

                            <span className="text-label-lg text-foreground">•••• {card.last4}</span>

                            {card.isDefault && <span className="text-caption text-text-tertiary px-2 rounded-xl border border-border-default">Default</span>}

                            {card.verified && <Check size={11} className="text-accent" />}

                        </div>

                        <p className="text-caption text-text-tertiary mt-0.5">Expires {card.expiry} · Deposit only</p>

                    </div>

                    <button className="text-text-tertiary p-1">
                        <Trash2 size={14} />
                    </button>

                </div>
                
            ))}

        </div>

    );

}