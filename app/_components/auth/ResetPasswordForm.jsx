"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { setNewPassword } from "@/_lib/actions";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordForm({ isRecovery = false }) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { currentPassword: "", password: "", confirm: "" },
  });

  const onSubmit = (values) => {
    startTransition(async () => {
      const result = await setNewPassword({
        password: values.password,
        currentPassword: isRecovery ? undefined : values.currentPassword,
      });
      if (result?.error) setError("root", { message: result.error });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isRecovery && (
        <Field
          id="currentPassword"
          label="Current password"
          error={errors.currentPassword?.message}
        >
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.currentPassword}
            className="h-10"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
          />
        </Field>
      )}

      <Field id="password" label="New password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className="h-10"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: `Min ${MIN_PASSWORD_LENGTH} characters`,
            },
          })}
        />
      </Field>

      <Field id="confirm" label="Confirm new password" error={errors.confirm?.message}>
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

      {errors.root?.message && (
        <p className="text-destructive text-xs">{errors.root.message}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 text-sm font-semibold"
      >
        {isPending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground font-normal">
        {label}
      </Label>
      {children}
      {error && <span className="block text-destructive text-xs">{error}</span>}
    </div>
  );
}
