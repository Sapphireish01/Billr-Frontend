import { Calendar, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { getStats, activityFeed } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const stats = getStats();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-space">Overview</h1>
          <p className="mt-1 text-sm text-text-secondary font-space">
            Real-time business performance and subscription metrics.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-[#2563EB] bg-transparent font-montserrat px-4 py-2.5 text-sm font-bold text-[#2563EB] hover:bg-blue-50/40 transition-colors shadow-xs cursor-pointer">
          <Calendar className="h-4 w-4" />
          <span>Last 3o Days</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Monthly Recurring Revenue"
          value={formatCurrency(stats.mrr).replace(/\.00$/, "")}
          hint={
            <>
              <span className="text-[#10B981] font-bold font-space">+12%</span>{" "}
              <span className="text-gray-400 font-space">Vs Last Month</span>
            </>
          }
        />
        <StatCard
          label="Active Subscribers"
          value={stats.activeSubscribers.toString()}
          hint={
            <>
              <span className="text-[#10B981] font-bold font-space">+8</span>{" "}
              <span className="text-gray-400 font-space">This Month</span>
            </>
          }
        />
        <StatCard
          label="Failed Payments"
          value={stats.failedPayments.toString()}
          hint={
            <>
              <span className="text-gray-400 font-space">Action Required For </span>
              <span className="text-[#EF4444] font-bold font-space">1 Account</span>
            </>
          }
        />
        <StatCard
          label="Churn Rate"
          value={stats.churnRate}
          hint={
            <>
              <span className="text-[#EF4444] font-bold font-space">-0.3%</span>{" "}
              <span className="text-gray-400 font-space">Vs Last Month</span>
            </>
          }
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
          <h2 className="text-xl font-bold text-text-primary font-space">Recent Activity</h2>
        </div>
        <div className="mt-2">
          <ActivityFeed events={activityFeed} />
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-bold text-[#0052FF] hover:underline font-space"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
