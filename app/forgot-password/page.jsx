import Logo from "@/_components/Logo";
import ForgotPasswordForm from "@/_components/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Logo />
          <p className="text-on-surface-variant text-sm text-center">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </section>
  );
}
