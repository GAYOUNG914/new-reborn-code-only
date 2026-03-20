import type { InsightSwiperResponse } from "@/types/Post";

import topBg01 from "@/app/assets/images/contents/post_is_top_bg-01.png";
import topBg02 from "@/app/assets/images/contents/post_is_top_bg-02.png";
import topBg03 from "@/app/assets/images/contents/post_is_top_bg-03.png";

import thumb01 from "@/app/assets/images/contents/post_is_thumb-01.png";
import thumb02 from "@/app/assets/images/contents/post_is_thumb-02.png";
import thumb03 from "@/app/assets/images/contents/post_is_thumb-03.png";

import user01 from "@/app/assets/images/contents/post_is_user-01.png";


export const InsightSwiperData: InsightSwiperResponse[] = [
  {
    statusCode: "200",
    message: "ok",
    result: {
      contents: [
        {
          id: "article_1",
          bgImageUrl: topBg01.src, //bgImageUrl 추가
          imageUrl: thumb01.src,
          index: 0,
          title: "리본회생의 모든것1", //title 추가
          subtitle: "처음 정장을 입었던 그날, 낯설고 꽉 끼는 구두 속에서 내 발도, 마처음 정장을 입었던 그날",
          date: "July, 5, 2025",
          categoryIds: [
            {
              id: 1,
              title: "🎤 리본회생"
            }
          ],
          manager: {
            id: "manager4",
            name: "Yuns",
            profileImage: user01.src
          },
        }
      ]
    }
  },
  {
    statusCode: "200",
    message: "ok",
    result: {
      contents: [
        {
          id: "article_2",
          bgImageUrl: topBg02.src,
          imageUrl: thumb02.src,
          index: 1,
          title: "리본회생의 모든것2",
          subtitle: "리본회생의 모든것",
          date: "July, 5, 2025",
          categoryIds: [
            {
              id: 2,
              title: "🎤 리본회생"
            }
          ],
          manager: {
            id: "manager4",
            name: "Yuns",
            profileImage: user01.src
          },
        }
      ]
    }
  },
  {
    statusCode: "200",
    message: "ok",
    result: {
      contents: [
        {
          id: "article_3",
          bgImageUrl: topBg03.src,
          imageUrl: thumb03.src,
          index: 2,
          title: "리본회생의 모든것3",
          subtitle: "리본회생의 모든것",
          date: "July, 5, 2025",
          categoryIds: [
            {
              id: 3,
              title: "🎤 리본회생"
            }
          ],
          manager: {
            id: "manager4",
            name: "Yuns",
            profileImage: user01.src
          },
        }
      ]
    }
  }
];