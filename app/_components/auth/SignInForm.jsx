"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Input from "@/_components/ui/Input";
import {
  signInWithCredentials,
  signUpWithCredentials,
} from "@/_lib/actions";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignInForm() {
  const [mode, setMode] = useState("signin");
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const isSignup = mode === "signup";

  const onSubmit = (values) => {
    startTransition(async () => {
      const action = isSignup ? signUpWithCredentials : signInWithCredentials;
      const result = await action(values);
      if (result?.error) {
        setError("root", { message: result.error });
        return;
      }
      if (result?.ok && result?.message) {
        setSuccessMessage(result.message);
      }
    });
  };

  const toggleMode = () => {
    setMode(isSignup ? "signin" : "signup");
    setSuccessMessage(null);
    reset({ name: "", email: "", password: "", confirm: "" });
  };

  if (successMessage) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-on-surface text-sm">{successMessage}</p>
        <button
          type="button"
          onClick={() => {
            setSuccessMessage(null);
            setMode("signin");
          }}
          className="text-primary hover:underline text-sm font-medium"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSignup && (
        <Field label="Name" error={errors.name?.message}>
          <Input
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Name is required" })}
          />
        </Field>
      )}

      <Field label="Email" error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
          })}
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <Input
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: isSignup
              ? {
                  value: MIN_PASSWORD_LENGTH,
                  message: `Min ${MIN_PASSWORD_LENGTH} characters`,
                }
              : undefined,
          })}
        />
        {!isSignup && (
          <Link
            href="/forgot-password"
            className="block mt-1 text-right text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        )}
      </Field>

      {isSignup && (
        <Field label="Confirm password" error={errors.confirm?.message}>
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirm}
            {...register("confirm", {
              required: "Please confirm your password",
              validate: (v) =>
                v === getValues("password") || "Passwords do not match",
            })}
          />
        </Field>
      )}

      {errors.root?.message && (
        <p className="text-error text-xs">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary-dim transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending
          ? isSignup
            ? "Creating account..."
            : "Signing in..."
          : isSignup
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="text-center text-xs text-on-surface-variant">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={toggleMode}
          className="text-primary hover:underline font-medium"
        >
          {isSignup ? "Sign in" : "Create one"}
        </button>
      </p>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-on-surface text-sm">{label}</span>
      {children}
      {error && <span className="block text-error text-xs">{error}</span>}
    </label>
  );
}
