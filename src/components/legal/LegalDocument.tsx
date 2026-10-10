import type { ReactNode } from 'react';

type LegalDocumentType = 'terms' | 'privacy';

const termsSections: { title: string; content: ReactNode }[] = [
  {
    title: '1. Acceptance of these terms',
    content:
      'By accessing or using GridX, you acknowledge that you have read and understood these Terms. If you do not agree, do not use the platform. Applicable university or institutional requirements continue to apply.',
  },
  {
    title: '2. Purpose and scope',
    content:
      'GridX is a university software prototype for educational and demonstration purposes. It explores concepts such as simulated energy offers, order matching, market activity, forecasting and simulated meter data. Features may be incomplete, experimental or changed during development.',
  },
  {
    title: '3. Simulated credits and transactions',
    content:
      'Credits, wallet balances, orders, prices, trades and transaction records displayed in GridX are simulated. Credits are not cash, deposits, electronic money or a claim against a bank or financial institution. They are not redeemable for money or physical electricity. Administrator-funded demo credits exist only for testing and demonstration. No real-money deposits, withdrawals, payments or financial settlements are processed by this prototype.',
  },
  {
    title: '4. No physical electricity delivery',
    content:
      'A simulated trade or energy quantity does not cause electricity to be generated, transferred, supplied or delivered. GridX does not connect users to a live electricity grid or arrange real-world energy supply agreements through this prototype. Meter readings, forecasts and market displays may be simulated or illustrative.',
  },
  {
    title: '5. Accounts and security',
    content:
      'You are responsible for providing accurate information where requested and taking reasonable steps to protect your account credentials. Do not share your password or attempt to access another person’s account. Notify the project team through its designated contact channel if you suspect unauthorized access.',
  },
  {
    title: '6. Acceptable use',
    content:
      'Do not misuse the platform, interfere with its operation, attempt unauthorized access, introduce malicious code, abuse other users, or misrepresent simulated activity as a real electricity or financial transaction. Comply with applicable laws and relevant institutional rules.',
  },
  {
    title: '7. Experimental features and availability',
    content:
      'GridX is provided for evaluation and development. Features may be unavailable, inaccurate, modified, reset or removed. Do not rely on simulated prices, forecasts, balances, analytics or records to make financial, energy-supply, safety or other real-world decisions.',
  },
  {
    title: '8. Intellectual property',
    content:
      'Unless otherwise stated, original code, designs and project materials remain subject to the rights of their respective owners and contributors. These Terms do not transfer intellectual property ownership to you. Third-party components remain subject to their own licences.',
  },
  {
    title: '9. Disclaimer',
    content:
      'To the extent permitted by applicable law, GridX is provided “as is” and “as available”, without a promise that it will be uninterrupted, error-free, accurate or suitable for a particular purpose. This disclaimer does not exclude protections that cannot legally be excluded.',
  },
  {
    title: '10. Limitation of liability',
    content:
      'To the extent permitted by applicable law, the GridX project team is not responsible for losses arising from reliance on simulated information, service interruptions or use of the prototype. Nothing in these Terms excludes liability where exclusion is prohibited by law.',
  },
  {
    title: '11. Privacy',
    content:
      'Personal information is handled as described in the GridX Privacy Policy. Please review that policy to understand the categories of information that may be processed and the purposes for which it may be used.',
  },
  {
    title: '12. Changes to these terms',
    content:
      'These Terms may be updated as the prototype develops. The current version and its update date will be published on this page. Continued use after an update remains subject to applicable law and any consent requirements.',
  },
  {
    title: '13. Applicable law',
    content:
      'The applicable law depends on the circumstances and the entity or institution operating GridX. These draft Terms do not determine jurisdiction or represent that the prototype has obtained regulatory approval. The responsible institution or operator should review and confirm the final governing-law provision.',
  },
  {
    title: '14. Contact',
    content:
      'For questions about these Terms, contact the GridX project team through the official contact channel provided by the responsible university or project operator.',
  },
];

const privacySections: { title: string; content: ReactNode }[] = [
  {
    title: '1. Who is responsible?',
    content:
      'GridX is being developed as a university project. The legal entity or institution responsible for operating the platform and handling privacy requests should be identified by the project owner before this policy is used as a final public notice.',
  },
  {
    title: '2. Information that may be processed',
    content: (
      <>
        <p>
          <strong>Account information:</strong> Depending on the features used,
          this may include your name, email address, account credentials or
          password verifier, and account status. Passwords should not be stored
          in plain text.
        </p>
        <p className="mt-3">
          <strong>Optional identity-verification information:</strong> The
          interface includes fields for a legal name, national identity or
          passport number, date of birth, and an identity-document image. The
          presence of a field does not by itself mean the information is
          submitted or stored. The actual submission and storage flow must be
          confirmed.
        </p>
        <p className="mt-3">
          <strong>Technical and security data:</strong> Where relevant to
          security and service operation, systems may process session
          identifiers, session expiry and revocation records, IP address,
          browser or device user-agent information, and authentication events.
        </p>
        <p className="mt-3">
          <strong>Prototype activity:</strong> The platform may process demo
          orders, simulated energy quantities, test wallet balances, simulated
          transaction records and application activity associated with an
          account. These do not prove a real electricity transfer or real-money
          payment.
        </p>
      </>
    ),
  },
  {
    title: '3. Why information may be used',
    content:
      'Depending on implemented features, information may be used to create and manage accounts, authenticate users, maintain sessions, protect against misuse, troubleshoot errors, operate prototype features and evaluate functionality. Optional identity information should not be collected merely because a field exists in the interface.',
  },
  {
    title: '4. Cookies and local storage',
    content:
      'The application may use browser storage or similar technologies to remember display preferences or support authentication. The exact technologies depend on the deployed configuration. Disabling storage may affect some functionality.',
  },
  {
    title: '5. Sharing and service providers',
    content:
      'Information may be processed by infrastructure and service providers used to operate the prototype, such as hosting, database, authentication, email-testing or monitoring services, if configured and receiving relevant data. The actual providers and data flows should be reviewed before making definitive statements about sharing. Information may also be disclosed where required by applicable law.',
  },
  {
    title: '6. Data retention and deletion',
    content:
      'Information should be retained only for as long as reasonably necessary for its documented purpose, project requirements, security and applicable legal obligations. The project owner should define retention periods and deletion procedures for databases, backups, logs and connected services before production use.',
  },
  {
    title: '7. Security',
    content:
      'Reasonable technical and organisational safeguards should be used to protect information from unauthorized access, loss, misuse or disclosure. No system can guarantee absolute security. Sensitive identity information, if collected, requires particularly careful protection.',
  },
  {
    title: '8. Your privacy rights',
    content:
      'Depending on applicable law and the circumstances, you may have rights to request access to personal information, correction of inaccurate information, deletion, restriction or objection to certain processing, or other available remedies. Contact the responsible project operator through its official contact channel. Some requests may be subject to lawful limitations.',
  },
  {
    title: '9. Children and other users',
    content:
      'The prototype is not intended to encourage unnecessary collection of sensitive information. Before collecting personal information from anyone who cannot legally provide consent independently, the responsible operator must establish and follow the applicable requirements.',
  },
  {
    title: '10. International processing',
    content:
      'If hosting or service providers process information in another country, this may involve an international data transfer. The deployment and provider locations must be checked so applicable transfer requirements can be addressed. This draft does not determine which privacy law applies.',
  },
  {
    title: '11. Changes to this policy',
    content:
      'This policy may be updated as the prototype and its data flows change. The current version and update date will be shown on this page. Where required, users will be informed of material changes and any additional consent will be obtained.',
  },
  {
    title: '12. Contact and questions',
    content:
      'For privacy questions or requests concerning personal information, contact the GridX project team through the official contact channel provided by the responsible university or project operator. The final published policy should identify a specific responsible contact.',
  },
];

export function LegalDocument({ type }: { type: LegalDocumentType }) {
  const isTerms = type === 'terms';
  const sections = isTerms ? termsSections : privacySections;

  return (
    <div className="space-y-6 text-sm leading-7 text-text-secondary">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
          GridX · Legal
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          {isTerms ? 'Terms of Service' : 'Privacy Policy'}
        </h2>
        <p className="mt-2 text-xs text-text-tertiary">
          Last updated: 10 October 2026
        </p>
        <p className="mt-4">
          {isTerms
            ? 'These Terms describe the conditions for using GridX, a university project and software prototype for exploring peer-to-peer energy trading concepts.'
            : 'This policy explains the categories of information that may be processed through GridX, a university software prototype. Actual processing depends on enabled features and their backend connections.'}
        </p>
      </div>

      <div className="rounded-lg border border-border-subtle bg-secondary/50 p-3">
        <p className="font-semibold text-text-primary">
          {isTerms ? 'Prototype notice' : 'Identity-data notice'}
        </p>
        <p className="mt-1">
          {isTerms
            ? 'GridX simulates trading and energy-related activity. It does not execute real electricity trades, deliver physical electricity, or process real-money payments or financial settlements.'
            : 'The interface may display optional identity-verification fields. Do not submit identity numbers or identity-document images unless the responsible project team has confirmed that the feature is enabled, necessary and approved for your use.'}
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="mb-2 text-base font-semibold text-text-primary">
            {section.title}
          </h3>
          {typeof section.content === 'string' ? (
            <p>{section.content}</p>
          ) : (
            section.content
          )}
        </section>
      ))}
    </div>
  );
}
