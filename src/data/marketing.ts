import { Layers, Palette, RouteIcon } from 'lucide-react'

export const heroChecks = [
  'No lock-in contracts',
  'AED wallet, instant settlement',
  'Smart-meter verified',
]

export const buyerBenefits = [
  'Pay 5-20% below standard retail tariff on qualifying trades',
  'Choose renewable-sourced energy from verified local prosumers',
  'Real-time pricing, no monthly contracts or fixed plans',
  'AED wallet with instant top-up via bank transfer or card',
  'Filter listings by zone, asset type, price, and delivery window',
  'Price alerts when rates hit your target in your grid zone',
]

export const prosumerBenefits = [
  'Earn AED from every kWh of surplus solor you export to neighbours',
  'Set your own price per kWh — zone parameters apply as guide',
  'Battery storage and EV vehicle -to-grid  exports fully supported',
  'Typical prosumer earnings AED 200-800 per month',
]

export const aboutPage = {
  badge: 'About GridX',
  title: 'Peer-to-peer energy trading for households.',
  description:
    'GridX lets neighbours buy and sell surplus solar through a shared wallet, with settlement in dirhams and delivery inside local grid zones.',
  notes: [
    {
      title: 'Token-driven styling',
      description:
        'Screens use the GridX design-system tokens for color, type, and surface.',
      icon: Palette,
    },
    {
      title: 'Shared interface kit',
      description:
        'Cards, badges, and actions come from one component kit so each screen behaves the same way.',
      icon: Layers,
    },
    {
      title: 'File-based routing',
      description:
        'Public and authenticated pages are separate routes, with one shell for each.',
      icon: RouteIcon,
    },
  ],
}
