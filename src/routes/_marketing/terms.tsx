import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const Route = createFileRoute('/_marketing/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Service | GridX' },
      {
        name: 'description',
        content:
          'Terms governing access to and use of the GridX peer-to-peer energy trading simulation.',
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          to="/sign-up"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to create account
        </Link>

        <header className="mb-10 border-b border-border-subtle pb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
            GridX · Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-text-secondary">
            Last updated: 10 October 2026
          </p>
          <p className="mt-5 max-w-3xl leading-7 text-text-secondary">
            These Terms describe the conditions for using GridX, a university
            project and software prototype for exploring peer-to-peer energy
            trading concepts. Please read them before using the platform.
          </p>
        </header>

        <div className="mb-10 flex gap-3 rounded-xl border border-border-subtle bg-card p-4">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <h2 className="font-semibold">Prototype notice</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              GridX simulates trading and energy-related activity for
              demonstration and educational purposes. It does not execute real
              electricity trades, deliver physical electricity, or process
              real-money payments or financial settlements.
            </p>
          </div>
        </div>

        <div className="space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-semibold">
              1. Acceptance of these terms
            </h2>
            <p className="mt-3 text-text-secondary">
              By accessing or using GridX, you acknowledge that you have read
              and understood these Terms. If you do not agree, do not use the
              platform. If you are using GridX as part of a course or university
              project, any applicable institutional requirements continue to
              apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Purpose and scope</h2>
            <p className="mt-3 text-text-secondary">
              GridX is a software prototype intended to demonstrate concepts
              such as simulated energy offers, order matching, market activity,
              forecasting, and simulated meter data. Features and information
              may be incomplete, experimental, or changed as development
              progresses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              3. Simulated credits and transactions
            </h2>
            <p className="mt-3 text-text-secondary">
              Any credits, wallet balances, orders, prices, trades, or
              transaction records shown in GridX are part of the simulation.
              Credits are not cash, deposits, electronic money, or a claim
              against a bank or other financial institution. They are not
              redeemable for money or physical electricity.
            </p>
            <p className="mt-3 text-text-secondary">
              Where the prototype uses administrator-funded demo credits, those
              credits exist only to support testing and demonstration. No
              real-money deposit, withdrawal, payment, or financial settlement
              should be inferred from a displayed balance or transaction record.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              4. No physical electricity delivery
            </h2>
            <p className="mt-3 text-text-secondary">
              A simulated trade or energy quantity does not cause electricity to
              be generated, transferred, supplied, or delivered. GridX does not,
              through this prototype, connect users to a live electricity grid
              or arrange a real-world energy supply agreement. Meter readings,
              forecasts, and market displays may be simulated or illustrative.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Accounts and security</h2>
            <p className="mt-3 text-text-secondary">
              You are responsible for providing accurate information where
              requested and taking reasonable steps to protect your account
              credentials. Do not share your password or attempt to access
              another person's account. Notify the project team through its
              designated contact channel if you suspect unauthorized account
              access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Acceptable use</h2>
            <p className="mt-3 text-text-secondary">
              You must not misuse the platform, interfere with its operation,
              attempt unauthorized access, introduce malicious code, abuse other
              users, or use the prototype to misrepresent simulated activity as
              a real electricity or financial transaction. You must also comply
              with applicable laws and any relevant institutional rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              7. Experimental features and availability
            </h2>
            <p className="mt-3 text-text-secondary">
              GridX is provided for evaluation and development. Features may be
              unavailable, inaccurate, modified, reset, or removed without
              notice. Do not rely on its simulated prices, forecasts, balances,
              analytics, or records to make financial, energy-supply, safety, or
              other real-world decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              8. Intellectual property and project materials
            </h2>
            <p className="mt-3 text-text-secondary">
              Unless otherwise stated, the platform's original code, design, and
              project materials are subject to the rights of their respective
              owners and contributors. These Terms do not transfer ownership of
              intellectual property to you. Third-party components remain
              subject to their own licences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Disclaimer</h2>
            <p className="mt-3 text-text-secondary">
              To the extent permitted by applicable law, GridX is provided "as
              is" and "as available", without a promise that it will be
              uninterrupted, error-free, accurate, or suitable for a particular
              purpose. This disclaimer does not exclude any rights or
              protections that cannot legally be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              10. Limitation of liability
            </h2>
            <p className="mt-3 text-text-secondary">
              To the extent permitted by applicable law, the GridX project team
              is not responsible for losses arising from reliance on simulated
              information, service interruptions, or use of the prototype.
              Nothing in these Terms excludes liability where exclusion is
              prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Privacy</h2>
            <p className="mt-3 text-text-secondary">
              Personal information is handled as described in our{' '}
              <Link
                to="/privacy"
                className="font-semibold text-accent hover:underline"
              >
                Privacy Policy
              </Link>
              . Please review it to understand how information may be used and
              protected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              12. Changes to these terms
            </h2>
            <p className="mt-3 text-text-secondary">
              These Terms may be updated as the prototype develops. The updated
              version will be published on this page with a revised date.
              Continued use after an update is subject to applicable law and any
              consent requirements that apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">13. Applicable law</h2>
            <p className="mt-3 text-text-secondary">
              The law applicable to GridX depends on the circumstances and the
              entity or institution operating it. These draft Terms do not
              determine jurisdiction or represent that the prototype has
              obtained regulatory approval. Any final governing-law provision
              should be reviewed and confirmed by the responsible institution or
              operator.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">14. Contact</h2>
            <p className="mt-3 text-text-secondary">
              For questions about these Terms, contact the GridX project team
              through the official contact channel provided by the responsible
              university or project operator.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border-subtle pt-6 text-sm text-text-secondary">
          Also see our{' '}
          <Link
            to="/privacy"
            className="font-semibold text-accent hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </article>
    </main>
  );
}
