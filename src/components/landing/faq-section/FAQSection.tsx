import FAQHeader from './FAQHeader'
import FAQCard from './FAQCard'

export default function FAQSection() {
  return (
    <section className="border border-red-500 bg-bg-surface flex flex-col items-center justify-center">

        <FAQHeader />

        <FAQCard />
      
    </section>
  )
}