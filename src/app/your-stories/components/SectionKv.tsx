"use client";

import { useEffect, useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/SectionKv.scss";
import Title from './Title';
import PlayButton from "@/components/new-reborn/PlayButton";
// import useIsMobile from '@/utils/useIsMobile';
// import { useDominantColorPalette } from "@/hooks/usePalette";
import { motion, AnimatePresence } from 'framer-motion';

import backgroundVideoSparkle1 from "@/app/assets/images/contents/bg_ys_shine-01.png";
import backgroundVideoSparkle2 from "@/app/assets/images/contents/bg_ys_shine-02.png";
import backgroundVideoSparkle3 from "@/app/assets/images/contents/bg_ys_shine-03.png";
import backgroundVideo01 from "@/app/assets/images/contents/ys_kv_vid_thumb-01.png";
import backgroundVideo02 from "@/app/assets/images/contents/ys_kv_vid_thumb-02.png";

const dummyImg = {
  backgroundVideoSparkle1: "/workout-v2/images/contents/bg_ys_shine-01.png",
  backgroundVideoSparkle2: "/workout-v2/images/contents/bg_ys_shine-02.png",
  backgroundVideoSparkle3: "/workout-v2/images/contents/bg_ys_shine-03.png",
  backgroundVideo01: "/workout-v2/images/contents/ys_kv_vid_thumb-01.png",
  backgroundVideo02: "/workout-v2/images/contents/ys_kv_vid_thumb-02.png"
}

// 비디오 데이터 타입
interface VideoContent {
  id: number;
  title: string;
  videoUrl: string; // 유튜브 비디오 ID
  imageUrl: string;
  autoColor?: boolean;
  color?: string;
}

// 원본 비디오 데이터
const originalVideoContents: VideoContent[] = [
  {
    id: 1,
    title: "[EP.3] 엄마 대신 ",
    imageUrl: backgroundVideo01.src,
    videoUrl: "lxw6oTqZ2H0", // 샘플 유튜브 ID
    autoColor: true,
    color: "rgb(255, 134, 134)",
  },
  {
    id: 2,
    title: "[EP.3] 엄마 대신 떠안은 빛 3천만원3천만원",
    imageUrl: backgroundVideo02.src,
    videoUrl: "9bZkp7q19f0", // 샘플 유튜브 ID
    autoColor: true,
    color: "rgb(255, 225, 134)",
  },
  // {
  //   id: 3,
  //   title: "[EP.3] 엄마 대신 떠안은 빛 3천만원",
  //   imageUrl: backgroundVideo03.src,
  //   videoUrl: "lxw6oTqZ2H0", // 샘플 유튜브 ID
  //   autoColor: false,
  //   color: "",
  // },
  // {
  //   id: 4,
  //   title: "[EP.3] 엄마 대신 떠안은 빛 3천만원ddd",
  //   imageUrl: backgroundVideo04.src,
  //   videoUrl: "fJ9rUzIMcZQ", // 샘플 유튜브 ID
  //   autoColor: false,
  //   color: "",
  // },
  // {
  //   id: 5,
  //   title: "[EP.3] 엄마 대신 떠안은 빛 3천만원  빛 3천만ddd",
  //   imageUrl: backgroundVideo05.src,
  //   videoUrl: "hOJ76cZEt08", // 샘플 유튜브 ID
  //   autoColor: false,
  //   color: "",
  // },
  
];

// 데이터 개수가 4개 이하일 때 복제하여 최소 5개 이상으로 만들기
const createExtendedVideoContents = (contents: VideoContent[]): VideoContent[] => {
  if (contents.length >= 5) {
    return contents;
  }
  
  // 최소 5개가 되도록 필요한 복제 횟수 계산
  const minRequired = 5;
  const repeatCount = Math.ceil(minRequired / contents.length);
  
  const extendedContents: VideoContent[] = [];
  
  for (let i = 0; i < repeatCount; i++) {
    contents.forEach((content, index) => {
      extendedContents.push({
        ...content,
        id: content.id + (i * contents.length), // 고유한 ID 생성
      });
    });
  }
  
  return extendedContents;
};

// 확장된 비디오 데이터 생성
const videoContents = createExtendedVideoContents(originalVideoContents);

// 원본 데이터 개수 (페이지네이션용)
const originalDataCount = originalVideoContents.length;

// YouTube Player 타입 정의
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  getVideoData: () => { video_id: string };
}

export default function SectionKv() {
  const [activeIndex, setActiveIndex] = useState(() => {
    // 컴포넌트 초기화 시점에 바로 랜덤 인덱스 계산
    const randomIndex = Math.floor(Math.random() * videoContents.length);
    return randomIndex;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [showCustomPlayButton, setShowCustomPlayButton] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  
  // Refs
  const bufferingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerCreationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const currentVideoIdRef = useRef<string>('');
  
  // 현재 활성화된 비디오의 썸네일에서 주요 색상과 팔레트 추출
  // const { dominantColor, palette } = useDominantColorPalette(videoContents[activeIndex]?.imageUrl);

  // 메모이제이션된 값들
  const totalSlides = useMemo(() => videoContents.length, []);
  const slidesPerView = useMemo(() => 3, []);
  const slidesPerGroup = useMemo(() => 1, []);
  const currentVideoContent = useMemo(() => videoContents[activeIndex], [activeIndex]);
  
  // 페이지네이션용 활성 인덱스 계산 (원본 데이터 기준)
  const paginationActiveIndex = useMemo(() => {
    return activeIndex % originalDataCount;
  }, [activeIndex, originalDataCount]);

  // YouTube API 로드 - 메모이제이션된 함수
  const loadYouTubeAPI = useCallback(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    // API가 이미 로드된 경우
    if (window.YT && window.YT.Player) {
      createPlayer();
    }
  }, []);

  useEffect(() => {
    loadYouTubeAPI();
  }, [loadYouTubeAPI]);

  // 새로고침 시 리사이즈 이벤트 트리거 (AOS 재가동용)
  useEffect(() => {
    const timer = setTimeout(() => {
      // 리사이즈 이벤트를 수동으로 트리거
      window.dispatchEvent(new Event('resize'));
      // console.log('Resize event triggered for AOS refresh');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // activeIndex가 변경될 때 플레이어 재생성 및 재생 (슬라이드 변경 시에만)
  useEffect(() => {
    if (window.YT && window.YT.Player && isInitialized) {
      const newVideoId = currentVideoContent?.videoUrl;
      
      // 현재 비디오 ID와 새로운 비디오 ID가 다를 때만 플레이어 재생성
      if (currentVideoIdRef.current !== newVideoId) {
        currentVideoIdRef.current = newVideoId || '';
        setShouldAutoPlay(true);
        
        // 기존 타이머 정리
        if (playerCreationTimeoutRef.current) {
          clearTimeout(playerCreationTimeoutRef.current);
        }
        
        // 플레이어 재생성을 디바운싱하여 빠른 변경 시 중복 생성 방지 - 지연 시간 단축
        playerCreationTimeoutRef.current = setTimeout(() => {
          createPlayer();
        }, 50);
      }
    }
  }, [activeIndex, isInitialized, currentVideoContent]);

  // 통합된 자동슬라이드 제어 함수 - 지연 시간 최적화
  const manageAutoSlide = useCallback((shouldStart: boolean, delay: number = 100) => {
    // 기존 타이머 정리
    if (bufferingTimeoutRef.current) {
      clearTimeout(bufferingTimeoutRef.current);
      bufferingTimeoutRef.current = null;
    }

    if (swiperRef.current) {
      if (shouldStart) {
        // 자동슬라이드 시작 - 지연 시간 단축
        bufferingTimeoutRef.current = setTimeout(() => {
          if (swiperRef.current) {
            setIsUserInteracting(false);
            swiperRef.current.autoplay.start();
          }
        }, delay);
      } else {
        // 자동슬라이드 중지
        swiperRef.current.autoplay.stop();
      }
    }
  }, []);

  // 편의를 위한 래퍼 함수들
  const startAutoSlide = useCallback(() => manageAutoSlide(true), [manageAutoSlide]);
  const stopAutoSlide = useCallback(() => manageAutoSlide(false), [manageAutoSlide]);

  // 플레이어 상태 변경 핸들러
  const onPlayerStateChange = useCallback((event: { data: number }) => {
    const playerState = event.data;
    
    if (playerState === window.YT.PlayerState.PLAYING) {
      // 영상 재생 시
      setIsVideoPlaying(true);
      setIsBuffering(false);
      setShowCustomPlayButton(false);
      stopAutoSlide(); // 자동슬라이드 중지
    } else if (
      playerState === window.YT.PlayerState.PAUSED || 
      playerState === window.YT.PlayerState.CUED || 
      playerState === window.YT.PlayerState.ENDED ||
      playerState === window.YT.PlayerState.BUFFERING || // BUFFERING 상태 추가
      playerState === -1 // UNSTARTED
    ) {
      // 영상 일시정지, 정지, 종료 시
      setIsVideoPlaying(false);
      setIsBuffering(false);
      setShowCustomPlayButton(true);
      startAutoSlide(); // 자동슬라이드 시작
    } else if (playerState === window.YT.PlayerState.BUFFERING) {
      // 버퍼링 시
      setIsBuffering(playerState === window.YT.PlayerState.BUFFERING);
      setIsVideoPlaying(true);
      setShowCustomPlayButton(false);
      stopAutoSlide(); // 자동슬라이드 중지
    }
  }, [startAutoSlide, stopAutoSlide]);

  // 플레이어 생성 - 메모이제이션된 함수
  const createPlayer = useCallback(() => {
    if (!iframeRef.current || !currentVideoContent) return;

    // 기존 플레이어가 있다면 제거
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
        playerRef.current = null;
      } catch (error) {
        // 플레이어 제거 중 에러 무시
      }
    }

    // 플레이어 생성 전에 iframe 요소 정리
    if (iframeRef.current) {
      iframeRef.current.innerHTML = '';
    }

    // 에러 처리를 위한 try-catch 추가
    try {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: currentVideoContent.videoUrl,
        playerVars: {
          loop: 1,
          playlist: currentVideoContent.videoUrl,
          controls: 0,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          autoplay: shouldAutoPlay ? 1 : 0,
          modestbranding: 1,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
          showinfo: 0,
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: () => {
            if (shouldAutoPlay) {
              setTimeout(() => {
                if (playerRef.current?.playVideo) {
                  try {
                    playerRef.current.playVideo();
                    setShouldAutoPlay(false);
                  } catch (_error) {
                    // 재생 실패 시 무시
                  }
                }
              }, 100);
            }
          },
        },
      });
    } catch (error) {
      console.error('플레이어 생성 실패:', error);
      setShowCustomPlayButton(true);
    }
  }, [currentVideoContent, shouldAutoPlay, onPlayerStateChange]);

  // 화면 크기 감지 - 디바운싱 적용 및 리사이즈 상태 관리
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    let resizeEndTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      // 리사이즈 시작 시 애니메이션 비활성화
      setIsResizing(true);
      
      clearTimeout(resizeTimeout);
      clearTimeout(resizeEndTimeout);
      
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);

      // 리사이즈 종료 감지 및 애니메이션 재활성화
      resizeEndTimeout = setTimeout(() => {
        setIsResizing(false);
      }, 300); // 리사이즈가 완전히 끝난 후 애니메이션 재활성화
    };

    handleResize();
    window.addEventListener('resize', handleResize);
     
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      clearTimeout(resizeEndTimeout);
    };
  }, []);

  // 섹션 가시성 감지 (Intersection Observer) - 메모이제이션된 콜백
  // const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
  //   entries.forEach((entry) => {
  //     const isVisible = entry.isIntersecting;
  //     setIsSectionVisible(isVisible);
      
  //     // 섹션이 화면에서 벗어나고 영상이 재생 중이면 일시정지
  //     if (!isVisible && isVideoPlaying && playerRef.current?.pauseVideo) {
  //       try {
  //         playerRef.current.pauseVideo();
  //       } catch (error) {
  //         console.log('영상 일시정지 실패:', error);
  //       }
  //     }
  //   });
  // }, [isVideoPlaying]);

  // useEffect(() => {
  //   if (!sectionRef.current) return;

  //   const observer = new IntersectionObserver(handleIntersection, {
  //     threshold: 0.3,
  //     rootMargin: '0px'
  //   });

  //   observer.observe(sectionRef.current);

  //   return () => {
  //     if (sectionRef.current) {
  //       observer.unobserve(sectionRef.current);
  //     }
  //   };
  // }, [handleIntersection]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 모든 타이머 정리
      if (bufferingTimeoutRef.current) {
        clearTimeout(bufferingTimeoutRef.current);
      }
      if (playerCreationTimeoutRef.current) {
        clearTimeout(playerCreationTimeoutRef.current);
      }
      
      // 플레이어 정리
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          // 정리 중 에러 무시
        }
      }
    };
  }, []);

  // 페이지 첫 접근 시 자동슬라이드 시작 - 즉시 시작
  useEffect(() => {
    if (swiperRef.current && !isVideoPlaying && !isUserInteracting) {
      // 즉시 자동슬라이드 시작 (지연 없이)
      manageAutoSlide(true, 0);
    }
  }, [isVideoPlaying, isUserInteracting, manageAutoSlide]);

  // Swiper 초기화 후 랜덤 슬라이드로 이동
  useEffect(() => {
    if (swiperRef.current && !isInitialized) {
      swiperRef.current.slideToLoop(activeIndex, 0, false);
      setIsInitialized(true);
    }
  }, [activeIndex, isInitialized]);

  // 유저 상호작용 설정 함수 - 지연 시간 최적화
  const setUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    stopAutoSlide();
    
    // 기존 타이머 정리 후 새로운 타이머 설정 - 지연 시간 단축
    const interactionTimeout = setTimeout(() => {
      setIsUserInteracting(false);
      if (!isVideoPlaying) {
        startAutoSlide();
      }
    }, 200);
    
    return () => clearTimeout(interactionTimeout);
  }, [stopAutoSlide, startAutoSlide, isVideoPlaying]);

  // 썸네일 클릭 핸들러 - 메모이제이션
  const handleThumbnailClick = useCallback((index: number) => {
    if (swiperRef.current) {
      setUserInteraction();
      swiperRef.current.slideToLoop(index);
      setShouldAutoPlay(true);
    }
  }, [setUserInteraction]);

  // 슬라이드 변경 핸들러 - 메모이제이션
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const realIndex = swiper.realIndex;
    setActiveIndex(realIndex);
    setShouldAutoPlay(isUserInteracting);
  }, [isUserInteracting]);

  //타이틀 오버플로우 - 각 슬라이드별로 관리
  const titleContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isOverflowStates, setIsOverflowStates] = useState<boolean[]>([]);

  // 커스텀 재생버튼 클릭 핸들러 - 메모이제이션
  const handleCustomPlayClick = useCallback(() => {
    const currentIsOverflow = isOverflowStates[activeIndex] || false;
    // console.log("🎬 [SECTIONKV] 재생 버튼 클릭", {
    //   isOverflow: currentIsOverflow,
    //   showCustomPlayButton,
    //   willAnimate: currentIsOverflow && !showCustomPlayButton
    // });
    
    if (playerRef.current?.playVideo) {
      setIsUserInteracting(true);
      stopAutoSlide();
      try {
        playerRef.current.playVideo();
        setShowCustomPlayButton(false);
        // console.log("▶️ [SECTIONKV] 재생 시작, showCustomPlayButton: false");
      } catch (_error) {
        // 재생 실패 시 무시
      }
    }
  }, [stopAutoSlide, isOverflowStates, activeIndex, showCustomPlayButton]);

  // 각 슬라이드별 오버플로우 체크 함수
  const checkOverflowForSlide = useCallback((index: number) => {
    const containerRef = titleContainerRefs.current[index];
    const textRef = titleRefs.current[index];
    
    if (containerRef && textRef) {
      const containerWidth = containerRef.clientWidth;
      const textWidth = textRef.scrollWidth;
      const isOverflowing = textWidth > containerWidth;

      // console.log(`🔍 [SECTIONKV OVERFLOW CHECK] 슬라이드 ${index}`, {
      //   containerWidth,
      //   textWidth,
      //   isOverflowing,
      //   showCustomPlayButton,
      //   willAnimate: isOverflowing && !showCustomPlayButton
      // });

      // 해당 슬라이드의 오버플로우 상태 업데이트
      setIsOverflowStates(prev => {
        const newStates = [...prev];
        newStates[index] = isOverflowing;
        return newStates;
      });

      if (isOverflowing) {
        containerRef.style.setProperty("--container-width", containerWidth + "px");
        containerRef.style.setProperty("--text-width", textWidth + "px");
        // console.log(`✅ [SECTIONKV] 슬라이드 ${index} 오버플로우 설정됨`);
      } else {
        // console.log(`❌ [SECTIONKV] 슬라이드 ${index} 오버플로우 해제됨`);
      }
    }
  }, [showCustomPlayButton]);

  // 모든 슬라이드의 오버플로우 체크
  useLayoutEffect(() => {
    videoContents.forEach((_, index) => {
      checkOverflowForSlide(index);
    });
  }, [checkOverflowForSlide, showCustomPlayButton]);


  return (
    <section className="section-kv" ref={sectionRef}>
      <div className="kv-container-wrapper">
        <div className="kv-container">
          {/* 좌측 메인 비디오 영역 */}
        
          <div className="kv-title-wrapper">
            <Title
              title="당신의 이야기"
              desc={
                <>
                  리본회생을 만나 변화한 삶을 만나보세요. <br />
                  이제 당신의 이야기가 될 차례입니다.
                </>
              }
              />
          </div>
          <div className="main-video-container" >
            <div className="main-video-area" data-aos="fade-up" data-aos-delay="200" data-aos-once="true">
              <div className="main-video-wrapper">
                  <div
                    ref={iframeRef}
                    className="main-video"
                  />
                  <div className={`custom-play-overlay ${showCustomPlayButton ? 'visible' : ''}`} onClick={handleCustomPlayClick}>
                      <div className="custom-play-bg">
                        <Image src={videoContents[activeIndex]?.imageUrl} alt={videoContents[activeIndex]?.title} width={700} height={500}/>
                      </div>
                      <div className="custom-play-button">
                        <PlayButton />
                      </div>
                  </div>
                  <div
                    className="main-video_bg_shadow"
                    style={{
                      background: `${videoContents[activeIndex]?.autoColor ? videoContents[activeIndex]?.color : 'rgba(0, 0, 0, 0.5)'}`,
                    }}
                  ></div>
                  <div className="main-video_bg"></div>
              </div>

            </div>
            {/* 우측 썸네일 스와이퍼 */}
            <div className="thumbnail-swiper-area" data-aos="fade-up" data-aos-delay="400" data-aos-once="true">
              <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              direction={isMobile ? "horizontal" : "vertical"}
              slidesPerView={slidesPerView}
              slidesPerGroup={slidesPerGroup}
              spaceBetween={isMobile ? 24 : 0}
              pagination={false}
              loop={true}
              centeredSlides={true}
              initialSlide={activeIndex}
              speed={700}
              autoplay={{
                delay: 2500, // 2.5초마다 자동 슬라이드
                disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
                pauseOnMouseEnter: true, // 마우스 오버 시 일시정지
                waitForTransition: false, // 전환 완료를 기다리지 않고 즉시 다음 슬라이드 준비
              }}
                onSwiper={useCallback((swiper: SwiperType) => {
                  swiperRef.current = swiper;
                  swiper.autoplay.stop();
                  setTimeout(() => {
                    if (!isInitialized) {
                      swiper.slideToLoop(activeIndex, 0, false);
                      setIsInitialized(true);
                    }
                  }, 10); // 지연 시간 단축
                }, [activeIndex, isInitialized])}
                onSlideChange={handleSlideChange}
                onTouchStart={useCallback(() => {
                  setIsUserInteracting(true);
                  stopAutoSlide();
                }, [stopAutoSlide])}
                onSliderMove={useCallback(() => {
                  setIsUserInteracting(true);
                  stopAutoSlide();
                }, [stopAutoSlide])}
                onTouchEnd={useCallback(() => {
                  setTimeout(() => {
                    setIsUserInteracting(false);
                    if (!isVideoPlaying) {
                      startAutoSlide();
                    }
                  }, 50); // 지연 시간 단축
                }, [isVideoPlaying, startAutoSlide])}
                className="thumbnail-swiper"
              >
                {videoContents.map((content, index) => (
                  <SwiperSlide key={content.id}>
                    <div
                      className={`thumbnail-item`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <div className="thumbnail-image">
                        <Image src={content.imageUrl} alt={content.title} width={400} height={300} />
                      </div>
                      <div 
                        className="thumbnail-content" 
                        ref={(el) => {
                          titleContainerRefs.current[index] = el;
                        }}
                      >
                        {/* <strong>{content.title}</strong> */}
                          <span 
                            className={`marquee ${
                              (isOverflowStates[index] && !showCustomPlayButton && index === activeIndex) 
                                ? "animate" 
                                : ""
                            }`}
                            // style={{
                            //   // 디버깅을 위한 임시 스타일
                            //   border: isOverflowStates[index] ? '2px solid red' : '2px solid green',
                            //   display: 'block'
                            // }}
                          >
                            <span 
                              ref={(el) => {
                                titleRefs.current[index] = el;
                              }} 
                              className="marquee__inner"
                            >
                              <strong>{content.title}</strong>
                              {
                                isOverflowStates[index] && !showCustomPlayButton && index === activeIndex &&
                                <strong aria-hidden="true">{content.title}</strong>
                              }
                            </span>
                          </span>
                      </div>
                      <div className="thumbnail-shadow">
                        {/* <Image src={thumbnailBg} alt="thumbnailBg" /> */}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              {/* 커스텀 페이지네이션 */}
              <div className="custom-pagination">
                {Array.from({ length: originalDataCount }, (_, index) => {
                  const isActive = (activeIndex % originalDataCount) === index;
                  return (
                    <button
                      key={index}
                      className={`custom-pagination-bullet ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        if (swiperRef.current) {
                          setUserInteraction();
                          // 원본 데이터 기준으로 슬라이드 이동
                          const targetSlideIndex = index;
                          swiperRef.current.slideToLoop(targetSlideIndex);
                          setShouldAutoPlay(true);
                        }
                      }}
                    />
                  );
                })}
              </div>                
              </Swiper>
            </div>
          </div>
        </div>
          <div className="kv-background-wrapper">
            <div className="kv-background_sparkle">
              <div className="img" style={{ background: `url(${dummyImg.backgroundVideoSparkle1}) no-repeat center / cover` }} ></div>
              <div className="img" style={{ background: `url(${dummyImg.backgroundVideoSparkle2}) no-repeat center / cover` }} ></div>
              <div className="img" style={{ background: `url(${dummyImg.backgroundVideoSparkle3}) no-repeat center / cover` }} ></div>
            </div>
            <div className="kv-background_video-thumbnail">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: isResizing ? 1 : 0 }} // 리사이즈 중에는 애니메이션 건너뛰기
                  animate={{ opacity: 1 }}
                  exit={{ opacity: isResizing ? 1 : 0 }} // 리사이즈 중에는 애니메이션 건너뛰기
                  transition={{ 
                    duration: isResizing ? 0 : 0.8, // 리사이즈 중에는 애니메이션 지속시간 0
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    willChange: isResizing ? 'auto' : 'opacity', // 리사이즈 중에는 willChange 최적화
                    transform: 'translateZ(0)' // 하드웨어 가속 강제 활성화
                  }}
                >
                  <Image 
                    src={videoContents[activeIndex]?.imageUrl} 
                    alt={videoContents[activeIndex]?.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    priority={activeIndex === 0}
                  />
                  <div className="kv-background_video-thumbnail_gradient"/>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
      </div>
    </section>
  );
}