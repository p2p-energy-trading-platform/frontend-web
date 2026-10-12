import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import Reveal from '#/components/landing/Reveal';

const faqs = [
  {
    question: 'Is GridX the same as net metering or DEWA feed-in?',
    answer:
      'No. GridX is designed as a peer-to-peer energy trading marketplace. Its operation is distinct from traditional net metering or utility feed-in arrangements. Actual participation depends on applicable regulations and supported infrastructure.',
  },
  {
    question: 'Do I need any new hardware or equipment?',
    answer:
      'GridX is designed around compatible smart-meter data. Whether your existing meter and energy assets are supported depends on your setup and the platform’s current integration capabilities.',
  },
  {
    question: 'How are kWh prices determined on the marketplace?',
    answer:
      'Buyers and sellers submit orders with their desired quantities and prices. The marketplace matching rules determine which compatible orders can trade.',
  },
  {
    question: 'Which Dubai grid zones are currently supported?',
    answer:
      'Zone support depends on the platform configuration and available integrations. Check the current application or contact the GridX team for the latest supported areas.',
  },
  {
    question: 'How quickly do I receive payment after a trade settles?',
    answer:
      'Settlement timing depends on the platform’s settlement process. Check the transaction and settlement records in the application for the status of an individual trade.',
  },
  {
    question: 'Is my energy data and personal information secure?',
    answer:
      'GridX is designed to manage user accounts and energy-trading information through its application services. Review the Privacy Policy for information about data handling, and avoid sharing your sign-in credentials.',
  },
];

function FAQHeader() {
  return (
    <Reveal className="flex flex-col items-center gap-4 text-center">
      <Badge variant="secondary">FAQ</Badge>

      <h2 className="text-section-title text-foreground">
        Frequently asked questions
      </h2>

      <p className="text-base text-text-secondary">
        Can't find your answer?{' '}
        <Link
          to="/about"
          className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
        >
          Contact the GridX team
        </Link>
      </p>
    </Reveal>
  );
}

function FAQList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3 lg:mt-14">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;

        return (
          <Reveal key={faq.question} delay={Math.min(index * 50, 250)}>
            <Card className="overflow-hidden rounded-xl transition-colors duration-200 hover:border-primary/30">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
              >
                <span className="font-medium leading-6 text-foreground">
                  {faq.question}
                </span>

                <ChevronDown
                  aria-hidden="true"
                  className={`size-5 shrink-0 text-text-secondary transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              <div
                id={answerId}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <p className="border-t border-border-subtle pt-4 text-sm leading-7 text-text-secondary">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="bg-background px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <FAQHeader />
        <FAQList />
      </div>
    </section>
  );
}
