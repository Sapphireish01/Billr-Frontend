import { Plan, Customer, Invoice, ActivityEvent } from "@/types";

export const plans: Plan[] = [
  {
    id: "plan_enterprise",
    name: "Enterprise",
    price: 250000,
    billingInterval: "monthly",
    trialPeriodDays: 14,
    subscribers: 124,
    status: "active",
    description: "Full platform access with dedicated support and custom SLAs.",
    createdAt: "2025-11-02",
  },
  {
    id: "plan_growth",
    name: "Growth",
    price: 75000,
    billingInterval: "monthly",
    trialPeriodDays: 14,
    subscribers: 312,
    status: "active",
    description: "For scaling teams that need higher usage limits.",
    createdAt: "2025-09-18",
  },
  {
    id: "plan_starter",
    name: "Starter",
    price: 25000,
    billingInterval: "monthly",
    trialPeriodDays: 7,
    subscribers: 540,
    status: "active",
    description: "Everything a new merchant needs to get started.",
    createdAt: "2025-06-01",
  },
  {
    id: "plan_team",
    name: "Team",
    price: 720000,
    billingInterval: "annual",
    trialPeriodDays: 30,
    subscribers: 96,
    status: "active",
    description: "Annual billing for teams that want a discount upfront.",
    createdAt: "2025-08-12",
  },
  {
    id: "plan_legacy_basic",
    name: "Legacy Basic",
    price: 15000,
    billingInterval: "monthly",
    trialPeriodDays: null,
    subscribers: 48,
    status: "archived",
    description: "Grandfathered plan, no longer offered to new customers.",
    createdAt: "2024-03-04",
  },
  {
    id: "plan_custom_enterprise",
    name: "Custom Enterprise",
    price: 0,
    billingInterval: "custom",
    trialPeriodDays: null,
    subscribers: 12,
    status: "draft",
    description: "Negotiated pricing for large accounts, set up manually.",
    createdAt: "2026-05-20",
  },
];

const inDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const customers: Customer[] = [
  {
    id: "cust_ada_miles",
    name: "Ada Miles",
    email: "ada.miles@example.com",
    planId: "plan_enterprise",
    planName: "Enterprise",
    status: "active",
    nextBillingDate: inDays(14),
    startDate: "2025-11-02",
    paymentMethod: { brand: "Visa", last4: "4242", expires: "08/27" },
  },
  {
    id: "cust_abel_mark",
    name: "Abel Mark",
    email: "abel.mark@example.com",
    planId: "plan_starter",
    planName: "Starter",
    status: "past_due",
    nextBillingDate: inDays(3),
    startDate: "2026-06-14",
    paymentMethod: { brand: "Visa", last4: "4242", expires: "08/27" },
    primaryContact: [{ name: "Tobi Smith", role: "Billing Contact" }],
  },
  {
    id: "cust_chioma_eze",
    name: "Chioma Eze",
    email: "chioma.eze@example.com",
    planId: "plan_growth",
    planName: "Growth",
    status: "active",
    nextBillingDate: inDays(21),
    startDate: "2025-12-10",
    paymentMethod: { brand: "Mastercard", last4: "8831", expires: "02/28" },
  },
  {
    id: "cust_sarah_johnson",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    planId: "plan_starter",
    planName: "Starter",
    status: "trial",
    nextBillingDate: inDays(7),
    startDate: "2026-06-29",
  },
  {
    id: "cust_ngozi_adaora",
    name: "Ngozi Adaora",
    email: "ngozi.adaora@example.com",
    planId: "plan_legacy_basic",
    planName: "Legacy Basic",
    status: "cancelled",
    nextBillingDate: null,
    startDate: "2024-04-01",
  },
  {
    id: "cust_emeka_nwosu",
    name: "Emeka Nwosu",
    email: "emeka.nwosu@example.com",
    planId: "plan_growth",
    planName: "Growth",
    status: "past_due",
    nextBillingDate: inDays(1),
    startDate: "2026-01-15",
    paymentMethod: { brand: "Verve", last4: "1120", expires: "11/26" },
  },
  {
    id: "cust_taiwo_adeyemi",
    name: "Taiwo Adeyemi",
    email: "taiwo.adeyemi@example.com",
    planId: "plan_team",
    planName: "Team",
    status: "active",
    nextBillingDate: inDays(184),
    startDate: "2025-08-12",
    paymentMethod: { brand: "Visa", last4: "6673", expires: "05/29" },
  },
  {
    id: "cust_biodun_falake",
    name: "Biodun Falake",
    email: "biodun.falake@example.com",
    planId: "plan_starter",
    planName: "Starter",
    status: "cancelled",
    nextBillingDate: null,
    startDate: "2025-10-05",
  },
  {
    id: "cust_amaka_okafor",
    name: "Amaka Okafor",
    email: "amaka.okafor@example.com",
    planId: "plan_growth",
    planName: "Growth",
    status: "active",
    nextBillingDate: inDays(9),
    startDate: "2026-07-01",
    paymentMethod: { brand: "Mastercard", last4: "5502", expires: "09/27" },
  },
  {
    id: "cust_chisom_eze",
    name: "Chisom Eze",
    email: "chisom.eze@example.com",
    planId: "plan_growth",
    planName: "Growth",
    status: "active",
    nextBillingDate: inDays(17),
    startDate: "2025-05-19",
    paymentMethod: { brand: "Visa", last4: "9013", expires: "01/28" },
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-0091",
    customerId: "cust_taiwo_adeyemi",
    customerName: "Taiwo Adeyemi",
    customerEmail: "taiwo.adeyemi@example.com",
    planName: "Team",
    status: "paid",
    nextBillingDate: inDays(184),
    amount: 720000,
  },
  {
    id: "INV-0092",
    customerId: "cust_ada_miles",
    customerName: "Ada Miles",
    customerEmail: "ada.miles@example.com",
    planName: "Enterprise",
    status: "paid",
    nextBillingDate: inDays(14),
    amount: 250000,
  },
  {
    id: "INV-0093",
    customerId: "cust_emeka_nwosu",
    customerName: "Emeka Nwosu",
    customerEmail: "emeka.nwosu@example.com",
    planName: "Growth",
    status: "failed",
    nextBillingDate: inDays(1),
    amount: 75000,
  },
  {
    id: "INV-0094",
    customerId: "cust_sarah_johnson",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    planName: "Starter",
    status: "pending",
    nextBillingDate: inDays(7),
    amount: 25000,
  },
  {
    id: "INV-0095",
    customerId: "cust_abel_mark",
    customerName: "Abel Mark",
    customerEmail: "abel.mark@example.com",
    planName: "Starter",
    status: "failed",
    nextBillingDate: inDays(3),
    amount: 25000,
  },
  {
    id: "INV-0096",
    customerId: "cust_amaka_okafor",
    customerName: "Amaka Okafor",
    customerEmail: "amaka.okafor@example.com",
    planName: "Growth",
    status: "paid",
    nextBillingDate: inDays(9),
    amount: 75000,
  },
  {
    id: "INV-0097",
    customerId: "cust_chisom_eze",
    customerName: "Chisom Eze",
    customerEmail: "chisom.eze@example.com",
    planName: "Growth",
    status: "paid",
    nextBillingDate: inDays(17),
    amount: 75000,
  },
  {
    id: "INV-0098",
    customerId: "cust_ngozi_adaora",
    customerName: "Ngozi Adaora",
    customerEmail: "ngozi.adaora@example.com",
    planName: "Legacy Basic",
    status: "failed",
    nextBillingDate: null,
    amount: 15000,
  },
];

export const activityFeed: ActivityEvent[] = [
  {
    id: "act_1",
    message: "Amaka Okafor subscribed to the Growth plan",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    type: "subscription",
  },
  {
    id: "act_2",
    message: "Charge failed for Emeka Nwosu — ₦5,000 · Insufficient funds",
    timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
    type: "payment_failed",
  },
  {
    id: "act_3",
    message: "Invoice #INV-0091 paid — Taiwo Adeyemi · ₦15,000",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    type: "payment_success",
  },
  {
    id: "act_4",
    message: "Chisom Eze upgraded from Starter to Growth plan",
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    type: "upgrade",
  },
  {
    id: "act_5",
    message: "Subscription cancelled — Biodun Falake · Starter plan",
    timestamp: new Date(Date.now() - 181 * 60000).toISOString(),
    type: "cancellation",
  },
  {
    id: "act_6",
    message: "Dunning recovery — Ngozi Adaora updated her card, ₦5,000 collected",
    timestamp: new Date(Date.now() - 182 * 60000).toISOString(),
    type: "dunning",
  },
];

export function getPlanById(id: string) {
  return plans.find((p) => p.id === id);
}

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id);
}

export function getStats() {
  const mrr = customers
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + (getPlanById(c.planId)?.price ?? 0), 0);
  const activeSubscribers = customers.filter((c) => c.status === "active").length;
  const failedPayments = invoices.filter((i) => i.status === "failed").length;
  const cancelled = customers.filter((c) => c.status === "cancelled").length;
  const churnRate = ((cancelled / customers.length) * 100).toFixed(1);

  return {
    mrr,
    activeSubscribers,
    failedPayments,
    churnRate: `${churnRate}%`,
  };
}
