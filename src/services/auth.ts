import { apiClient } from "@/lib/api-client";
import { User } from "@/types";

export interface RegisterPayload {
  business_name: string;
  business_email: string;
  phone_number: string;
  business_type: string;
  full_name: string;
  password1: string;
  password2: string;
  web_url?: string | null;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export const authService = {
  register(payload: RegisterPayload) {
    return apiClient.post<any>("/merchant/register/", payload);
  },

  login(email: string, password: string) {
    return apiClient.post<LoginResponse>("/user/signin/", { email, password });
  },

  confirmOtp(email: string, otp: string) {
    return apiClient.post<LoginResponse>("/user/signin/confirm-otp/", { email, otp });
  },
};
