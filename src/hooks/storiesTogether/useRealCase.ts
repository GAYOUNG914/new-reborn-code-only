import { getRealCaseData } from "@/services/storiesTogether";
import { useState, useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";

const storiesTogetherAPI = process.env.NEXT_PUBLIC_BASE_URL;

interface RealCaseApiResponse {
  statusCode: string;
  message: string;
  result: RealCaseData;
}

export interface RealCaseData {
  contents: RealCaseContent[];
  currentSize: number;
  hasMore: boolean;
  firstPage: boolean;
  nextId: string | null;
  nextDate: string | null;
}

interface RealCaseContent {
  tagIds: string[];
  gsiDate: string;
  date: string;
  imageUrl: string;
  createDate: string;
  contentId: number;
  open: boolean;
  gsiType: string;
  article: string;
  hide: boolean;
  video: Video;
  title: string;
  subtitle?: string;
}

interface Video {
  videoUrl: string;
  videoType: "youtube" | "s3";
}

export const useRealCaseData = (deviceType: '' | 'mobile' | 'tablet' | 'pc') => {
  const [realCaseData, setRealCaseData] = useState<RealCaseData | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const [nextDate, setNextDate] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);

  const [size, setSize] = useState(3);

  // URL에 nextId와 nextDate 추가
  const url = useMemo(() => {
    const baseUrl = `${storiesTogetherAPI}/dasi/real-case?size=${size}&direction=asc`;

    if (nextId && nextDate) {
      return `${baseUrl}&nextId=${nextId}&nextDate=${encodeURIComponent(nextDate)}`;
    }
    return baseUrl;
  }, [nextId, nextDate, size]);

  const { data, isLoading, mutate } = useSWR<RealCaseApiResponse>(
    deviceType && shouldFetch ? url : null, 
    getRealCaseData,
    {
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      revalidateOnMount: true,
      onSuccess: (fetchedData) => {
        if (fetchedData?.result) {
          const result = fetchedData.result;
          
          if (result.nextId && result.nextDate) {
            setNextId(result.nextId);
            setNextDate(result.nextDate);
          }

          setRealCaseData((prev) => {
            if (!prev) {
              return result;
            }
            
            const updatedData = {
              contents: [...prev.contents, ...result.contents],
              currentSize: result.currentSize,
              hasMore: result.hasMore,
              firstPage : result.firstPage,
              nextId: result.nextId,
              nextDate: result.nextDate,
            };
            
            return updatedData;
          });

          setShouldFetch(false);
        }
      },
    }
  );

  const realCaseLoadMore = useCallback(() => {
    if (!isLoading && realCaseData?.hasMore) {
      setShouldFetch(true);
      mutate(undefined, { revalidate: true });
      setSize(2);
    }
  }, [isLoading, realCaseData, mutate]);

  return {
    realCaseData,
    realCaseDataSWRMutation: mutate,
    realCaseDataisLoading: isLoading,
    realCaseLoadMore,
  };
};