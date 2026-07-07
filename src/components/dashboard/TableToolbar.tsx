"use client";

import { Search } from "lucide-react";
import { ReactNode } from "react";

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  action,
  reverse = false,
  alignFiltersRight = false,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  action?: ReactNode;
  reverse?: boolean;
  alignFiltersRight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div
        className={`flex flex-1 items-center gap-3 ${
          reverse
            ? "flex-row-reverse justify-between"
            : alignFiltersRight
            ? "justify-between"
            : ""
        }`}
      >
        <div className="relative max-w-sm flex-1">
          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#131927]"
          />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-text-primary font-montserrat placeholder:text-gray-400/80 focus:border-blue-500 focus:outline-none transition-colors shadow-xs"
          />
        </div>
        {filters && (
          <div className="flex items-center gap-3">
            {filters}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
