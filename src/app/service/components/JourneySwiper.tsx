"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import useIsMobile from "../../../utils/useIsMobile";
// 여정소개 이미지 경로 정의
const journeyImages = {
  imgJourney01: '/workout-v2/images/contents/img_service_journey-01.png',
  imgJourney02: '/workout-v2/images/contents/img_service_journey-02.png',
  imgJourney03: '/workout-v2/images/contents/img_service_journey-03.png',
  imgJourney04: '/workout-v2/images/contents/img_service_journey-04.png',
  imgJourney05: '/workout-v2/images/contents/img_service_journey-05.png',
};

// 아이콘은 작은 파일이므로 import 유지 (최적화 필요)
import iconArrowGray from '../../assets/images/icons/icon_arrow_gray.svg';

// 슬라이드 데이터 타입 정의
type JourneySlideData = {
  id: number;
  image: string; // string으로 변경 (public 경로 사용)
  title: string;
  description: JSX.Element;
  content: {
    type: "list";
    items: Array<{
      badge: string;
      colorName: string;
      text: JSX.Element;
      className?: string;
    }>;
    className?: string;
  } | {
    type: "step3";
    badge: string;
    colorName: string;
    text: JSX.Element;
    lineBox: {
      title: string;
      description: string;
    };
  };
};

// 슬라이드 데이터 정의
const journeySlidesData: JourneySlideData[] = [
  {
    id: 1,
    image: journeyImages.imgJourney01,
    title: "개시신청",
    description: (
      <>
        채무를 언제까지 얼만큼 변제할지<br />
        얼만큼의 탕감율로 신청할지 <strong>전략을 세우고,</strong><br />
        <strong>그에 따른 서류를 준비</strong>하는 단계예요!
      </>
    ),
    content: {
      type: "list",
      items: [
        {
          badge: "그린리본",
          colorName: "green",
          text: (
            <>
              <strong>도산전문변호사가 직접 사건 검토</strong>하고 
              <br />
              위임장을 제출하고, <strong>리본북까지 제공</strong>해 드려요
            </>
          )
        },
        {
          badge: "블루리본", 
          colorName: "blue",
          text: (
            <>
              신청할 때 필요한 제출서류들을 <br />
              대신해서 제출해 드려요! 
              <span>*그린리본 서비스 포함</span>
            </>
          )
        },
        {
          badge: "퍼플리본",
          colorName: "purple",
          text: (
            <>
              서면 작업을 대신 제출하고, 전담팀이 <br />
              채권 조회와 독촉 방어까지 바로 지원해드려요!
              <span>*블루리본 서비스 포함</span>
            </>
          )
        }
      ]
    }
  },
  {
    id: 2,
    image: journeyImages.imgJourney02,
    title: "보정",
    description: (
      <>
        개시신청 때 제출한 변제계획안에 대한<br />
        <strong>소명을 하기 위해 각종 서류를<br />
        법원에 제출</strong>하는 단계예요!
      </>
    ),
    content: {
      type: "list",
      items: [
        {
          badge: "그린리본",
          colorName: "green",
          text: (
            <>
              <strong>실시간 소통</strong>으로 진행상황을 안내하고, <br className="pc-tablet-only" />
              주요 <strong>서류 작성 및 발급 방법을 쉽게 알려드려요!</strong>
            </>
          )
        },
        {
          badge: "블루리본",
          colorName: "blue",
          text: (
            <>
              사건 진행에 추가적으로 작성하기 어려운 제출 <br className="pc-tablet-only" />
              서류들을 <strong>대리 작성 및 발급해</strong> 드려요!
              <span>*그린리본 서비스 포함</span>
            </>
          )
        },
        {
          badge: "퍼플리본",
          colorName: "purple",
          text: (
            <>
              진행상황이나 안부연락을 수시로 연락을 주기 <br className="pc-tablet-only" />
              때문에 먼저 궁금할 일을 없게 만들어 드려요!
              <span>*블루리본 서비스 포함</span>
            </>
          )
        }
      ]
    }
  },
  {
    id: 3,
    image: journeyImages.imgJourney03,
    title: "개시결정",
    description: (
      <>
        보정이 잘 끝나고 나면 <br />
        <strong>변제기간, 변제금액이 확정</strong>되어 <strong>납부를 시작</strong>하고 <br />
        <strong>채권자집회를 통해 법원에 참석</strong>하는 단계에요!
      </>
    ),
    content: {
      type: "step3",
      badge: "리본회생",
      colorName: "purple",
      text: (
        <>
          변제액이 <strong>연체되지 않도록,</strong> <br className="mo-only" />
          채권자집회*를 위해 <br className="pc-tablet-only" />
          법원에 참석할 때 <strong>실수하지 않도록,</strong> <br />
          <em>수시로 일정을 관리</em>하여 사건에 <strong>문제가 <br className="pc-tablet-only" /> 생기지 않도록</strong> <span>도와 드려요!</span>
        </>
      ),
      lineBox: {
        title: "채권자집회",
        description: "법원에서 정한 날짜에, 채권자들이 모여서 회생 계획안을 검토하는 자리예요."
      }
    }
  },
  {
    id: 4,
    image: journeyImages.imgJourney04,
    title: "인가결정",
    description: (
      <>
        계획을 유지하도록 법원에게  <br className="pc-tablet-only"/>소명서류를 준비해서 <br className="mo-only"/>제출하는 단계예요!
      </>
    ),
    content: {
      type: "list",
      items: [
        {
          badge: "그린리본",
          colorName: "green",
          text: (
            <>
              인가가 결정되었다는 것과 함께<br />
              앞으로 어떻게 나갈지 <strong>유의점을 안내</strong>해 드려요!
            </>
          )
        },
        {
          badge: "블루리본",
          colorName: "blue",
          text: (
            <>
              인가 전에 문제가 발생하지 않도록<br className="mo-only"/>
              <strong>정기적으로 <br className="pc-tablet-only" />수입상황을 법원에 신고</strong>해 드려요!
              <span>*그린리본 서비스 포함</span>
            </>
          )
        },
        {
          badge: "퍼플리본",
          colorName: "purple",
          text: (
            <>
              <strong>정기 신고까지 끝까지 책임</strong>져 드릴 뿐만 아니라, <br className="pc-tablet-only" />
              <strong>인가 후 면책까지에 대한 가이드북을 제공</strong>해 드려요!
              <span>*블루리본 서비스 포함</span>
            </>
          ),
          className: "journey-slide_list_item_purple"
        }
      ]
    }
  },
  {
    id: 5,
    image: journeyImages.imgJourney05,
    title: "면책결정",
    description: (
      <>
        변제기간 동안 변제금을 성실히 납부했다면,<br />
        남은 채무가 모두 면제되고,<br />
        신용회복이 이루어지는 마지막 단계예요!
      </>
    ),
    content: {
      type: "list",
      items: [
        {
          badge: "퍼플리본",
          colorName: "purple",
          text: (
            <>
              면책 후에 <strong>면책신청서를 대리 작성</strong>해 드리며, <br />
              사건이 종료될 때까지 끝까지 함께해요!
            </>
          )
        }
      ],
      className: "only_one"
    }
  }
];

interface JourneySwiperProps {
  onSlideChange?: (index: number) => void;
}

// 공통 슬라이드 컴포넌트
interface JourneySlideProps {
  slideData: JourneySlideData;
  hasLenisPrevent?: boolean;
  isMobile: boolean;
}

function JourneySlide({ slideData, hasLenisPrevent = false, isMobile }: JourneySlideProps) {
  const renderContent = () => {
    if (slideData.content.type === "list") {
      return (
        <ul className={`journey-slide_list ${slideData.content.className || ''}`}>
          {slideData.content.items.map((item, index) => (
            <li key={index} className={`journey-slide_list_item ${item.className || ''}`}>
              <span className={`badge_${item.colorName}`}>
                {item.badge}
              </span>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      );
    } else if (slideData.content.type === "step3") {
      return (
        <div className="journey-slide_step3_content">
          <div className="journey-slide_step3_content_text">
            <span className="badge_grd">{slideData.content.badge}</span>
            <p>{slideData.content.text}</p>
          </div>
          <div className="line-box">
            <span>{slideData.content.lineBox.title}</span>
            <p>{slideData.content.lineBox.description}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="journey-slide" 
      {...(hasLenisPrevent && isMobile && { 'data-lenis-prevent': true })}
    >
      <div className="journey-slide_title_wrap">
        <div className="journey-slide_title_wrap_image">
          <Image
            src={slideData.image}
            alt=""
            width={140}
            height={140}
          />
        </div>
        <h3 className="journey-slide_title">
          <span>{String(slideData.id).padStart(2, '0')}</span> {slideData.title}
        </h3>
        <p className="journey-slide_description">{slideData.description}</p>
      </div>

      <div className="journey-slide_content">
        {renderContent()}
      </div>
    </div>
  );
}

export default function JourneySwiper({ onSlideChange }: JourneySwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isControlsDisabled, setIsControlsDisabled] = useState(false);
  const imageSwiperRef = useRef<SwiperRef>(null);
  const textSwiperRef = useRef<SwiperRef>(null);
  const isMobile = useIsMobile();
  
  // 모든 journey-slide의 스크롤 값을 초기화하는 함수
  const resetAllJourneySlidesScroll = () => {
    const allJourneySlides = document.querySelectorAll('.journey-slide');
    allJourneySlides.forEach((slide) => {
      if (slide instanceof HTMLElement) {
        slide.scrollTop = 0;
        slide.scrollLeft = 0;
        // slide.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });
  };

  // 컨트롤 버튼 비활성화 함수
  const disableControlsTemporarily = () => {
    setIsControlsDisabled(true);
    setTimeout(() => {
      setIsControlsDisabled(false);
    }, 500); // 0.5초 후 다시 활성화
  };

  // 스크롤 동기화를 위한 useEffect
  useEffect(() => {
    const imageSwiper = imageSwiperRef.current?.swiper;
    const textSwiper = textSwiperRef.current?.swiper;
    
    if (!imageSwiper || !textSwiper) return;

    // 이미지 스와이퍼의 각 슬라이드에 스크롤 이벤트 리스너 추가
    const imageSlides = imageSwiper.slides;
    const textSlides = textSwiper.slides;

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const scrollLeft = target.scrollLeft;
      
      // 현재 활성화된 이미지 슬라이드의 인덱스 찾기
      let activeImageIndex = -1;
      for (let i = 0; i < imageSlides.length; i++) {
        if (imageSlides[i].contains(target)) {
          activeImageIndex = i;
          break;
        }
      }
      
      if (activeImageIndex !== -1) {
        // 해당하는 텍스트 슬라이드에 동일한 스크롤 적용
        const textSlide = textSlides[activeImageIndex];
        if (textSlide) {
          const textSlideContent = textSlide.querySelector('.journey-slide') as HTMLElement;
          if (textSlideContent) {
            textSlideContent.scrollTop = scrollTop;
            textSlideContent.scrollLeft = scrollLeft;
          }
        }
      }
    };

    // 각 이미지 슬라이드의 .journey-slide 요소에 스크롤 이벤트 리스너 추가
    imageSlides.forEach((slide) => {
      const slideContent = slide.querySelector('.journey-slide') as HTMLElement;
      if (slideContent) {
        slideContent.addEventListener('scroll', handleScroll);
      }
    });

    // 클린업 함수
    return () => {
      imageSlides.forEach((slide) => {
        const slideContent = slide.querySelector('.journey-slide') as HTMLElement;
        if (slideContent) {
          slideContent.removeEventListener('scroll', handleScroll);
        }
      });
    };
  }, []);

  const handleImageSlideChange = (swiper: { realIndex: number; activeIndex: number }) => {
    const newIndex = swiper.realIndex;
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex);
    
    // 텍스트 스와이퍼도 동기화
    if (textSwiperRef.current?.swiper) {
      textSwiperRef.current.swiper.slideToLoop(newIndex);
    }
    
    // 모든 journey-slide의 스크롤 값을 초기화
    resetAllJourneySlidesScroll();
  };

  const goToSlide = (index: number) => {
    if (imageSwiperRef.current?.swiper) {
      imageSwiperRef.current.swiper.slideToLoop(index);
    }
    if (textSwiperRef.current?.swiper) {
      textSwiperRef.current.swiper.slideToLoop(index);
    }
    
    // 모든 journey-slide의 스크롤 값을 초기화
    resetAllJourneySlidesScroll();
  };

  return (
    <div className="journey-swiper-container">
        <div className="journey-swiper-wrapper">

          {/* 이미지 슬라이딩을 위한 스와이퍼 */}
          <Swiper
            ref={imageSwiperRef}
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={800}
            // img 스와이퍼만 오토슬라이드 하기
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            grabCursor={true}
            onSlideChange={handleImageSlideChange}
            className="journey-swiper journey-swiper-image"
            breakpoints={{
              320: {
                direction: "horizontal",
                // direction: "vertical",
                spaceBetween: 30,
                // autoHeight: true,
              },
              768: {
                // direction: "vertical",
                direction: "horizontal",
                spaceBetween: 10,
                // autoHeight: true,
              }
            }}
          >
            {journeySlidesData.map((slideData) => (
              <SwiperSlide key={slideData.id}>
                <JourneySlide 
                  slideData={slideData} 
                  hasLenisPrevent={true} 
                  isMobile={isMobile} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* 텍스트 페이드인아웃을 위한 스와이퍼 */}
          <Swiper
             ref={textSwiperRef}
             modules={[Autoplay, Pagination, Navigation, EffectFade]}
             spaceBetween={30}
             slidesPerView={1}
             loop={true}
             speed={400}
             allowTouchMove={false}
             effect="fade"
             className="journey-swiper journey-swiper-text"
            breakpoints={{
              320: {
                direction: "horizontal",
                spaceBetween: 30,
                autoHeight: true,
              },
              768: {
                direction: "vertical",
                spaceBetween: 10,
              }
            }}
            // onSlideChange={handleTextSlideChange}
          >
            {journeySlidesData.map((slideData) => (
              <SwiperSlide key={slideData.id}>
                <JourneySlide 
                  slideData={slideData} 
                  hasLenisPrevent={false} 
                  isMobile={isMobile} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      
      {/* 커스텀 컨트롤 */}
      <div className="journey-swiper_controls">
        <button 
          className="journey-swiper_prev-btn"
          disabled={isControlsDisabled}
          onClick={() => {
            const prevIndex = activeIndex === 0 ? 4 : activeIndex - 1;
            if (imageSwiperRef.current?.swiper) {
              imageSwiperRef.current.swiper.slideToLoop(prevIndex);
            }
            if (textSwiperRef.current?.swiper) {
              textSwiperRef.current.swiper.slideToLoop(prevIndex);
            }
            
            // 모든 journey-slide의 스크롤 값을 초기화
            resetAllJourneySlidesScroll();
            
            // 컨트롤 버튼 0.5초 비활성화
            disableControlsTemporarily();
          }}
        >
          <Image 
            src={iconArrowGray.src}
            alt="이전"
            width={10}
            height={5}
          />
        </button>
        
        <div className="journey-swiper_pagination">
          <button
            className={`journey-swiper_pagination_bullet ${activeIndex === 0 ? 'active' : ''}`}
            disabled={isControlsDisabled}
            onClick={() => {
              goToSlide(0);
              disableControlsTemporarily();
            }}
          >
            1
          </button>
          <button
            className={`journey-swiper_pagination_bullet ${activeIndex === 1 ? 'active' : ''}`}
            disabled={isControlsDisabled}
            onClick={() => {
              goToSlide(1);
              disableControlsTemporarily();
            }}
          >
            2
          </button>
          <button
            className={`journey-swiper_pagination_bullet ${activeIndex === 2 ? 'active' : ''}`}
            disabled={isControlsDisabled}
            onClick={() => {
              goToSlide(2);
              disableControlsTemporarily();
            }}
          >
            3
          </button>
          <button
            className={`journey-swiper_pagination_bullet ${activeIndex === 3 ? 'active' : ''}`}
            disabled={isControlsDisabled}
            onClick={() => {
              goToSlide(3);
              disableControlsTemporarily();
            }}
          >
            4
          </button>
          <button
            className={`journey-swiper_pagination_bullet ${activeIndex === 4 ? 'active' : ''}`}
            disabled={isControlsDisabled}
            onClick={() => {
              goToSlide(4);
              disableControlsTemporarily();
            }}
          >
            5
          </button>
        </div>
        
        <button 
          className="journey-swiper_next-btn"
          disabled={isControlsDisabled}
          onClick={() => {
            const nextIndex = activeIndex === 4 ? 0 : activeIndex + 1;
            if (imageSwiperRef.current?.swiper) {
              imageSwiperRef.current.swiper.slideToLoop(nextIndex);
            }
            if (textSwiperRef.current?.swiper) {
              textSwiperRef.current.swiper.slideToLoop(nextIndex);
            }
            
            // 모든 journey-slide의 스크롤 값을 초기화
            resetAllJourneySlidesScroll();
            
            // 컨트롤 버튼 0.5초 비활성화
            disableControlsTemporarily();
          }}
        >
          <Image 
            src={iconArrowGray.src}
            alt="다음"
            width={10}
            height={5}
          />
        </button>
      </div>
    </div>
  );
} 