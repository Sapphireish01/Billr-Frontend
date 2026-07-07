export type PlanStatus = "active" | "draft" | "archived";
export type CustomerStatus = "active" | "trial" | "past_due" | "cancelled";
export type InvoiceStatus = "paid" | "pending" | "failed";
export type BillingInterval = "monthly" | "annual" | "custom";

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingInterval: BillingInterval;
  trialPeriodDays: number | null;
  subscribers: number;
  status: PlanStatus;
  description?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  planId: string;
  planName: string;
  status: CustomerStatus;
  nextBillingDate: string | null;
  startDate: string;
  paymentMethod?: {
    brand: string;
    last4: string;
    expires: string;
  };
  primaryContact?: {
    name: string;
    role: string;
  }[];
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  status: InvoiceStatus;
  nextBillingDate: string | null;
  amount: number;
}

export interface ActivityEvent {
  id: string;
  message: string;
  timestamp: string;
  type: "subscription" | "payment_failed" | "payment_success" | "upgrade" | "cancellation" | "dunning";
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface Merchant {
  id: number;
  business_name: string;
  business_email: string;
  phone_number: string;
  business_type: string;
  web_url: string | null;
  webhook_url?: string | null;
  test_api_key?: string;
  live_api_key?: string;
  created?: string;
}

export interface User {
  status: string;
  id: number;
  full_name: string;
  email: string;
  user_type: string;
  related_merchant: Merchant;
}
