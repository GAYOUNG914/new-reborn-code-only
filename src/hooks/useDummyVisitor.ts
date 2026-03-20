import { useCookies } from "next-client-cookies";
import { useEffect, useId, useState } from "react";

interface DummyVisitorData {
  visitorId: string;
  extendedResult: boolean;
}

interface UseDummyVisitorOptions {
  extended?: { extendedResult: boolean };
  immediation?: { immediate: boolean };
  errorInjection?: boolean;
}

export const useDummyVisitor = (options: UseDummyVisitorOptions) => {
  const [visitorId, setVisitorId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [dummyExtendedResult, setDummyExtendedResult] = useState<DummyVisitorData | null>(null);
  const dummyId = useId()
  const cookieStore = useCookies();

  useEffect(() => {
    const visitorId = cookieStore.get("VISITOR_ID_DUMMY");
    if (visitorId) {
      setVisitorId(visitorId);
    } else {
      const newVisitorId = dummyId;
      const currentHostname = window.location.hostname;
      const dummyIdPrefix = "dummy-";
      cookieStore.set("VISITOR_ID_DUMMY", `${dummyIdPrefix}${newVisitorId}`, {
        domain: currentHostname,
      });
    }
  }, [cookieStore]);

  useEffect(() => {
    if (visitorId) {
      setIsLoading(false);
    }
  }, [visitorId]);

  useEffect(() => {
    if (visitorId && dummyExtendedResult) {
      setDummyExtendedResult({ visitorId, extendedResult: options.extended?.extendedResult ?? false });
    }
  }, [visitorId, options.extended?.extendedResult]);

  return { data: { visitorId, extendedResult: dummyExtendedResult }, isLoading, error: options.errorInjection ? new Error("Dummy Visitor Error") : null };
};