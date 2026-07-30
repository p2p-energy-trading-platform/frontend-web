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

export default function ParticipantCard({label, title, benefits}: ParticipantCardProps){

    return(

        <Card className="w-64 p-6">
            <div className="flex flex-col gap-3">

                <Badge variant="secondary">
                    {label}
                </Badge>

                <h3 className="text-label-lg text-foreground">
                    {title}
                </h3>

                <ul className="flex flex-col gap-2">
                    {benefits.map((benefit) => (

                        <li key={benefit.text} className="text-sm text-text-secondary">

                            {benefit.icon}

                            <span>
                               {benefit.text}
                            </span>

                        </li>

                    ))}
                </ul>

            </div>
        </Card>
        
    )

}