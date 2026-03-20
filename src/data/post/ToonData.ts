import type { ToonResponse } from "@/types/Post";

import toonGrid01 from "@/app/assets/images/contents/post_toon_grid-01.png";
import toonGrid02 from "@/app/assets/images/contents/post_toon_grid-02.png";
import toonGrid03 from "@/app/assets/images/contents/post_toon_grid-03.png";


// 샘플 데이터 (실제로는 API에서 받아올 데이터)
export const sampleToonData: ToonResponse = {
  statusCode: "200",
  message: "ok",
  result: {
    contents: [
      {
        id: "article_1",
        imageUrl: toonGrid01.src,
        title: "리본툰 설명 내용 설명리본툰 설명 내용 설명리본툰 설명 내용 설명",
        subtitle: "리본툰 설명 내용 설명본툰 설명 내용 설명 내본툰 설명 내용 설명 내본툰 설명 내용 설명 내 내용",
        episode: 1,
        hide: false,
        isHot: true,
        isNew: true,
      },
      {
        id: "article_2",
        imageUrl: toonGrid02.src,
        title: "리본 풀어보고 싶지 않으세요?",
        subtitle: "리본툰 설명 내용 설명 내용",
        episode: 2,
        hide: false,
        isHot: false,
        isNew: true,
      },
      {
        id: "article_3",
        imageUrl: toonGrid03.src,
        title: "리본 풀어보고 싶지 않으세요?",
        subtitle: "리본툰 설명 내용 설명 내용",
        episode: 3,
        hide: false,
        isHot: true,
        isNew: false,
      },
      {
        id: "article_4",
        imageUrl: toonGrid01.src,
        title: "리본 풀어보고 싶지 않으세요?",
        subtitle: "리본툰 설명 내용 설명 내용",
        episode: 4,
        hide: false,
        isHot: false,
        isNew: true,
      },
      {
        id: "article_5",
        imageUrl: toonGrid02.src,
        title: "리본 풀어보고 싶지 않으세요?",
        subtitle: "리본툰 설명 내용 설명 내용",
        episode: 5,
        hide: false,
        isHot: true,
        isNew: false,
      },
      {
        id: "article_6",
        imageUrl: toonGrid03.src,
        title: "리본 풀어보고 싶지 않으세요?",
        subtitle: "리본툰 설명 내용 설명 내용",
        episode: 6,
        hide: false,
        isHot: false,
        isNew: true,
      }
    ],
    currentSize: 6,
    hasMore: true,
    nextId: "article_7",
    nextValue: "179749374_EP.03 스무 해",
    firstPage: true
  }
};