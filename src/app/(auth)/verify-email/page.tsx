"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { OTPInput } from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/Button";

import { useAuth } from "@/components/auth/AuthProvider";

import { parseFormErrors } from "@/lib/errors";

const RESEND_SECONDS = 30;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "you@company.com";
  const { confirmOtp } = useAuth();

  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleVerify() {
    if (!code) return;
    setErrorMsg(null);
    setLoading(true);
    confirmOtp(email, code)
      .catch((err) => {
        setLoading(false);
        const parsed = parseFormErrors(err);
        setErrorMsg(parsed.nonFieldErrors || parsed.fieldErrors.otp || parsed.fieldErrors.code || "OTP verification failed");
      });
  }

  function handleResend() {
    setSecondsLeft(RESEND_SECONDS);
    // Note: since there's no specific resend endpoint documented, we can leave this as mock/placeholder
  }

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <StepIndicator currentStep={2} />
      </div>

      <h1 className="text-2xl font-semibold text-text-primary">Check your email</h1>
      <p className="mt-1 text-sm text-text-secondary">
        We sent a 6 digit code to{" "}
        <span className="font-medium text-text-primary">{email}</span>. Enter it below.
        Code expires in 10 minutes.
      </p>

      {errorMsg && (
        <div className="mt-4 rounded-lg bg-danger-bg p-3 text-sm text-danger font-medium">
          {errorMsg}
        </div>
      )}

      <div className="mt-8">
        <OTPInput onComplete={setCode} />
      </div>

      <p className="mt-4 text-sm text-text-secondary">
        Didn&apos;t get the code?{" "}
        {secondsLeft > 0 ? (
          <span className="text-text-muted">
            Resend code (0:{secondsLeft.toString().padStart(2, "0")})
          </span>
        ) : (
          <button
            onClick={handleResend}
            className="font-medium text-primary hover:text-primary-dark"
          >
            Resend code
          </button>
        )}
      </p>

      <Button
        onClick={handleVerify}
        loading={loading}
        disabled={!code}
        className="mt-6 w-full"
      >
        Verify Email
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
