import { Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useMarketing } from '#/hooks/useMarketing';
import Reveal from '#/components/landing/Reveal';

function HeroContent() {
  const marketing = useMarketing();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <Reveal>
        <Badge variant="secondary" className="mb-2 mt-4 gap-2 px-3 py-1.5">
          <Sparkles className="size-3.5 text-primary" />
          Live Energy Marketplace
        </Badge>
      </Reveal>

      <Reveal delay={100}>
        <h1 className="mt-5 text-display-xl leading-[1.08] tracking-tight text-foreground">
          <span className="block">Turn Your Energy</span>
          <span className="mt-1 block text-accent">into Shared Value</span>
        </h1>
      </Reveal>

      <Reveal delay={180}>
        <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
          Buy surplus solar, battery, or EV energy directly from households in
          your Dubai grid zone — or sell what you generate at a fair price to
          neighbours who need it.
        </p>
      </Reveal>

      <Reveal delay={260}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/sign-in"
            className={buttonVariants({
              size: 'lg',
              className:
                'group shadow-lg shadow-primary/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
            })}
          >
            Start Trading Energy
            <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="group transition-all duration-300 hover:-translate-y-0.5"
            onClick={scrollToHowItWorks}
          >
            See How It Works
            <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </Reveal>

      <Reveal delay={340}>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {marketing.heroChecks.map((label) => (
            <div key={label} className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-feedback-success-icon" />
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function HeroVisual() {
  return (
    <Reveal delay={180} className="w-full max-w-xl">
      <div className="relative isolate mx-auto w-full">
        <div
          aria-hidden="true"
          className="absolute inset-10 -z-10 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="animate-[float_6s_ease-in-out_infinite] motion-reduce:animate-none">
          <img
            src="/images/gridx-energy-ecosystem.png"
            alt="GridX energy ecosystem connecting solar, battery, EV and smart homes"
            className="mx-auto h-auto w-full object-contain drop-shadow-xl"
            fetchPriority="high"
          />
        </div>
      </div>
    </Reveal>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate scroll-mt-24 bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)_0%,transparent_38%)] opacity-[0.07]"
      />

      <div className="mx-auto grid min-h-[min(760px,calc(100svh-4rem))] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10 lg:py-24">
        <HeroContent />
        <HeroVisual />
      </div>
    </section>
  );
}
