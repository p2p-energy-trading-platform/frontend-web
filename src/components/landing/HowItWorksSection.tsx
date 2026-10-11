import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDown,
  ArrowLeftRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect Your Meter',
    eyebrow: 'GET CONNECTED',
    image: '/images/connect_your_meter.png',
    alt: 'Connect a smart meter',
    description:
      'Connect your smart meter through the GridX app using your Dubai address and meter number. Get your energy-trading journey started with a simple setup.',
    icon: Zap,
    accent: 'from-amber-400/20 to-yellow-500/5',
  },
  {
    number: '02',
    title: 'Verify Your Account',
    eyebrow: 'TRADE WITH CONFIDENCE',
    image: '/images/verify_your_account.png',
    alt: 'Verify your account',
    description:
      'Complete your account verification so your information is ready for the GridX marketplace. A verified account helps establish trust between marketplace participants.',
    icon: ShieldCheck,
    accent: 'from-sky-400/20 to-blue-500/5',
  },
  {
    number: '03',
    title: 'Trade Energy',
    eyebrow: 'ENERGY IN MOTION',
    image: '/images/trade_energy.png',
    alt: 'Trade energy on GridX',
    description:
      'Place buy or sell orders and let the marketplace match compatible orders using price and time priority. Follow your trading activity through GridX.',
    icon: ArrowLeftRight,
    accent: 'from-emerald-400/20 to-teal-500/5',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const context = gsap.context(() => {
      const storySteps = gsap.utils.toArray<HTMLElement>(
        '[data-story-step]',
      );

      if (storySteps.length === 0) return;

      storySteps.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });

      const visual = section.querySelector<HTMLElement>(
        '[data-story-visual]',
      );
      const lastStep = storySteps.at(-1);

      if (
        !reduceMotion &&
        window.matchMedia('(min-width: 1024px)').matches &&
        visual &&
        lastStep
      ) {
        ScrollTrigger.create({
          trigger: visual,
          start: 'top top+=112',
          endTrigger: lastStep,
          end: 'bottom bottom-=80',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      context.revert();
    };
  }, []);

  const currentStep = steps[activeStep] ?? steps[0];
  const ActiveIcon = currentStep.icon;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative scroll-mt-24 overflow-clip bg-background px-5 py-20 sm:px-8 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_50%_30%,var(--color-primary)_0%,transparent_55%)] opacity-[0.045]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
          <Badge variant="secondary" className="mb-5 gap-2 px-3 py-1.5">
            <Zap className="size-3.5 text-primary" />
            How GridX Works
          </Badge>

          <h2 className="text-display-lg leading-tight tracking-tight text-foreground sm:text-display-xl">
            A Smarter Way to
            <span className="block text-accent">Trade Energy</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            From connecting your meter to matching energy orders,
            discover how GridX brings energy marketplace participants
            together.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div data-story-visual className="self-start">
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card">
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${currentStep.accent} transition-colors duration-700`}
              />

              <div className="relative flex min-h-[340px] flex-col justify-between p-6 sm:min-h-[460px] sm:p-10 lg:min-h-[520px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                      THE GRIDX JOURNEY
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">
                      Step {activeStep + 1} of {steps.length}
                    </p>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background/70">
                    <ActiveIcon className="size-5 text-primary transition-transform duration-500" />
                  </div>
                </div>

                <div
                  key={currentStep.number}
                  className="flex flex-1 flex-col items-center justify-center py-8 motion-safe:animate-[story-enter_500ms_ease-out_both]"
                >
                  <div className="relative flex w-full max-w-sm items-center justify-center">
                    <div
                      aria-hidden="true"
                      className="absolute size-48 rounded-full bg-primary/10 blur-3xl sm:size-64"
                    />
                    <img
                      src={currentStep.image}
                      alt={currentStep.alt}
                      loading="lazy"
                      className="relative z-10 size-14 object-contain drop-shadow-xl sm:size-16"
                    />
                  </div>

                  <p className="mt-6 text-center text-xs font-semibold tracking-[0.2em] text-primary">
                    {currentStep.eyebrow}
                  </p>

                  <h3 className="mt-3 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {currentStep.title}
                  </h3>
                </div>

                <div>
                  <div
                    className="mb-4 grid grid-cols-3 gap-2"
                    aria-label={`Step ${activeStep + 1} of ${steps.length}`}
                  >
                    {steps.map((step, index) => (
                      <div
                        key={step.number}
                        className="h-1.5 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className={`h-full rounded-full bg-primary transition-[width] duration-500 ${
                            index <= activeStep ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {currentStep.number} / 0{steps.length}
                    </span>

                    <span className="flex items-center gap-2 text-xs text-text-secondary">
                      Scroll to explore
                      <ArrowDown className="size-3.5 animate-bounce motion-reduce:animate-none" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 px-1">
              <CheckCircle2 className="size-5 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-text-secondary">
                A guided journey from setup to energy trading.
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-16 left-[19px] top-16 hidden w-px bg-border sm:block"
            />

            <div className="space-y-6 sm:space-y-10">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = activeStep === index;

                return (
                  <article
                    key={step.number}
                    data-story-step={index}
                    className={`relative min-h-[320px] rounded-3xl border p-6 transition-[border-color,background-color,box-shadow] duration-500 sm:min-h-[390px] sm:p-8 ${
                      isActive
                        ? 'border-primary/40 bg-card shadow-xl shadow-primary/5'
                        : 'border-border/60 bg-card/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={`flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 ${
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground'
                        }`}
                      >
                        {step.number}
                      </span>

                      <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
                        {step.eyebrow}
                      </span>
                    </div>

                    <div
                      className={`mt-8 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300 ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <StepIcon className="size-6" />
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {step.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-base leading-7 text-text-secondary">
                      {step.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-sm font-medium text-primary">
                      <span>
                        {index === 0
                          ? 'Start your journey'
                          : index === 1
                            ? 'Build your trust'
                            : 'Discover the marketplace'}
                      </span>
                      <span
                        className={`transition-transform duration-300 ${
                          isActive ? 'translate-x-1' : ''
                        }`}
                      >
                        →
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
