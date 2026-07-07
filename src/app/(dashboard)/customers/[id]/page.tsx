import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RotateCcw, Download, CheckCircle, XCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getCustomerById, getPlanById, invoices } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getCustomerById(id);
  if (!customer) notFound();

  const plan = getPlanById(customer.planId);
  const customerInvoices = invoices.filter((inv) => inv.customerId === customer.id);

  // Generate realistic timeline based on customer startDate
  const startD = new Date(customer.startDate);
  const timeline = [
    {
      time: `${formatDate(startD)} · 10:02 AM`,
      label: "Subscription created (Trial)",
    },
    {
      time: `${formatDate(new Date(startD.getTime() + 7 * 86400000))} · 12:00 AM`,
      label: "Subscription created",
    },
    ...(customer.status === "past_due" || customer.status === "cancelled"
      ? [
        {
          time: `${formatDate(new Date(startD.getTime() + 15 * 86400000))} · 08:14 AM`,
          label: "Charge failed",
        },
      ]
      : []),
    ...(customer.status === "past_due"
      ? [
        {
          time: `${formatDate(new Date(startD.getTime() + 16 * 86400000))} · 09:00 AM`,
          label: "Dunning retry 1 of 3 — failed",
        },
      ]
      : []),
  ];

  // Mock payment history list
  const paymentHistory = [
    {
      description: customer.status === "past_due" ? "Retry attempt" : "Monthly charge",
      date: formatDate(new Date(startD.getTime() + 16 * 86400000)),
      amount: plan ? formatCurrency(plan.price).replace(/\.00$/, "") : "₦25,000",
      status: customer.status === "past_due" ? "failed" : "paid",
    },
    {
      description: "Monthly charge",
      date: formatDate(new Date(startD.getTime() + 7 * 86400000)),
      amount: plan ? formatCurrency(plan.price).replace(/\.00$/, "") : "₦25,000",
      status: "paid",
    },
    {
      description: "First charge · Trial conversion",
      date: formatDate(startD),
      amount: plan ? formatCurrency(plan.price).replace(/\.00$/, "") : "₦25,000",
      status: "paid",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm text-[#000000] font-montserrat">
        <Link href="/customers" className="hover:text-[#0052FF] transition-colors">
          Customers
        </Link>
        <ChevronRight size={14} className="text-[#000000]" />
        <span className="text-[#0052FF]">Customer details</span>
      </div>

      {/* Header Profile Card */}
      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50">
        <Avatar name={customer.name} size={64} className="bg-[#0052FF] text-white font-bold" />
        <div>
          <h1 className="text-3xl font-bold text-[#131927] font-space">{customer.name}</h1>
          <p className="text-sm text-gray-400 font-montserrat mt-0.5">{customer.email}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={customer.status} />
        </div>
      </div>

      {/* Upper Grid: Subscription Info vs Payment Method & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* Left Side: Subscription Info */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50 h-full">
            <h2 className="text-2xl font-bold text-[#131927] font-montserrat mb-6">Subscription Info</h2>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="flex flex-row items-center p-0 gap-1.5 text-xs font-semibold text-[#131927] capitalize tracking-wide font-montserrat flex-none order-0 grow-0">
                  Plan
                </span>
                <span className="flex flex-row items-center p-0 gap-1.5 mt-1 text-sm  text-[#131927] font-montserrat flex-none order-1 grow-0">
                  {customer.planName}
                </span>
              </div>
              <div>
                <span className="flex flex-row items-center p-0 gap-1.5 text-xs font-semibold text-[#131927] capitalize tracking-wide font-montserrat flex-none order-0 grow-0">
                  Billing interval
                </span>
                <span className="flex flex-row items-center p-0 gap-1.5 mt-1 text-sm  text-[#131927] font-montserrat capitalize flex-none order-1 grow-0">
                  {plan?.billingInterval ?? "Monthly"}
                </span>
              </div>
              <div>
                <span className="flex flex-row items-center p-0 gap-1.5 text-xs font-semibold text-[#131927] capitalize tracking-wide font-montserrat flex-none order-0 grow-0">
                  Start Date
                </span>
                <span className="flex flex-row items-center p-0 gap-1.5 mt-1 text-sm  text-[#131927] font-montserrat flex-none order-1 grow-0">
                  {formatDate(customer.startDate)}
                </span>
              </div>
              <div>
                <span className="flex flex-row items-center p-0 gap-1.5 text-xs font-semibold text-[#131927] capitalize tracking-wide font-montserrat flex-none order-0 grow-0">
                  Next Billing
                </span>
                {customer.status === "past_due" ? (
                  <span className="flex flex-row items-center p-0 gap-1.5 mt-1 text-sm  text-[#D97706] font-montserrat flex-none order-1 grow-0">
                    Retry {customer.nextBillingDate ? formatDate(customer.nextBillingDate) : "—"}
                  </span>
                ) : (
                  <span className="flex flex-row items-center p-0 gap-1.5 mt-1 text-sm  text-[#131927] font-montserrat flex-none order-1 grow-0">
                    {customer.nextBillingDate ? formatDate(customer.nextBillingDate) : "—"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Method & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6 justify-between">
          {/* Payment Method */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50 flex-1">
            <h2 className="text-xl font-bold text-[#131927] font-montserrat mb-4">Payment Method</h2>
            {customer.paymentMethod ? (
              <div className="flex items-center gap-3">
                <div className="w-22.25 h-13.25 shrink-0">
                  <div
                    className="w-full h-full rounded bg-cover bg-no-repeat bg-center"
                    style={{ backgroundImage: "url(/checkers.png)" }}
                  />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-[#131927] font-montserrat">
                    {customer.paymentMethod.brand} ending in {customer.paymentMethod.last4}
                  </span>
                  <span className="block text-xs text-gray-400 font-montserrat mt-2.5">
                    Expires {customer.paymentMethod.expires}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-400 font-montserrat">No payment method on file.</span>
            )}
          </div>

          {/* Actions */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50 flex-1">
            <h2 className="text-xl font-bold text-[#131927] font-montserrat mb-4">Actions</h2>
            <div className="flex items-center gap-4">
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#0052FF] px-4 py-2.5 text-sm font-bold text-[#0052FF] hover:bg-blue-50/40 transition-colors font-montserrat cursor-pointer shadow-xs">
                <RotateCcw size={16} />
                <span>Trigger Retry</span>
              </button>
              <button className="flex-1 flex items-center justify-center rounded-xl bg-[#0052FF] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors font-montserrat cursor-pointer shadow-xs">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Grid: Subscription Timeline vs Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* Left Side: Subscription Timeline */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50 h-full">
            <h2 className="text-xl font-bold text-[#131927] font-montserrat mb-6">Subscription timeline</h2>
            <div className="relative pl-6 border-l-2 border-blue-100/80 ml-2 flex flex-col gap-6">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-7.75 top-1.5 h-3.5 w-3.5 rounded-full bg-[#0052FF] border-2 border-white shrink-0 shadow-xs" />
                  <div>
                    <span className="block text-xs font-medium text-gray-400 font-montserrat">
                      {event.time}
                    </span>
                    <span className="block mt-0.5 text-sm font-bold text-[#131927] font-montserrat">
                      {event.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Invoices */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50 h-full">
            <h2 className="text-xl font-bold text-[#131927] font-montserrat mb-4">Recent invoices</h2>
            <div className="flex flex-col gap-4">
              {customerInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between border-b border-[#F3F4F6] pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <span className="block text-sm font-bold text-[#131927] font-montserrat">
                      #{inv.id}
                    </span>
                    <span className="block text-xs text-gray-400 font-montserrat mt-0.5">
                      29 Jun 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      {inv.status === "failed" ? (
                        <>
                          <XCircle size={14} className="text-[#EF4444]" />
                          <span className="text-sm font-bold text-[#EF4444] font-montserrat">Failed</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} className="text-[#10B981]" />
                          <span className="text-sm font-bold text-[#10B981] font-montserrat">Paid</span>
                        </>
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#131927] font-montserrat">
                      {formatCurrency(inv.amount).replace(/\.00$/, "")}
                    </span>
                    <button className="text-[#0052FF] hover:text-blue-700 cursor-pointer">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {customerInvoices.length === 0 && (
                <span className="text-sm text-gray-400 font-montserrat">No invoices found.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History (Full Width) */}
      <div className="rounded-2xl bg-white p-6 shadow-xs border border-gray-100/50">
        <h2 className="text-xl font-bold text-[#131927] font-space mb-4">Payment history</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-light font-space text-lg font-bold capitalize tracking-normal text-[#131927] bg-[#C7DAFF] text-start leading-[1.7]">
                <th className="py-2.5 text-start pl-2">Description</th>
                <th className="py-2.5 text-start">Date</th>
                <th className="py-2.5 text-start">Amount</th>
                <th className="py-2.5 text-start">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((row, idx) => (
                <tr key={idx} className="border-b border-[#F3F4F6] font-montserrat last:border-0">
                  <td className="py-3.5 pl-2 text-[#131927] font-medium">{row.description}</td>
                  <td className="py-3.5 text-[#131927]">{row.date}</td>
                  <td className="py-3.5 text-[#131927]">{row.amount}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      {row.status === "failed" ? (
                        <>
                          <XCircle size={14} className="text-[#EF4444]" />
                          <span className="text-sm font-bold text-[#EF4444] font-montserrat">Failed</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} className="text-[#10B981]" />
                          <span className="text-sm font-bold text-[#10B981] font-montserrat">Paid</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
