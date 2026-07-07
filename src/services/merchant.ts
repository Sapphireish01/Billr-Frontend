import { apiClient } from "@/lib/api-client";
import { Merchant } from "@/types";

export const merchantService = {
  getDetails() {
    return apiClient.get<Merchant>("/merchant/");
  },
};
