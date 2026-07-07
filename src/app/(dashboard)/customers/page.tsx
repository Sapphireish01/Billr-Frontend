"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RowMenu, RowMenuItem } from "@/components/dashboard/RowMenu";
import { customers, plans } from "@/lib/mock-data";
import { formatDaysUntil } from "@/lib/utils";
import { CustomerStatus } from "@/types";

const PAGE_SIZE = 6;

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CustomerStatus>("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesPlan = planFilter === "all" || c.planId === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [search, statusFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-space">Customers</h1>
          <p className="mt-1 text-sm text-text-secondary font-space">
            Manage your subscription tiers and billing cycles.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50">
        <TableToolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search..."
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
                  { value: "active", label: "Active" },
                  { value: "trial", label: "Trial" },
                  { value: "past_due", label: "Past Due" },
                  { value: "cancelled", label: "Cancelled" },
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
                  ...plans.map((p) => ({ value: p.id, label: p.name })),
                ]}
              />
            </>
          }
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-light font-space text-lg font-bold uppercase tracking-normal text-[#131927] bg-[#C7DAFF] text-start leading-[1.7]">
                <th className="py-2 text-start pl-2">Customer Name</th>
                <th className="py-2 text-start">Email</th>
                <th className="py-2 text-start">Plan</th>
                <th className="py-2 text-start">Status</th>
                <th className="py-2 text-start">Next Billing</th>
                <th className="py-2 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((customer) => (
                <tr key={customer.id} className="border-b border-[#F3F4F6] font-montserrat last:border-0">
                  <td className="py-3.5 pl-2">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium text-[#131927] hover:text-[#0052FF]"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="py-3.5 text-[#131927]">{customer.email}</td>
                  <td className="py-3.5 text-[#131927]">{customer.planName}</td>
                  <td className="py-3.5">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="py-3.5 text-[#131927]">
                    {customer.nextBillingDate ? formatDaysUntil(customer.nextBillingDate) : "-"}
                  </td>
                  <td className="py-3.5 text-right">
                    <RowMenu>
                      <RowMenuItem href={`/customers/${customer.id}`}>
                        View Details
                      </RowMenuItem>
                      <RowMenuItem>Send Reminder</RowMenuItem>
                      <RowMenuItem danger>Cancel Subscription</RowMenuItem>
                    </RowMenu>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-text-muted">
                    No customers match your search.
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
            itemName="users"
          />
        </div>
      </div>
    </div>
  );
}
