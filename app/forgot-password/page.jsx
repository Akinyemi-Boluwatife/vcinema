import Logo from "@/_components/layout/Logo";
import ForgotPasswordForm from "@/_components/auth/ForgotPasswordForm";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-10">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Logo size={26} />
            <h1 className="text-xl font-display mt-2 text-foreground">
              Forgot your password?
            </h1>
            <p className="text-muted-foreground text-sm text-center">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </section>
  );
}
