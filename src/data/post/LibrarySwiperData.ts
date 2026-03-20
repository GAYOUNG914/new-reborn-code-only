import type { LibraryResponse } from "@/types/Post";

import profileImg from "@/app/assets/images/contents/post_li_user.png";

import bookImg01 from "@/app/assets/images/contents/post_li_monthly_book.png";
import bookImg02 from "@/app/assets/images/contents/post_li_editor_book.png";


import bgImg01 from "@/app/assets/images/contents/post_li_monthly_bg.png";
import bgImg02 from "@/app/assets/images/contents/post_li_editor_bg.png";
import bgImg03 from "@/app/assets/images/contents/post_li_quotes_bg.png";

import bgImg01Mobile from "@/app/assets/images/contents/post_li_monthly_bg_mo.png";
import bgImg02Mobile from "@/app/assets/images/contents/post_li_editor_bg_mo.png";
import bgImg03Mobile from "@/app/assets/images/contents/post_li_quotes_bg_mo.png";


export const LibrarySwiperData: LibraryResponse = {   
  statusCode: "200",
  message: "ok",
  result: {
    // 이달의 도서
    monthlyBook: {
      id: "article_1",
      subtitle: "지금, 가장 사랑 받는 책",
      manager: {
        id: "manager4",
        name: "Yuns",
        profileImage: profileImg.src,
        bgImage: bgImg01.src,
        bgImageMo: bgImg01Mobile.src, //mo 추가
      },
      book: {
        title: "세계 경제 지각 변동",
        imageUrl: bookImg01.src,
        subtitle: "지각 변동 서브 내용",
        author: "박종훈",
        company: "교보문고"
      }
    },
    
    // EDITOR'S PICK
    editorsPick: {
      id: "article_2",
      subtitle: "지금, 당신에게 건네고 싶은 한 문장",
      manager: {
        id: "manager4",
        name: "Yuns",
        profileImage: profileImg.src,
        bgImage: bgImg02.src,
        bgImageMo: bgImg02Mobile.src, //mo 추가
      },
      book: {
        title: "고전이 답했다",
        imageUrl: bookImg02.src,
        subtitle: "마땅히 가져야 할 부 대하여",
        author: "고명환",
        company: "리곰"
      },
      editorsMention: "“46가지 질문으로 내 안의 진짜 부를 깨울 때.”\n고전에서 건져 올린 ‘돈의 언어’로 \n부에 대한 자신만의 답을 찾아보세요"
    },
    
    // 인용구
    quotes: {
      id: "article_3",
      manager: {
        id: "manager4",
        name: "Yuns",
        profileImage: profileImg.src,
        bgImage: bgImg03.src,
        bgImageMo: bgImg03Mobile.src, //mo 추가
      },
      book: {
        title: "행복할 거야 \n이래도 되나 싶을 정도로",
        imageUrl: 'img.url',
        subtitle: "행복할거야 서브 내용~",
        author: "일홍",
        company: "부크럼"
      },
      quotes: "자신을 믿고 내일로 건너가야지. \n\n실수하고 밀려나더라도\n희망과 용기로 나아간다면\n\n기회는 어떤 방식으로든 다시 찾아온다."
    }
  }
};