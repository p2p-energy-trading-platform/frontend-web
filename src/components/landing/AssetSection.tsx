import { Card } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import Reveal from '#/components/landing/Reveal';

const assets = [
  {
    title: 'Rooftop Solar PV',
    image: '/images/sun.png',
    alt: 'Sun representing rooftop solar',
    description:
      'List surplus kWh from your photovoltaic installation. Any rooftop system from 2 kW and above is eligible.',
    tag: 'Solar',
  },
  {
    title: 'Battery Storage',
    image: '/images/battery.png',
    alt: 'Battery energy storage',
    description:
      'Export stored energy during peak demand hours. Charge during low-cost periods and sell when demand is higher.',
    tag: 'Storage',
  },
  {
    title: 'EV Vehicle-to-Grid',
    image: '/images/car.png',
    alt: 'Electric vehicle',
    description:
      "Turn your electric vehicle into a household grid asset. Export from your EV's battery when you're parked at home.",
    tag: 'Electric mobility',
  },
];

export default function AssetsSection() {
  return (
    <section className="bg-background px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary">Supported assets</Badge>

          <h2 className="text-section-title text-foreground">
            What you can trade on GridX
          </h2>

          <p className="text-base leading-7 text-text-secondary">
            Three asset types, one unified marketplace.
          </p>
        </Reveal>

        <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {assets.map((asset, index) => (
            <Reveal key={asset.title} delay={index * 120} className="h-full">
              <Card className="group flex h-full flex-col items-start overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15">
                  <img
                    src={asset.image}
                    alt={asset.alt}
                    loading="lazy"
                    className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="mt-5 inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-text-secondary">
                  {asset.tag}
                </span>

                <h3 className="mt-3 text-label-lg font-semibold text-foreground">
                  {asset.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {asset.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
