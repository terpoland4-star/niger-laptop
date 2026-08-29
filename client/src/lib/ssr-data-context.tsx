import { createContext, useContext } from "react";

type SSRDataMap = Record<string, unknown>;

export const SSRDataContext = createContext<SSRDataMap>({});

export function useSSRInitialData<T>(key: string): T | null {
  const ctx = useContext(SSRDataContext);
  if (key in ctx) return ctx[key] as T;

  if (
    typeof window !== "undefined" &&
    (window as any).__INITIAL_DATA__?.[key]
  ) {
    return (window as any).__INITIAL_DATA__[key] as T;
  }
  return null;
}
