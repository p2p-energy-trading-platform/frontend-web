import { useState } from "react";
import { Plus,CreditCard,Check, Trash2, Building2, Info, AlertTriangle } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";


type CardBrand = "visa" | "mastercard" | "amex";


interface PaymentCard {
   id: string; last4: string; brand: CardBrand; expiry: string;
   verified: boolean; isDefault: boolean;
}
interface BankAccount {
   id: string; bankName: string; maskedIban: string; last4: string;
   verified: boolean; verifiedAt?: string; isDefault: boolean;
}



const SAMPLE_CARDS: PaymentCard[] = [
   { id:"c1", last4:"4821", brand:"visa",       expiry:"09/27", verified:true,  isDefault:true  },
   { id:"c2", last4:"3802", brand:"mastercard", expiry:"04/26", verified:true,  isDefault:false },
];

const SAMPLE_ACCOUNTS: BankAccount[] = [
   { id:"b1", bankName:"Emirates NBD",  maskedIban:"AE07 •••• •••• •••• 3917", last4:"3917", verified:true,  verifiedAt:"12 May 2025", isDefault:true  },
   { id:"b2", bankName:"Abu Dhabi CIB", maskedIban:"AE46 •••• •••• •••• 5204", last4:"5204", verified:false, isDefault:false },
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

                <div className="space-y-2">

                    {SAMPLE_ACCOUNTS.map(a => (

                        <div key={a.id} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-secondary border border-default">
                            
                            <Building2 size={17} className="text-text-tertiary" />
                            
                            <div className="flex-1 min-w-0">

                                <div className="flex items-center gap-2 flex-wrap">

                                    <span className="text-label-lg text-foreground">{a.bankName}</span>
                                    
                                    {a.isDefault && <span className="text-caption text-text-tertiary px-1.5 py-0.5 rounded-full border border-default">Default</span>}
                                    
                                    {a.verified 
                                        ? 
                                        <Badge variant="secondary" className="bg-accent/10">
                                            <Check size={9} className="text-accent" />
                                            <span className="text-accent">Verified</span>                                            
                                        </Badge>

                                        : 

                                        <Badge variant="secondary" className="bg-feedback-warning-icon/30">
                                            <AlertTriangle size={9} className="text-feedback-warning-icon" />
                                            <span className="text-feedback-warning-text">Pending</span>
                                        </Badge>
                                    }
                                
                                </div>

                                <p className="text-xs text-gx-fg4 font-mono mt-0.5">{a.maskedIban}</p>
                                
                                {a.verifiedAt && <p className="text-caption text-text-tertiary">Verified {a.verifiedAt}</p>}
                                
                                {!a.verified && <p className="text-caption text-amber-500 font-medium">Micro-deposit verification pending</p>}
                            
                            </div>

                            <button className="text-text-tertiary p-1">

                                <Trash2 size={14} />

                            </button>

                        </div>

                    ))}

                    <div className="flex items-start gap-2 p-3 rounded-xl border border-default">

                        <Info size={11} className="mt-0.5 text-chart-2" />

                        <span className="text-text-tertiary text-caption">
                            Bank accounts are verified via two micro-deposits (AED 0.01–0.99). Verification typically takes 1–2 business days.
                        </span>

                    </div>

                </div>

            )}    
            

        </div>

    

  )
}


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


