"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Input from "@/_components/ui/Input";
import { requestPasswordReset } from "@/_lib/actions";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  const onSubmit = (values) => {
    startTransition(async () => {
      const result = await requestPasswordReset(values);
      if (result?.ok) setSuccessMessage(result.message);
    });
  };

  if (successMessage) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-on-surface text-sm">{successMessage}</p>
        <Link
          href="/signin"
          className="inline-block text-primary hover:underline text-sm font-medium"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="block text-on-surface text-sm">Email</span>
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
        {errors.email && (
          <span className="block text-error text-xs">
            {errors.email.message}
          </span>
        )}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary-dim transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending..." : "Send reset link"}
      </button>

      <p className="text-center text-xs text-on-surface-variant">
        Remembered it?{" "}
        <Link href="/signin" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
