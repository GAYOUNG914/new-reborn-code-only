/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GET_ARTICLES_LIST_WITH_CATEGORY_FILTER_API_PATH,
  GET_ARTICLES_RECOMMEND_API_PATH,
  GET_CATEGORY_INFORMATION_API_PATH,
  GET_ARTICLES_LIST_API_PATH,
  GET_VIDEO_SLIDER_DATA_API_PATH,
  POST_ARTICLE_LIKE_API_PATH,
  PATCH_ARTICLE_UNLIKE_API_PATH,
  GET_ARTICLE_METADATA_API_PATH,
  GET_PUBLISHER_SETS_API_PATH,
  GET_ARTICLE_LIST_BY_TAG_API_PATH,
} from "@/constants/post-api.constants";
import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import {
  ArticleContentsResponse,
  ArticlesListResponse,
  CategoryInformationResponse,
  RecommendListResponse,
  VideoSliderDataResponse,
  ArticleContentsMetadataResponse,
  LikeAndUnlikeResponse,
  PublisherSetResponse,
} from "@/types/contents";
import { CONTENTS_API_HOST } from "@/constants/api.constants";

const swrErrorOption = {
  onErrorRetry: (
    error: any,
    key: string,
    config: any,
    revalidate: any,
    { retryCount }: any
  ) => {
    // Never retry on 404.
    if (error.status === 404) return;

    // Only retry up to 10 times.
    if (retryCount >= 10) return;

    // Retry after 5 seconds.
    setTimeout(() => revalidate({ retryCount }), 3000);
  },
};

const simpleUrlFetcher = async <T>(url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const data = await response.json();
  return data as T;
};

const postFetcher = async <T>(url: string, { arg }: { arg: any }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const responseData = await response.json();
  return responseData as T;
};

const patchFetcher = async <T>(url: string, { arg }: { arg: any }) => {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const responseData = await response.json();
  return responseData as T;
};

const simpleUrlFetcherUnCached = async <T>(url: string) => {
  const response = await fetch(url, {
    headers: { "Cache-Control": "max-age=0" },
    mode: "cors",
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const data = await response.json();
  return data as T;
};

const generateUrlWithParamsFetcherUnCached = async <T>(
  baseUrl: string,
  { arg }: { arg: Record<string, any> }
) => {
  const url = new URL(baseUrl);
  Object.entries(arg).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    headers: { "Cache-Control": "max-age=0" },
    mode: "cors",
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  const data = await response.json();
  return data as T;
};

export const generateUrlWithParams = (
  baseUrl: string,
  params: Record<string, any>
) => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

// const simpleUrlSwr = <T>(url: string, config?: SWRConfiguration) => useSWR(url, simpleUrlFetcher<T>, config);

export const useRecommendList = (config?: SWRConfiguration) => {
  return useSWR<RecommendListResponse>(
    `${CONTENTS_API_HOST}${GET_ARTICLES_RECOMMEND_API_PATH}`,
    simpleUrlFetcher<RecommendListResponse>,
    { ...swrErrorOption, ...config }
  );
};

export const useCategoryInformation = (config?: SWRConfiguration) => {
  const params: {
    hideContent: boolean;
  } = {
    hideContent: false,
  };
  return useSWR(
    generateUrlWithParams(
      `${CONTENTS_API_HOST}${GET_CATEGORY_INFORMATION_API_PATH}`,
      params
    ),
    simpleUrlFetcher<CategoryInformationResponse>,
    { ...swrErrorOption, ...config }
  );
};

export const useArticleList = (
  userId?: string,
  page?: number,
  size: number = 9, // default size
  categoryFilter: number[] = [],
  config?: SWRConfiguration
) => {
  const params: {
    userId?: string;
    page?: number;
    size: number;
    categoryIds?: string;
    hideContent: boolean;
    center: string;
  } = {
    userId, // optional
    page, // optional
    size, // default to 9
    hideContent: false,
    center: "workout",
  };

  let url: string | null = null;
  if (categoryFilter.length > 0) {
    params.categoryIds = categoryFilter.join(",");
    url = generateUrlWithParams(
      `${CONTENTS_API_HOST}${GET_ARTICLES_LIST_WITH_CATEGORY_FILTER_API_PATH}`,
      params
    );
  } else {
    url = generateUrlWithParams(
      `${CONTENTS_API_HOST}${GET_ARTICLES_LIST_API_PATH}`,
      params
    );
  }
  return useSWR<ArticlesListResponse>(
    url,
    simpleUrlFetcherUnCached<ArticlesListResponse>,
    { ...swrErrorOption, ...config }
  );
};

export const useArticleContents = (
  articleId: string,
  userId?: string,
  config?: SWRConfiguration
) => {
  const params: {
    userId?: string;
  } = {
    userId, // optional
  };

  let url: string | null = null;

  if (userId) {
    url = generateUrlWithParams(
      `${CONTENTS_API_HOST}${GET_ARTICLES_LIST_API_PATH}/${articleId}`,
      params
    );
  } else {
    url = `${CONTENTS_API_HOST}${GET_ARTICLES_LIST_API_PATH}/${articleId}`;
  }
  return useSWR<ArticleContentsResponse>(
    url,
    simpleUrlFetcher<ArticleContentsResponse>,
    { ...swrErrorOption, ...config }
  );
};

export const useVideoSliderDatas = (config?: SWRConfiguration) => {
  return useSWR(
    `${CONTENTS_API_HOST}${GET_VIDEO_SLIDER_DATA_API_PATH}`,
    simpleUrlFetcher<VideoSliderDataResponse>,
    config
  );
};

export const useArticleLike = ({
  contentId,
  userId,
}: {
  contentId: string;
  userId: string;
}) => {
  const url = `${CONTENTS_API_HOST}${POST_ARTICLE_LIKE_API_PATH}`;
  const { trigger } = useSWRMutation(
    url,
    postFetcher<LikeAndUnlikeResponse>,
    {}
  );
  return {
    like: ({
      resetContentId,
      resetUserId,
    }: {
      resetContentId?: string;
      resetUserId?: string;
    }) =>
      trigger({
        contentId: contentId !== "" && contentId ? contentId : resetContentId,
        userId: userId !== "" && userId ? userId : resetUserId,
      }),
  };
};

export const useArticleUnlike = ({
  contentId,
  userId,
}: {
  contentId: string;
  userId: string;
}) => {
  const url = `${CONTENTS_API_HOST}${PATCH_ARTICLE_UNLIKE_API_PATH}`;
  const { trigger } = useSWRMutation(
    url,
    patchFetcher<LikeAndUnlikeResponse>,
    {}
  );
  return {
    unlike: ({
      resetContentId,
      resetUserId,
    }: {
      resetContentId: string;
      resetUserId: string;
    }) =>
      trigger({
        contentId: contentId !== "" && contentId ? contentId : resetContentId,
        userId: userId !== "" && userId ? userId : resetUserId,
      }),
  };
};

export const useArticleMetadata = ({
  articleId,
  userId,
}: {
  articleId: string;
  userId?: string;
}) => {
  const params: {
    userId?: string;
  } = {
    userId, // optional
  };

  let url: string | null = null;
  if (userId) {
    url = generateUrlWithParams(
      `${CONTENTS_API_HOST}${GET_ARTICLE_METADATA_API_PATH.replace(
        "{ARTICLE_ID}",
        articleId
      )}`,
      params
    );
  } else {
    url = `${CONTENTS_API_HOST}${GET_ARTICLE_METADATA_API_PATH.replace(
      "{ARTICLE_ID}",
      articleId
    )}`;
  }
  return useSWR(
    url,
    simpleUrlFetcherUnCached<ArticleContentsMetadataResponse>,
    { ...swrErrorOption }
  );
};

export const useArticleMetadataTrigger = ({
  articleId,
}: {
  articleId: string;
}) => {
  const url = `${CONTENTS_API_HOST}${GET_ARTICLE_METADATA_API_PATH.replace(
    "{ARTICLE_ID}",
    articleId
  )}`;

  const { trigger } = useSWRMutation(
    url,
    generateUrlWithParamsFetcherUnCached,
    {}
  );
  return {
    getMetadata: ({ userId }: { userId: string }) => trigger({ userId }),
  };
};

export const usePublisherSets = ({
  managerId,
  config,
}: {
  managerId: string;
  config?: SWRConfiguration;
}) => {
  return useSWR(
    `${CONTENTS_API_HOST}${GET_PUBLISHER_SETS_API_PATH}${managerId}`,
    simpleUrlFetcherUnCached<PublisherSetResponse>,
    { ...swrErrorOption, ...config }
  );
};

export const useArticleListSearchByTag = ({
  tagIds,
  userId,
  page = 1,
  size = 4,
  config,
}: {
  tagIds: string;
  userId?: string;
  page?: number;
  size?: number;
  config?: SWRConfiguration;
}) => {
  const params: {
    userId?: string;
    page?: number;
    size: number;
    tagIds: string;
  } = {
    page,
    size,
    tagIds,
  };

  if (userId) {
    params.userId = userId;
  }

  const url = generateUrlWithParams(
    `${CONTENTS_API_HOST}${GET_ARTICLE_LIST_BY_TAG_API_PATH}`,
    params
  );

  return useSWR<ArticlesListResponse>(
    url,
    simpleUrlFetcherUnCached<ArticlesListResponse>,
    { ...swrErrorOption, ...config }
  );
};
