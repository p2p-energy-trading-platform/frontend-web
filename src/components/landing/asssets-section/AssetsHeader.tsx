import { Badge } from '@/components/ui/badge'


export default function AssetsHeader() {

    return(

        <div className="py-6 flex flex-col gap-5 items-center text-center">

                <Badge variant="secondary" className="">
                    Supported assets
                </Badge>

                <h2 className="text-section-title text-foreground">
                    What you can trade on GridX
                </h2>

                <p className="text-label-lg text-text-secondary">
                    Three asset types, one unified marketplace.
                </p>

        </div>

    )

}