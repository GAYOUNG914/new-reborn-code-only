"use client";

import "../styles/SectionKv.scss";
import { useRef, useEffect, useState, useMemo } from 'react';
import useIsMobile from "@/utils/useIsMobile";
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NavigationOptions } from 'swiper/types';
import { Navigation, A11y, Keyboard, Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { useDominantColorPalette } from "@/hooks/usePalette";
import { KvResponseData } from "@/data/our-stories/KV";
import { useSwiperAutoSlide } from "./useSwiperAutoSlide";
import { getYoutubeEmbedUrl } from "@/utils/getEmbedUrl";
import { getVideoId } from "@/utils/getVideoId";

const PC_SIZE = { w: 1920, h: 1080 };
const MOBILE_SIZE = { w: 400, h: 870 };

// 스와이프 랜덤 노출을 위한 셔플
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}


export default function SectionKv() {

  const isMobile = useIsMobile();

  const sectionKvRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const descRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [swiperReady, setSwiperReady] = useState(false);

  const [shuffledData, setShuffledData] = useState<typeof KvResponseData>([]);

  const [desc, setDesc] = useState("");
  const [fade, setFade] = useState(false);
  const playDuration = 10000;

  const { startAutoSlide, stopAutoSlide } = useSwiperAutoSlide(swiperRef, playDuration);

  const activeItem = useMemo(() => shuffledData?.[activeIndex]?.result.contents[0], [shuffledData, activeIndex]);



  useEffect(() => {
    if (KvResponseData) {
      setShuffledData(shuffleArray(KvResponseData));
    }

  }, [KvResponseData]);



  // 색상 추출 및 그라데이션 적용 =========================================
  const activeSrc = isMobile ? activeItem?.imageUrl : activeItem?.pcImageUrl;

  const { dominantColor } = useDominantColorPalette(activeSrc);


  // 대표색 변경 시 gradient 적용
  useEffect(() => {
    if (!gradientRef.current || !shuffledData) return;

    const currentContent = shuffledData[activeIndex]?.result.contents[0];

    if (!currentContent) return;

    // autoColor 여부에 따라 색상 결정
    const baseColor = currentContent?.autoColor
      ? dominantColor // autoColor true → 기존 dominantColor 사용
      : currentContent.color; // autoColor false → 지정 color 사용

    if (!baseColor) return;

    // GSAP으로 그라데이션 색상 부드럽게 변경
    gsap.to(gradientRef.current, {
      "--color1": "rgba(0, 0, 0, 0)",
      "--color2": baseColor,
      duration: 1,
    });

  }, [activeItem, dominantColor]);


  // 스와이퍼 준비 ==========================================

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    // navigation refs 연결
    if (
      prevRef.current &&
      nextRef.current &&
      swiper.params.navigation &&
      typeof swiper.params.navigation !== 'boolean'
    ) {
      const nav = swiper.params.navigation as NavigationOptions;
      nav.prevEl = prevRef.current;
      nav.nextEl = nextRef.current;

      swiper.navigation?.init();
      swiper.navigation?.update();
    }


    // resize 이벤트
    const handleResize = () => {
      swiper.update(); 
      swiper.slideTo(swiper.realIndex, 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [swiperRef.current, prevRef.current, nextRef.current]);


  useEffect(() => {
    if (swiperRef.current && !swiperReady) {
      sectionKvRef.current?.classList.add('on');
      
      const t = setTimeout(() => {
        setSwiperReady(true);
        swiperRef.current && handleSlideChangeEnd(swiperRef.current);
      }, 1000);

      return () => clearTimeout(t);
    }
  }, [swiperReady]);



  const handleSlideChangeEnd = (swiper: SwiperClass) => {
    setPlayingIndex(swiper.realIndex);
    stopAutoSlide();
    startAutoSlide();
    setActiveIndex(swiper.realIndex);

    // 포커스를 iframe으로 이동
    const iframe = swiper.slides[swiper.activeIndex].querySelector("iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.focus();
    }

  };



  // 초기 desc 세팅 (shuffledData 로드 시)
  useEffect(() => {
    if (!shuffledData || !shuffledData.length) return;
    const raw = shuffledData[0].result.contents[0].article || "";
    setDesc(raw.replace(/\n/g, "<br />"));
    setFade(true); // 초기엔 보이도록
  }, [shuffledData]);



  // swiper 이벤트로 desc 전환 + fade 동기화
  useEffect(() => {
    
    const swiper = swiperRef.current;
    if (!swiper || !shuffledData?.length) return;

    const getFormatted = (index: number) => {
      const raw = shuffledData[index]?.result.contents[0].article || "";
      return raw.replace(/\n/g, "<br />");
    };

    const handleStart = () => {
      setFade(false);

      const nextIndex = swiper.realIndex;

      // 짧은 딜레이 후에 내용 교체 → 강제 리플로우 → 다음 프레임에 fade-in
      const swapDelay = 250; // 필요하면 40~120 사이에서 조정
      setTimeout(() => {
        setDesc(getFormatted(nextIndex));

        if (descRef.current) void descRef.current.offsetHeight;

        requestAnimationFrame(() => setFade(true));
      }, swapDelay);

      sectionKvRef.current?.classList.add("event-none");
    };

    const handleEnd = () => {
      // 슬라이드 끝나면 index 확정 및 autoplay 재시작 등
      setActiveIndex(swiper.realIndex);
      setPlayingIndex(swiper.realIndex);

      stopAutoSlide();
      startAutoSlide();

      sectionKvRef.current?.classList.remove("event-none");
    };

    swiper.on("slideChangeTransitionStart", handleStart);
    swiper.on("slideChangeTransitionEnd", handleEnd);

    return () => {
      swiper.off("slideChangeTransitionStart", handleStart);
      swiper.off("slideChangeTransitionEnd", handleEnd);
    };
  }, [shuffledData, startAutoSlide, stopAutoSlide]);



  return (
      <section className="section-kv" ref={sectionKvRef}>
        <div className="kv-wrapper">
          <div className="kv-contents">
            <h2 className="kv-contents_title" data-aos="fade-up">
              우리의 이야기
            </h2>
            <p
              className="kv-contents_desc"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              단순한 법률서비스의 제공이 아닌,<br />
              서류 한 장에도 진심을 다하는 우리의 이야기를 전합니다.
            </p>
          </div>

          <div className={`kv-desc ${fade ? "fade-in" : "fade-out"}`}
            dangerouslySetInnerHTML={{ __html: desc }}
          />

          <div className="kv-swiper_navigation">
            <button ref={prevRef} type="button" className="btn btn-prev" onClick={() => swiperRef.current && setActiveIndex(swiperRef.current.realIndex)}>
              <span className="blind">이전</span>
              <span className="icon"></span>
            </button>

            <button ref={nextRef} type="button" className="btn btn-next" onClick={() => swiperRef.current && setActiveIndex(swiperRef.current.realIndex)}>
              <span className="blind">다음</span>
              <span className="icon"></span>
            </button>
          </div>

          <div className="kv-scroll">
            <span>Scroll</span>
            <div className="kv-scroll_arrow-list">
              <span className="kv-scroll_arrow-item"></span>
              <span className="kv-scroll_arrow-item"></span>
              <span className="kv-scroll_arrow-item"></span>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Navigation, A11y, Keyboard]}
          spaceBetween={0}
          slidesPerView={1}
          loop
          speed={750}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChangeTransitionEnd={(swiper) => handleSlideChangeEnd(swiper)}
          style={{
            "--swiper-transition-timing-function":
              "cubic-bezier(0.4, 0, 0, 0.99)",
          } as React.CSSProperties}
          keyboard={{
            enabled: true,
            onlyInViewport: false,  // 뷰포트 제한 해제
            pageUpDown: true,       // PgUp / PgDn 지원
          }}
          a11y={{ enabled: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
        >
          {shuffledData?.map((item, index) => {

            const content = item.result.contents[0];
            const embedUrl = getYoutubeEmbedUrl(content.videoUrl);
            const videoId = getVideoId(embedUrl);

            const finalUrl = embedUrl
              ? `${embedUrl}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1&iv_load_policy=3`
              : "";

            return (
              <SwiperSlide key={`slide-${index}-${content.id}`}
                aria-label={`슬라이드 ${index + 1} / ${shuffledData.length} || '영상 슬라이드'}`}>
                <div className="slide-inner" style={{ position: "relative" }}>

                  <img
                    src={isMobile ? content.imageUrl : content.pcImageUrl}
                    alt={`slide-${index}-${content.id}`}
                    width={isMobile ? MOBILE_SIZE.w : PC_SIZE.w}
                    height={isMobile ? MOBILE_SIZE.h : PC_SIZE.h}
                    style={{
                      opacity: isMobile 
                        ? (playingIndex === index ? "0" : "1") 
                        : "1", 
                      transition: 'opacity 0.4s ease',
                    }}
                  />

                  {/* 비디오 미리 렌더링 */}
                  {isMobile && (
                    <div
                      className="video-wrapper"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: playingIndex === index ? 1 : 0,
                        pointerEvents: playingIndex === index ? 'auto' : 'none',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      <div className="yt-wrapper">
                        <div className="yt-frame-container">
                          <iframe
                            src={finalUrl}
                            title={`slide-video-${index}-${content.id}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                            tabIndex={-1}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="kv-gradient" ref={gradientRef}></div>
      </section>
  );
}