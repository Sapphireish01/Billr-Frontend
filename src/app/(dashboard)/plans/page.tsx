"use client";

import { useMemo, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { RowMenu, RowMenuItem } from "@/components/dashboard/RowMenu";
import { CreatePlanModal } from "@/components/plans/CreatePlanModal";
import { formatCurrency } from "@/lib/utils";
import { Plan, PlanStatus, BillingInterval } from "@/types";
import { planService } from "@/services/plans";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 6;

const INTERVAL_LABEL: Record<Plan["billingInterval"], string> = {
  monthly: "Monthly",
  annual: "Annual",
  custom: "Custom",
};

function mapBackendPlanToPlan(bp: any): Plan {
  let interval: BillingInterval = "monthly";
  if (bp.billing_interval === "annually" || bp.billing_interval === "annual") {
    interval = "annual";
  } else if (bp.billing_interval === "custom") {
    interval = "custom";
  }

  return {
    id: String(bp.id),
    name: bp.name,
    price: Number(bp.price) || 0,
    billingInterval: interval,
    trialPeriodDays: bp.trial_period_in_days ? Number(bp.trial_period_in_days) : null,
    subscribers: bp.subscribers || 0,
    status: bp.status || "active",
    description: bp.description || "",
    createdAt: bp.created || new Date().toISOString(),
  };
}

export default function PlansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PlanStatus>("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planService.getPlans,
    select: (data) => data.map(mapBackendPlanToPlan),
  });

  const filtered = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [plans, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Plans</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your subscription tiers and billing cycles.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="font-montserrat">
          <Plus size={16} /> Create Plan
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <TableToolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search assets..."
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-light font-space text-xl font-bold uppercase tracking-normal text-[#131927] bg-[#C7DAFF] text-start leading-[1.7]">
                <th className="py-1 text-start pl-1">Plan Name</th>
                <th className="py-1 text-start">Price</th>
                <th className="py-1 text-start">Billing Interval</th>
                <th className="py-1 text-start">Trial Period</th>
                <th className="py-1 text-start">Subscribers</th>
                <th className="py-1 text-start">Status</th>
                <th className="py-1 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  </td>
                </tr>
              ) : (
                paged.map((plan) => (
                  <tr key={plan.id} className="border-b border-border-light font-montserrat last:border-0">
                    <td className="py-3.5 font-medium text-[#131927]">{plan.name}</td>
                    <td className="py-3.5 text-[#131927]">
                      {plan.price > 0 ? formatCurrency(plan.price) : "Custom"}
                    </td>
                    <td className="py-3.5 text-[#131927]">
                      {INTERVAL_LABEL[plan.billingInterval]}
                    </td>
                    <td className="py-3.5 text-[#131927]">
                      {plan.trialPeriodDays ? `${plan.trialPeriodDays} days` : "None"}
                    </td>
                    <td className="py-3.5 text-[#131927]">{plan.subscribers}</td>
                    <td className="py-3.5">
                      <StatusBadge status={plan.status} />
                    </td>
                    <td className="py-3.5 text-right">
                      <RowMenu>
                        <RowMenuItem>Edit Plan</RowMenuItem>
                        <RowMenuItem>View Subscribers</RowMenuItem>
                        <RowMenuItem danger>Archive Plan</RowMenuItem>
                      </RowMenu>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-muted">
                    No plans match your search.
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
            itemName="plans"
          />
        </div>
      </div>

      <CreatePlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={() => queryClient.invalidateQueries({ queryKey: ["plans"] })}
      />
    </div>
  );
}
