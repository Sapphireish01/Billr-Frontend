import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50">
      <div className="text-xs font-bold text-[#131927] tracking-wide font-space">{label}</div>
      <div className="mt-3 text-3xl font-bold text-[#0052FF] font-space">{value}</div>
      {hint && (
        <div className="mt-3 text-xs font-medium font-space">
          {hint}
        </div>
      )}
    </div>
  );
}
