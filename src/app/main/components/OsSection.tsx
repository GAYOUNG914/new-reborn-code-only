import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import Title from "./Title";
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';
import "../styles/OsSection.scss";

import osBg01 from "@/app/assets/images/contents/bg_main_os-01.png";
import osBg02 from "@/app/assets/images/contents/bg_main_os-02.png";
import osBg03 from "@/app/assets/images/contents/bg_main_os-03.png";
import osImg01 from "@/app/assets/images/contents/img_main_os-01.png";
import osImg02 from "@/app/assets/images/contents/img_main_os-02.png";
import osImg03 from "@/app/assets/images/contents/img_main_os-03.png";
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from "swiper";
// import { SliderRoot } from '@mui/material';

const dummydata = [
  {
    "id": 1,
    "article": "“아무래도 채팅이라는게 얼굴을 보고 이야기 하는 것과 달라서 조금이라도 더 마음을 열고 대화를 하려고 해요.”",
    "imageUrl": osImg01.src,
    "bgImageUrl": osBg01.src,
    "gradientColor": "#7E383C"
  },
  {
    "id": 2,
    "article": "“고객이 안정감을 느낄 수 있도록, 모든 과정에 전문적인 지식을 더하는 것이 저의 가장 큰 임무라고 생각해요.”",
    "imageUrl": osImg02.src,
    "bgImageUrl": osBg02.src,
    "gradientColor": "#8B7B57"
  },  
  {
    "id": 3,
    "article": "“고객이 안정감을 느낄 수 있도록, 모든 과정에 전문적인 지식을 더하는 것이 저의 가장 큰 임무라고 생각해요.”",
    "imageUrl": osImg03.src,
    "bgImageUrl": osBg03.src,
    "gradientColor": "#576063"
  }
]

const randomIndex = Math.floor(Math.random() * dummydata.length);
const hasMultipleSlides = dummydata.length > 1; // "dummydata" 데이터 개수가 한 개이면, 스와이퍼 네비게이션 및 오토슬라이드 효과가 사라집니다.

export default function OsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="os-section">
      <div className="os-section-container">
        <div className="os-section-title">

          <Title 
          title="우리의 이야기" 
          desc="리본회생의 사람들이 일하는 방식" 
          readmorebtn="자세히 보기" color="black"/>
        </div>

        <div className="os-section-swiper" data-aos="fade-in">
          <div className="os-section-swiper-inner">
          {hasMultipleSlides && (
            <button
              className="arrow-btn prev-btn"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="이전 슬라이드"
            >
              <svg fill="none" height="34" viewBox="0 0 19 34" width="19" xmlns="http://www.w3.org/2000/svg"><path d="m16.7422 32-15.00001-15 15.00001-15" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
            </button>
            )}
            <Swiper
            modules={[EffectFade, Autoplay]}
            slidesPerView={1}
            spaceBetween={0}
            loop={hasMultipleSlides}
            initialSlide={hasMultipleSlides ? randomIndex : 0}
            autoplay={hasMultipleSlides ? {
              delay: 5000,
              disableOnInteraction: false,
            } : false}
            effect="fade"
            speed={1000}
            threshold={50}
            grabCursor={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper: SwiperType) => {
              const realIndex = swiper.realIndex;
              setActiveIndex(realIndex);
            }}
            >
              {dummydata.map((item,index) => (
                <SwiperSlide key={item.id}>
                  <div className="card-wrap">
                    <p className="card_desc"
                      dangerouslySetInnerHTML={{ __html: item.article }}
                    />
                    <div className="card_img">
                      <Image src={item.imageUrl} alt={item.article} width={549} height={824} />
                    </div>
                    <div className="card_gradient" style={{
                      background: item.gradientColor?
                      `linear-gradient(0deg, ${item.gradientColor}, rgba(0, 0, 0, 0))`
                      :
                      `linear-gradient(0deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))`
                      }}></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {hasMultipleSlides && (
            <button
                className="arrow-btn next-btn"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="다음 슬라이드"
              >
              <svg fill="none" height="34" viewBox="0 0 19 34" width="19" xmlns="http://www.w3.org/2000/svg"><path d="m16.7422 32-15.00001-15 15.00001-15" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
            </button>
            )}
          </div>
        </div>
        
        <div className="os-section-readmorebtn mo-only" data-aos="fade-in" data-aos-offset="10" data-aos-duration="300">
          <ReadMoreButton text="자세히 보기" direction="right" color="black"/>
        </div>

        <div className="os-section-bg" data-aos="fade-in">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%'
              }}
            >
            <Image src={dummydata[activeIndex].bgImageUrl} alt={dummydata[activeIndex].article} width={1920} height={1080} />
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </section>
  )
}