import {
  TrendingUp,
  ArrowUpRight,
  Gauge,
  BatteryCharging,
  CircleCheck,
  Star,
} from 'lucide-react'

export const ProsumerBenefits = [
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
