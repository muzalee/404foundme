import { useCallback, useMemo, useState, type ReactNode } from "react";
import { LoadingContext } from "./useLoading.context";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export function LoadingProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const startLoading = useCallback((customMessage?: string) => {
    if (customMessage) {
      setMessage(customMessage);
    }
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => setIsLoading(false), []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading, startLoading, stopLoading]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <LoadingOverlay visible={isLoading} message={message} />
    </LoadingContext.Provider>
  );
}
