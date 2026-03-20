"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface SlideItem {
  id: string;
  image: string;
  imageMobile?: string;
  className?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  titleHighlightColor?: string;
  titleBackgroundImage?: string;
}

interface CardItem {
  id: string;
  title: string | React.ReactNode;
  image: string;
  buttonGradient?: string;
}

interface CardListSectionProps {
  title: string;
  titleHighlight?: string;
  titleHighlightColor?: string;
  subtitle?: string;
  cards: CardItem[];
  slides: SlideItem[];
  onPopupStateChange?: (isOpen: boolean) => void;
  type?: 'green' | 'blue' | 'purple'; // 카드 타입 추가
}

export default function CardListSection({
  title,
  titleHighlight,
  titleHighlightColor = "#007AFF",
  subtitle,
  cards,
  slides,
  onPopupStateChange,
  type = 'green'
}: CardListSectionProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(1); // 2번째 리스트가 기본 활성화
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);
  const cardsSwiperRef = useRef<SwiperRef>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // 디바이스 타입 감지
  useEffect(() => {
    const checkDeviceType = () => {
      const wasMobile = isMobile;
      const newIsMobile = window.innerWidth <= 767;
      setIsMobile(newIsMobile);
      
      // PC에서 모바일로 변경될 때 초기화
      if (!wasMobile && newIsMobile) {
        // DOM이 렌더링될 때까지 대기
        setTimeout(() => {
          if (cardsSwiperRef.current && cardsSwiperRef.current.swiper) {
            // 모든 슬라이드에서 active 클래스 제거
            const slides = cardsSwiperRef.current.swiper.slides;
            if (slides && slides.length > 0) {
              slides.forEach((slide) => {
                slide.classList.remove('swiper-slide-active');
              });
              
              // 2번째 슬라이드에 active 클래스 추가
              if (slides[1]) {
                slides[1].classList.add('swiper-slide-active');
              }
              
              // 2번째 슬라이드로 이동
              cardsSwiperRef.current.swiper.slideTo(1, 0);
            }
          }
        }, 0);
      }
      
      // 모바일에서 PC로 변경될 때 초기화
      if (wasMobile && !newIsMobile) {
        // DOM이 렌더링될 때까지 대기
        setTimeout(() => {
          if (sectionRef.current) {
            const cardContainer = sectionRef.current.querySelector('.card-list-section_cards_pc');
            if (cardContainer) {
              const cards = cardContainer.querySelectorAll('.card-list-section_card');
              cards.forEach((card) => {
                card.classList.remove('active');
              });
              
              if (cards[1]) {
                cards[1].classList.add('active');
              }
            }
          }
        }, 0);
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, [isMobile]);

  // 2번째 카드가 기본 활성화되도록 설정 (모바일/PC 모두)
  useEffect(() => {
    if (isMobile && cardsSwiperRef.current && cardsSwiperRef.current.swiper) {
      // 모바일에서는 Swiper로 처리
      cardsSwiperRef.current.swiper.slideTo(1, 0);
      
      // 2번째 슬라이드에 active 클래스 추가
      const slides = cardsSwiperRef.current.swiper.slides;
      if (slides && slides.length > 0) {
        slides.forEach((slide, index) => {
          slide.classList.remove('swiper-slide-active');
        });
        if (slides[1]) {
          slides[1].classList.add('swiper-slide-active');
        }
      }
    } else if (!isMobile && sectionRef.current) {
      // PC에서는 현재 컴포넌트의 DOM 요소로 처리
      const cardContainer = sectionRef.current.querySelector('.card-list-section_cards_pc');
      if (cardContainer) {
        const cards = cardContainer.querySelectorAll('.card-list-section_card');
        cards.forEach((card) => {
          card.classList.remove('active');
        });
        
        if (cards[1]) {
          cards[1].classList.add('active');
        }
      }
    }
  }, [isMobile]);

  const handleCardClick = (cardIndex: number) => {
    setSelectedCardIndex(cardIndex);
    setIsPopupOpen(true);
    onPopupStateChange?.(true);
  };

  const handleCardHover = (cardIndex: number) => {
    if (!isMobile && sectionRef.current) {
      // PC 버전에서는 현재 컴포넌트의 DOM 요소로 처리
      const cardContainer = sectionRef.current.querySelector('.card-list-section_cards_pc');
      if (cardContainer) {
        const cards = cardContainer.querySelectorAll('.card-list-section_card');
        cards.forEach((card) => {
          card.classList.remove('active');
        });
        
        if (cards[cardIndex]) {
          cards[cardIndex].classList.add('active');
        }
      }
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    onPopupStateChange?.(false);
  };

  const handleSlideChange = () => {
    // PC에서는 onSlideChange 이벤트를 무시하고 호버로만 처리
    if (cardsSwiperRef.current && isMobile) {
      const activeIndex = cardsSwiperRef.current.swiper.activeIndex;
      const slides = cardsSwiperRef.current.swiper.slides;
      
      // 모든 슬라이드에서 active 클래스 제거
      slides.forEach((slide) => {
        slide.classList.remove('swiper-slide-active');
      });
      
      // 현재 활성 슬라이드에 active 클래스 추가
      if (slides[activeIndex]) {
        slides[activeIndex].classList.add('swiper-slide-active');
      }
    }
  };



  const renderTitle = () => {
    if (!titleHighlight) {
      return <h2 className="card-list-section_title" dangerouslySetInnerHTML={{ __html: title }} />;
    }

    const parts = title.split(titleHighlight);
    return (
      <h2 className="card-list-section_title">
        {parts[0]}
        <span style={{ color: titleHighlightColor }}>{titleHighlight}</span>
        {parts[1]}
      </h2>
    );
  };

  return (
    <>
      <section className="card-list-section" ref={sectionRef}>
        <div className="card-list-section_container">
          {renderTitle()}
          {subtitle && (
            <p className="card-list-section_subtitle">{subtitle}</p>
          )}
          
          <div className="card-list-section_cards">
            {isMobile ? (
              <Swiper
                ref={cardsSwiperRef}
                spaceBetween={20}
                slidesPerView={1.85}
                centeredSlides={true}
                loop={false}
                speed={800}
                className="cards-swiper"
                allowTouchMove={true}
                initialSlide={1}
                onSlideChange={handleSlideChange}
              >
                {cards.map((card, index) => (
                  <SwiperSlide key={card.id}>
                    <div className="card-list-section_card">
                      <h3 className="card-list-section_card_title">
                        {typeof card.title === 'string' ? card.title : card.title}
                      </h3>
                      <div className={`card-list-section_card_image ${type}-slide-${index + 1}`}>
                        <Image src={card.image} alt={typeof card.title === 'string' ? card.title : 'Card image'} width={200} height={150} />
                      </div>
                      <button 
                        className="card-list-section_card_button"
                        style={{ 
                          '--button-gradient': card.buttonGradient
                        } as React.CSSProperties}
                        onClick={() => handleCardClick(index)}
                      >
                        자세히 보기
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="card-list-section_cards_pc">
                {cards.map((card, index) => (
                  <div 
                    key={card.id}
                    className={`card-list-section_card ${index === 1 ? 'active' : ''}`}
                    onMouseEnter={() => handleCardHover(index)}
                  >
                    <h3 className="card-list-section_card_title">
                      {typeof card.title === 'string' ? card.title : card.title}
                    </h3>
                    <div className={`card-list-section_card_image ${type}-slide-${index + 1}`}>
                      <Image src={card.image} alt={typeof card.title === 'string' ? card.title : 'Card image'} width={200} height={150} />
                    </div>
                    <button 
                      className="card-list-section_card_button"
                      style={{ 
                        '--button-gradient': card.buttonGradient
                      } as React.CSSProperties}
                      onClick={() => handleCardClick(index)}
                    >
                      자세히 보기
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popup */}
      {isPopupOpen && (
        <div className="card-list-section_popup">
          {/* <div className="card-list-section_popup_dim" onClick={handleClosePopup} /> */}
          <div className="card-list-section_popup_dim" />
          <div className="card-list-section_popup_content">
            <div className="card-list-section_popup_slider">
              <Swiper
                ref={swiperRef}
                slidesPerView={1}
                loop={true}
                initialSlide={selectedCardIndex}
                className="popup-swiper"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <div className={`card-list-section_popup_slide ${slide.className}`}>
                      <div className="card-list-section_popup_slide_image">
                        <Image 
                          className="pc-tablet-only"
                          src={slide.image} 
                          alt=''
                          width={300}
                          height={200}
                        />
                        <Image 
                          className="mo-only"
                          src={slide.imageMobile || slide.image} 
                          alt=''
                          width={300}
                          height={200}
                        />                        
                      </div>
                      <div className="card-list-section_popup_slide_content" data-lenis-prevent>
                        <h3 
                          style={{
                            '--title-highlight-color': slide.titleHighlightColor || titleHighlightColor,
                            '--title-background-image': slide.titleBackgroundImage ? `url(${slide.titleBackgroundImage})` : 'none'
                          } as React.CSSProperties}
                        >
                          {slide.title}
                        </h3>
                        <p>{slide.description}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* 커스텀 좌우 버튼 */}
              <button 
                className="card-list-section_popup_prev-btn"
                onClick={() => swiperRef.current?.swiper.slidePrev()}
              >이전</button>
              <button 
                className="card-list-section_popup_next-btn"
                onClick={() => swiperRef.current?.swiper.slideNext()}
              >다음</button>
            </div>
            
            <button 
              className="card-list-section_popup_close"
              onClick={handleClosePopup}
            >
              내용을 확인했어요!
            </button>
          </div>
        </div>
      )}
    </>
  );
} 