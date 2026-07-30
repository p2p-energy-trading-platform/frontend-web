import { Badge } from '../ui/badge'


export default function BenefitsHeader() {

    return(
        <div className="py-6 flex flex-col gap-5 items-center text-center">
            <Badge variant="link">who it's for</Badge>

            <h2 className="text-section-title text-foreground">
                Benifits for every household
            </h2>

            <p className="text-label-lg text-text-secondary">
                Ehether you generate more than you use or simply want greener, <br />
                cheaper electricity - GrideX is for you.
            </p>
        </div>
    )

}