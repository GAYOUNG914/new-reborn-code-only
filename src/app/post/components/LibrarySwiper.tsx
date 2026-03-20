import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../styles/LibrarySwiper.scss";
import type { Swiper as SwiperType } from "swiper";
import Title from "./Title";
import useIsMobile from "@/utils/useIsMobile";

import { LibrarySwiperData } from "@/data/post/LibrarySwiperData";

export default function LibrarySwiper() {
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(Math.random() * 3));
  const isMobile = useIsMobile();
  return (
    <div className="library-hero-wrapper">
      <div className="library-hero-wrapper-title">
        <div className="inner" data-aos="fade-up">
          <div className={`inner-wrap ${isMobile? activeIndex === 2 ? 'dark' : '' : ''}`}>
            {/* dark class 붙으면 타이틀 어두워짐 */}
            <Title title="LIBRARY" desc={
              <>
                조용히 건네는 한 문장, 이야기로 <br />
                리본회생이 전하는 의미와 영감을 함께 나누고자 합니다
              </>
            } />
            <div className="editor-wrapper">
              {activeIndex === 0 && <Image src={LibrarySwiperData.result.monthlyBook.manager.profileImage} alt="library-hero-swiper-item-image" width={90} height={90} />}
              {activeIndex === 1 && <Image src={LibrarySwiperData.result.editorsPick.manager.profileImage} alt="library-hero-swiper-item-image" width={90} height={90} />}
              {activeIndex === 2 && <Image src={LibrarySwiperData.result.quotes.manager.profileImage} alt="library-hero-swiper-item-image" width={90} height={90} />}
            </div>
          </div>
        </div>
      </div>
      <Swiper 
        data-aos="fade-in"
        className="library-swiper"
        grabCursor={true}
        modules={[Pagination, EffectFade, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        initialSlide={activeIndex}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        speed={1000}  // 전환 속도 추가 (밀리초 단위)
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          type: 'bullets',
        }}
        onSlideChange={(swiper: SwiperType) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {/* 이달의 도서 */}
        <SwiperSlide>
          <div className="library-swiper-item monthly-book">
            <div className="monthly-book-data-wrapper fade">
              <div className="box-left"></div>
              <div className="box-right" data-aos="fade-up" data-aos-delay="100">
                <div className="monthly-book-titlewrap">
                  <div className="monthly-book-titlewrap_title">이달의 도서</div>
                  <div className="monthly-book-titlewrap_desc">지금, 가장 사랑 받는 책</div>
                </div>
                <div className="monthly-book_image">
                  <Image src={LibrarySwiperData.result.monthlyBook.book.imageUrl} alt="library-hero-swiper-item-image" width={526} height={792} />
                </div>
              </div>
            </div>
            <div className="library-swiper-item_bg">
              <Image src={LibrarySwiperData.result.monthlyBook.manager.bgImage} alt="library-hero-swiper-item-image" width={1920} height={518}  className="pc-tablet-only"/>
              <Image src={LibrarySwiperData.result.monthlyBook.manager.bgImageMo} alt="library-hero-swiper-item-image" width={1920} height={518} className="mo-only"/>
            </div>
          </div>
        </SwiperSlide>

        {/* EDITOR'S PICK */}
        <SwiperSlide>
          <div className="library-swiper-item editor-pick">
            <div className="editor-pick-data-wrapper fade" data-aos="fade-up" data-aos-delay="100">
              <div className="editor-pick-text-wrapper">
                <div className="pc-tablet-only">
                  <div className="editor-pick-text-wrapper_title">{LibrarySwiperData.result.editorsPick.book.title}</div>
                  <div className="editor-pick-text-wrapper_subtitle s2_n">{LibrarySwiperData.result.editorsPick.book.subtitle}</div>
                  <div className="editor-pick-text-wrapper_author caption_n">{LibrarySwiperData.result.editorsPick.book.author}, {LibrarySwiperData.result.editorsPick.book.company}</div>
                </div>
                <div className="editor-pick-text-wrapper_desc">
                  {LibrarySwiperData.result.editorsPick.editorsMention}
                </div>
              </div>
              <div className="editor-pick-book-wrapper">
                <div className="editor-pick-titlewrap">
                  <div className="editor-pick-titlewrap_desc">지금, 당신에게 건네고 싶은 한 문장</div>
                  <div className="editor-pick-titlewrap_title">Editor&apos;s Pick</div>
                </div>
                <div className="mo-wrap">
                  <div className="mo-only">
                    <div className="mo-only_title">{LibrarySwiperData.result.editorsPick.book.title}</div>
                    <div className="mo-only_subtitle">{LibrarySwiperData.result.editorsPick.book.subtitle}</div>
                    <div className="mo-only_author">{LibrarySwiperData.result.editorsPick.book.author}, {LibrarySwiperData.result.editorsPick.book.company}</div>
                  </div>
                  <div className="book-img">
                    <Image src={LibrarySwiperData.result.editorsPick.book.imageUrl} alt="library-hero-swiper-item-image" width={334} height={454} />
                  </div>
                </div>
              </div>
            </div>
            <div className="library-swiper-item_bg">
              <Image src={LibrarySwiperData.result.editorsPick.manager.bgImage} alt="library-hero-swiper-item-image" width={1920} height={518} className="pc-tablet-only"/>
              <Image src={LibrarySwiperData.result.editorsPick.manager.bgImageMo} alt="library-hero-swiper-item-image" width={1920} height={518} className="mo-only"/>
            </div>
          </div>
        </SwiperSlide>

        {/* QUOTES */}
        <SwiperSlide>
          <div className="library-swiper-item quotes">
            <div className="quotes-data-wrapper fade" data-aos="fade-up" data-aos-delay="100">
              <div className="inner">
                <div className="quotes-data-box_left">
                  <div className="quotes-data-box_left_title">{LibrarySwiperData.result.quotes.book.title}</div>
                  <div className="quotes-data-box_left_author">EDIT. {LibrarySwiperData.result.quotes.book.author}</div>
                </div>
                <div className="quotes-data-box_right">
                  <div className="quotes-data-box_right_desc">
                    {LibrarySwiperData.result.quotes.quotes}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="library-swiper-item_bg">
              <Image src={LibrarySwiperData.result.quotes.manager.bgImage} alt="library-hero-swiper-item-image" width={1920} height={518} className="pc-tablet-only"/>
              <Image src={LibrarySwiperData.result.quotes.manager.bgImageMo} alt="library-hero-swiper-item-image" width={1920} height={518} className="mo-only"/>
            </div> */}
            <div className="library-swiper-item_blur">
              <Image src={LibrarySwiperData.result.quotes.manager.bgImage} alt="library-hero-swiper-item-image" width={1920} height={518} className="pc-tablet-only"/>
              <Image src={LibrarySwiperData.result.quotes.manager.bgImageMo} alt="library-hero-swiper-item-image" width={1920} height={518} className="mo-only"/>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className={`swiper-pagination ${isMobile ? activeIndex === 1 || activeIndex === 2 ? 'dark' : '' : ''}`}>
        {/* .swiper-pagination 에 dark 클래스 붙으면 페이지네이션 닷 어두워짐 */}
      </div>
    </div>
  );
}