"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Merchant } from "@/types";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { authService } from "@/services/auth";
import { merchantService } from "@/services/merchant";

interface AuthContextType {
  user: User | null;
  merchant: Merchant | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  confirmOtp: (email: string, otp: string) => Promise<User>;
  register: (payload: any) => Promise<any>;
  logout: () => void;
  refreshMerchant: () => Promise<Merchant>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password");

  useEffect(() => {
    async function loadUser() {
      const token = getCookie("accessToken");
      if (!token) {
        setLoading(false);
        if (!isAuthRoute && pathname !== "/") {
          router.push("/login");
        }
        return;
      }

      try {
        // Fetch merchant details (which works as an auth check and loads live keys)
        const merchantData = await merchantService.getDetails();
        setMerchant(merchantData);

        // Retrieve local user data if stored, or mock it from merchant info
        const storedUser = localStorage.getItem("billr_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Fallback user structure based on merchant admin details
          const fallbackUser: User = {
            id: merchantData.id,
            full_name: merchantData.business_name + " Admin",
            email: merchantData.business_email,
            user_type: "merchant_admin",
            related_merchant: merchantData,
            status: "",
          };
          setUser(fallbackUser);
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [pathname]);

  const login = async (email: string, password: string): Promise<any> => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);

      if (data && (data as any).status === "OTP sent to email") {
        setLoading(false);
        return data;
      }

      setCookie("accessToken", data.access);
      setCookie("refreshToken", data.refresh);
      setUser(data.user);
      setMerchant(data.user.related_merchant);
      localStorage.setItem("billr_user", JSON.stringify(data.user));

      router.push("/dashboard");
      return data.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const confirmOtp = async (email: string, otp: string): Promise<User> => {
    setLoading(true);
    try {
      const data = await authService.confirmOtp(email, otp);

      setCookie("accessToken", data.access);
      setCookie("refreshToken", data.refresh);
      setUser(data.user);
      setMerchant(data.user.related_merchant);
      localStorage.setItem("billr_user", JSON.stringify(data.user));

      router.push("/dashboard");
      return data.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (payload: any): Promise<any> => {
    return authService.register(payload);
  };

  const logout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    setUser(null);
    setMerchant(null);
    localStorage.removeItem("billr_user");
    router.push("/login");
  };

  const refreshMerchant = async (): Promise<Merchant> => {
    try {
      const merchantData = await merchantService.getDetails();
      setMerchant(merchantData);
      return merchantData;
    } catch (error) {
      console.error("Failed to refresh merchant details:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        merchant,
        loading,
        login,
        confirmOtp,
        register,
        logout,
        refreshMerchant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
