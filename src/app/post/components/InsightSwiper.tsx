import Title from "./Title";
import "../styles/InsightSwiper.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { motion, AnimatePresence } from "framer-motion";

import { InsightSwiperData } from "@/data/post/InsightSwiperData";

import { Autoplay, EffectFade } from 'swiper/modules';

export default function InsightSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="insight-swiper-container">
      <div className="insight-swiper-datas">
        <Title data-aos="fade-up" data-aos-delay="100"
          title="INSIGHT" desc={
            <>
              세상에서 벌어지는 일들, <br />
              우리가 함께 나누고 싶은 소식들을 담았습니다
            </>
          } />
        <div className="insight-swiper-wrapper" data-aos="fade-up" data-aos-delay="200">
          <Swiper 
            className="insight-swiper"
            grabCursor={true}
            onSlideChange={(swiper: SwiperType) => {
              // 무한 루프에서 실제 슬라이드 인덱스 계산
              const realIndex = swiper.realIndex;
              setActiveIndex(realIndex);
            }}
            resistanceRatio={0}
            modules={[Autoplay, EffectFade]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            effect="fade"
            speed={1000}  // 전환 속도 추가 (밀리초 단위)
          >
            {InsightSwiperData.map((data, index) => (
              <SwiperSlide key={data.result.contents[0].id}>
                <div className="insight-swiper-item">
                  <div className="insight-swiper-item-title fade">
                    <div className="title">{data.result.contents[0].title}</div>
                    <div className="desc caption_n">{data.result.contents[0].subtitle}</div>
                    <div className="date caption_n">{data.result.contents[0].date}</div>
                  </div>
                  <div className="insight-swiper-item-user fade">
                    <div className="user-image">
                      <Image src={data.result.contents[0].manager.profileImage} alt="user" width={54} height={54} />
                    </div>
                    <div className="user caption_n">by {data.result.contents[0].manager.name}</div>
                  </div>
                  <div className="insight-swiper-item-image">
                    <Image src={data.result.contents[0].imageUrl} alt="thumbnail" width={322} height={483} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div> 
      </div>
      <div className="insight-swiper-background">
        <div className="insight-swiper-background_number-text">
          <div className="line line-01"></div>
          <div className="text">
            Monthly Topic 
            <span className={activeIndex === 0 ? "active" : ""}>1</span>
            <span className={activeIndex === 1 ? "active" : ""}>2</span>
            <span className={activeIndex === 2 ? "active" : ""}>3</span>
          </div>
          <div className="line line-02"></div>
        </div>
        <div className="insight-swiper-background_image" data-aos="fade-in">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="fade-image-container"
            >
              <Image
                className="fade-image"
                src={InsightSwiperData[activeIndex].result.contents[0].bgImageUrl} 
                alt="top-bg" 
                width={1920} 
                height={518} 
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}