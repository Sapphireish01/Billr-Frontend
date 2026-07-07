import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [1, 2, 3];

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
              step < currentStep && "bg-primary text-white",
              step === currentStep && "bg-primary text-white",
              step > currentStep && "border border-border text-text-muted"
            )}
          >
            {step < currentStep ? <Check size={12} /> : step}
          </div>
          {idx < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-6",
                step < currentStep ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
