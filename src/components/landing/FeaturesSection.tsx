/*
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const features = [
    {
        title: "Peer-to-Peer Trading",
        description:
            "Trade surplus energy directly with other users in your local grid zone.",
        icon: "/images/peer_to_peer_trading.png",
    },
    {
        title: "Real-Time Marketplace",
        description:
            "Buy and sell energy through a live marketplace with real-time updates.",
        icon: "/images/real_time_marketplace.png",
    },
    {
        title: "Smart Meter Integration",
        description:
            "Connect your smart meter and monitor your energy usage effortlessly.",
        icon: "/images/smart_meter_integration.png",
    },
    {
        title: "Secure Transactions",
        description:
            "Enjoy secure energy trading with reliable payment settlement.",
        icon: "/images/secure_transactions.png",
    },
    {
        title: "AI Market Insights",
        description:
            "Get intelligent insights to make better energy trading decisions.",
        icon: "/images/ai_market_insights.png",
    },
    {
        title: "Wallet & Settlement",
        description:
            "Manage your energy payments with fast and transparent settlements.",
        icon: "/images/wallet_settlement.png",
    },
];


export default function FeatureSection() {

    return (

        <section className="bg-background flex flex-col items-center justify-center">

            <div className="py-6 flex flex-col gap-5 items-center text-center">

                <Badge variant="secondary">
                    Features
                </Badge>

                <h2 className="text-section-title text-foreground">
                    Everything You Need for Energy Trading
                </h2>

                <p className="text-label-lg text-text-secondary">
                    Powerful tools that make buying, selling, and managing energy simple.
                </p>

            </div>


            <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {features.map((feature) => (

                    <Card
                        key={feature.title}
                        className="w-72 p-6"
                    >

                        <div className="flex flex-col gap-4">

                            <img
                                src={feature.icon}
                                alt={feature.title}
                                className="size-12 object-contain"
                            />

                            <h3 className="text-heading-4 text-foreground">
                                {feature.title}
                            </h3>

                            <p className="text-text-secondary text-sm">
                                {feature.description}
                            </p>

                        </div>

                    </Card>

                ))}

            </div>

        </section>

    );
}
*/

import { Card } from '../ui/card'
import { Badge } from '../ui/badge'

export default function FeatureSection() {
  return (
    <section className="border border-red-500 bg-background flex flex-col items-center justify-center">
      <div className="py-6 flex flex-col gap-5 items-center text-center">
        <Badge variant="link">who it's for</Badge>

        <h2 className="text-section-title text-foreground">
          Benifits for every household
        </h2>

        <p className="text-label-lg text-text-secondary">
          Ehether you generate more than you use or simply want greener, <br />
          cheaper electricity - GrideX is for you.
        </p>
      </div>

      <div className="py-6 flex flex-row justify-center gap-6">
        <Card className="w-64 p-6">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary">For buyers</Badge>

            <h3 className="text-label-lg text-foreground">
              clean local your energy assets
            </h3>
          </div>
        </Card>

        <Card className="w-64 p-6">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary">For prosumers</Badge>

            <h3 className="text-label-lg text-foreground">
              Monetise your energy assets
            </h3>
          </div>
        </Card>
      </div>
    </section>
  )
}
