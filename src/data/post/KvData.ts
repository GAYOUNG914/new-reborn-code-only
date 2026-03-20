import type { PostCommonResponse } from "@/types/Post";

import toonHeroBackground from '@/app/assets/images/contents/post_toon_bg-pc.png';
import toonHeroBackgroundMo from '@/app/assets/images/contents/post_toon_bg-mo.png';
import postBgPc from '@/app/assets/images/contents/post_bg_pc.png'; 
import postBgMo from '@/app/assets/images/contents/post_bg_mo.png'; 
import heroDataImg from "@/app/assets/images/contents/post_kv_hero.png"; //kv 히어로 이미지
import heroDataImgBg from "@/app/assets/images/contents/post_kv_hero_bg.png"; //kv 히어로 배경 이미지

export const KvData: PostCommonResponse = {
  statusCode: "200",
  message: "ok",
  result: {
    // 세상의 이야기 상단
    firstLayout: {
      innerImageUrl: heroDataImg.src,
      outterImageUrl: postBgPc.src,
      outterImageUrlMo: postBgMo.src, // mo추가
      mainText: "떨어지는 계절에도, 우리는 함께 성장합니다",
      subText: "수확의 계절, 9월",
      date: "2025.09",
      dateEng: "SEPTEMBER"
    },
    // 리본툰 대문 
    secondLayout: {
      imageUrl: toonHeroBackground.src
    },
    secondLayoutMo: { // mo추가
      imageUrl: toonHeroBackgroundMo.src
    }
  }
}