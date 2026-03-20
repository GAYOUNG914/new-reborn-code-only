import type { InsightGridResponse } from "@/types/Post";

// 임시 데이터 (실제로는 API에서 가져올 데이터)
export const mockGridData: InsightGridResponse = {
  statusCode: "200",
  message: "ok",
  result: {
    contents: [
      {
        id: "article_530",
        title: "내 지갑 속 예술",
        date: "July, 5, 2025",
        categoryIds: [
          {
            id: 1,
            title: "인터뷰 🎤"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: true,
        isNew: true,
        hide: false
      },
      {
        id: "article_531",
        title: "스무 해의 기록",
        date: "July, 4, 2025",
        categoryIds: [
          {
            id: 2,
            title: "사회이슈 🌎"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: false,
        isNew: true,
        hide: false
      },
      {
        id: "article_532",
        title: "절약의 기술",
        date: "July, 3, 2025",
        categoryIds: [
          {
            id: 3,
            title: "절약 📄"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: true,
        isNew: false,
        hide: false
      },
      {
        id: "article_533",
        title: "리본회생 이야기",
        date: "July, 2, 2025",
        categoryIds: [
          {
            id: 4,
            title: "리본회생 🎁"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: false,
        isNew: false,
        hide: false
      },
      {
        id: "article_534",
        title: "내 지갑 속 예술",
        date: "July, 1, 2025",
        categoryIds: [
          {
            id: 2,
            title: "사회이슈 🌎"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: true,
        isNew: true,
        hide: false
      },
      {
        id: "article_535",
        title: "내 지갑 속 예술",
        date: "June, 30, 2025",
        categoryIds: [
          {
            id: 3,
            title: "절약 📄"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: false,
        isNew: true,
        hide: false
      },
      {
        id: "article_536",
        title: "내 지갑 속 예술",
        date: "June, 29, 2025",
        categoryIds: [
          {
            id: 1,
            title: "인터뷰 🎤"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: true,
        isNew: false,
        hide: false
      },
      {
        id: "article_537",
        title: "내 지갑 속 예술",
        date: "June, 28, 2025",
        categoryIds: [
          {
            id: 4,
            title: "리본회생 🎁"
          }
        ],
        imageUrl: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/25eb440f-aa54-4f6f-b03a-bebad4b16f00/public",
        isHot: false,
        isNew: false,
        hide: false
      }
    ],
    currentSize: 8,
    hasMore: true,
    nextId: "article_1",
    nextValue: "179749374_EP.03 스무 해",
    firstPage: true
  }
};
