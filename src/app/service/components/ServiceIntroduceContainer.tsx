"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { getLenis } from "@/utils/lenis";
import useDeviceType from "@/utils/useDeviceType";
// 작은 아이콘들은 import 유지 (최적화 필요)
import imgScrollArrow from "../../assets/images/icons/icon_scroll_arrow.svg";
import imgIntroText01 from '../../assets/images/contents/img_service_text-01.svg';
import imgIntroText02 from '../../assets/images/contents/img_service_text-02.svg';
import imgIntroText03 from '../../assets/images/contents/img_service_text-03.svg';
import imgIntroTextGif01 from '../../assets/images/icons/img_service_gif-01.gif';
import imgIntroTextGif02 from '../../assets/images/icons/img_service_gif-02.gif';
import imgIntroTextGif03 from '../../assets/images/icons/img_service_gif-03.gif';

// 큰 이미지들은 public 경로로 변경
const imagePaths = {
  bgIntroGrdPc: '/workout-v2/images/contents/bg_service_gradient.jpg',
  bgIntroGrdMo: '/workout-v2/images/contents/bg_service_gradient_m.png',
  imgIntroCard01: '/workout-v2/images/contents/img_service_card-01_new.png',
  imgIntroCard02: '/workout-v2/images/contents/img_service_card-02_new.png',
  imgIntroCard03: '/workout-v2/images/contents/img_service_card-03_new.png',
};

// KV 이미지들도 public 경로로 변경
const kvImagePaths = {
  imgIntroKvGreen: '/workout-v2/images/contents/img_service_kv_green_new.png',
  imgIntroKvBlue: '/workout-v2/images/contents/img_service_kv_blue_new.png',
  imgIntroKvPurple: '/workout-v2/images/contents/img_service_kv_purple_new.png',
};

// 배경 이미지들도 public 경로로 변경
const backgroundImagePaths = {
  // 모바일 배경 이미지
  bgIntroContentGreenMo: '/workout-v2/images/contents/bg_service_content_green_m.png',
  bgIntroContentBlueMo: '/workout-v2/images/contents/bg_service_content_blue_m.png',
  bgIntroContentPurpleMo: '/workout-v2/images/contents/bg_service_content_purple_m.png',
  // PC 배경 이미지
  bgIntroContentGreenPc: '/workout-v2/images/contents/bg_service_content_green.jpg',
  bgIntroContentBluePc: '/workout-v2/images/contents/bg_service_content_blue.jpg',
  bgIntroContentPurplePc: '/workout-v2/images/contents/bg_service_content_purple.jpg',
};
import ServiceInfoSection from "./ServiceInfoSection";
import CardListSection from "./CardListSection";
import CustomerReviewSection from "./CustomerReviewSection";
import JourneySwiper from "./JourneySwiper";

// 그린리본 이미지들 - public 경로로 변경
const greenImagePaths = {
  imgContentCardGreen01: '/workout-v2/images/contents/img_service_content_card_green-01.png',
  imgContentCardGreen01New: '/workout-v2/images/contents/img_service_content_card_green-01_new.png',
  imgContentCardGreen02: '/workout-v2/images/contents/img_service_content_card_green-02.png',
  imgContentCardGreen02New: '/workout-v2/images/contents/img_service_content_card_green-02_new.png',
  imgContentCardGreen03: '/workout-v2/images/contents/img_service_content_card_green-03.png',
  imgContentCardGreen03New: '/workout-v2/images/contents/img_service_content_card_green-03_new.png',
  // thumbContentGreen01: '/workout-v2/images/contents/thumb_service_content_green-01.jpg',
  // thumbContentGreen02: '/workout-v2/images/contents/thumb_service_content_green-02.jpg',
  // thumbContentGreen03: '/workout-v2/images/contents/thumb_service_content_green-03.jpg',
  thumbContentGreen01: '/workout-v2/images/contents/thumb_service_content_green-01.png',
  thumbContentGreen02: '/workout-v2/images/contents/thumb_service_content_green-02.png',
  thumbContentGreen03: '/workout-v2/images/contents/thumb_service_content_green-03.png',
};

// 블루리본 이미지들 - public 경로로 변경
const blueImagePaths = {
  imgContentCardBlue01: '/workout-v2/images/contents/img_service_content_card_blue-01_new.png',
  imgContentCardBlue02: '/workout-v2/images/contents/img_service_content_card_blue-02.png',
  imgContentCardBlue03: '/workout-v2/images/contents/img_service_content_card_blue-03.png',
  // thumbContentBlue01: '/workout-v2/images/contents/thumb_service_content_blue-01.jpg',
  // thumbContentBlue02: '/workout-v2/images/contents/thumb_service_content_blue-02.jpg',
  // thumbContentBlue03: '/workout-v2/images/contents/thumb_service_content_blue-03.jpg',
  thumbContentBlue01: '/workout-v2/images/contents/thumb_service_content_blue-01.png',
  thumbContentBlue02: '/workout-v2/images/contents/thumb_service_content_blue-02.png',
  thumbContentBlue03: '/workout-v2/images/contents/thumb_service_content_blue-03.png',
};

// 퍼플리본 이미지들 - public 경로로 변경
const purpleImagePaths = {
  imgContentCardPurple01: '/workout-v2/images/contents/img_service_content_card_purple-01.png',
  imgContentCardPurple01New: '/workout-v2/images/contents/img_service_content_card_purple-01_new.png',
  imgContentCardPurple02: '/workout-v2/images/contents/img_service_content_card_purple-02.png',
  imgContentCardPurple02New: '/workout-v2/images/contents/img_service_content_card_purple-02_new.png',
  imgContentCardPurple03: '/workout-v2/images/contents/img_service_content_card_purple-03.png',
  imgContentCardPurple03New: '/workout-v2/images/contents/img_service_content_card_purple-03_new.png',
  // thumbContentPurple01: '/workout-v2/images/contents/thumb_service_content_purple-01.jpg',
  // thumbContentPurple02: '/workout-v2/images/contents/thumb_service_content_purple-02.jpg',
  // thumbContentPurple03: '/workout-v2/images/contents/thumb_service_content_purple-03.jpg',
  thumbContentPurple01: '/workout-v2/images/contents/thumb_service_content_purple-01.png',
  thumbContentPurple02: '/workout-v2/images/contents/thumb_service_content_purple-02.png',
  thumbContentPurple03: '/workout-v2/images/contents/thumb_service_content_purple-03.png',
};




// Journey 배경 이미지들 - public 경로로 변경
const journeyImagePaths = {
  // PC 배경 이미지
  bgJourney01: '/workout-v2/images/contents/bg_service_journey-01.png',
  bgJourney02: '/workout-v2/images/contents/bg_service_journey-02.png',
  bgJourney03: '/workout-v2/images/contents/bg_service_journey-03.png',
  bgJourney04: '/workout-v2/images/contents/bg_service_journey-04.png',
  bgJourney05: '/workout-v2/images/contents/bg_service_journey-05.png',
  // 모바일 배경 이미지
  bgJourney01M: '/workout-v2/images/contents/bg_service_journey-01_m.png',
  bgJourney02M: '/workout-v2/images/contents/bg_service_journey-02_m.png',
  bgJourney03M: '/workout-v2/images/contents/bg_service_journey-03_m.png',
  bgJourney04M: '/workout-v2/images/contents/bg_service_journey-04_m.png',
  bgJourney05M: '/workout-v2/images/contents/bg_service_journey-05_m.png',
  // 배너 이미지
  imgRebomCharactor: '/workout-v2/images/contents/img_service_banner-1.png',
  imgRebomCharactorMo: '/workout-v2/images/contents/img_service_banner_m-1.png',
};

// 작은 아이콘은 import 유지
import iconLinkArrowWhite from '../../assets/images/icons/icon_link_arrow_white.svg';


import "../styles/ServiceIntroduceContainer.scss";
import "../styles/CardListSection.scss";
import "../styles/CustomerReviewSection.scss";
import "../styles/JourneySwiper.scss";

export default function ServiceIntroduceContainer() {
  const [activeSection, setActiveSection] = useState(-1); // 초기값을 -1로 설정하여 아무것도 활성화되지 않도록 함
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [journeyActiveIndex, setJourneyActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceType = useDeviceType();
  
  const lenis = getLenis();

  // 팝업 상태 변경 핸들러
  const handlePopupStateChange = useCallback((isOpen: boolean) => {
    setIsPopupOpen(isOpen);
    
    if (isOpen) {
      // 팝업이 열릴 때 활성화된 팝업이 있는 round-wrap에 z-index 적용
      setTimeout(() => {
        const popup = document.querySelector('.card-list-section_popup');
        if (popup) {
          const activeRoundWrap = popup.closest('.service-introduce_part--2_content_round-wrap');
          if (activeRoundWrap) {
            (activeRoundWrap as HTMLElement).style.zIndex = '1000';
          }
        }
      }, 100); // DOM 렌더링을 위해 100ms 대기
      if (lenis) {
        lenis.stop();
        document.body.style.overflow = 'hidden';
      }
    } else {
      // 팝업이 닫힐 때 모든 round-wrap의 z-index 제거
      const roundWraps = document.querySelectorAll('.service-introduce_part--2_content_round-wrap');
      roundWraps.forEach((roundWrap) => {
        (roundWrap as HTMLElement).style.zIndex = '';
      });
      if (lenis) {
        lenis.start();
        document.body.style.overflow = '';
      }
    }
  }, [lenis]);

  // 디바이스 타입에 따른 배경 이미지 선택
  const bgIntroContentGreen = deviceType === 'pc' ? backgroundImagePaths.bgIntroContentGreenPc : backgroundImagePaths.bgIntroContentGreenMo;
  const bgIntroContentBlue = deviceType === 'pc' ? backgroundImagePaths.bgIntroContentBluePc : backgroundImagePaths.bgIntroContentBlueMo;
  const bgIntroContentPurple = deviceType === 'pc' ? backgroundImagePaths.bgIntroContentPurplePc : backgroundImagePaths.bgIntroContentPurpleMo;

  // 네비게이션 클릭 핸들러 함수
  const handleNavigationClick = (sectionIndex: number, target: React.RefObject<HTMLDivElement | null> | string) => {
    setActiveSection(sectionIndex);
    const lenis = getLenis();
    
    let targetElement: Element | null = null;
    
    if (typeof target === 'string') {
      // 문자열인 경우 CSS 선택자로 처리
      targetElement = document.querySelector(target);
    } else {
      // RefObject인 경우 ref.current 사용
      targetElement = target.current;
    }
    
    if (targetElement) {
      if (lenis) {
        // Lenis 일시 중지
        lenis.stop();
        // 네이티브 스크롤 사용
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // 스크롤 완료 후 Lenis 재시작
        setTimeout(() => {
          lenis.start();
        }, 1000);
      } else {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollDoItRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const purpleRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const text4P1Ref = useRef<HTMLParagraphElement>(null);
  const text4P2Ref = useRef<HTMLParagraphElement>(null);
  const cardListRef = useRef<HTMLDivElement>(null);
  const cardList1Ref = useRef<HTMLLIElement>(null);
  const cardList2Ref = useRef<HTMLLIElement>(null);
  const cardList3Ref = useRef<HTMLLIElement>(null);
  const text6Ref = useRef<HTMLDivElement>(null);
  const textListRef = useRef<HTMLDivElement>(null);
  const textList1Ref = useRef<HTMLParagraphElement>(null);
  const textList2Ref = useRef<HTMLParagraphElement>(null);
  const textList3Ref = useRef<HTMLParagraphElement>(null);
  const textList4Ref = useRef<HTMLParagraphElement>(null);
  const text7P1Ref = useRef<HTMLParagraphElement>(null);
  const text7P2Ref = useRef<HTMLParagraphElement>(null);
  const kvRef = useRef<HTMLDivElement>(null);
  const part1Ref = useRef<HTMLDivElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);

  const navigationRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);



  // 화면 크기 감지 및 업데이트
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkIsMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newIsMobile = window.innerWidth <= 767;
        setIsMobile(newIsMobile);
        // console.log('화면 크기 변경:', window.innerWidth, 'isMobile:', newIsMobile);
      }, 100);
    };

    // 초기 설정
    checkIsMobile();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.normalizeScroll(true); 


    // iOS 크롬 감지
    const isIOSChrome = /CriOS/.test(navigator.userAgent) && /iPad|iPhone|iPod/.test(navigator.userAgent);

    // iOS 크롬에서는 주소창으로 인한 스크롤 점프 방지
    if (isIOSChrome) {
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load", // resize 이벤트 제외
        ignoreMobileResize: true, // 모바일 리사이즈 무시
      });
    }

    // 화면 크기 확인
    // const currentIsMobile = isMobile;
    const currentIsMobile = window.innerWidth <= 767;

    // 초기 상태 설정
    gsap.set(text2Ref.current, { opacity: 0 });
    gsap.set(text3Ref.current, { x: "100%" });
    gsap.set(text4P1Ref.current, { opacity: 0 });
    gsap.set(text4P2Ref.current, { opacity: 0 });
    gsap.set(text6Ref.current, { opacity: 0 });
    if(currentIsMobile){
      gsap.set(cardListRef.current, { opacity: 0, transform: "translateY(50%)" });
    }else{
      gsap.set(cardListRef.current, { opacity: 0, transform: "translateY(0)" });
    }
    gsap.set(textListRef.current, { opacity: 0 });
    gsap.set(text7P1Ref.current, { opacity: 0 });
    gsap.set(text7P2Ref.current, { opacity: 0 });
    // gsap.set(kvRef.current, { opacity: 0 });
    
    // 카드 초기 상태 설정 - PC/모바일 분기
    if (currentIsMobile) {
      // 모바일 초기화
      gsap.set(cardList1Ref.current, { 
        opacity: 1,
        transform: "translate(-50%, -50%)",
        width: "360px",
        height: "333px"
      });
      gsap.set(cardList2Ref.current, { 
        opacity: 0.5,
        transform: "translate(-50%, 214px)",
        width: "288px", 
        height: "184px"
      });
      gsap.set(cardList3Ref.current, { 
        opacity: 0.2,
        transform: "translate(-50%, 430px)",
        width: "230px",
        height: "147px"
      });
    } else {
      // PC 초기화 - 모바일 스타일 완전 제거
      gsap.set(cardList1Ref.current, { 
        opacity: 1,
        transform: "none",
        width: "auto",
        height: "auto"
      });
      gsap.set(cardList2Ref.current, { 
        opacity: 0,
        // transform: "translateY(500px)",
        transform: "translateY(0px)",
        width: "auto",
        height: "auto"
      });
      gsap.set(cardList3Ref.current, {  
        opacity: 0,
        // transform: "translateY(500px)",
        transform: "translateY(0px)",
        width: "auto",
        height: "auto"
      });
    }
    
    // 카드 내부 이미지 및 텍스트 초기 상태 설정 - PC/모바일 분기
    const card1Img = cardList1Ref.current?.querySelector('img') as HTMLImageElement;
    const card2Img = cardList2Ref.current?.querySelector('img') as HTMLImageElement;
    const card3Img = cardList3Ref.current?.querySelector('img') as HTMLImageElement;
    const card1Text = cardList1Ref.current?.querySelector('p') as HTMLParagraphElement;
    const card2Text = cardList2Ref.current?.querySelector('p') as HTMLParagraphElement;
    const card3Text = cardList3Ref.current?.querySelector('p') as HTMLParagraphElement;
    
    if (currentIsMobile) {
      // 모바일 초기화
      if (card1Img) gsap.set(card1Img, { width: "169px", height: "150px", marginBottom: "20px", opacity: 1 });
      if (card2Img) gsap.set(card2Img, { width: "80px", height: "80px", marginBottom: "0px", opacity: 1 });
      if (card3Img) gsap.set(card3Img, { width: "80px", height: "80px", opacity: 1 });
      if (card1Text) gsap.set(card1Text, { fontSize: "20px", opacity: 1 });
      if (card2Text) gsap.set(card2Text, { fontSize: "16px", opacity: 1 });
      if (card3Text) gsap.set(card3Text, { fontSize: "16px", opacity: 1 });
    } 
    else {
      // PC 초기화 - 모바일 스타일 완전 제거
      if (card1Img) gsap.set(card1Img, { width: "auto", height: "auto", opacity: 0 });
      if (card2Img) gsap.set(card2Img, { width: "auto", height: "auto", opacity: 0 });
      if (card3Img) gsap.set(card3Img, { width: "auto", height: "auto", opacity: 0 });
      if (card1Text) gsap.set(card1Text, { fontSize: "auto", opacity: 0 });
      if (card2Text) gsap.set(card2Text, { fontSize: "auto", opacity: 0 });
      if (card3Text) gsap.set(card3Text, { fontSize: "auto", opacity: 0 });
    }
    
    // 텍스트 리스트 초기 상태 설정
    if (currentIsMobile) {
      gsap.set(textList1Ref.current, { 
        opacity: 1,
        transform: "translate(-50%, -50%)"
      });
      gsap.set(textList2Ref.current, { 
        opacity: 0,
        transform: "translate(-50%, calc(-50% + 150px))"
      });
      gsap.set(textList3Ref.current, { 
        opacity: 0,
        transform: "translate(-50%, calc(-50% + 300px))"
      });
      gsap.set(textList4Ref.current, { 
        opacity: 0,
        transform: "translate(-50%, calc(-50% + 300px))"
      });
    } else {
      gsap.set(textList1Ref.current, { 
        opacity: 1,
        transform: "translateY(-50%)"
      });
      gsap.set(textList2Ref.current, { 
        opacity: 1,
        transform: "translateY(-50%)"
      });
      gsap.set(textList3Ref.current, { 
        opacity: 0.2,
        transform: "translateY(calc(-50% + 150px))"
      });
      gsap.set(textList4Ref.current, { 
        opacity: 0,
        transform: "translateY(calc(-50% + 200px))"
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=6900vh",
        scrub: 1,
        pin: ".service-introduce_part--1", // part1만 pin
        pinSpacing: true,
        invalidateOnRefresh: false, // iOS 주소창 변경 시 애니메이션 재계산 방지
      },
    });

    // 1단계: 첫 번째 텍스트가 opacity 0으로 사라짐과 동시에 scroll-do-it도 사라짐 (0vh ~ 250vh)
    tl.to(text1Ref.current, {
      opacity: 0,
      duration: 2.25,
      ease: "ease",
    }, 0);

    tl.to(scrollDoItRef.current, {
      opacity: 0,
      duration: 2.25,
      ease: "ease",
    }, 0);

    tl.to(bgRef.current, {
      opacity: 0,
      duration: 2.25,
      ease: "ease",
    }, 0);

    // 2단계: 두 번째 텍스트가 opacity 1로 나타남 (250vh ~ 500vh)
    tl.to(text2Ref.current, {
      opacity: 1,
      duration: 2.25,
      ease: "ease",
    }, 2.5);

    // 3단계: 두 번째 텍스트가 왼쪽으로 이동하며 사라지고, 세 번째 텍스트가 오른쪽에서 중앙으로 이동하며 나타남 (750vh ~ 1000vh)
    tl.to(text2Ref.current, {
      x: "-100%",
      opacity: 0,
      duration: 3.25,
      ease: "ease",
    }, 5.5);

    tl.to(text3Ref.current, {
      x: "0%",
      opacity: 1,
      duration: 3.25,
      ease: "ease",
    }, 5.5);

    // 4단계: 세 번째 텍스트가 250vh 동안 유지 (1000vh ~ 1250vh)
    tl.to({}, {
      duration: 1,
    }, 8);

    // 5단계: 세 번째 텍스트가 opacity 0으로 사라짐 (1250vh ~ 1500vh)
    tl.to(text3Ref.current, {
      opacity: 0,
      duration: 3,
      ease: "power1.inOut",
    }, 9);

    // 7단계: 첫 번째 p 태그가 나타남 (1500vh ~ 1625vh)
    tl.to(text4P1Ref.current, {
      opacity: 1,
      duration: 2.25,
      ease: "power1.inOut",
    }, 11.5);

    tl.to(bgRef.current, {
      opacity: 1,
      duration: 2.25,
      ease: "power1.inOut",
    }, 11.5);

    tl.to({}, {
      duration: 1,
    }, 13);

    // 8단계: 두 번째 p 태그가 나타남 (1875vh ~ 2000vh)
    tl.to(text4P2Ref.current, {
      opacity: 1,
      duration: 2.25,
      ease: "power1.inOut",
    }, 14);

    // 8.5단계: 4단계 텍스트 유지 구간 (2000vh ~ 2250vh)
    tl.to({}, {
      duration: 2,
    }, 16);

    // 9단계: 텍스트가 사라지고 카드 리스트가 노출됨 (2250vh ~ 2375vh)
    tl.to([text4P1Ref.current, text4P2Ref.current], {
      opacity: 0,
      duration: 2.25,
      ease: "power1.inOut",
    }, 18);

    tl.to(bgRef.current, {
      opacity: 0,
      duration: 2.5,
      ease: "power1.inOut",
    }, 18);

    // 10단계: 카드 전체 노출 (2475vh ~ 2600vh)
    if (currentIsMobile) {
      tl.to(cardListRef.current, {
        opacity: 1,
        transform: "translateY(0)",
        duration: 6,
        ease: "power1.inOut",
      }, 20.5);
    }
    else{
      tl.to(cardListRef.current, {
        opacity: 1,
        duration: 3,
        ease: "power1.inOut",
      }, 20.5);
    }

    // 11단계: 첫 번째 카드 위로 이동, 나머지 카드들 위치 조정 (2600vh ~ 3100vh) - PC/모바일 분기
    if (currentIsMobile) {
      // 모바일 애니메이션

      tl.to(cardList1Ref.current, {
        opacity: 0.2,
        transform: "translate(-50%, -310px)",
        width: "230px",
        height: "147px",
        duration: 4,
        ease: "linear",
      }, 26.25);
      
      tl.to(cardList2Ref.current, {
        opacity: 1,
        transform: "translate(-50%, -50%)",
        width: "360px",
        height: "333px",
        duration: 4,
        ease: "linear",
      }, 26.25);
      
      tl.to(cardList3Ref.current, {
        opacity: 0.5,
        transform: "translate(-50%, 214px)",
        width: "288px",
        height: "184px",
        duration: 4,
        ease: "linear",
      }, 26.25);
      
      if (card1Img && card2Img && card3Img) {
        tl.to(card1Img, {
          width: "90px",
          height: "80px",
          marginBottom: "0px",
          duration: 4,
          ease: "power1.inOut",
        }, 26.25);
        
        tl.to(card2Img, {
          width: "150px",
          height: "150px",
          marginBottom: "14px",
          duration: 4,
          ease: "power1.inOut",
        }, 26.25);
        
        tl.to(card3Img, {
          width: "86px",
          height: "86px",
          duration: 4,
          ease: "power1.inOut",
        }, 26.25);
      }
      
      if (card1Text && card2Text && card3Text) {
        tl.to(card1Text, {
          fontSize: "16px",
          duration: 4,
          ease: "power1.inOut",
        }, 26.25);
        
        tl.to(card2Text, {
          fontSize: "20px",
          duration: 4,
          ease: "power1.inOut",
        }, 26.25);
        
        tl.to(card3Text, {
          fontSize: "16px",
          duration: 4,
          ease: "power1.inOut",
        }, 26.25);
      }

      // 12단계: 두 번째 카드 위로 이동, 세 번째 카드 중앙으로 이동 (3100vh ~ 3600vh)
      tl.to(cardList1Ref.current, {
        opacity: 0,
        duration: 1.25,
        ease: "linear",
      }, 30.25);
      
      tl.to(cardList2Ref.current, {
        opacity: 0.2,
        transform: "translate(-50%, -310px)",
        width: "230px",
        height: "147px",
        duration: 4,
        ease: "linear",
      }, 30.25);
      
      tl.to(cardList3Ref.current, {
        opacity: 1,
        transform: "translate(-50%, -50%)",
        width: "360px",
        height: "333px",
        duration: 4,
        ease: "linear",
      }, 30.25);
      
      if (card2Img && card3Img) {
        tl.to(card2Img, {
          width: "80px",
          height: "80px",
          marginBottom: "0px",
          duration: 4,
          ease: "power1.inOut",
        }, 30.25);
        
        tl.to(card3Img, {
          width: "178px",
          height: "178px",
          duration: 4,
          ease: "power1.inOut",
        }, 30.25);
      }
      
      if (card2Text && card3Text) {
        tl.to(card2Text, {
          fontSize: "16px",
          duration: 4,
          ease: "power1.inOut",
        }, 30.25);
        
        tl.to(card3Text, {
          fontSize: "20px",
          duration: 4,
          ease: "power1.inOut",
        }, 30.25);
      }
  
      // 13단계: 두 번째, 세 번째 카드 동시에 사라짐 (3600vh ~ 3725vh)
      tl.to([cardList2Ref.current, cardList3Ref.current], {
        opacity: 0,
        duration: 2.25,
        ease: "power1.inOut",
      }, 35);

    }else{
      tl.to(card1Img, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
      }, 22.25);
      tl.to(card1Text, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
      }, 22.25);

      tl.to(cardList2Ref.current, {
        opacity: 1,
        transform: "translateY(0)",
        duration: 2,
        ease: "power1.inOut",
      }, 24.25);
      tl.to(card2Img, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
      }, 26);
      tl.to(card2Text, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
      }, 26);


      tl.to(cardList3Ref.current, {
        opacity: 1,
        transform: "translateY(0)",
        duration: 2,
        ease: "power1.inOut",
      }, 28.5);
      tl.to(card3Img, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
      }, 30.25);
      tl.to(card3Text, {
        opacity: 1,
        duration: 2,
        ease: "power1.inOut",
      }, 30.25);

      tl.to({}, {
        duration: 1,
      }, 32.25);

      tl.to(cardListRef.current, {
        opacity: 0,
        duration: 4,
        ease: "power1.inOut",
      }, 33.25);
  
    }


    // 14단계: 배경색 변경 및 6단계 텍스트 노출 (3725vh ~ 3975vh)
    const animationElement = containerRef.current?.querySelector('.service-introduce_animation') as HTMLElement;
    if (animationElement) {
      tl.to(animationElement, {
        backgroundColor: "#ffffff",
        duration: 3,
        ease: "power1.inOut",
      }, 37);
    }
    
    tl.to(text6Ref.current, {
      opacity: 1,
      duration: 3,
      ease: "power1.inOut",
    }, 38);

    tl.to({}, {
      duration: 1.75,
    }, 40.25);

    // 15단계: text6Ref 사라짐 (3975vh ~ 4100vh)
    tl.to(text6Ref.current, {
      opacity: 0,
      duration: 2,
      ease: "power1.inOut",
    }, 42.25);


    // 16단계: 텍스트 리스트 전체 노출 (4100vh ~ 4225vh)
    tl.to(textListRef.current, {
      opacity: 1,
      duration: 2,
      ease: "power1.inOut",
    }, 44.25);


    // 17단계: 첫 번째 텍스트 위로 이동, 나머지 텍스트들 위치 조정 (4225vh ~ 4725vh)
    if (currentIsMobile) {
      tl.to(textList1Ref.current, {
        opacity: 0.2,
        transform: "translate(-50%, calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 45.25);
      
      tl.to(textList2Ref.current, {
        opacity: 1,
        transform: "translate(-50%, -50%)",
        duration: 3,
        ease: "linear",
      }, 45.25);
      
      tl.to(textList3Ref.current, {
        opacity: 0.5,
        transform: "translate(-50%, calc(-50% + 150px))",
        duration: 3,
        ease: "linear",
      }, 45.25);
  
      // 18단계: 두 번째 텍스트 위로 이동, 세 번째 텍스트 중앙으로 이동 (4725vh ~ 5225vh)
      tl.to(textList1Ref.current, {
        opacity: 0,
        duration: 1.25,
        ease: "linear",
      }, 48.25);
      
      tl.to(textList2Ref.current, {
        opacity: 0.2,
        transform: "translate(-50%, calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 48.25);
      
      tl.to(textList3Ref.current, {
        opacity: 1,
        transform: "translate(-50%, -50%)",
        duration: 3,
        ease: "linear",
      }, 48.25);
      
      tl.to(textList4Ref.current, {
        opacity: 0.5,
        transform: "translate(-50%, calc(-50% + 150px))",
        duration: 3,
        ease: "linear",
      }, 48.25);
  
      // 19단계: 세 번째 텍스트 위로 이동, 네 번째 텍스트 중앙으로 이동 (5225vh ~ 5725vh)
      tl.to(textList2Ref.current, {
        opacity: 0,
        duration: 1.25,
        ease: "linear",
      }, 51.25);
      
      tl.to(textList3Ref.current, {
        opacity: 0.2,
        transform: "translate(-50%, calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 51.25);
      
      tl.to(textList4Ref.current, {
        opacity: 1,
        transform: "translate(-50%, -50%)",
        duration: 3,
        ease: "linear",
      }, 51.25);

      tl.to(textList4Ref.current, {
        opacity: 0,
        transform: "translate(-50%, calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 54.25);
      
    }else{
      // pc:우측 첫줄 최상단 이동
      tl.to(textList2Ref.current, {
        opacity: 0.2,
        transform: "translateY(calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 46.25);

      tl.to(textList3Ref.current, {
        opacity: 1,
        transform: "translateY(calc(-50%))",
        duration: 3,
        ease: "linear",
      }, 46.25);

      tl.to(textList4Ref.current, {
        opacity: 0.2,
        transform: "translateY(calc(-50% + 150px))",
        duration: 3,
        ease: "linear",
      }, 46.25);

      // pc:우측 2째줄 최상단 이동
      tl.to(textList2Ref.current, {
        opacity: 0,
        transform: "translateY(calc(-50% - 200px))",
        duration: 3,
        ease: "linear",
      }, 49.25);

      tl.to(textList3Ref.current, {
        opacity: 0.2,
        transform: "translateY(calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 49.25);

      tl.to(textList4Ref.current, {
        opacity: 1,
        transform: "translateY(calc(-50%))",
        duration: 3,
        ease: "linear",
      }, 49.25);

      tl.to(textList3Ref.current, {
        opacity: 0,
        transform: "translateY(calc(-50% - 150px))",
        duration: 1.25,
        ease: "linear",
      }, 52.25);

      tl.to(textList4Ref.current, {
        opacity: 0,
        transform: "translateY(calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 52.25);

      tl.to(textList1Ref.current, {
        opacity: 0,
        transform: "translateY(calc(-50% - 150px))",
        duration: 3,
        ease: "linear",
      }, 52.25);

    }

    // 20단계: 텍스트 리스트 사라짐 (5725vh ~ 5850vh)
    tl.to(textListRef.current, {
      opacity: 0,
      duration: 2.25,
      ease: "power1.inOut",
    }, 53.25);

    // 21단계: 첫 번째 p 태그가 나타남 (5850vh ~ 5975vh)
    tl.to(text7P1Ref.current, {
      opacity: 1,
      duration: 2.5,
      ease: "power1.inOut",
    }, 56);

    tl.to({}, {
      duration: 1.25,
    }, 56.75);

    // 22단계: 배경색 변경 및 텍스트 색상 변경 (6100vh ~ 6225vh)
    if (animationElement) {
      tl.to(animationElement, {
        backgroundColor: "#000000",
        duration: 2.25,
        ease: "power1.inOut",
      }, 58);
    }

    tl.to(bgRef.current, {
      opacity: 1,
      duration: 2.25,
      ease: "power1.inOut",
    }, 58);

    tl.to(text7P1Ref.current, {
      color: "#ffffff",
      duration: 2.25,
      ease: "power1.inOut",
    }, 58);

    // 23단계: p 태그가 나타남 (6225vh ~ 6350vh)
    tl.to(text7P2Ref.current, {
      opacity: 1,
      duration: 2.25,
      ease: "power1.inOut",
    }, 59.25);

    tl.to({}, {
      duration: 1.25,
    }, 60.5);

    tl.to(bgRef.current, {
      opacity: 0,
      duration: 2.25,
      ease: "power1.inOut",
    }, 61.75);

    tl.to(text7P1Ref.current, {
      opacity: 0,
      duration: 2.25,
      ease: "power1.inOut",
    }, 61.75);

    tl.to(text7P2Ref.current, {
      opacity: 0,
      duration: 2.25,
      ease: "power1.inOut",
    }, 61.75);

    // // 24단계: part1Ref 투명하게 -> KV 영역이 나타남 (6350vh ~ 6475vh)

    tl.to(part1Ref.current, {
      opacity: 0,
      duration: 2.25,
      ease: "power1.inOut",
    }, 63.5);

    tl.to(part2Ref.current, {
      zIndex: 1,
    }, 65.75);

    // 24단계: 아니면 원래부터 zindex 1 이었던 part2Ref.current 가 opacity 1됨

    // tl.set(part2Ref.current, {
    //   opacity: 1,
    // }, 63.75);

    // tl.to({}, {
    //   duration: 5.25,
    // }, 63.75);


    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]); // isMobile 상태가 변경될 때마다 애니메이션 재설정

  // 리사이즈 이벤트 처리 (기존 ScrollTrigger 관련만 처리)
  useEffect(() => {
    // iOS 크롬 감지
    const isIOSChrome = /CriOS/.test(navigator.userAgent) && /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      // iOS 크롬에서는 디바운싱 적용하여 스크롤 점프 방지
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // iOS 크롬에서는 실제 화면 크기 변경(회전)일 때만 refresh
        if (!isIOSChrome) {
          ScrollTrigger.refresh();
        }
        
        // service-introduce_part--1의 인라인 스타일 제거
        const part1Element = document.querySelector('.service-introduce_part--1');
        if (part1Element) {
          (part1Element as HTMLElement).style.width = '';
          (part1Element as HTMLElement).style.height = '';
        }
      }, isIOSChrome ? 300 : 100);
    };

    // iOS 크롬에서는 orientationchange만 감지
    if (isIOSChrome) {
      window.addEventListener('orientationchange', handleResize);
      return () => {
        window.removeEventListener('orientationchange', handleResize);
        clearTimeout(resizeTimeout);
      };
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

// ServiceIntroduceContainer.tsx에 추가
const [isChromeIOS, setIsChromeIOS] = useState(false);

useEffect(() => {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  setIsChromeIOS(isChrome && isIOS);
}, []);


  // 모바일 주소창 리사이즈 문제 해결을 위한 viewport height 안정화
  useEffect(() => {
    // iOS 감지 (사파리 + 크롬)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIOSChrome = /CriOS/.test(navigator.userAgent) && isIOS;
    const isIOSSafari = isIOS && !isIOSChrome;
    
    // iOS에서 주소창 변경으로 인한 높이 변화를 추적
    let previousHeight = window.visualViewport?.height || window.innerHeight;
    
    const setViewportHeight = () => {
      // visualViewport API 사용 (더 정확한 viewport 높이)
      const height = window.visualViewport?.height || window.innerHeight;
      const vh = height * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // part2Ref의 margin-top을 고정값으로 설정하여 주소창 변경에 영향받지 않도록 함
      if (part2Ref.current && window.innerWidth <= 767) {
        const part2Element = part2Ref.current as HTMLElement;
        // 초기 높이를 기준으로 고정값 설정
        if (!part2Element.dataset.initialHeight) {
          part2Element.dataset.initialHeight = height.toString();
        }
        const initialHeight = parseInt(part2Element.dataset.initialHeight);
        part2Element.style.marginTop = `-${initialHeight * 3}px`;
      }
    };

    // 초기 설정
    setViewportHeight();

    // iOS에서 ScrollTrigger refresh를 매우 신중하게 처리
    let resizeTimeout: NodeJS.Timeout;
    const handleViewportResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDiff = Math.abs(currentHeight - previousHeight);
      
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setViewportHeight();
        
        // iOS에서는 주소창 변경(높이 변화)으로 인한 refresh를 완전히 방지
        if (isIOS) {
          // 너비는 변경되지 않고 높이만 변경된 경우 (주소창 변경) refresh 하지 않음
          const widthChanged = window.innerWidth !== (window as any).lastKnownWidth;
          (window as any).lastKnownWidth = window.innerWidth;
          
          if (!widthChanged) {
            // 주소창 변경만 발생한 경우 refresh 생략
            previousHeight = currentHeight;
            return;
          }
        }
        
        // 실제 화면 크기 변경(회전 등)인 경우에만 refresh
        ScrollTrigger.refresh();
        previousHeight = currentHeight;
      // }, isIOS ? 150 : 150); // iOS는 더 긴 디바운싱
      }, 150);
    };

    // visualViewport API 이벤트 리스너 (더 정확한 주소창 변경 감지)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }
    
    window.addEventListener('resize', handleViewportResize);
    
    // orientationchange는 실제 회전이므로 refresh 필요
    const handleOrientationChange = () => {
      setTimeout(() => {
        setViewportHeight();
        ScrollTrigger.refresh();
      }, 300);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
      window.removeEventListener('resize', handleViewportResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Part2 스크롤 감지
  useEffect(() => {
    const sections = [
      { ref: greenRef, index: 0 },
      { ref: blueRef, index: 1 },
      { ref: purpleRef, index: 2 },
      { ref: journeyRef, index: 3 }
    ];

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // 현재 화면 중앙 위치 계산
      const centerY = scrollY + windowHeight / 2;
      
      let activeIndex = -1;
      
      sections.forEach((section, index) => {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const sectionTop = rect.top + scrollY;
          const sectionBottom = sectionTop + rect.height;
          
          // 섹션이 화면 중앙에 있는지 확인
          if (centerY >= sectionTop && centerY <= sectionBottom) {
            activeIndex = index;
          }
        }
      });
      
      setActiveSection(activeIndex);
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 초기 상태 설정
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // sticky 네비게이션 감지
  useEffect(() => {
    let gnbHeight = 0;
    
    if(window.innerWidth <= 425){
      gnbHeight = 50;
    }else{
      gnbHeight = 60;
    }
    
    const handleStickyScroll = () => {
      const part2Content = document.querySelector('.service-introduce_part--2_content');

      
      if (part2Content) {
        const rect = part2Content.getBoundingClientRect();
        // 요소의 상단이 브라우저 창의 상단에 닿았거나 지나갔을 때
        setIsSticky(rect.top - gnbHeight <= 0);
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleStickyScroll, { passive: true });
    
    // 초기 상태 설정
    handleStickyScroll();

    return () => {
      window.removeEventListener('scroll', handleStickyScroll);
    };
  }, []);

  // 스크롤 이벤트로 이미지 크기 변경
  useEffect(() => {
    const roundWraps = document.querySelectorAll('.service-introduce_part--2_content_round-wrap');
    
    const handleScroll = () => {
      roundWraps.forEach((roundWrap) => {
        const contentSection = roundWrap.previousElementSibling;
        const visualImg = contentSection?.querySelector('.content-section_visual img');
        
        if (visualImg) {
          const rect = roundWrap.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // round-wrap이 화면 하단에서 중앙까지 이동하는 구간 계산
          const startY = windowHeight;
          const endY = windowHeight * 0.7; // 화면의 70% 지점에서 완료
          const currentY = rect.top;
          
          // progress 계산 (0~1)
          let progress = 0;
          if (currentY <= startY && currentY >= endY) {
            progress = (startY - currentY) / (startY - endY);
          } else if (currentY < endY) {
            progress = 1; // 완전히 축소된 상태
          }
          
          // 이미지 크기 계산 (PC와 모바일 모두 적용)
          const maxWidth = 100 - (progress * 22); // 100%에서 70%까지 (30% 축소)
          const maxHeight = 70 - (progress * 25); // 70vh에서 35vh까지 (50% 축소)
          
          gsap.set(visualImg, {
            maxWidth: `${maxWidth}%`,
            maxHeight: `${maxHeight}vh`,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="service-introduce" ref={containerRef}>
      <div className="service-introduce_part--1" ref={part1Ref}>
        <div className="service-introduce_animation">
          <div className="service-introduce_animation_bg" ref={bgRef}>
            <Image src={imagePaths.bgIntroGrdPc} alt="" className="bg-pc" width={1920} height={1080} />
            <Image src={imagePaths.bgIntroGrdMo} alt="" className="bg-mobile" width={1920} height={1080} />
          </div>
          {/* 스크롤 유도 애니메이션 */}
          <div className="service-introduce_scroll-do-it" ref={scrollDoItRef} style={{ bottom: '16vh'}}>
            <p>Scroll</p>
            <div className="arrows-wrap">
              <Image src={imgScrollArrow} width={12} height={6} alt="Scroll Arrow" />
              <Image src={imgScrollArrow} width={12} height={6} alt="Scroll Arrow" />
              <Image src={imgScrollArrow} width={12} height={6} alt="Scroll Arrow" />
            </div>
          </div>
          {/* 1단계 텍스트 */}
          <p className="service-introduce_animation_item" ref={text1Ref}>
            더 이상 채무 때문에 <br />
            <span>혼자 힘들어하지 마세요!</span>
          </p>
          
          {/* 2단계 텍스트 */}
          <p className="service-introduce_animation_item" ref={text2Ref}>
            대출은 이제 그만!
          </p>
          
          {/* 3단계 텍스트 */}
          <p className="service-introduce_animation_item" ref={text3Ref}>
            채무 자체를 줄여주는
          </p>

          {/* 4단계 텍스트 */}
          <div className="service-introduce_animation_item item--4">
            <p ref={text4P1Ref}><span>개인회생</span></p>
            <p ref={text4P2Ref}>지금부터 알려 드릴게요</p>
          </div>

          {/* 5단계 카드 리스트 */}
          <div className="service-introduce_card-list" ref={cardListRef}>
            <ul>
              <li className="service-introduce_card-item card-1" ref={cardList1Ref}>
                <Image src={imagePaths.imgIntroCard01} alt="" width={200} height={200} />
                <p>소득이 있다면</p>
              </li>
              <li className="service-introduce_card-item card-2" ref={cardList2Ref}>
                <Image src={imagePaths.imgIntroCard02} alt="" width={200} height={200} />
                <p>재산보다 채무가 더 많다면</p>
              </li>
              <li className="service-introduce_card-item card-3" ref={cardList3Ref}>
                <Image src={imagePaths.imgIntroCard03} alt="" width={200} height={200} />
                <p>채무가 천만 원 이상이라면</p>
              </li>
            </ul>
          </div>

          {/* 6단계 텍스트 */}
          <div className="service-introduce_animation_item item--6" ref={text6Ref}>
            <p>
              합법적으로
              <span>채무를 탕감</span>
              받을 수 있어요
            </p>
          </div>

          {/* 텍스트 리스트 */}
          <div className="service-introduce_text-list" ref={textListRef}>
            <p className="service-introduce_text-item" ref={textList1Ref}>
              하지만 개인회생은
            </p>
            <p className="service-introduce_text-item" ref={textList2Ref}>
              변제계획안 <Image src={imgIntroTextGif01} width={42} height={42} alt="" /> <br />
              준비할 게 많아요
            </p>
            <p className="service-introduce_text-item" ref={textList3Ref}>
              채권자집회 <Image src={imgIntroTextGif02} width={58} height={58} alt="" /> <br />
              참석해야 해요
            </p>
            <p className="service-introduce_text-item" ref={textList4Ref}>
              기억나지않는 채무 <Image src={imgIntroTextGif03} width={42} height={42} alt="" /> <br />
              소명해야 해요
            </p>
          </div>

          {/* 7단계 텍스트 */}
          <div className="service-introduce_animation_item item--8">
            <p ref={text7P1Ref}>리본회생은 <br />내가 원하는 서비스를</p>
            <p ref={text7P2Ref}><span>선택할 수 <br />있어요</span></p>
          </div>
        </div>
      </div>
      
      {/* 파트2 */}
      <div className="service-introduce_part--2" ref={part2Ref}>
        <div className="item--9 kv-section" ref={kvRef}>
            <div className="service-introduce_kv">
              <h2>
                나에게 <span>딱-</span> 맞는<br />
                리본을 찾아보세요
              </h2>
              <p>
                리본회생은 나에게 필요한 혜택을 담은<br />
                리본을 선택할 수 있어요
              </p>
              <div className="service-introduce_kv_list">
                <ul>
                  <li>
                    <Image src={kvImagePaths.imgIntroKvGreen} alt="" width={200} height={200} />
                  </li>
                  <li>
                    <Image src={kvImagePaths.imgIntroKvBlue} alt="" width={200} height={200} />
                  </li>
                  <li>
                    <Image src={kvImagePaths.imgIntroKvPurple} alt="" width={200} height={200} />
                  </li>
                </ul>
              </div>
            </div>
        </div>
        {/* Navigation */}
        <div className={`service-introduce_navigation ${isSticky ? 'sticky-active' : ''}`} ref={navigationRef}>
          <div className="service-introduce_navigation_container">
            <ul className="service-introduce_navigation_list">
              <li className={`service-introduce_navigation_item ${activeSection === 0 ? 'active' : ''}`}>
                <button
                  onClick={() => handleNavigationClick(0, greenRef)}
                  className="service-introduce_navigation_button"
                >
                  그린리본
                </button>
              </li>
              <li className={`service-introduce_navigation_item ${activeSection === 1 ? 'active' : ''}`}>
                <button
                  onClick={() => handleNavigationClick(1, blueRef)}
                  className="service-introduce_navigation_button"
                >
                  블루리본
                </button>
              </li>
              <li className={`service-introduce_navigation_item ${activeSection === 2 ? 'active' : ''}`}>
                <button
                  onClick={() => handleNavigationClick(2, purpleRef)}
                  className="service-introduce_navigation_button"
                >
                  퍼플리본
                </button>
              </li>
              <li className={`service-introduce_navigation_item ${activeSection === 3 ? 'active' : ''}`}>
                <button
                  onClick={() => handleNavigationClick(3, '.journey-swiper-container')}
                  className="service-introduce_navigation_button"
                >
                  여정소개
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`service-introduce_part--2_content ${isPopupOpen ? 'popup-open' : ''}`}>
          {/* Green Section */}
          <div ref={greenRef}>
            <ServiceInfoSection
              backgroundImage={bgIntroContentGreen}
              mainTitle="그린리본"
              mainTitleColor="#0A905B"
              subTitle={
                <>
                  가격 부담은<br />
                  줄이고 <span style={{
                    background: 'linear-gradient(135deg, #22A690 0%, #C3FFF0 50%, #A6F1D7 100%)'
                  }}>실속있게</span>
                </>
              }
              tagTexts={["#베이직", "#가격부담ZERO"]}
              visualImg={kvImagePaths.imgIntroKvGreen}
              visualPosition="green"
            />
            
            <div className="service-introduce_part--2_content_round-wrap">
              <CardListSection
                title="그린리본을 선택한다면?"
                titleHighlight="그린리본"
                titleHighlightColor="#0B8F5B"
                type="green"
                onPopupStateChange={handlePopupStateChange}
                cards={[
                  {
                    id: "green-card1",
                    title: (
                      <>
                        <span>나에게 꼭 필요한</span>
                        <strong><b>혜택</b>만 받아가세요</strong>
                      </>
                    ),
                    image: greenImagePaths.imgContentCardGreen01,
                    buttonGradient: "linear-gradient(90deg, #24BD9E 0%, #90CA9E 100%)"
                  },
                  {
                    id: "green-card2",
                    title: (
                      <>
                        <span>리본회생 노하우가 담긴</span>
                        <strong><b>리본북</b>을 드려요</strong>
                      </>
                    ),
                    image: greenImagePaths.imgContentCardGreen02,
                    buttonGradient: "linear-gradient(90deg, #24BD9E 0%, #90CA9E 100%)"
                  },
                  {
                    id: "green-card3",
                    title: (
                      <>
                        <span>리본회생 노하우가 담긴</span>
                        <strong><b>리본북</b>을 드려요</strong>
                      </>
                    ),
                    image: greenImagePaths.imgContentCardGreen03,
                    buttonGradient: "linear-gradient(90deg, #24BD9E 0%, #90CA9E 100%)"
                  }
                ]}
                slides={[
                  {
                    id: "green-slide1",
                    image: greenImagePaths.imgContentCardGreen01New,
                    // imageMobile: imgContentCardGreen01.src,
                    titleHighlightColor: "#96FFD5",
                    title: (
                      <>
                        나에게 꼭 <i className="text_highlight_green_line-01">필요한 혜택</i>만 <br className="m_only" /> 
                        챙기고 싶다면<br />
                        <strong><i className="text_highlight_green_line-03">그린리본</i></strong>을 추천드려요.
                      </>
                    ),
                    description: (
                      <>
                        개인회생 준비, 모든 사람이 같을 순 없죠. <br />
                        그린리본은 필요한 서류만 정확히 안내해 드려요. <br />
                        직접 준비하길 원하시는 분들을 위해
                        <strong>꼭 필요한 혜택</strong>만 담았어요.
                      </>
                    ),
                  },
                  {
                    id: "green-slide2",
                    image: greenImagePaths.imgContentCardGreen02New,
                    // imageMobile: imgContentCardGreen02.src,
                    titleHighlightColor: "#96FFD5",
                    title: (
                      <>
                        <strong><i className="text_highlight_green_line-02">그린리본</i></strong>이 <i className="text_highlight_green_line-02-1">리본북</i>을 통해 <br className="m_only" />
                        서류 발급을 <br className="pc-tablet-only" />직접 할 수 있도록<br className="m_only" />
                        다- 알려드릴게요.
                      </>
                    ),
                    description: (
                      <>
                        <strong>어떤 서류든 쉽게 발급할 수 있도록</strong> <br className="m_only" />
                        필요한 서류 리스트부터 <br className="pc-tablet-only"/> 발급처, 작성 요령까지 전부 <br className="m_only" />
                        정리되어 있는 리본북을 제공해 드려요! <br />
                        복잡하고 어려운 절차, 리본북 하나로 쉽고 빠르게 준비해보세요.
                      </>
                    ),
                  },
                  {
                    id: "green-slide3",
                    className: "green-slide-3",
                    image: greenImagePaths.imgContentCardGreen03New,
                    // imageMobile: imgContentCardGreen03.src,
                    // titleHighlightColor: "#96FFD5",
                    titleHighlightColor: "#fffff",
                    title: (
                      <>
                        <i className="text_highlight_green_line-03-1">가장 부담 없는 비용</i>으로 <br className="mo-only" />
                        진행하고 싶다면<br />
                        <strong><i className="text_highlight_green_marker-01">그린리본</i></strong>을 추천드려요.
                      </>
                    ),
                    description: (
                      <>
                        비용 걱정에 회생 준비가 더 막막하게 느껴지시죠? <br />
                        가장 부담 없는 비용으로 진행하고 싶은 분들을 위해 <br />
                        <strong>실속 있게 핵심</strong>만 담아 준비했어요.
                      </>
                    ),
                  }
                ]}
              />

              <div className="service-introduce_part--2_more_info">
                <ul>
                  <li>수많은 사건진행을 통해 다져진 전문적인 노하우로 <strong>상황에 맞는 솔루션을 제공</strong>합니다.</li>
                  <li><strong>도산전문변호사</strong>가 직접 사건처리 후 <strong>위임장을 제출</strong>합니다.</li>
                  <li>리본회생의 노하우가 담긴 <strong>자체제작 책자를 제공</strong>합니다.</li>
                  <li>각 고객의 상황에 따른 경험을 보유한 실무진들이 모여 <strong>특별 관리</strong>해 드립니다. </li>
                </ul>
                <p>*도산전문변호사를 중심으로 서류 발급, 부채증명서 발급, 고객 서비스 담당자가 보조하여 사건을 담당해 드립니다.</p>
              </div>

              {/* 스타법무법인 측 개발 필요 */}
              <CustomerReviewSection
                title={
                  <>
                    이런 점에서<br />
                    고객들이 <strong>만족</strong>했어요!
                  </>
                }
                titleHighlightColor="#0A905B"
                reviews={[
                  {
                    id: "green-review1",
                    thumbnail: greenImagePaths.thumbContentGreen01,
                    content: (
                      <>
                        개인회생을 신청하기 위한 <strong>과정, 서류에 대해 엄청 꼼꼼하게</strong> 알려주십니다.<br /><br className="m_only" />
                        <strong>잘 모르는 부분은 친절하게 설명</strong>해주시고, <strong>필요한 자료도 빠짐없이 챙겨주셨어요.</strong><br /><br className="m_only" />
                        폐업 신청 이후에도 처리해야 할 일이 많았는데, <strong>끝까지 도와주시고 세심하게 챙겨주셔서</strong> 큰 힘이 됐습니다.
                      </>
                    ),
                    videoUrl: "#video-green-01-url"
                  },
                  {
                    id: "green-review2",
                    thumbnail: greenImagePaths.thumbContentGreen02,
                    content: (
                      <>
                        제가 준비해야 하는 것들을 혼자 하기 힘들어서 궁금한 걸 일일히 물어보면 <strong>바로바로 알려주시는 게</strong> 가장 좋았어요.<br /><br className="m_only" />
                        채권사에서 연락이 안 오는게 좋아요.  마음이 훨씬 여유로워졌죠. 원래는 월 150~200만 원 내야 했지만, <strong>리본회생을 만나고 월 20만 원만 변제</strong>하고 있어요.
                      </>
                    ),
                    videoUrl: "#video-green-02-url"
                  },
                  {
                    id: "green-review3",
                    thumbnail: greenImagePaths.thumbContentGreen03,
                    content: (
                      <>
                        개인회생 과정을 여러 곳에 검색해보니까 도저히 이거는 혼자 못하겠다 싶더라고요.
                        너무 복잡해서요. <strong>&ldquo;뭘 하더라도 유명한 곳에서 해야 보통은 간다.&rdquo;</strong>, 안되더라도 해보자.<br /><br className="m_only" />
                        리본회생 변호사 분들이 되게 <strong>본인 일처럼 생각</strong>해주셨어요. 근무 중이라 연락을 늦게 보고 서류를 늦게 드려도 <strong>기다려주시고,</strong> 불안해서 전화를 자주 했는데 <strong>늘 잘 알려주셨어요.</strong>
                      </>
                    ),
                    videoUrl: "#video-green-03-url"
                  }
                ]}
              />
              {/* //스타법무법인 측 개발 필요 */}
            </div>
          </div>

          {/* Blue Section */}
          <div ref={blueRef}>
            <ServiceInfoSection
              backgroundImage={bgIntroContentBlue}
              mainTitle="블루리본"
              mainTitleColor="#0049BB"
              subTitle={
                <>
                  비용은 합리적으로,<br />
                  절차는 <span style={{
                    background: 'linear-gradient(135deg, #4690FF 0%, #BED8FF 49%, #4690FF 100%)'
                  }}>믿고 맡길 수 있게</span>
                </>
              }
              tagTexts={["#스탠다드", "#서류대행"]}
              visualImg={kvImagePaths.imgIntroKvBlue}
              visualPosition="blue"
            />
            <div className="service-introduce_part--2_content_round-wrap">
              <CardListSection
                title="블루리본을 선택한다면?"
                titleHighlight="블루리본"
                titleHighlightColor="#0049BB"
                subtitle="※ 그린리본의 혜택이 기본적으로 포함됩니다."
                type="blue"
                onPopupStateChange={handlePopupStateChange}
                cards={[
                  {
                    id: "blue-card1",
                    title: (
                      <>
                        <span>합리적인 비용으로</span>
                        <strong><b>부담</b>을 덜어보세요</strong>
                      </>
                    ),
                    image: blueImagePaths.imgContentCardBlue01,
                    buttonGradient: "linear-gradient(90deg, #526EDF 0%, #63B0C1 100%)"
                  },
                  {
                    id: "blue-card2",
                    title: (
                      <>
                        <span>논리적이고 설득력 있는 진술</span>
                        <strong><b>대신 작성</b>해 드려요</strong>
                      </>
                    ),
                    image: blueImagePaths.imgContentCardBlue02,
                    buttonGradient: "linear-gradient(90deg, #526EDF 0%, #63B0C1 100%)"
                  },
                  {
                    id: "blue-card3",
                    title: (
                      <>
                        <span>번거롭고 많은 서류들</span>
                        <strong><b>대신 발급</b>해 드려요</strong>
                      </>
                    ),
                    image: blueImagePaths.imgContentCardBlue03,
                    buttonGradient: "linear-gradient(90deg, #526EDF 0%, #63B0C1 100%)"
                  }
                ]}
                slides={[
                  {
                    id: "blue-slide1",
                    image: blueImagePaths.imgContentCardBlue01,
                    titleHighlightColor: "#99DAFF",
                    title: (
                      <>
                        <i className="text_highlight_blue_line-01">&ldquo;혜택 대비 가격</i>이 가장 중요하다면?&rdquo;<br />
                        <strong><i className="text_highlight_blue_line-03">블루리본</i></strong>을 추천드려요.
                      </>
                    ),
                    description: (
                      <>
                        <strong>시간도 아끼고, 부담도 덜고 싶으신가요?</strong> <br />
                        복잡한 회생 절차에 비용까지 걱정되시는 분들을 위해 <br />
                        블루리본은 합리적인 가격으로 서류 발급까지 대신 도와드려요.
                      </>
                    ),
                  },
                  {
                    id: "blue-slide2",
                    className: "blue-slide-2",
                    image: blueImagePaths.imgContentCardBlue02,
                    titleHighlightColor: "#99DAFF",
                    title: (
                      <>
                        &ldquo;<i className="text_highlight_blue_line-01">하고 싶은 말은</i> 많은데, <br className="m_only" />
                        어떻게 써야 할지 모르겠다면?&rdquo; <br className="m_only" />
                        <strong><i className="text_highlight_blue_line-02">블루리본</i></strong> 을 추천드려요
                      </>
                    ),
                    description: (
                      <>
                        개인회생에선 나의 상황을 잘 설명하는 것이 정말 중요해요. <br />
                        하지만 글로 쓰는 건 쉽지 않기에,
                        블루리본은 고객님의 이야기를 <br /> 토대로 제출할 서류를 <strong>설득력 있게 대신 작성</strong>해 드려요.
                      </>
                    ),
                  },
                  {
                    id: "blue-slide3",
                    className: "blue-slide-3",
                    image: blueImagePaths.imgContentCardBlue03,
                    titleHighlightColor: "#fffff",
                    title: (
                      <>
                        &ldquo;서류가 <i className="text_highlight_blue_line-01">많고 복잡해서</i> <br className="m_only" />
                        직접 준비하기 어렵다면?&rdquo;<br />
                        <strong><i className="text_highlight_blue_marker-01">블루리본</i></strong> 을 추천드려요
                      </>
                    ),
                    description: (
                      <>
                        개인회생에 필요한 서류는 종류도 많고 <br />
                        발급처도 다양해서 혼자 준비하기 쉽지 않아요. <br />
                        직장인이라면 평일에 일일이 발급받는 것도 큰 부담이죠. <br />
                        그래서 블루리본은 복잡한 <strong>서류 발급을 대신</strong> 해드려요.
                      </>
                    ),
                  }
                ]}
              />

              {/* 스타법무법인 측 개발 필요 */}
              <CustomerReviewSection
                title={
                  <>
                    이런 점에서<br />
                    고객들이 <strong>만족</strong>했어요!
                  </>
                }
                titleHighlightColor="#0049BB"
                reviews={[
                  {
                    id: "blue-review1",
                    thumbnail: blueImagePaths.thumbContentBlue01,
                    content: (
                      <>
                        서류 발급이 너무 번거로워서 상담할 때 최대한 움직이지 않게 해달라고 요청했어요.<br /><br className="m_only" />
                        그래서 제가 한 일은 <strong>동사무소 가서 인감 떼고 도장 드리는 것 뿐</strong>이었고, 나머지는 <strong>알아서 일사천리로 진행</strong>되더라고요. <strong>전화 응대도 항상 친절</strong>했고, 제가 <strong>저녁 8시에 연락해도 자연스럽게 응대</strong>해주셔서 정말 편했어요.
                      </>
                    ),
                    videoUrl: "#video-blue-01-url"
                  },
                  {
                    id: "blue-review2",
                    thumbnail: blueImagePaths.thumbContentBlue02,
                    content: (
                      <>
                        준비하다가 놓치는 부분이 생기면 그 과정에서 시간도 더 딜레이되고, <strong>조금이라도 빠르게 처리하고 덜 신경 쓸 수 있는 방법</strong>으로 하려고 블루 리본 서비스를 선택했었던 것 같아요.<br /><br className="m_only" />
                        <strong>번거로운 것들을 모두 준비</strong>해 주시니 <strong>제가 해야 할 부분은 딱히 없어서</strong> 만족스러워요.
                      </>
                    ),
                    videoUrl: "#video-blue-02-url"
                  },
                  {
                    id: "blue-review3",
                    thumbnail: blueImagePaths.thumbContentBlue03,
                    content: (
                      <>
                        처음엔 법무사에서 진행했는데, 서류 정리가 너무 안되더라구요. 블루리본은 <strong>번거로운 서류 작업을 모두 기본으로 알아서</strong> 해준데요.<br /><br className="m_only" />
                        <strong>체계적인 진행</strong>이 느껴졌어요 <strong>회생 끝날 때까지 다 서포트</strong>해준다고 하더라구요. 여기는 차원이 달라요. 제대로 찾아왔구나 싶었죠.
                      </>
                    ),
                    videoUrl: "#video-blue-03-url"
                  }
                ]}
              />
              {/* //스타법무법인 측 개발 필요 */}
            </div>
          </div>

          {/* Purple Section */}
          <div ref={purpleRef}>
            <ServiceInfoSection
              backgroundImage={bgIntroContentPurple}
              mainTitle="퍼플리본"
              mainTitleColor="#5E01D6"
              subTitle={
                <>
                  처음부터 끝까지,<br />
                  <span>
                    <span style={{
                      background: 'linear-gradient(135deg, #7451ff 8%, #e6e1ff 49%, #7451ff 100%)'
                    }}>신경 쓸 필요 없이</span>
                  </span>
                </>
              }
              tagTexts={["#프리미엄", "#올인원"]}
              visualImg={kvImagePaths.imgIntroKvPurple}
              visualPosition="purple"
            />
            <div className="service-introduce_part--2_content_round-wrap">
              <CardListSection
                title="퍼플리본을 선택한다면?"
                titleHighlight="퍼플리본"
                titleHighlightColor="#5E01D6"
                subtitle="※ 그린리본, 블루리본의 혜택이 기본적으로 포함됩니다."
                type="purple"
                onPopupStateChange={handlePopupStateChange}
                cards={[
                  {
                    id: "purple-card1",
                    title: (
                      <>
                        <span>법원의 처리를 기다리는 상황에도</span>
                        <strong><b>먼저 연락</b> 드려요</strong>
                      </>
                    ),
                    image: purpleImagePaths.imgContentCardPurple01,
                    buttonGradient: "linear-gradient(90deg, #9483D7 0%, #7F7BF2 100%)"
                  },
                  {
                    id: "purple-card2",
                    title: (
                      <>
                        <span>일어날 수 있는 모든 문제를</span>
                        <strong><b>모두 대비</b>해 드려요</strong>
                      </>
                    ),
                    image: purpleImagePaths.imgContentCardPurple02,
                    buttonGradient: "linear-gradient(90deg, #9483D7 0%, #7F7BF2 100%)"
                  },
                  {
                    id: "purple-card3",
                    title: (
                      <>
                        <span>3~5년의 긴 변제기간 후</span>
                        <strong><b>결과</b>까지 책임져요</strong>
                      </>
                    ),
                    image: purpleImagePaths.imgContentCardPurple03,
                    buttonGradient: "linear-gradient(90deg, #9483D7 0%, #7F7BF2 100%)"
                  }
                ]}
                slides={[
                  {
                    id: "purple-slide1",
                    className: "purple-slide-1",
                    image: purpleImagePaths.imgContentCardPurple01New,
                    titleHighlightColor: "#D0ACFF",
                    title: (
                      <>
                        <i className="text_highlight_purple_line-01">&ldquo;모든 문제를 대비</i> 하고 싶다면&rdquo;<br />
                        <strong>퍼플리본</strong>과 함께해요
                      </>
                    ),
                    description: (
                      <>
                        빚이 쌓이면 독촉 전화와 압박 때문에<br className="m_only"/>
                        큰 부담이 될 수 있어요.<br className="pc-tablet-only"/>
                        퍼플리본은 채무자대리인제도를 <br className="m_only"/> 통해 이런 부담을 <strong>대신 대응</strong>해 드려요.
                      </>
                    ),
                  },
                  {
                    id: "purple-slide2",
                    className: "purple-slide-2",
                    image: purpleImagePaths.imgContentCardPurple02New,
                    titleHighlightColor: "#D0ACFF",
                    title: (
                      <>
                        3~5년의 변제기간이 지난 다음에도<br />
                        먼저 연락해 드려서<br className="m_only"/>
                        면책 결정까지 <i className="text_highlight_purple_line-01">책임져 주는</i><br />
                        <strong><i className="text_highlight_purple_line-02">퍼플리본</i></strong>이 있으니 든든해요
                      </>
                    ),
                    description: (
                      <>
                        개인회생은 신청 이후에도 <br className="m_only" />
                        3~5년간의 긴 여정이 이어져요.<br />
                        퍼플리본은 <strong>회생이 끝나는 그 순간까지</strong><br className="m_only"/>
                        <strong>든든하게 함께하며 </strong> <br />
                        복잡한 모든 과정을 처리해 드려요.
                      </>
                    ),
                  },
                  {
                    id: "purple-slide3",
                    className: "purple-slide-3",
                    image: purpleImagePaths.imgContentCardPurple03New,
                    titleHighlightColor: "#ffffff",
                    title: (
                      <>
                        &ldquo;신경쓰지 않아도<br />
                        <i className="text_highlight_purple_line-01">먼저 챙겨주는</i> 서비스를 원한다면?&rdquo;<br />
                        <strong><i className="text_highlight_purple_marker-01">퍼플리본</i></strong> 을 추천드려요
                      </>
                    ),
                    description: (
                      <>
                        회생 진행 중에 무엇을 해야 할지 계속 신경 쓰는 건 <br className="m_only"/>
                        꽤 큰 <br className="pc-tablet-only"/>부담이 될 수 있어요. 
                        퍼플리본은 전담 관리팀이 <strong>실시간으로 <br className="pc-tablet-only"/> 상황을 체크하고 </strong> 
                        <strong>필요한 내용을 먼저</strong> 알려드려요.
                      </>
                    ),
                  }
                ]}
              />

              {/* 스타법무법인 측 개발 필요 */}
              <CustomerReviewSection
                title={
                  <>
                    이런 점에서<br />
                    고객들이 <strong>만족</strong>했어요!
                  </>
                }
                titleHighlightColor="#5E00D7"
                reviews={[
                  {
                    id: "purple-review1",
                    thumbnail: purpleImagePaths.thumbContentPurple01,
                    content: (
                      <>
                        개시나 인가결정이 나도 <strong>대부업체에서 연락이 안 오게 막아</strong>주시고, 혹시 연락이 오는경우 <strong>채권사의 번호만 리본회생에 전달</strong>하면 된다고 해서 정말 편했어요.<br /><br className="m_only" />
                        또 이직하면서 월급이 늦게 들어와서 <strong>수임료 잔금 납부일을 다음 달로 미뤄</strong>달라고 했더니 오히려 기한을 더 늘려주셔서 더 편하게 해주시려는 배려에 정말 감사했어요.
                      </>
                    ),
                    videoUrl: "#video-purple-01-url"
                  },
                  {
                    id: "purple-review2",
                    thumbnail: purpleImagePaths.thumbContentPurple02,
                    content: (
                      <>
                        <strong>사업을 했던 사람은 채무자도 너무 많고 채권 관계도 다양하고 복잡했는데 까다로운 일을 대행</strong>해서 처리를 해주시는 게 저는 그게 항상 감사했습니다.<br /><br className="m_only" />
                        <strong>전화를 걸면 거의 실시간으로 언제든지 바로 받으십니다.</strong> 담당자에게 설명하면 <strong>알아서 처리</strong>해주시고, 법원의 보정에 <strong>대응을 정말 잘 해주셔서</strong> 이제는 미래에 대한 <strong>경제적인 계획</strong>도 세울 수 있게 되었죠.
                      </>
                    ),
                    videoUrl: "#video-purple-02-url"
                  },
                  {
                    id: "purple-review3",
                    thumbnail: purpleImagePaths.thumbContentPurple03,
                    content: (
                      <>
                        &ldquo;그냥 광고 아닌가&rdquo; 라고 했는데 <strong>상담해 주시는 분이 되게 믿음이 갔어요.</strong> 직접 하기 싫은 일, 하기 힘든 일을 <strong>모두 다 해주시니까 여기서 해야되겠다고 생각</strong>했죠.<br /><br className="m_only" />
                        특정 날짜에 얼마를 어디에 썼는지 하나하나 소명해야 하는데 대응을 정말 잘해주시고, 최대한 탕감 받을 수 있도록 정말 신경을 많이 써주셔서 <strong>정말 고마웠어요.</strong> 결국 86% 탕감 받았거든요. 
                      </>
                    ),
                    videoUrl: "#video-purple-03-url"
                  }
                ]}
              />
              {/* //스타법무법인 측 개발 필요 */}
            </div>
          </div>

          <div className="bg-journey-banner-wrap">
            {/* 배경 이미지들 */}
            <div className="journey-bg-image-container">
              <div className={`journey-bg-image ${journeyActiveIndex === 0 ? 'active' : ''}`} style={{ backgroundImage: `url(${journeyImagePaths.bgJourney01})` }}>
                <div className="journey-bg-image-mobile" style={{ backgroundImage: `url(${journeyImagePaths.bgJourney01M})` }}></div>
              </div>
              <div className={`journey-bg-image ${journeyActiveIndex === 1 ? 'active' : ''}`} style={{ backgroundImage: `url(${journeyImagePaths.bgJourney02})` }}>
                <div className="journey-bg-image-mobile" style={{ backgroundImage: `url(${journeyImagePaths.bgJourney02M})` }}></div>
              </div>
              <div className={`journey-bg-image ${journeyActiveIndex === 2 ? 'active' : ''}`} style={{ backgroundImage: `url(${journeyImagePaths.bgJourney03})` }}>
                <div className="journey-bg-image-mobile" style={{ backgroundImage: `url(${journeyImagePaths.bgJourney03M})` }}></div>
              </div>
              <div className={`journey-bg-image ${journeyActiveIndex === 3 ? 'active' : ''}`} style={{ backgroundImage: `url(${journeyImagePaths.bgJourney04})` }}>
                <div className="journey-bg-image-mobile" style={{ backgroundImage: `url(${journeyImagePaths.bgJourney04M})` }}></div>
              </div>
              <div className={`journey-bg-image ${journeyActiveIndex === 4 ? 'active' : ''}`} style={{ backgroundImage: `url(${journeyImagePaths.bgJourney05})` }}>
                <div className="journey-bg-image-mobile" style={{ backgroundImage: `url(${journeyImagePaths.bgJourney05M})` }}></div>
              </div>
            </div>

            {/* Journey Section */}
            <div className="service-introduce_journey" ref={journeyRef}>
              <div className="service-introduce_journey_container">
            
                <div className="journey-text-wrap">
                  <h2 className="service-introduce_journey_title">모든 여정을 <br className="m_only" />리본회생과 함께해요</h2>
                  <p className="service-introduce_journey_subtitle">개인회생의 타임라인을 통해 <br className="m_only" />리본회생이 제공하는 서비스를 비교해드릴게요</p>
                </div>
                <div className="service-introduce_journey_content">
                  <JourneySwiper onSlideChange={setJourneyActiveIndex} />
                </div>
              </div>
            </div>

            {/* 최하단 배너 */}
            <div className="service-introduce_rebom_chat_banner">
              <div className="service-introduce_rebom_chat_banner_content">
                <div className="service-introduce_rebom_chat_text">
                  <h2>나는 얼마나 <strong>탕감</strong>받을까?</h2>
                  <p className="pc-tablet-only">
                    개인회생이 가능한지,
                    <strong className="text_highlight">6개월 뒤</strong> <br className="pc-tablet-only" />
                    <strong className="text_grd_highlight">나의 채무와 상환 플랜</strong>을 알려드려요
                  </p>
                  <p className="m_only">
                    개인회생이 가능한지, <br className="m_only" />
                    <strong className="text_grd_highlight">6개월 뒤 나의 채무와 상환 플랜</strong>을 알려드려요
                  </p>
                  {/* 상담 버튼 추가 */}
                  <Link href="#" className="service-introduce_rebom_chat_button">
                    <span>
                      <strong>신청자격 알아보기</strong>
                      <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.06078 19.8429L10.2793 10.6244L1.06078 1.40588" stroke="white" strokeWidth="1.8437"/>
                      </svg>
                    </span>
                  </Link>
                </div>
                <div className="service-introduce_rebom_chat_img">
                  <Image className="pc-tablet-only" src={journeyImagePaths.imgRebomCharactor} width={500} height={450} alt="" />
                  <Image className="mo-only" src={journeyImagePaths.imgRebomCharactorMo} width={312} height={135} alt="" />
                </div>
              </div>
            </div>
          </div>    

        </div>
      </div>
    </div>
  );
}