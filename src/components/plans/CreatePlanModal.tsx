"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Plan, BillingInterval } from "@/types";
import { planService } from "@/services/plans";

const INTERVALS: { value: BillingInterval; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
  { value: "custom", label: "Custom" },
];

function mapBackendPlanToPlan(bp: any): Plan {
  let interval: BillingInterval = "monthly";
  if (bp.billing_interval === "annually" || bp.billing_interval === "annual") {
    interval = "annual";
  } else if (bp.billing_interval === "custom") {
    interval = "custom";
  }

  return {
    id: String(bp.id),
    name: bp.name,
    price: Number(bp.price) || 0,
    billingInterval: interval,
    trialPeriodDays: bp.trial_period_in_days ? Number(bp.trial_period_in_days) : null,
    subscribers: bp.subscribers || 0,
    status: bp.status || "active",
    description: bp.description || "",
    createdAt: bp.created || new Date().toISOString(),
  };
}

import { useMutation } from "@tanstack/react-query";
import { parseFormErrors } from "@/lib/errors";

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
  const [trialDays, setTrialDays] = useState("");
  const [description, setDescription] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [nonFieldErrors, setNonFieldErrors] = useState<string | null>(null);

  function reset() {
    setName("");
    setPrice("");
    setInterval("monthly");
    setTrialDays("");
    setDescription("");
    setFieldErrors({});
    setNonFieldErrors(null);
  }

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
      billing_interval_in_days: interval === "custom" ? 30 : null,
    };

    createPlanMutation.mutate(payload);
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Plan">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                onClick={() => setInterval(opt.value)}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
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
          label="Trial Period"
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

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createPlanMutation.isPending}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
