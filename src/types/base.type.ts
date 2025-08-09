/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaginationResponse<T> {
  status: string;
  data?: T[];
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    [key: string]: any;
  };
  error?: string;
  message?: string;
}

export interface BaseResponse<T> {
  status: string;
  data?: T;
  error?: string;
  message?: string;
}
