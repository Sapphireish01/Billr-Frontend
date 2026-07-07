import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemName = "users",
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const showingCount = totalItems === 0 ? 0 : end - start + 1;

  return (
    <div className="flex items-center justify-between pt-4 text-sm text-text-secondary font-montserrat">
      <span className="text-gray-400 font-medium">
        Showing {showingCount} of {totalItems.toLocaleString()} {itemName}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-50/50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors shadow-xs"
        >
          <ArrowLeft size={16} className="text-gray-400" />
          <span>Prev</span>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "h-10 w-10 rounded-xl text-sm font-semibold transition-colors shadow-xs flex items-center justify-center cursor-pointer",
              p === page
                ? "border-2 border-[#0052FF] text-[#0052FF] bg-white font-bold"
                : "border border-gray-200/80 text-gray-400 bg-white hover:bg-gray-50/50"
            )}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1.5 rounded-xl bg-[#0052FF] px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:border-none transition-colors shadow-xs cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
