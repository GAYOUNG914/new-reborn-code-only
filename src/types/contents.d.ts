/* eslint-disable @typescript-eslint/no-empty-object-type */
import { OutputData } from "@editorjs/editorjs";

interface ContentsApiResponse<resultType> {
  statusCode: string;
  message: string;
  result: resultType;
}

interface RecommendListItem {
  viewCategoryId: number;
  imageUrl: string;
  title: string;
  contentId: string;
}

interface RecommendListResult {
  contents: RecommendListItem[];
  totalItems: number;
}

interface RecommendListResponse
  extends ContentsApiResponse<RecommendListResult> {}

interface CategoryInformationListItem {
  categoryId: number;
  areaColor: string;
  buttonAreaColor: string;
  iconUrl: string;
  order: number;
  backgroundColor: string;
  font: string;
  primary: string;
  title: string;
}

interface CategoryInformationResponse
  extends ContentsApiResponse<CategoryInformationListItem[]> {}

type categorySetsType = {
  id: number;
  title: string;
};

type publisherSetsType = {
  id: string;
  name: string;
};
interface ArticlesListItem {
  categoryIds: categorySetsType[];
  workoutCategoryIds: workoutCategoryIds[];
  tagIds: string[];
  createDate: string;
  date: string;
  imageUrl: string;
  view: number;
  publisher: string;
  like: number;
  title: string;
  subtitle: string;
  liked: boolean;
  id: string;
}
interface ContentsApiResult {
  contents: ArticlesListItem[];
  totalPages: number;
  totalContents: number;
  currentPage: number;
}

interface ArticlesListResponse extends ContentsApiResponse<ContentsApiResult> {}

interface ArticleContentsMetadata {
  contentId: string;
  categoryIds: number[];
  workoutCategoryIds: { id: number; name: string }[];
  createDate: string;
  imageUrl: string;
  like: number;
  tagIds: string[];
  title: string;
  subtitle: string;
  date: string;
  view: number;
  publisher: publisherSetsType;
  hide: boolean;
  liked: boolean;
}

interface ArticleContentsMetadataResponse
  extends ContentsApiResponse<ArticleContentsMetadata> {}

interface ArticleContentsResult extends ArticleContentsMetadata {
  article: OutputBlockData;
}

interface ArticleContentsResponse
  extends ContentsApiResponse<ArticleContentsResult> {}

interface VideoSliderDataItem {
  videoUrl: string;
  date: string;
  imageUrl: string;
  createDate: string;
  view: number;
  isYoutube: boolean;
  contentId: string;
  isOutside: boolean;
  like: number;
  title: string;
}

interface VideoSliderDataResult {
  videos: VideoSliderDataItem[];
}

interface VideoSliderDataResponse
  extends ContentsApiResponse<VideoSliderDataResult> {}

interface LikeAndUnlikeResult {
  userId: string;
  contentId: string;
  timestamp: string;
}

interface LikeAndUnlikeResponse
  extends ContentsApiResponse<LikeAndUnlikeResult> {}

/**
 * {
    "id": "manager1",
    "comment": {
      "version": "2.30.6",
      "blocks": [
        {
          "type": "paragraph",
          "data": {
            "text": "ㅁㄴㅇㄹ"
          },
          "id": "jPFxAgF69D"
        },
        {
          "type": "paragraph",
          "data": {
            "text": "ㅋㅌ"
          },
          "id": "b76BDhIanK"
        }
      ],
      "time": 1728988558312
    },
    "part": "마케팅파트",
    "headQuater": "전략기획본부",
    "profileImage": "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/b12f6f6e-c72d-475a-8424-2b45904b2500/public",
    "primaryColor": "#e89696",
    "name": "관리자"
  }
 */
interface PublisherSetResult {
  id: string;
  comment: OutputData;
  part: string;
  headQuater: string;
  profileImage: string;
  primaryColor: string;
  name: string;
}

interface PublisherSetResponse
  extends ContentsApiResponse<PublisherSetResult> {}


// ===============================아래로 Fave추가===============================

// Your Story 콘텐츠 아이템 타입
interface YourStoryContentItem {
  id: number;
  title: string;
  imageUrl: string;
  videoUrl: string;
  autoColor: boolean;
  color: string;
  index: number;
  activated: string; // ISO 8601 날짜 문자열
  hide: boolean;
  open: boolean;
}

// Your Story API 응답 타입
interface YourStoryResult {
  contents: YourStoryContentItem[];
}

interface YourStoryResponse extends ContentsApiResponse<YourStoryResult> {}


export {
  ContentsApiResponse,
  RecommendListItem,
  RecommendListResult,
  RecommendListResponse,
  CategoryInformationResponse,
  ArticlesListResponse,
  ArticlesListItem,
  CategoryInformationListItem,
  publisherSetsType,
  ArticleContentsMetadata,
  ArticleContentsResult,
  ArticleContentsResponse,
  VideoSliderDataItem,
  VideoSliderDataResult,
  VideoSliderDataResponse,
  ArticleContentsMetadata,
  ArticleContentsMetadataResponse,
  LikeAndUnlikeResult,
  LikeAndUnlikeResponse,
  PublisherSetResult,
  PublisherSetResponse,
  // 아래로 Fave추가
  YourStoryContentItem,
  YourStoryResult,
  YourStoryResponse,
};
