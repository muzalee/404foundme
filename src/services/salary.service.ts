import type {
  BaseResponse,
  GetSalariesQuery,
  PaginationResponse,
  Salary,
  UpdateSalaryRequest,
} from "@/types";
import { apiClient } from "./api/api-client";
import { TokenUtil } from "@/utils/token.util";

class SalaryService {
  readonly API_ENDPOINTS = {
    list: "/salary",
    payslip: (id: string) => `/salary/${id}/payslip`,
  };

  async getSalaries(query?: GetSalariesQuery) {
    return apiClient.get<PaginationResponse<Salary>>(
      this.API_ENDPOINTS.list,
      query
    );
  }

  async downloadPayslip(id: string, month: string, name: string) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${this.API_ENDPOINTS.payslip(id)}?month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${TokenUtil.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download payslip");
    }

    const formattedName = name.replace(/\s+/g, "_");
    const filename = `${formattedName}_${month}.pdf`;

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async getSalaryById(id: string) {
    return apiClient.get<BaseResponse<Salary>>(
      `${this.API_ENDPOINTS.list}/${id}`
    );
  }

  async updateSalary(id: string, data: UpdateSalaryRequest) {
    return apiClient.put<BaseResponse<Salary>>(
      `${this.API_ENDPOINTS.list}/${id}`,
      data
    );
  }
}

export const salaryService = new SalaryService();
