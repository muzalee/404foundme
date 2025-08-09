/* eslint-disable @typescript-eslint/no-explicit-any */
import { STRINGS } from "@/constants";
import { TokenUtil } from "@/utils/token.util";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = TokenUtil.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...headers,
      },
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message ?? STRINGS.ERROR_MESSAGES.AN_ERROR_OCCURRED
      );
    }
    return response.json();
  }

  async post<T>(
    endpoint: string,
    data?: any,
    formData?: FormData,
    headers?: Record<string, string>
  ): Promise<T> {
    const requestHeaders = {
      ...(formData ? {} : { "Content-Type": "application/json" }),
      ...this.getAuthHeaders(),
      ...headers,
    };

    const requestBody = formData ?? (data ? JSON.stringify(data) : undefined);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: requestHeaders,
      body: requestBody,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message ?? STRINGS.ERROR_MESSAGES.AN_ERROR_OCCURRED
      );
    }
    return response.json();
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message ?? STRINGS.ERROR_MESSAGES.AN_ERROR_OCCURRED
      );
    }
    return response.json();
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...this.getAuthHeaders(),
        ...headers,
      },
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message ?? STRINGS.ERROR_MESSAGES.AN_ERROR_OCCURRED
      );
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();
