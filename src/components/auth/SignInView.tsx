import SignInForm from './SignInForm';

export default function SignInView() {
  return (
    <>
      <header>
        <h1 className="font-heading text-heading-1">Welcome back</h1>

        <p className="mt-1.5 text-sm text-text-tertiary">
          Sign in to your GridX account
        </p>
      </header>

      <SignInForm />
    </>
  );
}
