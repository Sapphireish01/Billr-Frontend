"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { RowMenu, RowMenuItem } from "@/components/dashboard/RowMenu";
import { invoices, plans } from "@/lib/mock-data";
import { formatDaysUntil, formatCurrency } from "@/lib/utils";
import { InvoiceStatus } from "@/types";

const PAGE_SIZE = 6;

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const q = search.toLowerCase();
      const matchesSearch =
        inv.customerName.toLowerCase().includes(q) ||
        inv.customerEmail.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      const matchesPlan = planFilter === "all" || inv.planName === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [search, statusFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Invoices</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your subscription tiers and billing cycles.
          </p>
        </div>
        <Button>
          <Download size={16} /> Export
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <TableToolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search invoices..."
          alignFiltersRight={true}
          filters={
            <>
              <FilterDropdown
                value={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v as typeof statusFilter);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "paid", label: "Paid" },
                  { value: "pending", label: "Pending" },
                  { value: "failed", label: "Failed" },
                ]}
              />
              <FilterDropdown
                value={planFilter}
                onChange={(v) => {
                  setPlanFilter(v);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Plans" },
                  ...plans.map((p) => ({ value: p.name, label: p.name })),
                ]}
              />
            </>
          }
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-light text-xl capitalize tracking-wide text-text-primary bg-[#C7DAFF]">
                <th className="py-1.5 pl-2 font-semibold">Customer Name</th>
                <th className="py-1.5 font-semibold">Email</th>
                <th className="py-1.5 font-semibold">Plan</th>
                <th className="py-1.5 font-semibold">Status</th>
                <th className="py-1.5 font-semibold">Amount</th>
                <th className="py-1.5 font-semibold">Next Billing</th>
                <th className="py-1.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((invoice) => (
                <tr key={invoice.id} className="border-b border-[#9EA2AE]last:border-0 font-montserrat">
                  <td className="py-3.5">
                    <Link
                      href={`/customers/${invoice.customerId}`}
                      className="font-medium text-[#131927] hover:[#131927]"
                    >
                      {invoice.customerName}
                    </Link>
                  </td>
                  <td className="py-3.5 text-[#131927]">{invoice.customerEmail}</td>
                  <td className="py-3.5 text-[#131927]">{invoice.planName}</td>
                  <td className="py-3.5">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="py-3.5 text-[#131927]">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="py-3.5 text-[#131927]">
                    {formatDaysUntil(invoice.nextBillingDate)}
                  </td>
                  <td className="py-3.5 text-right">
                    <RowMenu>
                      <RowMenuItem>Download PDF</RowMenuItem>
                      <RowMenuItem>Resend Invoice</RowMenuItem>
                      {invoice.status === "failed" && (
                        <RowMenuItem>Retry Payment</RowMenuItem>
                      )}
                    </RowMenu>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-muted">
                    No invoices match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            itemName="invoices"
          />
        </div>
      </div>
    </div>
  );
}
