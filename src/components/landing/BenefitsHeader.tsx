import { Badge } from "../ui/badge";
import { TrendingDown, Leaf, Zap, Wallet, Globe, Bell, ArrowUpRight, Gauge, BatteryCharging, TrendingUp, CircleCheck, Star } from 'lucide-react'
import { Card } from "../ui/card";

function BenefitsHeader() {
  return (
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
  )
}

const BuyerBenefits = [
  {
    text: 'Pay 5-20% below standard retail tariff on qualifying trades',
    icon: <TrendingDown className="size-4 text-brand-accent" />,
  },
  {
    text: 'Choose renewable-sourced energy from verified local prosumers',
    icon: <Leaf className="size-4 text-brand-accent" />,
  },
  {
    text: 'Real-time pricing, no monthly contracts or fixed plans',
    icon: <Zap className="size-4 text-brand-accent" />,
  },
  {
    text: 'AED wallet with instant top-up via bank transfer or card',
    icon: <Wallet className="size-4 text-brand-accent" />,
  },
  {
    text: 'Filter listings by zone, asset type, price, and delivery window',
    icon: <Globe className="size-4 text-brand-accent" />,
  },
  {
    text: 'Price alerts when rates hit your target in your grid zone',
    icon: <Bell className="size-4 text-brand-accent" />,
  },
]

const ProsumerBenefits = [
  {
    text: 'Earn AED from every kWh of surplus solor you export to neighbours',
    icon: <ArrowUpRight className="size-4 text-brand-accent" />,
  },
  {
    text: 'Set your own price per kWh — zone parameters apply as guide',
    icon: <Gauge className="size-4 text-brand-accent" />,
  },
  {
    text: 'Battery storage and EV vehicle -to-grid  exports fully supported',
    icon: <BatteryCharging className="size-4 text-brand-accent" />,
  },
  {
    text: 'Typical prosumer earnings AED 200-800 per month',
    icon: <TrendingUp className="size-4 text-brand-accent" />,
  },
  {
    text: 'Automatic meter reading — no manual logging or estimates',
    icon: <CircleCheck className="size-4 text-brand-accent" />,
  },
  {
    text: 'Build a verified trading reputation across grid zones',
    icon: <Star className="size-4 text-brand-accent" />,
  },
]

interface ParticipantCardProps {
  label: string
  title: string
  benefits: {
    text: string
    icon: React.ReactNode
  }[]
}

function ParticipantCard({
  label,
  title,
  benefits,
}: ParticipantCardProps) {
  return (
    <Card className="w-full max-w-lg p-6">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="px-6">
          {label}
        </Badge>

        <h3 className="text-label-lg text-foreground">{title}</h3>

        <ul className="flex flex-col gap-5">
          {benefits.map((benefit) => (
            <li
              key={benefit.text}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              {benefit.icon}

              <span className="text-caption">{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}


function ParticipantSection() {
  return (
    <div className="w-full py-6 flex flex-row justify-center gap-6">
      <ParticipantCard
        label="For buyers"
        title="Access clean local energy"
        benefits={BuyerBenefits}
      />

      <ParticipantCard
        label="For prosumers"
        title="Monetise your energy assets"
        benefits={ProsumerBenefits}
      />
    </div>
  )
}

export default function BenifitsSection() {
  return (
    <section className="bg-background flex flex-col items-center justify-center">
      <BenefitsHeader />

      <ParticipantSection />
    </section>
  )
}