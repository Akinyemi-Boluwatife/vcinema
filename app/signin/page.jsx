import { FcGoogle } from "react-icons/fc";
import Logo from "@/_components/Logo";
import SignInForm from "@/_components/auth/SignInForm";
import { signInWithGoogle } from "@/_lib/actions";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Logo />
          <p className="text-on-surface-variant text-sm text-center">
            Sign in to access your watchlist and more
          </p>
        </div>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-outline-variant bg-surface-low text-on-surface text-sm font-medium hover:bg-surface-high transition-colors duration-200"
          >
            <FcGoogle className="text-xl shrink-0" />
            Continue with Google
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/40" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface px-3 text-xs text-on-surface-variant">
              or
            </span>
          </div>
        </div>

        <SignInForm />
      </div>
    </section>
  );
}
