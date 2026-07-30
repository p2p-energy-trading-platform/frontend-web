import BenefitsHeader from './BenefitsHeader'
import ParticipantSection from './ParticipantSection'


export default function BenifitsSection() {
    return (
    <section className="border border-red-500 bg-background flex flex-col items-center justify-center">
      
        <BenefitsHeader />

        <ParticipantSection />  
      
    </section>
  )
}