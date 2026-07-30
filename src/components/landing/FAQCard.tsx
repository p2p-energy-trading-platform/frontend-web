import { ChevronDown } from 'lucide-react'
import { Card } from '../ui/card'

export default function FAQCard() {
    return (
        <div className="py-5 flex flex-col gap-4 w-full max-w-xl">

                <Card className="p-4">
                    <div className="flex items-center justify-between">

                        <h3 className="text-label-lg text-foreground">
                            Is GridX the same as net metering or DEWA feed-in?
                        </h3>
                        <ChevronDown className="size-5 text-text-secondary" />

                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">

                        <h3 className="text-label-lg text-foreground">
                            DO I need any new hardware or equipment?
                        </h3>
                        <ChevronDown className="size-5 text-text-secondary" />

                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">

                        <h3 className="text-label-lg text-foreground">
                            How are kWh prices determined on the marketplace?
                        </h3>
                        <ChevronDown className="size-5 text-text-secondary" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">

                        <h3 className="text-label-lg text-foreground">
                            Which Dubai grid zones are currently supported?
                        </h3>
                        <ChevronDown className="size-5 text-text-secondary" />

                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">

                        <h3 className="text-label-lg text-foreground">
                            How quickly do I receive payment after a trade  settles?
                        </h3>
                        <ChevronDown className="size-5 text-text-secondary" />

                    </div>                
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">

                        <h3 className="text-label-lg text-foreground">
                            Is my energy data and personal information secure?
                        </h3>
                        <ChevronDown className="size-5 text-text-secondary" />

                    </div>                
                </Card>

            </div>      
    )
}