import { FcGoogle } from "react-icons/fc";
import Logo from "@/_components/layout/Logo";
import SignInForm from "@/_components/auth/SignInForm";
import { signInWithGoogle } from "@/_lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Sign in" };

const ERROR_COPY = {
  auth_callback_failed: "We couldn't complete that sign-in. Please try again.",
};

function safeNext(value) {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export default async function SignInPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const next = safeNext(sp.next);
  const errorMessage =
    typeof sp.error === "string" ? ERROR_COPY[sp.error] : null;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-10 bg-background">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Logo size={28} />

            <p className="text-muted-foreground text-sm text-center">
              Sign in to your private journal.
            </p>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="text-destructive text-xs text-center bg-destructive/10 border border-destructive/30 rounded-md py-2 px-3"
            >
              {errorMessage}
            </p>
          )}

          <form action={signInWithGoogle}>
            {next && <input type="hidden" name="next" value={next} />}
            <Button
              type="submit"
              variant="outline"
              className="w-full h-11 text-sm font-medium"
            >
              <FcGoogle className="text-xl shrink-0" aria-hidden />
              Continue with Google
            </Button>
          </form>

          <div className="divider-or">or</div>

          <SignInForm next={next} />
        </CardContent>
      </Card>
    </section>
  );
}
