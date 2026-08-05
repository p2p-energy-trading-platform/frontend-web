import { Card } from '../../ui/card'
import { Badge } from '../../ui/badge'

interface ParticipantCardProps {
  label: string
  title: string
  benefits: {
    text: string
    icon: React.ReactNode
  }[]
}

export default function ParticipantCard({
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
