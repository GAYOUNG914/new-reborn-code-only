import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useDummyVisitor } from "@/hooks/useDummyVisitor";

export interface UseVisitorOptions {
  extendedResult: boolean;
}

export interface UseVisitorConfig {
  immediate?: boolean;
}

type UseVisitorReturn = {
  data: { visitorId?: string } | undefined;
  isLoading: boolean;
  error: unknown;
};

type UseVisitorHook = (
  options: UseVisitorOptions,
  config?: UseVisitorConfig,
) => UseVisitorReturn;

let useVisitorImpl: UseVisitorHook;

if (process.env.NODE_ENV === "development") {
  useVisitorImpl = function useVisitorDev(
    options: UseVisitorOptions,
    config?: UseVisitorConfig,
  ): UseVisitorReturn {
    const { data, isLoading, error } = useDummyVisitor({
      extended: { extendedResult: options.extendedResult },
      immediation: { immediate: config?.immediate ?? false },
      errorInjection: false,
    });
    return { data, isLoading, error } as UseVisitorReturn;
  };
} else {
  useVisitorImpl = function useVisitorProd(
    options: UseVisitorOptions,
    config?: UseVisitorConfig,
  ): UseVisitorReturn {
    const { data, isLoading, error } = useVisitorData(options, {
      immediate: config?.immediate ?? false,
    });
    return { data, isLoading, error } as UseVisitorReturn;
  };
}

export const useVisitor: UseVisitorHook = (options, config) =>
  useVisitorImpl(options, config);


