import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";


export default function HeroSection() {

    return(

        <section className="border border-red-500 bg-background flex flex-row justify-center gap-20">
        
            <HeroContent />

            
            <HeroVisual />
               
        </section>
    
    )

}