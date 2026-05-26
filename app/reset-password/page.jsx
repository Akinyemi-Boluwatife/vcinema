import { cookies } from "next/headers";
import Logo from "@/_components/layout/Logo";
import ResetPasswordForm from "@/_components/auth/ResetPasswordForm";
import { Card, CardContent } from "@/components/ui/card";
import { PW_RECOVERY_COOKIE } from "@/_lib/auth-cookies";

export const metadata = { title: "Reset password" };

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const isRecovery = cookieStore.get(PW_RECOVERY_COOKIE)?.value === "1";

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-10">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Logo size={26} />
            <h1 className="text-xl font-display mt-2 text-foreground">
              Set a new password
            </h1>
            <p className="text-muted-foreground text-sm text-center">
              {isRecovery
                ? "Choose a new password for your account."
                : "Enter your current password to confirm the change."}
            </p>
          </div>
          <ResetPasswordForm isRecovery={isRecovery} />
        </CardContent>
      </Card>
    </section>
  );
}
