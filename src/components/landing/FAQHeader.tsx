import { Badge } from '../ui/badge'

export default function FAQHeader() {
  return (
    <div className="py-10 flex flex-col gap-5 items-center text-center">
        <Badge variant="secondary">FAQ</Badge>

        <h2 className="text-heading-1 text-foreground">
            Frequently asked questions
        </h2>

        <p className="text-heading-4 text-text-secondary">
            Can't find your answer?{' '}
            <span className="text-brand-accent text-caption">
                Contact us
            </span>
        </p>
    </div>
  )
}