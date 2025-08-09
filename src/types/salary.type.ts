export interface Allowance {
  id: string;
  name: string;
  amount: number;
}

export interface Salary {
  id: string;
  name: string;
  icNumber: string;
  jobTitle: string;
  basicSalary: number;
  epfRate: number;
  taxAmount: number;
  allowances: Allowance[];
  createdAt: string;
  updatedAt: string;
}

export interface GetSalariesQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page: number;
  pageSize: number;
}
