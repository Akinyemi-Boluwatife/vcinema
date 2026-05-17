import Logo from "@/_components/Logo";
import ResetPasswordForm from "@/_components/auth/ResetPasswordForm";

export const metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Logo />
          <p className="text-on-surface-variant text-sm text-center">
            Choose a new password for your account.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </section>
  );
}
