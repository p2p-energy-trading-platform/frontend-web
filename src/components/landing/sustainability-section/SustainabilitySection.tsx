import { useState } from 'react'
import { Home, Leaf, SunMedium, Trees } from 'lucide-react'
import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'


const impactCards = [
  {
    icon: Leaf,
    value: '1,240',
    unit: 'tonnes',
    label: 'CO₂ avoided this year',
  },
  {
    icon: SunMedium,
    value: '61,840',
    unit: 'kWh',
    label: 'Renewable energy traded',
  },
  {
    icon: Home,
    value: '3,412',
    unit: 'homes',
    label: 'Households in the network',
  },
  {
    icon: Trees,
    value: '18,600',
    unit: 'equiv.',
    label: 'Trees planted equivalent',
  },
]


export default function SustainabilitySection() {

    const [activeCard, setActiveCard] = useState(1)

    return(
        <section className="bg-background px-9 py-20">

            <div className="mx-auto flex w-full max-w-7xl items-center">
                
                <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:gap-14">
                
                    <div className="flex flex-col items-start">

                        <Badge variant="secondary">
                            Sustainability impact
                        </Badge>

                        <h2 className="mt-6 text-display-lg text-text-primary">
                            Every trade reduces grid carbon intensity
                        </h2>

                        <p className="mt-5 text-heading-4 text-text-tertiary">
                            When a household buys solar energy from a neighbour instead of
                            drawing from the grid mix, both the local grid and the atmosphere
                            benefit.
                        </p>
                     
                        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                        
                            {impactCards.map(({ icon: Icon, value, unit, label }, index) => {

                                const isActive = activeCard === index

                                return (
                                    <Card
                                        key={label}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={isActive}
                                        onClick={() =>
                                            setActiveCard(isActive ? -1 : index)
                                        }
                                        className={`cursor-pointer p-5 text-left transition-all ${
                                            isActive
                                            ? 'border-action-accent bg-background-surface'
                                            : 'border-border-default bg-background-surface hover:border-border-strong hover:bg-muted'
                                        }`}
                                    >
                                        
                                        <div className="flex items-center gap-2 text-label-sm text-text-tertiary">
                                            <Icon
                                            size={15}
                                            strokeWidth={1.8}
                                            className="text-action-accent"
                                            aria-hidden="true"
                                            />
                                            <span>Impact</span>
                                        </div>

                                        <div className="mt-3 flex items-baseline gap-1">
                                            
                                            <span className="text-heading-2 text-text-primary">
                                                {value}
                                            </span>

                                            <span className="text-label-sm text-action-accent">
                                                {unit}
                                            </span>

                                        </div>

                                        <p className="mt-1 text-caption text-text-tertiary">
                                            {label}
                                        </p>

                                    </Card>
                                )
                                
                            })}

                        </div>

                    </div>

               
                    <Card className="relative overflow-hidden p-0">

                        <img
                            src="/images/sustainability.png"
                            alt="Solar panels installed on a residential roof"
                            className="aspect-[1.55] w-full object-cover object-center"
                        />

                        <div className="absolute inset-x-5 bottom-5 rounded-lg border border-border-default bg-background-surface px-4 py-3 shadow-sm sm:inset-x-6 sm:bottom-6">
                            
                            <p className="text-heading-4 text-text-primary">
                                Solar generation this month
                            </p>

                            <p className="mt-1 text-heading-2 text-text-primary">
                                61,840
                                <span className="ml-1 text-label-sm text-action-accent">
                                    kWh traded
                                </span>
                            </p>

                        </div>

                    </Card>

                </div>

            </div>

        </section>
    )

}
