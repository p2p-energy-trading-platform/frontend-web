import { useProfile } from '#/hooks/useProfile';
import PersonalInformation from './PersonalInformation';
import Security from './Security';
import TradingPreferences from './TradingPreferences';
import AccountStatus from './AccountStatus';
import ExternalServices from './ExternalServices';

export default function ProfileView() {
  const profileState = useProfile();
  const { source } = profileState;

  return (
    <main
      className="mx-auto w-full max-w-340 bg-bg-canvas px-4 py-6 text-text-primary sm:px-6 lg:px-8 lg:py-8"
      data-source={source}
    >
      <div className="mb-7 max-w-3xl">
        <h1 className="font-heading text-heading-1">Profile settings</h1>
        <p className="mt-1 text-sm text-text-tertiary">
          Manage your account, security, trading preferences and connected
          services.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <PersonalInformation />

          <Security />

          <TradingPreferences />

          <ExternalServices />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-20">
          <AccountStatus />
        </aside>
      </div>
    </main>
  );
}
