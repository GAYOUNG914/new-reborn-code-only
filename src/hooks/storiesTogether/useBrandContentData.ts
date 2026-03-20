import { getBrandContentData } from "@/services/storiesTogether";
import { useState, useCallback, useEffect, useMemo } from "react";
import useSWR from "swr";

const storiesTogetherAPI = process.env.NEXT_PUBLIC_BASE_URL;

interface BrandContentApiResponse {
  statusCode: string;
  message: string;
  result: BrandContentData;
}

export interface BrandContentData {
  contents: BrandContent[];
  currentSize: number;
  hasMore: boolean;
  firstPage: boolean;
  nextId: string | null;
  nextDate: string | null;
}

interface BrandContent {
  id: string;
  title: string;
  subtitle: string;
  tagIds: string[];
  imageUrl: string;
  date: string;
  liked: boolean;
  like: number;
  view: number;
}

export const useBrandContentData = (deviceType: '' | 'mobile' | 'tablet' | 'pc', userId: string) => {
  const [brandContentData, setBrandContentData] = useState<BrandContentData | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [nextDate, setNextDate] = useState<string | null>(null);
  
  const url = useMemo(() => {
      const baseUrl = `${storiesTogetherAPI}/dasi/latest-news?size=4&userId=${userId}`;
      if (nextId && nextDate) {
        return `${baseUrl}&nextId=${nextId}&nextDate=${nextDate}`;
      }
      return baseUrl;
    }, [nextId, nextDate]);

  const { data, isLoading, mutate } = useSWR<BrandContentApiResponse>(
    deviceType && shouldFetch ? url : null, 
    getBrandContentData,
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
          
          setBrandContentData((prev) => {
            if (!prev) return result;
            
            return {
              contents: [...prev.contents, ...result.contents],
              currentSize: result.currentSize,
              hasMore: result.hasMore,
              firstPage : result.firstPage,
              nextId: result.nextId,
              nextDate: result.nextDate,
            };
          });

          setShouldFetch(false);
        }
      },
    }
  );

  useEffect(() => {
    if (deviceType && !brandContentData) {
      setShouldFetch(true);
    }
  }, [deviceType, brandContentData]);

  const brandContentLoadMore = useCallback(() => {
    if (!isLoading && brandContentData?.hasMore) {
      setShouldFetch(true);
      mutate(undefined, { revalidate: true });
    }
  }, [isLoading, brandContentData, mutate]);

  return {
    brandContentData,
    brandContentDataSWRMutation: mutate,
    brandContentDataisLoading: isLoading,
    brandContentLoadMore,
  };
};
