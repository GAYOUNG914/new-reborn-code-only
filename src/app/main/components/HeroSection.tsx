import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from 'hls.js';

import Title from "./Title";
import KvScrollMotion from "@/components/new-reborn/KvScrollMotion";
import "../styles/HeroSection.scss";

// import logoImg from "@/app/assets/images/contents/logo.svg";
import bgImg from "@/app/assets/images/contents/brand_kv_bg_pc.png";
import bgImgMo from "@/app/assets/images/contents/brand_kv_bg_mo.png";

export default function HeroSection() {

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);  
  const scrollMotionRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef<number>(0);
  const isVideoPlaying = useRef<boolean>(false);
  const lastVideoOpacity = useRef<number>(1);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const hasAutoScrolled = useRef<boolean>(false);
  const scrollAnimationId = useRef<number | null>(null);
  
  // HLS 관련 상태
  const [hls, setHls] = useState<Hls | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // HLS 스트림 URL (테스트용)
  const streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  // HLS 플레이어 초기화 함수
  const initializeHlsPlayer = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // console.log('🎥 Initializing HLS player...');
    
    // 기존 HLS 인스턴스 정리
    setHls(prevHls => {
      if (prevHls) {
        // console.log('🧹 Destroying existing HLS instance');
        prevHls.destroy();
      }
      return null;
    });
    
    // 비디오 요소 초기화
    video.removeAttribute('src');
    video.load();

    // 사파리는 HLS를 네이티브 지원하므로 직접 소스 설정
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      
      video.addEventListener('loadedmetadata', function() {
        // console.log('📹 Safari HLS - Video loaded');
        setIsVideoLoaded(true);
      });
      
      video.addEventListener('error', function(e) {
        console.error('사파리 네이티브 HLS 오류:', e);
      });
      
    } else if (Hls.isSupported()) {
      // HLS.js를 지원하는 브라우저 (Chrome, Firefox 등)
      const hlsInstance = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
        // console.log('📹 HLS.js - Manifest parsed, video loaded');
        setIsVideoLoaded(true);
      });
      
      hlsInstance.on(Hls.Events.ERROR, function(event, data) {
        console.error('HLS.js 오류:', data);
        
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // console.log('네트워크 오류 - 재시도 중...');
              hlsInstance.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              // console.log('미디어 오류 - 복구 시도 중...');
              hlsInstance.recoverMediaError();
              break;
            default:
              // console.log('복구할 수 없는 오류 - HLS 인스턴스 재시작');
              hlsInstance.destroy();
              // 잠시 후 재시도
              setTimeout(() => {
                const video = videoRef.current;
                if (video) {
                  video.removeAttribute('src');
                  video.load();
                  if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = streamUrl;
                  } else if (Hls.isSupported()) {
                    const newHlsInstance = new Hls({
                      debug: false,
                      enableWorker: true,
                      lowLatencyMode: true,
                    });
                    newHlsInstance.loadSource(streamUrl);
                    newHlsInstance.attachMedia(video);
                    setHls(newHlsInstance);
                  }
                }
              }, 1000);
              break;
          }
        }
      });
      
      // HLS 인스턴스 설정
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      setHls(hlsInstance);
      
    } else {
      console.error('이 브라우저는 HLS를 지원하지 않습니다.');
    }
  }, [streamUrl]);

  // GSAP 애니메이션을 생성하는 함수
  const createAnimation = useCallback(() => {
    // 기존 ScrollTrigger 정리
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === heroSectionRef.current) {
        trigger.kill();
      }
    });

    const currentIsMobile = window.innerWidth <= 767;
    const currentIsMicro = window.innerWidth <= 426;
    const $header = document.querySelector('.sc-hvigdm');    
    
    //gsap 타임라인
    gsap.registerPlugin(ScrollTrigger);

    // if(currentIsMobile){
      gsap.set($header, {
        opacity: 0,
      });
    // }

    gsap.set(titleRef.current, {
      y: 100,
      opacity: 0,
    });
    gsap.set(scrollMotionRef.current, {
      opacity: 0,
    });
    
    // 스크롤 위치 및 opacity 초기화
    lastScrollY.current = window.scrollY;
    lastVideoOpacity.current = 0;
    hasAutoScrolled.current = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          // heroSection이 화면에서 보이지 않는지 체크
          const heroRect = heroSectionRef.current?.getBoundingClientRect();
          const isHeroVisible = heroRect && heroRect.bottom > 0 && heroRect.top < window.innerHeight;
          
          // videoWrap의 현재 opacity 체크
          const currentOpacity = gsap.getProperty(videoWrapRef.current, "opacity") as number;
          
          if (videoRef.current) {
            // heroSection이 화면에서 보이지 않거나 opacity가 0일 때 비디오 일시정지
            if ((!isHeroVisible || currentOpacity === 0) && isVideoPlaying.current) {
              // console.log('⏸️ Video paused - Section not visible or opacity 0');
              videoRef.current.pause();
              // videoRef.current.currentTime = 0;
              isVideoPlaying.current = false;
            }
            
            // heroSection이 화면에 보이고 opacity가 0보다 클 때 비디오 재생
            if (isHeroVisible && currentOpacity > 0 && !isVideoPlaying.current) {
              console.log('▶️ Video playing - Section visible and opacity > 0', {
                isHeroVisible,
                currentOpacity,
                isVideoPlaying: isVideoPlaying.current,
                isVideoLoaded
              });
              videoRef.current.play().catch((error) => {
                if (error.name !== 'AbortError') {
                  console.error('Video play error:', error);
                }
              });
              isVideoPlaying.current = true;
            }
          }
          
          lastVideoOpacity.current = currentOpacity || 0;
        }
      },
    });

    if(currentIsMobile){
      const topValue = currentIsMicro ? 5 : 10; // 최종 top 값 (px)
      
      tl.to(logoRef.current, {
        top: `${topValue}px`,
        width: 99,
        height: 40,
        duration: 0.2,
      }, 0);

      tl.to($header, {
        opacity: 1,
        duration: 0.1,
      }, 0.2);
    }else{
      tl.to(logoRef.current, {
        opacity: 0,
        duration: 0.2,
      }, 0);

      tl.to($header, {
        opacity: 1,
        duration: 0.2,
      }, 0.2);
    }

    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.2,
    }, 0.2);

    tl.to(videoWrapRef.current, {
      opacity: 1,
      duration: 0.2,
      onStart: () => {
        // 비디오 재생 시작 (리사이즈 시에는 currentTime을 0으로 설정하지 않음)
        if (videoRef.current) {
          // console.log('🎬 GSAP onStart - Video play attempt', { isVideoLoaded });
          videoRef.current.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Video play error:', error);
            }
          });
          isVideoPlaying.current = true;
        }
      }
    }, 0.2);

    tl.to(scrollMotionRef.current, {
      opacity: 1,
      duration: 0.15,
    }, 0.25);

    tl.to({}, {
      duration: 0.6,
    }, 0.4);

    return tl;
  }, []);

  // 리사이즈 핸들러
  const handleResize = useCallback(() => {
    // console.log('📱 Resize event - cleaning up...');
    
    // GSAP 애니메이션으로 변경된 스타일을 초기화
    if (logoRef.current) {
      gsap.set(logoRef.current, { clearProps: "all" });
    }
    if (titleRef.current) {
      gsap.set(titleRef.current, { clearProps: "all" });
    }
    if (scrollMotionRef.current) {
      gsap.set(scrollMotionRef.current, { clearProps: "all" });
    }
    
    // 스크롤 위치 및 opacity 초기화
    lastScrollY.current = window.scrollY;
    lastVideoOpacity.current = 0;
    
    // GSAP 애니메이션 재생성 (createAnimation 내부에서 ScrollTrigger 정리됨)
    createAnimation();
  }, [createAnimation]);

  // 커스텀 스무스 스크롤 함수 (속도 조절 가능)
  const smoothScrollTo = useCallback((targetY: number, duration: number = 2000) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    // 기존 애니메이션 취소
    if (scrollAnimationId.current) {
      cancelAnimationFrame(scrollAnimationId.current);
    }

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeInOutCubic 이징 함수 사용 (부드러운 시작과 끝)
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const easedProgress = easeInOutCubic(progress);
      const currentY = startY + (distance * easedProgress);
      
      window.scrollTo(0, currentY);
      
      if (progress < 1) {
        scrollAnimationId.current = requestAnimationFrame(animateScroll);
      } else {
        scrollAnimationId.current = null;
      }
    };

    scrollAnimationId.current = requestAnimationFrame(animateScroll);
  }, []);

  // 자동 스크롤 체크 및 타이머 시작 함수
  const startAutoScrollTimer = useCallback(() => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const threshold = windowHeight * 0.5; // 50% 임계값
    
    // 스크롤 위치가 임계값보다 작고, 아직 자동 스크롤이 실행되지 않았을 때
    if (currentScrollY < threshold && !hasAutoScrolled.current) {
      // 기존 타이머 클리어
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // 5초 후 자동 스크롤 실행
      scrollTimer.current = setTimeout(() => {
        if (heroSectionRef.current) {
          const heroBottom = heroSectionRef.current.offsetTop + heroSectionRef.current.offsetHeight - window.innerHeight;
          
          // 커스텀 스무스 스크롤로 HeroSection 하단으로 이동 (3초 동안 천천히)
          smoothScrollTo(heroBottom, 2000);
          
          hasAutoScrolled.current = true;
        }
      }, 5000);
    } else if (currentScrollY >= threshold) {
      // 임계값을 넘어가면 타이머 클리어 및 자동 스크롤 플래그 리셋
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
      hasAutoScrolled.current = false;
    }
  }, [smoothScrollTo]);

  // 스크롤 이벤트 핸들러
  const handleAutoScroll = useCallback(() => {
    startAutoScrollTimer();
    lastScrollY.current = window.scrollY;
  }, [startAutoScrollTimer]);

  useEffect(() => {
    // HLS 플레이어 초기화 (컴포넌트 마운트 시에만)
    initializeHlsPlayer();
    
    // 초기 애니메이션 생성
    const tl = createAnimation();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 스크롤 이벤트 리스너 추가 (자동 스크롤 기능 포함)
    window.addEventListener('scroll', handleAutoScroll);

    // 페이지 로드 시 초기 자동스크롤 체크 (사용자 동작 없이도 작동하도록)
    startAutoScrollTimer();

    return () => {
      // 정리
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleAutoScroll);
      
      // 타이머 정리
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // 스크롤 애니메이션 정리
      if (scrollAnimationId.current) {
        cancelAnimationFrame(scrollAnimationId.current);
      }
      
      // HLS 인스턴스 정리
      setHls(prevHls => {
        if (prevHls) {
          prevHls.destroy();
        }
        return null;
      });
    };
  }, [initializeHlsPlayer, createAnimation, handleResize, handleAutoScroll, startAutoScrollTimer]);


  return (
    <section className="hero-section" ref={heroSectionRef}>
      <div className="hero-section_container" data-aos="fade-in">
        <div className="sticky">
          <div className="hero-section_logo" ref={logoRef}>
            <div className="slogan" data-aos="fade-in" data-aos-duration="1200">
              <Image className="pc-tablet-only" src={"/workout-v2/images/contents/slogan.png"} alt="새로운 시작이 필요한 순간" width={1217} height={162} />
              <Image className="mo-only" src={"/workout-v2/images/contents/slogan_m.png"} alt="새로운 시작이 필요한 순간" width={315} height={46} />
            </div>
            <svg data-aos="zoom-out" viewBox="0 0 82 32" xmlns="http://www.w3.org/2000/svg"><path d="M67.6879 18.5049C61.4676 18.5049 59.6055 19.6647 59.6055 21.711C59.6055 23.7573 61.4676 24.9171 67.6879 24.9171C73.9081 24.9171 75.7703 23.7573 75.7703 21.711C75.7703 19.6647 73.9081 18.5049 67.6879 18.5049ZM67.6879 22.3592C64.0859 22.3592 63.6463 22.1031 63.6463 21.711C63.6463 21.3188 64.0859 21.0627 67.6879 21.0627C71.2899 21.0627 71.7288 21.3188 71.7288 21.711C71.7288 22.1031 71.2892 22.3592 67.6879 22.3592Z"></path><path d="M63.8406 16.0569L64.2597 17.8391H67.7741L66.491 12.3817H64.1988L65.2263 8.97119H61.7645L58.9883 17.8391H62.5554L63.8406 16.0569Z"></path><path d="M71.3749 15.0253H72.2541V18.1803H75.5047V8.63037H72.2541V11.7854H71.3749V8.63037H68.125V17.8393H71.3749V15.0253Z"></path><path d="M28.5838 19.8008H24.543V21.8V22.2107L28.5838 24.4905H39.6537V21.8471H28.5838V19.8008Z"></path><path d="M34.1344 15.6223H39.6547V8.97119H35.7895V10.3865H28.4098V8.97119H24.544V15.6223H30.0929V16.3455H24.0312V18.9869H40.1961V16.3455H34.1344V15.6223ZM28.4098 13.4904V12.5183H35.7895V13.4904H28.4098Z"></path><path d="M47.7845 12.5186C43.7785 12.5186 42.0742 13.5589 42.0742 15.7592C42.0742 17.9594 43.7785 18.9991 47.7845 18.9991C51.7905 18.9991 53.4947 17.9587 53.4947 15.7592C53.4947 13.5596 51.7905 12.5186 47.7845 12.5186ZM47.7845 16.4413C46.1506 16.4413 45.588 16.2535 45.588 15.7592C45.588 15.2648 46.15 15.0771 47.7845 15.0771C49.419 15.0771 49.9809 15.2648 49.9809 15.7592C49.9809 16.2535 49.419 16.4413 47.7845 16.4413Z"></path><path d="M54.3711 24.4903H58.0312V9.13061L54.3711 7.08301V24.4903Z"></path><path d="M49.8053 21.8471V19.8008H45.7637V21.8471H42.0742V24.4905H49.8053H53.4947V21.8471H52.3675H49.8053Z"></path><path d="M52.3675 9.48284H49.8053V8.11865H45.7637V9.48284H42.0742V12.0433H53.4947V9.48284H52.3675Z"></path><path d="M6.23047 18.9348V14.9497L8.21638 16.0624L10.2023 17.1758L14.1741 19.4006L16.16 20.5139L20.1318 22.7394L22.1178 23.8527L18.5616 25.8446C18.3045 25.9886 17.9873 25.9886 17.7303 25.8446L14.1741 23.8527L12.1882 22.7394L8.21638 20.5139L6.64611 19.6335C6.38907 19.4895 6.23047 19.2227 6.23047 18.9341V18.9348Z"></path><path d="M6.23047 14.95L8.21638 13.838L10.2023 12.7246L12.1882 13.838L14.1741 14.95L12.1882 16.0628L10.2023 17.1761L8.21638 16.0628L6.23047 14.95Z"></path><path d="M6.23047 10.4989V6.04736H6.23115L8.21638 7.16008H8.21706L10.2023 8.27279L10.203 8.27346L12.1882 9.38617H12.1889L13.7585 10.266C14.0155 10.41 14.1741 10.6767 14.1741 10.9653V14.9511L12.1882 13.8384L10.2023 12.725L6.23047 10.5002V10.4989Z"></path><path d="M18.1406 6.04736L22.1179 8.27279V23.8528L18.1406 21.6267V6.04736Z"></path></svg>
          </div>
          <div className="hero-section_title" ref={titleRef}>
            <Title 
            title="브랜드 소개" 
            desc="다시 태어나는 이름, 리본회생"
            desc2={<>새로운 시작이 필요한 순간, <br /> 그 순간을 함께할 리본회생의 브랜드를 소개합니다. </>}
            color="black" readmorebtn="자세히 보기" main={true} />
          </div>
          <div className="background">
            {/* <div className="bg-video" ref={videoWrapRef}>
              <video muted loop playsInline ref={videoRef}>
                브라우저에서 비디오를 지원하지 않습니다.
              </video>
            </div> */}
            <div className="bg-image">
              <Image className="pc-tablet-only" src={bgImg} alt="bg" width={1920} height={1080} />
              <Image className="mo-only" src={bgImgMo} alt="bg" width={1920} height={1080} />
            </div>
          </div>
          <div className="scroll-down" ref={scrollMotionRef}>
            <KvScrollMotion />
          </div>
        </div>
      </div>
    </section>
  )
}