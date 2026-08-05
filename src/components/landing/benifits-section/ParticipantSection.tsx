import ParticipantCard from './ParticipantCard'
import { BuyerBenefits } from './BuyerBenifits'
import { ProsumerBenefits } from './ProsumerBenefits'

export default function ParticipantSection() {
  return (
    <div className="w-full py-6 flex flex-row justify-center gap-6">
      <ParticipantCard
        label="For buyers"
        title="Access clean local energy"
        benefits={BuyerBenefits}
      />

      <ParticipantCard
        label="For prosumers"
        title="Monetise your energy assets"
        benefits={ProsumerBenefits}
      />
    </div>
  )
}
