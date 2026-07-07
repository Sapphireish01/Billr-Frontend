import { apiClient } from "@/lib/api-client";

export interface CreatePlanPayload {
  name: string;
  description: string;
  price: string | number;
  billing_interval: string;
  trial_period_in_days?: number;
  billing_interval_in_days?: number | null;
}

export const planService = {
  getPlans() {
    return apiClient.get<any[]>("/merchant/plan/");
  },

  createPlan(payload: CreatePlanPayload) {
    return apiClient.post<any>("/merchant/plan/", payload);
  },
};
