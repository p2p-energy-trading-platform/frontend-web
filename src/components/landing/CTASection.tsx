import { Link } from '@tanstack/react-router';
import { ArrowRight, Zap } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import Reveal from '#/components/landing/Reveal';

function CTAHeader() {
  return (
    <Reveal className="flex flex-col items-center gap-5 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <Zap className="size-7 text-primary" />
      </div>

      <Badge variant="secondary">Peer-to-peer energy marketplace</Badge>

      <h2 className="max-w-2xl text-display-lg leading-tight text-foreground">
        Join Dubai's growing energy network
      </h2>

      <p className="max-w-xl text-base leading-7 text-text-secondary">
        Explore a new way to connect local energy buyers and sellers through
        GridX.
      </p>
    </Reveal>
  );
}

function CTAActions() {
  return (
    <Reveal delay={160}>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

        <Link
          to="/about"
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          Learn More
        </Link>
      </div>
    </Reveal>
  );
}

export default function CTASection() {
  return (
    <section className="bg-card/40 px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Card className="relative isolate overflow-hidden rounded-3xl border-primary/15 bg-background px-5 py-14 shadow-xl shadow-primary/5 sm:px-10 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 -z-10 size-64 rounded-full bg-primary/10 blur-3xl"
          />

          <CTAHeader />
          <CTAActions />
        </Card>
      </div>
    </section>
  );
}
