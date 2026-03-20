import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import Title from "./Title";
import PlayButton from "@/components/new-reborn/PlayButton";
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import "../styles/YsSection.scss"; 

const bgImages = [
  {
    backgroundVideoSparkle1: "/workout-v2/images/contents/bg_ys_shine-01.png",
    backgroundVideoSparkle2: "/workout-v2/images/contents/bg_ys_shine-02.png",
    backgroundVideoSparkle3: "/workout-v2/images/contents/bg_ys_shine-03.png",
    backgroundVideo01: "/workout-v2/images/contents/ys_kv_vid_thumb-01.png",
    backgroundVideo02: "/workout-v2/images/contents/ys_kv_vid_thumb-02.png",
    backgroundVideo03: "/workout-v2/images/contents/ys_kv_vid_thumb-03.png",
    backgroundVideo04: "/workout-v2/images/contents/ys_kv_vid_thumb-04.png",
    backgroundVideo05: "/workout-v2/images/contents/ys_kv_vid_thumb-05.png",
    thumbnailBg: "/workout-v2/images/contents/ys_kv_thumb_bg.png",
  }
]

const dummydataMain = [
  {
    id: 1,
    // imageUrl: backgroundVideo01.src,
    imageUrl: "/workout-v2/images/contents/ys_kv_vid_thumb-01.png",
    bgImageUrl: "/workout-v2/images/contents/ys_kv_vid_thumb-01.png",
    videoUrl: "lxw6oTqZ2H0",
    title: "title1",
    // autoColor: "rgb(255, 134, 134)",
    autoColor: "#000",
  },
  {
    id: 2,
    imageUrl: "/workout-v2/images/contents/ys_kv_vid_thumb-02.png",
    bgImageUrl: "/workout-v2/images/contents/ys_kv_vid_thumb-02.png",
    title: "title2",
    videoUrl: "hOJ76cZEt08",
    // autoColor: "rgb(255, 225, 134)",
    autoColor: "#000",
  },
  {
    id: 3,
    imageUrl: "/workout-v2/images/contents/ys_kv_vid_thumb-03.png",
    bgImageUrl: "/workout-v2/images/contents/ys_kv_vid_thumb-03.png",
    title: "title3",
    videoUrl: "fJ9rUzIMcZQ",
    // autoColor: "#AA85E9",
    autoColor: "#000",
  }
];

// YouTube Player 타입 정의
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  getVideoData: () => { video_id: string };
  unMute: () => void;
  mute: () => void;
}

export default function YsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const randomIndex = Math.floor(Math.random() * dummydataMain.length);
  const swiperRef = useRef<SwiperType>(null);
  const hasMultipleSlides = dummydataMain.length > 1;
  
  // Safari 감지
  const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // YouTube API 관련 상태
  const [isYouTubeAPIReady, setIsYouTubeAPIReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const iframeRef = useRef<HTMLDivElement>(null);
  const [showCustomPlayButton, setShowCustomPlayButton] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // YouTube API 로드 함수
  const loadYouTubeAPI = useCallback(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setIsYouTubeAPIReady(true);
      createPlayer();
    };

    // API가 이미 로드된 경우
    if (window.YT && window.YT.Player) {
      setIsYouTubeAPIReady(true);
      createPlayer();
    }
  }, []);

  // 플레이어 상태 변경 핸들러
  const onPlayerStateChange = useCallback((event: { data: number }) => {
    const playerState = event.data;
    
    if (playerState === window.YT.PlayerState.PLAYING) {
      // 영상 재생 시
      setIsVideoPlaying(true);
      setShowCustomPlayButton(false);
      setVideoEnded(false);
      // 자동 슬라이드 중지
      if (swiperRef.current) {
        swiperRef.current.autoplay.stop();
      }
    } else if (
      playerState === window.YT.PlayerState.PAUSED || 
      playerState === window.YT.PlayerState.CUED || 
      playerState === window.YT.PlayerState.ENDED ||
      playerState === window.YT.PlayerState.BUFFERING ||
      playerState === -1 // UNSTARTED
    ) {
      // 영상 일시정지, 정지, 종료 시
      setIsVideoPlaying(false);
      setShowCustomPlayButton(true);
      setVideoEnded(true);
      // 자동 슬라이드 재시작
      if (swiperRef.current) {
        swiperRef.current.autoplay.start();
      }
    }
  }, []);

  // 플레이어 정리 함수
  const safeCleanupPlayer = useCallback(() => {
    if (playerRef.current) {
      try {
        // YouTube API의 destroy 메서드만 사용
        playerRef.current.destroy();
      } catch (error) {
        // 플레이어 제거 중 에러 무시
        // 이 에러는 플레이어가 이미 파괴된 경우 발생할 수 있습니다.
      }
      // 플레이어 참조를 null로 설정
      playerRef.current = null;
    }
  }, []);

  // 플레이어 생성 함수 (한 번만 생성)
  const createPlayer = useCallback(() => {
    if (!iframeRef.current || playerRef.current) return;

    try {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: dummydataMain[0].videoUrl, // 첫 번째 비디오로 초기화
        playerVars: {
          loop: 1,
          controls: 0,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          autoplay: 0,
          modestbranding: 1,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
          showinfo: 0,
          mute: 1, // 기본적으로 음소거
        },
        events: {
          onStateChange: onPlayerStateChange,
          onReady: () => {
            setCurrentVideoId(dummydataMain[0].videoUrl);
          },
        },
      });
    } catch (error) {
      console.error('플레이어 생성 실패:', error);
    }
  }, [onPlayerStateChange]);

  // 비디오 교체 함수 (자동 재생 없음)
  const changeVideo = useCallback((videoId: string, shouldUnmute = false) => {
    if (playerRef.current && currentVideoId !== videoId) {
      try {
        // cueVideoById: 비디오를 준비만 하고 자동 재생하지 않음
        playerRef.current.cueVideoById(videoId);
        setCurrentVideoId(videoId);
        
        // 사용자 클릭 시 음소거 해제 (안드로이드 대응)
        if (shouldUnmute && playerRef.current.unMute) {
          playerRef.current.unMute();
          // 안드로이드에서 확실한 unmute를 위한 추가 시도
          setTimeout(() => {
            if (playerRef.current?.unMute) {
              playerRef.current.unMute();
            }
          }, 100);
        }
        
        // 슬라이드 변경 시 플레이 상태 초기화
        setShowCustomPlayButton(true);
        setIsVideoPlaying(false);
        setVideoEnded(false);
      } catch (error) {
        console.error('비디오 교체 실패:', error);
      }
    }
  }, [currentVideoId]);

  // YouTube API 로드
  useEffect(() => {
    loadYouTubeAPI();
  }, [loadYouTubeAPI]);

  // 플레이어 초기 생성 (한 번만)
  useEffect(() => {
    if (isYouTubeAPIReady) {
      createPlayer();
    }
  }, [isYouTubeAPIReady, createPlayer]);

  // activeIndex 변경 시 비디오만 교체
  useEffect(() => {
    if (playerRef.current && dummydataMain[activeIndex]) {
      const newVideoId = dummydataMain[activeIndex].videoUrl;
      changeVideo(newVideoId);
    }
  }, [activeIndex, changeVideo]);

  // Intersection Observer 설정
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          const intersectionRatio = entry.intersectionRatio;
          
          setIsInViewport(isIntersecting && intersectionRatio >= 0.2);
          
          // 섹션이 20% 이상 보이면 자동재생 시작 (사용자가 정지시키지 않은 경우)
          if (isIntersecting && intersectionRatio >= 0.2 && !isUserPaused) {
            if (playerRef.current) {
              try {
                // 스크롤 기반 자동재생 시 음소거 상태로 설정
                if (playerRef.current.mute) {
                  playerRef.current.mute();
                }
                
                playerRef.current.playVideo();
                setShowCustomPlayButton(false);
                setIsVideoPlaying(true);
                setVideoEnded(false);
                
                // 자동 슬라이드 정지
                if (swiperRef.current) {
                  swiperRef.current.autoplay.stop();
                }
              } catch (error) {
                console.log('자동재생 실패:', error);
              }
            }
          } else if (!isIntersecting || intersectionRatio < 0.2) {
            // 섹션이 화면 밖으로 나가면 정지
            if (playerRef.current && isVideoPlaying) {
              try {
                playerRef.current.pauseVideo();
                setShowCustomPlayButton(true);
                setIsVideoPlaying(false);
                setVideoEnded(true);
                
                // 자동 슬라이드 재시작
                if (swiperRef.current) {
                  swiperRef.current.autoplay.start();
                }
              } catch (error) {
                console.log('자동정지 실패:', error);
              }
            }
            // 섹션이 화면 밖으로 나가면 사용자 정지 상태 초기화
            setIsUserPaused(false);
          }
        });
      },
      {
        threshold: [0, 0.2, 0.5, 1], // 0%, 20%, 50%, 100% 지점에서 감지
        rootMargin: '0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVideoPlaying, isUserPaused]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      safeCleanupPlayer();
    };
  }, [safeCleanupPlayer]);

  const handleCustomPlayClick = () => {
    if (isVideoPlaying) {
      // 현재 재생 중이면 일시정지
      handleVideoEnd();
    } else {
      // 현재 정지 상태면 재생 시작
      // 현재 슬라이드의 비디오 ID로 교체 후 재생
      const currentVideoId = dummydataMain[activeIndex]?.videoUrl;
      if (currentVideoId) {
        changeVideo(currentVideoId, true); // 사용자 클릭 시 음소거 해제
      }
      
      if (playerRef.current?.playVideo) {
        try {
          // 사용자가 직접 클릭한 경우 음소거 해제 (안드로이드 대응)
          if (playerRef.current.unMute) {
            playerRef.current.unMute();
          }
          
          playerRef.current.playVideo();
          setShowCustomPlayButton(false);
          setIsVideoPlaying(true);
          setVideoEnded(false);
          setIsUserPaused(false); // 사용자 정지 상태 해제
          
          // 안드로이드에서 unmute 후 다시 mute되는 문제 해결을 위한 반복 시도
          const ensureUnmute = () => {
            if (playerRef.current?.unMute) {
              playerRef.current.unMute();
            }
          };
          
          // 여러 번 시도하여 확실한 unmute 보장
          setTimeout(ensureUnmute, 50);
          setTimeout(ensureUnmute, 150);
          setTimeout(ensureUnmute, 300);
          setTimeout(ensureUnmute, 500);
          
          // 자동 슬라이드 정지
          if (swiperRef.current) {
            swiperRef.current.autoplay.stop();
          }
        } catch (_error) {
          // 재생 실패 시 무시
          console.log('YouTube 재생 실패:', _error);
        }
      }
    }
  };

  const handleVideoEnd = () => {
    if (playerRef.current?.pauseVideo) {
      try {
        playerRef.current.pauseVideo();
      } catch (_error) {
        // 일시정지 실패 시 무시
      }
    }
    
    setShowCustomPlayButton(true);
    setIsVideoPlaying(false);
    setVideoEnded(true);
    setIsUserPaused(true); // 사용자가 정지시킨 것으로 표시

    // 자동 슬라이드 재시작
    if (swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  };

  const handlePaginationClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  return (
    <section className="ys-section" ref={sectionRef}>
      <div className="ys-section-container">
        <div className="ys-section_title">
          <Title 
            title="당신의 이야기" 
            desc="리본회생과 함께한 사람들의 이야기" 
            desc2={<>리본회생을 만나 변화한 삶을 만나보세요. <br />이제 당신의 이야기가 될 차례입니다.</>} 
            readmorebtn="자세히 보기" color="border-w"/>
        </div>
        <div className="ys-swiper-container" data-aos="fade-up">
          <div className="ys-swiper-wrapper">
            <Swiper
              modules={[EffectFade, Autoplay]}
              slidesPerView={1}
              spaceBetween={0}
              loop={hasMultipleSlides}
              initialSlide={hasMultipleSlides ? randomIndex : 0}
              autoplay={hasMultipleSlides ? {
                delay: isSafari ? 8000 : 5000, // Safari에서는 더 긴 딜레이
                disableOnInteraction: false,
              } : false}
              threshold={50}
              effect="fade"
              speed={1000}
              grabCursor={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper: SwiperType) => {
                const realIndex = swiper.realIndex;
                setActiveIndex(realIndex);
              }}
              className="ys-section-swiper"
            >
              {dummydataMain.map((item, index) => (
                <SwiperSlide key={item.id}>
                  <div 
                    className="item"
                    onClick={isVideoPlaying ? handleVideoEnd : undefined}
                    style={{
                      cursor: isVideoPlaying ? 'pointer' : 'default'
                    }}
                  >
                    <div className="main-video-overlay">
                      <div className={`custom-play-overlay ${isVideoPlaying ? 'playing' : 'visible'}`} onClick={handleCustomPlayClick}>
                        <div className="custom-play-bg">
                          <Image src={item.imageUrl} alt={item.title} width={700} height={500}/>
                        </div>
                        <div className="custom-play-button">
                          <PlayButton />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="main-video-area">
              <div className="main-video-wrapper">
                <div 
                  ref={iframeRef}
                  className="main-video"
                />
              </div>
            </div>
            <div
              className="ys-swiper_bg_shadow"
              style={{
                background: `${dummydataMain[activeIndex]?.autoColor ? dummydataMain[activeIndex]?.autoColor : 'rgba(0, 0, 0, 0.5)'}`,
              }}
              />
            <div className="ys-swiper_bg" />
          </div>
          <div className="ys-pagination">
            {hasMultipleSlides && (
              <div className="custom-pagination">
                {dummydataMain.map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
                    onClick={() => handlePaginationClick(index)}
                    aria-label={`슬라이드 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mo-only" data-aos="fade-in" data-aos-offset="10" data-aos-duration="300">
            <ReadMoreButton text="자세히 보기" direction="right" color="border-w"/>
          </div>
        </div>
        <div className="kv-background-wrapper" data-aos="fade-in">
          <div className={`kv-background_sparkle ${isSafari ? 'safari-optimized' : ''}`}>
            <div className="img" style={{ backgroundImage: `url(${bgImages[0].backgroundVideoSparkle1})` }}></div>
            <div className="img" style={{ backgroundImage: `url(${bgImages[0].backgroundVideoSparkle2})` }}></div>
            <div className="img" style={{ backgroundImage: `url(${bgImages[0].backgroundVideoSparkle3})` }}></div>
          </div>
          <div className="kv-background_video-thumbnail">
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
                <Image src={dummydataMain[activeIndex]?.imageUrl} alt={dummydataMain[activeIndex]?.title} width={1000} height={1000} />
                <div className="kv-background_video-thumbnail_gradient"/>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}