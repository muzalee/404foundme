import type { AuthResponse, BaseResponse, LoginRequest } from "@/types";
import { apiClient } from "./api/api-client";

class AuthService {
  readonly API_ENDPOINTS = {
    login: "/auth/login",
  };

  async login(request: LoginRequest) {
    return apiClient.post<BaseResponse<AuthResponse>>(
      this.API_ENDPOINTS.login,
      request
    );
  }
}

export const authService = new AuthService();
