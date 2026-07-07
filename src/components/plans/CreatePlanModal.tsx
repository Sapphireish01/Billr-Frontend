"use client";

import { FormEvent, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { BillingInterval } from "@/types";
import { planService } from "@/services/plans";
import { useMutation } from "@tanstack/react-query";
import { parseFormErrors } from "@/lib/errors";

const INTERVALS: { value: BillingInterval; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
  { value: "custom", label: "Custom" },
];

export function CreatePlanModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [billingIntervalInDays, setBillingIntervalInDays] = useState("30");
  const [trialDays, setTrialDays] = useState("");
  const [description, setDescription] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [nonFieldErrors, setNonFieldErrors] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function reset() {
    setName("");
    setPrice("");
    setInterval("monthly");
    setBillingIntervalInDays("30");
    setTrialDays("");
    setDescription("");
    setFieldErrors({});
    setNonFieldErrors(null);
  }

  const handleIntervalChange = (val: BillingInterval) => {
    setInterval(val);
    if (val === "monthly") {
      setBillingIntervalInDays("30");
    } else if (val === "annual") {
      setBillingIntervalInDays("365");
    } else if (val === "custom") {
      setBillingIntervalInDays("30");
    }
  };

  const createPlanMutation = useMutation({
    mutationFn: planService.createPlan,
    onSuccess: () => {
      onCreate();
      reset();
      onClose();
    },
    onError: (err) => {
      const parsed = parseFormErrors(err);
      setFieldErrors(parsed.fieldErrors);
      setNonFieldErrors(parsed.nonFieldErrors);
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setNonFieldErrors(null);

    const payload = {
      name,
      description,
      price,
      billing_interval: interval === "annual" ? "annually" : interval,
      trial_period_in_days: trialDays ? Number(trialDays) : 0,
      billing_interval_in_days: Number(billingIntervalInDays) || 30,
    };

    createPlanMutation.mutate(payload);
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#0c111d]/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer Panel */}
      <div className="relative h-full w-[40%] min-w-[380px] max-w-[600px] bg-surface shadow-2xl flex flex-col border-l border-border animate-slide-in">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-lg font-semibold text-text-primary">Create Plan</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {nonFieldErrors && (
              <div className="rounded-lg bg-danger-bg p-3 text-sm text-danger font-medium">
                {nonFieldErrors}
              </div>
            )}
            <Input
              label="Plan Name"
              placeholder="e.g. Growth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name || fieldErrors.business_name}
              required
            />
            <Input
              label="Price"
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={fieldErrors.price}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Billing Interval</label>
              <div className="flex rounded-lg border border-border p-1">
                {INTERVALS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleIntervalChange(opt.value)}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors cursor-pointer",
                      interval === opt.value
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:bg-surface-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {fieldErrors.billing_interval && (
                <span className="text-xs text-danger">{fieldErrors.billing_interval}</span>
              )}
            </div>

            <Input
              label="Billing Interval (Days)"
              type="number"
              placeholder="e.g. 30"
              value={billingIntervalInDays}
              onChange={(e) => setBillingIntervalInDays(e.target.value)}
              readOnly={interval !== "custom"}
              className={cn(
                interval !== "custom" && "bg-surface-muted text-text-secondary cursor-not-allowed"
              )}
              error={fieldErrors.billing_interval_in_days}
              required
            />

            <Input
              label="Trial Period (Days)"
              type="number"
              placeholder="e.g. 30 days"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              error={fieldErrors.trial_period_in_days}
              optional
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Description <span className="font-normal text-text-muted">(Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's included in this plan?"
                rows={3}
                className={cn(
                  "resize-none rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
                  fieldErrors.description && "border-danger focus:border-danger focus:ring-danger/15"
                )}
              />
              {fieldErrors.description && (
                <span className="text-xs text-danger">{fieldErrors.description}</span>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-3 border-t border-border pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={createPlanMutation.isPending}>
                Create Plan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
