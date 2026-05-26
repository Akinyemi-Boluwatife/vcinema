"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  signInWithCredentials,
  signUpWithCredentials,
} from "@/_lib/actions";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignInForm({ next }) {
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
      const result = await action({ ...values, next });
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
        <p className="text-foreground text-sm">{successMessage}</p>
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
        <Field id="name" label="Name" error={errors.name?.message}>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className="h-10"
            {...register("name", { required: "Name is required" })}
          />
        </Field>
      )}

      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          className="h-10"
          {...register("email", {
            required: "Email is required",
            pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
          })}
        />
      </Field>

      <Field
        id="password"
        label="Password"
        error={errors.password?.message}
        trailingLabel={
          !isSignup ? (
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground no-underline"
            >
              Forgot password?
            </Link>
          ) : null
        }
      >
        <Input
          id="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className="h-10"
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
      </Field>

      {isSignup && (
        <Field id="confirm" label="Confirm password" error={errors.confirm?.message}>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirm}
            className="h-10"
            {...register("confirm", {
              required: "Please confirm your password",
              validate: (v) =>
                v === getValues("password") || "Passwords do not match",
            })}
          />
        </Field>
      )}

      {errors.root?.message && (
        <p className="text-destructive text-xs">{errors.root.message}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 text-sm font-semibold"
      >
        {isPending
          ? isSignup
            ? "Creating account..."
            : "Signing in..."
          : isSignup
            ? "Create account"
            : "Sign in"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={toggleMode}
          className="text-foreground hover:underline font-medium"
        >
          {isSignup ? "Sign in" : "Sign up"}
        </button>
      </p>
    </form>
  );
}

function Field({ id, label, trailingLabel, error, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id} className="text-xs text-muted-foreground font-normal">
          {label}
        </Label>
        {trailingLabel}
      </div>
      {children}
      {error && <span className="block text-destructive text-xs">{error}</span>}
    </div>
  );
}
