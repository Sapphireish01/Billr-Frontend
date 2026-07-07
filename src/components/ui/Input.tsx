import { cn } from "@/lib/utils";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "hint"> {
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, optional, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-bold text-text-primary">
          {label}
          {optional && (
            <span className="ml-1 font-normal text-text-muted">(Optional)</span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
            error && "border-danger focus:border-danger focus:ring-danger/15",
            className
          )}
          {...props}
        />
        {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
