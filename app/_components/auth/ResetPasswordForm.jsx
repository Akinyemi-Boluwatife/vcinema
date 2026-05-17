"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import Input from "@/_components/ui/Input";
import { setNewPassword } from "@/_lib/actions";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: { password: "", confirm: "" } });

  const onSubmit = (values) => {
    startTransition(async () => {
      const result = await setNewPassword({ password: values.password });
      if (result?.error) setError("root", { message: result.error });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="New password" error={errors.password?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: `Min ${MIN_PASSWORD_LENGTH} characters`,
            },
          })}
        />
      </Field>

      <Field label="Confirm new password" error={errors.confirm?.message}>
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

      {errors.root?.message && (
        <p className="text-error text-xs">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-primary-container text-on-primary-container text-sm font-semibold hover:bg-primary-dim transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Saving..." : "Set new password"}
      </button>
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
