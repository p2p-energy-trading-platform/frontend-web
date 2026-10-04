import SignInForm from "./SignInForm";
import SignInVisualPanel from "./SignInVisualPanel";

export default function SignInView() {
    return (
        <main className="min-h-screen overflow-y-auto bg-background text-foreground">
            <div className="grid min-h-screen lg:grid-cols-2">
                <section className="flex justify-center bg-background px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
                    <div className="w-full max-w-105">
                        <header>
                            <h1 className="font-heading text-heading-1">Welcome back</h1>

                            <p className="mt-1.5 text-sm text-text-tertiary">
                                Sign in to your GridX account
                            </p>
                        </header>

                        <SignInForm />
                    </div>
                </section>

                <SignInVisualPanel />
            </div>
        </main>
    );
}