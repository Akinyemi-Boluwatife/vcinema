"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/_lib/actions";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const result = await requestPasswordReset(values);
        if (result?.ok) {
          setSuccessMessage(result.message);
        } else {
          setError("root", {
            message: result?.error || "Something went wrong. Please try again.",
          });
        }
      } catch {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    });
  };

  if (successMessage) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-foreground text-sm">{successMessage}</p>
        <Link
          href="/signin"
          className="inline-block text-foreground hover:underline text-sm font-medium"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs text-muted-foreground font-normal">
          Email
        </Label>
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
        {errors.email && (
          <span className="block text-destructive text-xs">
            {errors.email.message}
          </span>
        )}
      </div>

      {errors.root?.message && (
        <p className="text-destructive text-xs">{errors.root.message}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 text-sm font-semibold"
      >
        {isPending ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Remembered it?{" "}
        <Link href="/signin" className="text-foreground hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
