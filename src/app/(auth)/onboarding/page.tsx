"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { CopyField } from "@/components/auth/CopyField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const TEST_CLIENT_ID = "billr_test_client_c1a2b3d4e5f6a7b8c9d0";
const TEST_SECRET_KEY = "billr_test_sk_9f8e7d6c5b4a3928170695f4e3d2c1b0";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: persist webhook URL to the merchant account
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  }

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <StepIndicator currentStep={3} />
      </div>

      <h1 className="text-2xl font-semibold text-text-primary">You&apos;re almost in</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Set up your webhook endpoint and grab your API keys. You can update these anytime
        in settings.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <Input
          label="Webhook URL (Your Endpoint URL)"
          name="webhookUrl"
          placeholder="e.g. https://yourcompany.com/webhooks/billr"
          hint={
            <>
              We&apos;ll POST subscription events here.{" "}
              <a href="#" className="text-primary hover:text-primary-dark">
                Learn more
              </a>
            </>
          }
          optional
        />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">Your API Keys</span>
            <span className="rounded-full bg-warning-bg px-2 py-0.5 text-xs font-medium text-warning">
              Test
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <CopyField label="Test Client ID" value={TEST_CLIENT_ID} />
            <CopyField label="Test Secret Key" value={TEST_SECRET_KEY} maskable />
          </div>
          <p className="mt-3 text-xs text-text-muted">
            You can find your production keys after you verify your business.
          </p>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Go to Dashboard
        </Button>
      </form>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 block w-full text-center text-sm font-medium text-primary hover:text-primary-dark"
      >
        Skip for now — I&apos;ll set this up later
      </button>
    </div>
  );
}
