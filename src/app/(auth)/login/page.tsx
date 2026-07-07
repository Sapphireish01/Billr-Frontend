"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

import { parseFormErrors } from "@/lib/errors";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [nonFieldErrors, setNonFieldErrors] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setNonFieldErrors(null);
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("businessEmail") as string;
    const password = formData.get("password") as string;

    login(email, password)
      .catch((err) => {
        setLoading(false);
        const parsed = parseFormErrors(err);
        setFieldErrors(parsed.fieldErrors);
        setNonFieldErrors(parsed.nonFieldErrors);
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary text-center">Welcome back</h1>
      <p className="mt-1 text-sm text-text-secondary text-center font-semibold" style={{ fontFamily: '"Montserrat", sans-serif' }}>Sign in to your Billr account.</p>

      {nonFieldErrors && (
        <div className="mt-4 rounded-lg bg-danger-bg p-3 text-sm text-danger text-center font-medium">
          {nonFieldErrors}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 font-space-grotesk">
        <Input
          label="Business Email"
          name="businessEmail"
          type="email"
          className="placeholder:text-sm font-montserrat text-[#9EA2AE]"
          placeholder="e.g. jane@yourcompany.com"
          error={fieldErrors.email || fieldErrors.business_email}
          required
        />

        <div>
          <PasswordInput
            label="Password"
            name="password"
            className="placeholder:text-sm font-montserrat text-[#9EA2AE]"
            placeholder="••••••••"
            error={fieldErrors.password}
            required
          />
          <Link
            href="/forgot-password"
            className="mt-1.5 inline-block text-sm font-medium text-primary hover:text-primary-dark font-montserrat"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" variant="primary" loading={loading} className="mt-2 w-full font-montserrat">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary font-montserrat">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:text-primary-dark">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
