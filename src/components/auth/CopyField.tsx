"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyField({
  label,
  value,
  maskable = false,
}: {
  label: string;
  value: string;
  maskable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!maskable);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write can fail without permissions; fail silently
    }
  }

  const displayValue = revealed ? value : "•".repeat(Math.min(value.length, 32));

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-3.5 py-2.5">
        <span className="flex-1 truncate font-mono text-sm text-text-secondary">
          {displayValue}
        </span>
        {maskable && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? "Hide" : "Reveal"}
            className="text-text-muted hover:text-text-secondary"
          >
            {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy"
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            copied ? "text-success" : "text-primary hover:text-primary-dark"
          )}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
