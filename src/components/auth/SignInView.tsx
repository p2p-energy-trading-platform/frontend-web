import SignInForm from './SignInForm';
import { useNavigate } from '@tanstack/react-router';
import { AuthBackButton } from '#/components/auth/AuthBackButton';
import { LogoMark } from '#/components/auth/AuthStepHeader';

export default function SignInView() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="flex h-14 items-center justify-between">
        <AuthBackButton onClick={() => void navigate({ to: '/' })} />
        <LogoMark />
      </header>
      <section className="mt-16 flex flex-1 flex-col">
        <header>
          <h1 className="font-heading text-[28px] leading-9 font-bold text-text-primary">
            Welcome back
          </h1>
          <p className="mt-2 text-[15px] leading-[22px] text-text-secondary">
            Sign in to your GridX account.
          </p>
        </header>
        <SignInForm />
      </section>
    </div>
  );
}
