"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination} from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
// import 'swiper/css/navigation';
import iconLinkArrow from '../../assets/images/icons/icon_link_arrow.svg';


interface ReviewItem {
  id: string;
  thumbnail: string;
  content: React.ReactNode;
  videoUrl?: string;
}

interface CustomerReviewSectionProps {
  title: string | React.ReactNode;
  titleHighlight?: string;
  titleHighlightColor?: string;
  reviews: ReviewItem[];
}

export default function CustomerReviewSection({
  title,
  titleHighlight,
  titleHighlightColor = "#007AFF",
  reviews
}: CustomerReviewSectionProps) {
  const swiperRef = useRef<SwiperRef>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const renderTitle = () => {
    if (typeof title === 'string') {
      if (!titleHighlight) {
        return <h2 className="customer-review-section_title">{title}</h2>;
      }

      const parts = title.split(titleHighlight);
      return (
        <h2 className="customer-review-section_title">
          {parts[0]}
          <span style={{ color: titleHighlightColor }}>{titleHighlight}</span>
          {parts[1]}
        </h2>
      );
    }

    return (
      <h2 
        className="customer-review-section_title"
        style={{ '--title-highlight-color': titleHighlightColor || '#0A905B' } as React.CSSProperties}
      >
        {title}
      </h2>
    );
  };

  const handleVideoClick = (videoUrl?: string) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <section className="customer-review-section">
      <div className="customer-review-section_container">
        {renderTitle()}
        
        <div className="slider-wrapper">
          <div className="customer-review-section_slider">
            <Swiper
              ref={swiperRef}
              modules={[Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              speed={800}
              autoHeight={true}
              className="reviews-swiper"
              pagination={{
                clickable: true,
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSwiper={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              // navigation={true}
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="customer-review-section_slide">
                    <div className="customer-review-section_slide_thumbnail">
                      <Image
                        src={review.thumbnail}
                        alt="Review thumbnail"
                        width={300}
                        height={200}
                      />
                    </div>
          
                    <div className="customer-review-section_slide_content">
                      <div className="customer-review-section_slide_text">
                        <p>{review.content}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="customer-review-section_slide_video_button_wrapper">
              <a
                // href={review.videoUrl}
                href={reviews[0].videoUrl || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="customer-review-section_slide_video_button"
                // onClick={() => handleVideoClick(review.videoUrl)}
              >
                <span className="button-text">영상 보러가기</span>
                <Image
                  src={iconLinkArrow.src}
                  alt=""
                  width={22}
                  height={10}
                  className="button-icon"
                />
              </a>
            </div>
          </div>
          <div className="swiper-nav-wrap">
            <button
                className={`swiper-nav-prev ${isBeginning ? 'disabled' : ''}`}
                onClick={handlePrev}
                disabled={isBeginning}
              >
              <svg width="40" height="74" viewBox="0 0 40 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.166 3L3.16602 37L37.166 71" stroke="#333333" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          
            <button
              className={`swiper-nav-next ${isEnd ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={isEnd}
            >
              <svg width="40" height="74" viewBox="0 0 40 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.83398 3L36.834 37L2.83398 71" stroke="#333333" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
} 