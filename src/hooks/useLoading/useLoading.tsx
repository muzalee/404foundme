import { useContext } from "react";
import { LoadingContext, type LoadingContextType } from "./useLoading.context";

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
