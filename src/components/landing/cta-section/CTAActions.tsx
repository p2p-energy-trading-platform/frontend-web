import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTAActions() {
  
    return (

        <div className="flex flex-row items-center justify-center gap-4">

            <Button size="lg">

                Start trading Energy
                <ArrowRight />

            </Button>

            <Button variant="outline" className="border-primary" size="lg">

                Request demo
                
            </Button>

        </div>

    );

}