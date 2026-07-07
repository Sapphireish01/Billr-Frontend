"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

const LENGTH = 6;

export function OTPInput({
  onComplete,
}: {
  onComplete?: (code: string) => void;
}) {
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function updateValues(next: string[]) {
    setValues(next);
    const code = next.join("");
    if (code.length === LENGTH && !next.includes("")) {
      onComplete?.(code);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    updateValues(next);

    if (digit && index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    updateValues(next);
    const focusIndex = Math.min(pasted.length, LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  return (
    <div className="flex gap-2.5">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-12 rounded-lg border text-center text-lg font-semibold text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/15",
            value ? "border-primary" : "border-border focus:border-primary"
          )}
        />
      ))}
    </div>
  );
}
