"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function Topbar() {
  const { merchant } = useAuth();
  const orgName = merchant?.business_name || "Billr Merchant";
  const initial = orgName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-border bg-surface px-8">
      <button
        aria-label="Notifications"
        className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted"
      >
        <Bell size={18} strokeWidth={2} />
      </button>

      <div className="flex items-center gap-2.5 border-l border-border pl-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
          {initial}
        </div>
        <span className="text-sm font-medium text-text-primary">{orgName}</span>
      </div>
    </header>
  );
}
