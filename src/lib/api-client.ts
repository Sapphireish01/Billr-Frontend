import { getCookie, deleteCookie } from "./cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://13.51.47.214/";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class APIError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;
  
  // Format endpoint and query params
  let url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Set headers
  const requestHeaders = new Headers(headers);
  if (!(restOptions.body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Inject Bearer Token
  const token = getCookie("accessToken");
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // Response is not JSON
    }

    if (response.status === 401) {
      // Clear token since it is invalid/expired
      deleteCookie("accessToken");
      if (typeof window !== "undefined") {
        // Optional redirect to login on auth failure (excluding the login page itself)
        if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
          window.location.href = "/login";
        }
      }
    }

    throw new APIError(
      errorData?.message || errorData?.detail || `API request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  // Check if response has content (not empty status like 204)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return null as unknown as T;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: FetchOptions["params"], options?: Omit<FetchOptions, "body" | "method">) =>
    request<T>(endpoint, { ...options, method: "GET", params }),
    
  post: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, "method">) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  put: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, "method">) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  patch: <T>(endpoint: string, body?: any, options?: Omit<FetchOptions, "method">) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, "body" | "method">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
