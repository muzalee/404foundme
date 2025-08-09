import { createContext } from "react";

export interface LoadingContextType {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
