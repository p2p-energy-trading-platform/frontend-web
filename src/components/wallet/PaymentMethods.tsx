import { useState } from "react";
import { Plus,CreditCard,Check, Trash2 } from "lucide-react";


type CardBrand = "visa" | "mastercard" | "amex";

interface PaymentCard {
  id: string; last4: string; brand: CardBrand; expiry: string;
  verified: boolean; isDefault: boolean;
}

const SAMPLE_CARDS: PaymentCard[] = [
  { id:"c1", last4:"4821", brand:"visa",       expiry:"09/27", verified:true,  isDefault:true  },
  { id:"c2", last4:"3802", brand:"mastercard", expiry:"04/26", verified:true,  isDefault:false },
];


export function PaymentMethods() {

  const [tab, setTab] = useState<"cards" | "banks">("cards");  

  return (

    

        <div className="bg-card rounded-2xl border border-border-default p-5">

            <div className="flex items-center justify-between mb-4">

                <h3 className="text-sm font-bold text-foreground">Payment methods</h3>

                <button className="flex items-center gap-1.5 text-caption text-accent hover:text-accent">
                    <Plus size={13} />Add
                </button>

            </div>

            <div className="flex gap-0.5 bg-secondary rounded-lg p-0.5 mb-4 w-fit">

                {(["cards", "banks"] as const).map(t => (

                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-3 py-1.5 rounded-md text-label-lg  ${
                            tab === t
                            ? "bg-card text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {t === "cards" ? "Debit / Credit" : "Bank accounts"}
                    </button>

                ))}

            </div>


            {tab === "cards" ? (

                <div className="space-y-2">

                    {SAMPLE_CARDS.map(c => (

                        <div key={c.id} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-secondary border border-border-default">
                            
                            <CreditCard size={17} className="text-muted-foreground"/>

                            <div className="flex-1 min-w-0">

                                <div className="flex items-center gap-2 flex-wrap">

                                    <CardLogo brand={c.brand} />

                                    <span className="text-label-lg text-foreground">•••• {c.last4}</span>
                                    
                                    {c.isDefault && <span className="text-caption text-text-tertiary px-2 rounded-xl border border-border-default">Default</span>}
                                    
                                    {c.verified && <Check size={11} className="text-accent" />}
                                
                                </div>

                                <p className="text-caption text-text-tertiary mt-0.5">Expires {c.expiry} · Deposit only</p>

                            </div>

                            <button className="text-text-tertiary p-1">
                                <Trash2 size={14} />
                            </button>

                        </div>

                    ))}

                </div>
            ) : (

                <div>

                    <h1>hi</h1>
                    
                </div>

            )}    
            

        </div>

    

  )
}






// need to check below

function CardLogo({ brand }: { brand: CardBrand }) {
  const colors: Record<CardBrand, string> = {
    visa: "text-chart-2",
    mastercard: "text-feedback-error-text",
    amex: "text-primary",
  };

  const labels: Record<CardBrand, string> = {
    visa: "VISA",
    mastercard: "MC",
    amex: "AMEX",
  };

  return (
    <span className={`text-label-sm ${colors[brand]}`}>
      {labels[brand]}
    </span>
  );
}


