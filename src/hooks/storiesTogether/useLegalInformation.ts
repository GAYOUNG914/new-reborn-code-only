import {
  getLegalInformationData,
  handleLike,
  handleUnlike,
} from "@/services/storiesTogether";
import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";

const storiesTogetherAPI = process.env.NEXT_PUBLIC_BASE_URL;

interface LegalInformationApiResponse {
  statusCode: string;
  message: string;
  result: LegalInformationData;
}

export interface LegalInformationData {
  contents: LegalInformationContent[];
  totalPages: number;
  totalContents: number;
  currentPage: number;
}

interface LegalInformationContent {
  id: string;
  title: string;
  date: string;
  tagIds: string[];
  imageUrl: string;
  subtitle: string;
  liked: boolean;
  like: number;
  view: number;
}

export const useLegalInformation = (
  deviceType: "" | "mobile" | "tablet" | "pc",
  userId: string,
) => {
  const [legalInformationData, setLegalInformationData] =
    useState<LegalInformationData | null>(null);
  const [page, setPage] = useState(1);
  const size =
    deviceType === "pc" ? 3 : deviceType === "mobile" || "tablet" ? 4 : 0;
  const params = new URLSearchParams({
    size: String(size),
    page: String(page),
    hideContent: String(false),
    userId: String(userId),
  }).toString();
  const url = `${storiesTogetherAPI}/dasi/legal-information?${params}`;

  const { data, isLoading, mutate } = useSWR<LegalInformationApiResponse>(
    deviceType ? url : null,
    getLegalInformationData,
    {
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      revalidateOnMount: false,
      onSuccess: (fetchedData) => {
        if (fetchedData?.result) {
          const uniqueContents = fetchedData.result.contents.filter(
            (content, index, self) =>
              index === self.findIndex((t) => t.id === content.id),
          );

          setLegalInformationData(() => ({
            ...fetchedData.result,
            contents: uniqueContents,
          }));
        }
      },
    },
  );

  useEffect(() => {
    if (deviceType !== "" && !isLoading) mutate();
  }, [page, deviceType]);

  const legalInformationSetPage = useCallback(
    (newPage: number) => {
      if (!legalInformationData || isLoading || newPage === page) return;

      setPage(newPage);
    },
    [isLoading, legalInformationData, page],
  );

  const toggleLike = useCallback(
    async (contentId: string, userId: string) => {
      if (!legalInformationData) return;

      try {
        const content = legalInformationData.contents.find(
          (c) => c.id === contentId,
        );
        if (!content) return;

        // Optimistic update
        const updatedContents = legalInformationData.contents.map((content) => {
          if (content.id === contentId) {
            return {
              ...content,
              liked: !content.liked,
              like: content.liked ? content.like - 1 : content.like + 1,
            };
          }
          return content;
        });

        setLegalInformationData((prev) =>
          prev
            ? {
                ...prev,
                contents: updatedContents,
              }
            : null,
        );

        // API call
        if (content.liked) {
          await handleUnlike(userId, contentId);
        } else {
          await handleLike(userId, contentId);
        }

        // Revalidate data
        await mutate();
      } catch (error) {
        console.error("Error toggling like:", error);
        // Revert optimistic update on error
        await mutate();
      }
    },
    [legalInformationData, mutate],
  );

  return {
    legalInformationData,
    legalInformationDataSWRMutation: mutate,
    legalInformationDataisLoading: isLoading,
    legalInformationSetPage,
    toggleLike,
  };
};
