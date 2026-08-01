import BenefitsHeader from './BenefitsHeader'
import ParticipantSection from './ParticipantSection'

export default function BenifitsSection() {
  return (
    <section className="bg-background flex flex-col items-center justify-center">
      <BenefitsHeader />

      <ParticipantSection />
    </section>
  )
}
