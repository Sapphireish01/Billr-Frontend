"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

const BUSINESS_TYPES = [
  { value: "saas", label: "SaaS" },
  { value: "e_commerce", label: "E-commerce" },
  { value: "finance", label: "Finance" },
  { value: "marketplace", label: "Marketplace" },
  { value: "subscription", label: "Subscription" },
];

import { parseFormErrors } from "@/lib/errors";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [businessEmail, setBusinessEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [nonFieldErrors, setNonFieldErrors] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setNonFieldErrors(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const businessName = formData.get("businessName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const businessType = formData.get("businessType") as string;
    const websiteUrl = formData.get("websiteUrl") as string;
    const fullName = formData.get("fullName") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    const payload = {
      business_name: businessName,
      business_email: businessEmail,
      phone_number: phoneNumber,
      business_type: businessType,
      full_name: fullName,
      password1: password,
      password2: confirmPassword,
      web_url: websiteUrl || null,
    };

    register(payload)
      .then(() => {
        router.push("/login");
      })
      .catch((err) => {
        setLoading(false);
        const parsed = parseFormErrors(err);
        setFieldErrors(parsed.fieldErrors);
        setNonFieldErrors(parsed.nonFieldErrors);
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary">Create your account</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Set up your Billr merchant account.
      </p>

      {nonFieldErrors && (
        <div className="mt-4 rounded-lg bg-danger-bg p-3 text-sm text-danger font-medium">
          {nonFieldErrors}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Input
          label="Business Name"
          name="businessName"
          placeholder="e.g. Fatura Inc"
          error={fieldErrors.business_name || fieldErrors.businessName}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Business Email"
            name="businessEmail"
            type="email"
            placeholder="e.g. jane@yourcompany.com"
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            error={fieldErrors.business_email || fieldErrors.businessEmail}
            required
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="e.g. 080 1234 5678"
            error={fieldErrors.phone_number || fieldErrors.phoneNumber}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Business Type"
            name="businessType"
            options={BUSINESS_TYPES}
            placeholder="Select a type"
            error={fieldErrors.business_type || fieldErrors.businessType}
            required
          />
          <Input
            label="Website URL"
            name="websiteUrl"
            placeholder="e.g. yourcompany.com"
            error={fieldErrors.web_url || fieldErrors.websiteUrl}
            optional
          />
        </div>

        <Input
          label="Full Name"
          name="fullName"
          placeholder="e.g. Jane Doe"
          error={fieldErrors.full_name || fieldErrors.fullName}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <PasswordInput
            label="Password"
            name="password"
            placeholder="••••••••"
            error={fieldErrors.password1 || fieldErrors.password}
            required
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="••••••••"
            error={fieldErrors.password2 || fieldErrors.confirmPassword}
            required
          />
        </div>

        <Button type="submit" loading={loading} className="mt-2 w-full">
          Continue
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
          Log in
        </Link>
      </p>
    </div>
  );
}
