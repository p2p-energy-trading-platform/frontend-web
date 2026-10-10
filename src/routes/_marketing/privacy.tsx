import { Link, createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, LockKeyhole } from 'lucide-react';

export const Route = createFileRoute('/_marketing/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | GridX' },
      {
        name: 'description',
        content:
          'Learn how personal information may be handled when using the GridX energy trading simulation.',
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-text-secondary">
            Last updated: 10 October 2026
          </p>
          <p className="mt-5 max-w-3xl leading-7 text-text-secondary">
            This policy explains the categories of information that may be
            processed through GridX, a university software prototype. The actual
            information processed depends on which features are enabled and how
            they are connected to the project's backend services.
          </p>
        </header>

        <div className="mb-10 flex gap-3 rounded-xl border border-border-subtle bg-card p-4">
          <LockKeyhole className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <h2 className="font-semibold">Important identity-data notice</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              The interface may display optional identity-verification fields.
              Do not submit identity numbers or identity-document images unless
              the responsible project team has confirmed that the feature is
              enabled, necessary, and approved for your use. GridX is a
              prototype, not a real-world identity-verification or
              energy-trading service.
            </p>
          </div>
        </div>

        <div className="space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-semibold">1. Who is responsible?</h2>
            <p className="mt-3 text-text-secondary">
              GridX is being developed as a university project. The legal entity
              or institution responsible for operating the platform, determining
              the purposes of processing, and handling privacy requests should
              be identified by the project owner before this policy is used as a
              final public notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              2. Information that may be processed
            </h2>

            <h3 className="mt-4 font-semibold">Account information</h3>
            <p className="mt-2 text-text-secondary">
              Depending on the features you use, this may include your name,
              email address, account credentials or password verifier, and
              account status. Passwords should not be stored in plain text.
            </p>

            <h3 className="mt-4 font-semibold">
              Optional identity-verification information
            </h3>
            <p className="mt-2 text-text-secondary">
              The interface includes optional fields for a legal name, a
              national identity or passport number, date of birth, and an
              identity-document image. If an enabled backend feature actually
              receives and stores this information, it should be processed only
              for a clearly explained purpose and under appropriate access and
              retention controls. The presence of a field in the interface does
              not, by itself, mean the information is successfully submitted or
              stored.
            </p>

            <h3 className="mt-4 font-semibold">Technical and security data</h3>
            <p className="mt-2 text-text-secondary">
              When relevant to account security and service operation, systems
              may process session identifiers, session expiry and revocation
              records, IP address, browser or device user-agent information, and
              authentication events.
            </p>

            <h3 className="mt-4 font-semibold">
              Prototype activity and simulated data
            </h3>
            <p className="mt-2 text-text-secondary">
              The platform may process demo orders, simulated energy quantities,
              test wallet balances, simulated transaction records, and
              application activity associated with your account. These are
              prototype data and do not represent proof of a real electricity
              transfer or real-money payment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              3. Why information may be used
            </h2>
            <p className="mt-3 text-text-secondary">
              Depending on the features implemented, information may be used to
              create and manage accounts, authenticate users, maintain sessions,
              protect against misuse, troubleshoot errors, operate prototype
              features, and evaluate the project's functionality. Optional
              identity-verification information should not be collected merely
              because the interface contains a field for it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              4. Cookies and local storage
            </h2>
            <p className="mt-3 text-text-secondary">
              The application may use browser storage or similar technologies
              for functions such as remembering display preferences or
              supporting authentication. The precise technologies depend on the
              deployed configuration. You can review your browser's settings to
              manage available site-storage controls, although disabling some
              storage may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              5. Sharing and service providers
            </h2>
            <p className="mt-3 text-text-secondary">
              Information may be processed by infrastructure and service
              providers used to operate the prototype, such as hosting,
              database, authentication, email-testing, or monitoring services,
              if those services are configured and receive the relevant data.
              Access should be limited to what is needed for development,
              operation, security, or evaluation.
            </p>
            <p className="mt-3 text-text-secondary">
              The project should not claim that information is never shared
              until its actual providers, integrations, and data flows have been
              reviewed. Information may also be disclosed where required by
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              6. Data retention and deletion
            </h2>
            <p className="mt-3 text-text-secondary">
              Information should be retained only for as long as reasonably
              necessary for the documented purpose, project requirements,
              security, and any applicable legal obligations. Retention periods
              and deletion procedures depend on the actual databases, backups,
              logs, and connected services used by the deployment. The project
              owner should define and publish those periods before production
              use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Security</h2>
            <p className="mt-3 text-text-secondary">
              Reasonable technical and organisational safeguards should be used
              to protect information from unauthorized access, loss, misuse, or
              disclosure. No system can guarantee absolute security. Access to
              sensitive identity information, if collected, requires
              particularly careful protection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Your privacy rights</h2>
            <p className="mt-3 text-text-secondary">
              Depending on the law that applies and the circumstances, you may
              have rights to request access to personal information, correction
              of inaccurate information, deletion, restriction or objection to
              certain processing, or other available remedies. Requests should
              be directed to the responsible project operator through its
              official contact channel. Some requests may be subject to lawful
              limitations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              9. Children's and other users' information
            </h2>
            <p className="mt-3 text-text-secondary">
              The prototype is not intended to encourage unnecessary collection
              of sensitive information. If a user is not legally able to provide
              consent independently, the responsible operator must establish the
              applicable requirements before collecting personal information
              from that user.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              10. International processing
            </h2>
            <p className="mt-3 text-text-secondary">
              If hosting or service providers process information in another
              country, that may involve an international transfer of data. The
              locations of the actual deployment and providers must be checked
              so that any applicable transfer requirements can be addressed.
              This draft does not determine which privacy law applies to the
              project.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              11. Changes to this policy
            </h2>
            <p className="mt-3 text-text-secondary">
              This policy may be updated as the prototype and its data flows
              change. The current version and its update date will be shown on
              this page. Where required, users will be informed of material
              changes and any additional consent will be obtained.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">12. Contact and questions</h2>
            <p className="mt-3 text-text-secondary">
              For privacy questions or requests relating to personal
              information, contact the GridX project team through the official
              contact channel provided by the responsible university or project
              operator. The final published policy should identify a specific
              responsible contact.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border-subtle pt-6 text-sm text-text-secondary">
          Also see our{' '}
          <Link
            to="/terms"
            className="font-semibold text-accent hover:underline"
          >
            Terms of Service
          </Link>
          .
        </div>
      </article>
    </main>
  );
}
