import { cn } from "@/lib/utils";

type Status =
  | "active"
  | "trial"
  | "past_due"
  | "cancelled"
  | "paid"
  | "pending"
  | "failed"
  | "draft"
  | "archived"
  | "paused";

const STATUS_STYLES: Record<Status, string> = {
  active: "bg-[#D1FAE5]",
  paid: "bg-[#D1FAE5]",
  trial: "bg-[#DBEAFE]",
  pending: "bg-[#FEF3C7]",
  past_due: "bg-[#FEF3C7]",
  failed: "bg-[#FEE2E2]",
  cancelled: "bg-[#FEE2E2]",
  draft: "bg-gray-100 ",
  archived: "bg-gray-100",
  paused: "bg-[#E5E7EB]",
};

const STATUS_LABELS: Record<Status, string> = {
  active: "Active",
  paid: "Paid",
  trial: "Trial",
  pending: "Pending",
  past_due: "Past Due",
  failed: "Failed",
  cancelled: "Cancelled",
  draft: "Draft",
  archived: "Archived",
  paused: "Paused",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center text-center align-middle rounded-md px-2.5 py-1 text-[12px] font-medium font-space tracking-normal leading-none text-[#000000] capitalize w-23 h-5.5",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
