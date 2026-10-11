import type { ReactNode } from 'react';
import { Badge } from '../ui/badge';
import {
  TrendingDown,
  Leaf,
  Zap,
  Wallet,
  Globe,
  Bell,
  ArrowUpRight,
  Gauge,
  BatteryCharging,
  TrendingUp,
  CircleCheck,
  Star,
} from 'lucide-react';
import { Card } from '../ui/card';
import { useMarketing } from '#/hooks/useMarketing';
import Reveal from '#/components/landing/Reveal';

function BenefitsHeader() {
  return (
    <Reveal className="flex flex-col items-center gap-4 text-center">
      <Badge variant="secondary">Who it's for</Badge>

      <h2 className="text-section-title text-foreground">
        Benefits for every household
      </h2>

      <p className="max-w-2xl text-base leading-7 text-text-secondary">
        Whether you generate more than you use or simply want greener, cheaper
        electricity, GridX is designed for you.
      </p>
    </Reveal>
  );
}

const buyerIcons = [TrendingDown, Leaf, Zap, Wallet, Globe, Bell];
const prosumerIcons = [
  ArrowUpRight,
  Gauge,
  BatteryCharging,
  TrendingUp,
  CircleCheck,
  Star,
];

interface ParticipantCardProps {
  label: string;
  title: string;
  benefits: {
    text: string;
    icon: ReactNode;
  }[];
}

function ParticipantCard({ label, title, benefits }: ParticipantCardProps) {
  return (
    <Card className="h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 sm:p-8">
      <div className="flex flex-col gap-5">
        <Badge variant="secondary" className="w-fit px-4">
          {label}
        </Badge>

        <h3 className="text-label-lg font-semibold text-foreground">{title}</h3>

        <ul className="flex flex-col gap-5">
          {benefits.map((benefit) => (
            <li
              key={benefit.text}
              className="flex items-start gap-3 text-sm leading-6 text-text-secondary"
            >
              <span className="mt-0.5 shrink-0">{benefit.icon}</span>
              <span>{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function ParticipantSection() {
  const marketing = useMarketing();

  const buyerBenefits = marketing.buyerBenefits.map((text, index) => {
    const Icon = buyerIcons[index % buyerIcons.length];

    return {
      text,
      icon: <Icon className="size-4 text-brand-accent" />,
    };
  });

  const prosumerBenefits = marketing.prosumerBenefits.map((text, index) => {
    const Icon = prosumerIcons[index % prosumerIcons.length];

    return {
      text,
      icon: <Icon className="size-4 text-brand-accent" />,
    };
  });

  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14">
      <Reveal>
        <ParticipantCard
          label="For buyers"
          title="Access clean local energy"
          benefits={buyerBenefits}
        />
      </Reveal>

      <Reveal delay={140}>
        <ParticipantCard
          label="For prosumers"
          title="Monetise your energy assets"
          benefits={prosumerBenefits}
        />
      </Reveal>
    </div>
  );
}

export default function BenefitsSection() {
  return (
    <section className="bg-card/40 px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <BenefitsHeader />
        <ParticipantSection />
      </div>
    </section>
  );
}
