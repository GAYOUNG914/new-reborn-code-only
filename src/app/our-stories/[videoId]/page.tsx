"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState, use, useRef } from "react";
import useIsMobile from "@/utils/useIsMobile";
// 모든 비디오 데이터를 가져오기 위한 import
import { USketchResponseData } from "@/data/our-stories/USketch";
import { VlogWorkData } from "@/data/our-stories/VlogWork";
import { VlogCultureData } from "@/data/our-stories/VlogCulture";
import { getVideoId } from "@/utils/getVideoId";
import "./VideoPage.scss";


type Props = { params: Promise<{ videoId: string }> };

export default function VideoPage({ params }: Props) {
  const { videoId } = use(params);
  const router = useRouter();
  const isMobile = useIsMobile();
  const isAndroid = /Android/.test(navigator.userAgent);

  // videoId를 숫자로 변환 (인덱스 기반)
  const currentVideoIndex = parseInt(videoId) || 0;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prevVideo, setPrevVideo] = useState<any>(null);
  const [nextVideo, setNextVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false); // 초기값 false로 시작
  const [isMuted, setIsMuted] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // 재생구간조절 관련 state
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const [showSeekControls, setShowSeekControls] = useState(false);
  const prevVideoRef = useRef<HTMLDivElement>(null);
  const nextVideoRef = useRef<HTMLDivElement>(null);

  // 모든 비디오 데이터를 하나의 배열로 합치기
  const allVideos = [
    ...USketchResponseData.map(item => item.result.contents[0]),
    ...VlogWorkData.map(item => item.result.contents[0]),
    ...VlogCultureData.map(item => item.result.contents[0])
  ];

  // 현재 비디오 찾기 (인덱스 기반)
  const currentVideo = allVideos[currentVideoIndex];

  // // iOS 감지 및 Google Ads 에러 방지
  // useEffect(() => {
  //   const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
  //                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  //   setIsIOS(isIOSDevice);
  //   setNeedsUserInteraction(isIOSDevice);
    
  //   // Google Ads 에러 방지 (안드로이드에서 자주 발생)
  //   const handleGoogleAdsError = (event: ErrorEvent) => {
  //     if (event.message && (
  //       event.message.includes('googleads.g.doubleclick.net') ||
  //       event.message.includes('6f0e311579.js') ||
  //       event.message.includes('ERR_FAILED') ||
  //       event.message.includes('403')
  //     )) {
  //       console.warn('Google Ads 스크립트 로드 실패 (안드로이드에서 차단될 수 있음):', event.message);
  //       event.preventDefault(); // 에러 전파 방지
  //       return false;
  //     }
  //   };

  //   // 네트워크 에러 방지
  //   const handleNetworkError = (event: Event) => {
  //     const target = event.target as HTMLScriptElement;
  //     if (target && target.src && (
  //       target.src.includes('googleads.g.doubleclick.net') ||
  //       target.src.includes('doubleclick.net')
  //     )) {
  //       console.warn('Google Ads 네트워크 에러 방지:', target.src);
  //       event.preventDefault();
  //       return false;
  //     }
  //   };

  //   // 에러 이벤트 리스너 등록
  //   window.addEventListener('error', handleGoogleAdsError, true);
  //   window.addEventListener('unhandledrejection', (event) => {
  //     if (event.reason && event.reason.toString().includes('googleads')) {
  //       console.warn('Google Ads Promise 에러 방지:', event.reason);
  //       event.preventDefault();
  //     }
  //   });

  //   // 스크립트 로드 에러 방지
  //   document.addEventListener('error', handleNetworkError, true);

  //   // console.log('📱 Device Detection:', {
  //   //   userAgent: navigator.userAgent,
  //   //   platform: navigator.platform,
  //   //   maxTouchPoints: navigator.maxTouchPoints,
  //   //   isIOS: isIOSDevice,
  //   //   needsUserInteraction: isIOSDevice
  //   // });

  //   return () => {
  //     // 정리
  //     window.removeEventListener('error', handleGoogleAdsError, true);
  //     document.removeEventListener('error', handleNetworkError, true);
  //   };
  // }, []);

  useEffect(() => {
    setCurrentIndex(currentVideoIndex);
    
    // 이전/다음 비디오 설정
    const prev = currentVideoIndex > 0 ? allVideos[currentVideoIndex - 1] : null;
    const next = currentVideoIndex < allVideos.length - 1 ? allVideos[currentVideoIndex + 1] : null;
    
    setPrevVideo(prev);
    setNextVideo(next);
    
    // console.log('📹 Video Stack Debug:', {
    //   currentIndex: currentVideoIndex,
    //   totalVideos: allVideos.length,
    //   prevVideo: prev ? { id: prev.id, title: prev.title } : null,
    //   nextVideo: next ? { id: next.id, title: next.title } : null,
    // });
  }, [currentVideoIndex, allVideos]);

  // 드래그 상태 디버깅
  // useEffect(() => {
  //   console.log('🎬 Drag State Changed:', {
  //     isDragging,
  //     dragOffset,
  //     currentVideoIndex,
  //     prevVideo: prevVideo?.title,
  //     nextVideo: nextVideo?.title,
  //      prevTransform: `translateY(${dragOffset < 0 ? Math.max(0, -dragOffset * 0.3) : -100}%)`,
  //      nextTransform: `translateY(${dragOffset > 0 ? Math.min(0, -dragOffset * 0.3) : 100}%)`,
  //     prevOpacity: dragOffset < 0 ? Math.min(1, Math.abs(dragOffset) / 50) : 0,
  //     nextOpacity: dragOffset > 0 ? Math.min(1, dragOffset / 50) : 0
  //   });
  // }, [isDragging, dragOffset, currentVideoIndex, prevVideo, nextVideo]);

  // iOS 스크롤 방지
  useEffect(() => {
    const preventScroll = (e: Event) => {
      // e.preventDefault();
    };

    // 페이지 로드 시 스크롤 방지
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // 터치 이벤트 방지
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventScroll, { passive: false });

    return () => {
      // 정리
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchstart', preventScroll);
    };
  }, []);

  const handleClose = useCallback(() => {
    // 현재 URL에서 our-stories/ 뒤의 모든 내용을 제거
    const currentPath = window.location.pathname;
    if (currentPath.includes('/our-stories/')) {
      const basePath = currentPath.split('/our-stories/')[0] + '/our-stories';
      router.push(basePath);
    } else {
    router.back();
    }
    // console.log("handleClose");
  }, [router]);

  // 비디오 네비게이션 공통 함수
  const navigateToVideo = useCallback((direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    // 범위 체크 - 첫 영상이나 마지막 영상일 때는 제자리로 돌아오기
    if (newIndex < 0 || newIndex >= allVideos.length) {
      setIsDragging(false);
      // 즉시 시각적 피드백을 위한 강제 업데이트
      setTimeout(() => {
        setDragOffset(0);
      }, 0);
      return;
    }
    
    // console.log(`🎬 Navigating ${direction}:`, {
    //   from: currentIndex,
    //   to: newIndex,
    //   total: allVideos.length
    // });
    
    // 안드로이드에서는 DOM 준비를 위해 약간의 지연 추가
    const isAndroid = /Android/.test(navigator.userAgent);
    if (isAndroid) {
      // 성능 감지
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const isLowEndDevice = 
        connection?.effectiveType === 'slow-2g' || 
        connection?.effectiveType === '2g' ||
        (navigator as any).deviceMemory < 2 ||
        navigator.hardwareConcurrency < 4;
      
      const delay = isLowEndDevice ? 300 : 0; // 저사양 기기: 600ms, 고사양 기기: 지연 없음
      // console.log(`📱 [ANDROID DEBUG] DOM 준비를 위해 ${delay}ms 지연 후 네비게이션 (저사양: ${isLowEndDevice})`);
      
      setTimeout(() => {
        router.push(`/our-stories/${newIndex}`);
      }, delay);
    } else {
      router.push(`/our-stories/${newIndex}`);
    }

  }, [currentIndex, allVideos.length, router]);

  // 브라우저 뒤로가기 버튼 감지
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // console.log('🔙 Browser back button detected');
      const currentPath = window.location.pathname;
      
      // /our-stories/[videoId] 패턴에서 뒤로가기 시 /our-stories로 이동
      if (currentPath.includes('/our-stories/')) {
        event.preventDefault();
        const basePath = currentPath.split('/our-stories/')[0] + '/our-stories';
        
        // 현재 상태를 히스토리에 추가하여 뒤로가기가 제대로 작동하도록
        window.history.pushState(null, '', basePath);
        router.push(basePath);
        
        // console.log('🔙 Redirected to:', basePath);
      }
    };

    // popstate 이벤트 리스너 등록
    window.addEventListener('popstate', handlePopState);

    // 현재 페이지를 히스토리에 추가 (뒤로가기 감지를 위해)
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  // iOS 자동재생을 위한 사용자 상호작용 처리
  const handleUserInteraction = useCallback(() => {
    if (needsUserInteraction && !hasUserInteracted && player) {
      // console.log('🎬 iOS User Interaction - Starting autoplay');
      setHasUserInteracted(true);
      setNeedsUserInteraction(false);
      
      // iOS에서 자동재생 시작
      try {
        player.playVideo();
        setIsPlaying(true);
        // console.log('✅ iOS autoplay started successfully');
      } catch (error) {
        // console.error('❌ iOS autoplay failed:', error);
      }
    }
  }, [needsUserInteraction, hasUserInteracted, player]);

  // YouTube 플레이어 제어 함수들
  const togglePlayPause = useCallback(() => {
    // iOS 자동재생을 위한 사용자 상호작용 처리
    handleUserInteraction();
    
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
        // console.log('⏸️ Video paused');
      } else {
        player.playVideo();
        setIsPlaying(true);
        // console.log('▶️ Video playing');
      }
    }
  }, [player, isPlaying, handleUserInteraction]);

  const toggleMute = useCallback(() => {
    if (player) {
      if (isMuted) {
        player.unMute();
        setIsMuted(false);
        // console.log('🔊 Video unmuted');
      } else {
        player.mute();
        setIsMuted(true);
        // console.log('🔇 Video muted');
      }
    }
  }, [player, isMuted]);

  // 재생구간조절 관련 함수들
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const seekToTime = useCallback((time: number) => {
    if (player) {
      player.seekTo(time, true);
      setCurrentTime(time);
      // console.log(`⏰ Seeked to ${formatTime(time)}`);
    }
  }, [player, formatTime]);

  const toggleSeekControls = useCallback(() => {
    setShowSeekControls(prev => !prev);
    // console.log('🎛️ Seek controls toggled');
  }, []);

  const toggleLoopMode = useCallback(() => {
    setIsLoopMode(prev => !prev);
    // console.log('🔄 Loop mode toggled');
  }, []);

  const resetSeekRange = useCallback(() => {
    setStartTime(0);
    setEndTime(videoDuration);
    // console.log('🔄 Seek range reset');
  }, [videoDuration]);

  // 위아래 스와이프 핸들러 (iOS 최적화)
  const handleTouchStart = (e: React.TouchEvent) => {
    // iOS에서 기본 스크롤 방지
    // e.preventDefault();
    e.stopPropagation();
    
    const touchX = e.targetTouches[0].clientX;
    const touchY = e.targetTouches[0].clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const edgeThreshold = 50; // 좌우 50px 영역에서만 스와이프 허용
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // 안드로이드 디버깅
    if (isAndroid) {
      console.log(`📱 [ANDROID DEBUG] 터치 시작:`, {
        touchX,
        touchY,
        screenWidth,
        screenHeight,
        edgeThreshold,
        isInEdgeArea: touchX <= edgeThreshold || touchX >= screenWidth - edgeThreshold
      });
    }
    
    // 좌우 가장자리가 아니면 스와이프 비활성화
    if (touchX > edgeThreshold && touchX < screenWidth - edgeThreshold) {
      // if (isAndroid) {
      //   console.log(`📱 [ANDROID DEBUG] 터치 차단 - 가장자리 영역 아님`);
      // }
      return;
    }
    
    // if (isAndroid) {
    //   console.log(`📱 [ANDROID DEBUG] 터치 허용 - 가장자리 영역에서 시작`);
    // }
    
    setTouchEnd(null);
    setTouchStart(touchY);
    setIsDragging(true);
    // setDragOffset(0);
    // console.log('🎬 Dragging started');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return; // 스와이프가 시작되지 않았으면 무시
    
    // e.preventDefault();
    e.stopPropagation();
    const currentY = e.targetTouches[0].clientY;
    setTouchEnd(currentY);
    
    // 드래그 오프셋 계산 (시각적 피드백)
    const rawDifference = touchStart - currentY;
    const isAndroid = /Android/.test(navigator.userAgent);
    // 안드로이드에서는 더 높은 감도 적용
    const sensitivity = isAndroid ? 0.4 : 0.2;
    const offset = rawDifference * sensitivity; 
    
    // 안드로이드에서 더 엄격한 클램핑 적용
    let clampedOffset;
    
    if (isAndroid) {
      // 안드로이드에서는 더 보수적인 클램핑
      clampedOffset = Math.max(-120, Math.min(150, offset));
      
      // 디버깅: 큰 값이 나오는 경우 로깅
      // if (Math.abs(offset) > 150) {
      //   console.log(`📱 [ANDROID DEBUG] 큰 터치 드래그 감지:`, {
      //     touchStart,
      //     currentY,
      //     rawDifference,
      //     offset,
      //     clampedOffset,
      //     isClamped: offset !== clampedOffset,
      //     screenHeight: window.innerHeight
      //   });
      // }
    } else {
      // 다른 플랫폼은 기존 클램핑
      clampedOffset = Math.max(-150, Math.min(200, offset));
    }
    
    setDragOffset(clampedOffset);
    
    // console.log('🔄 Touch Move:', { 
    //   touchStart, 
    //   currentY, 
    //   offset, 
    //   clampedOffset,
    //   dragOffset: clampedOffset 
    // });
  };

  const handleTouchEnd = () => {
    if (!touchStart) return;
    
    // touchEnd가 null인 경우를 대비한 안전장치
    const endY = touchEnd !== null ? touchEnd : touchStart;
    const rawDistance = touchStart - endY;
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // 안드로이드에서는 클램핑된 값 계산, 다른 플랫폼은 원시 값 사용
    let distance;
    if (isAndroid) {
      // 안드로이드에서는 더 높은 감도 적용
      const sensitivity = 0.4;
      const offset = rawDistance * sensitivity;
      distance = Math.max(-120, Math.min(150, offset));
    } else {
      distance = rawDistance;
    }
    
    const isUpSwipe = distance > 50; // 위로 스와이프 (다음 비디오)
    const isDownSwipe = distance < -50; // 아래로 스와이프 (이전 비디오)

    // 안드로이드 디버깅
    // if (isAndroid) {
    //   console.log(`📱 [ANDROID DEBUG] 터치 종료:`, {
    //     touchStart,
    //     touchEnd,
    //     endY,
    //     rawDistance,
    //     calculatedOffset: rawDistance * 0.4,
    //     distance,
    //     isUpSwipe,
    //     isDownSwipe,
    //     currentDragOffset: dragOffset,
    //     threshold: 50
    //   });
    // } else {
    //   console.log(`기본 플랫폼 distance:`, distance);
    // }

    // 드래그 상태 초기화
    setIsDragging(false);
    
    if (isUpSwipe) {
      // 다음 비디오로
      navigateToVideo('next');
      // console.log('next')
    } else if (isDownSwipe) {
      // 이전 비디오로
      navigateToVideo('prev');
      // console.log('prev22')
    } else {
      // 충분하지 않은 드래그는 원래 위치로 복원
      setDragOffset(0);
      // 강제 리렌더링을 위한 추가 상태 업데이트
      setIsDragging(false);
      // 즉시 시각적 피드백을 위한 강제 업데이트
      setTimeout(() => {
        setDragOffset(0);
      }, 0);
      // console.log('실패')
      // console.log('🎬 Insignificant drag - reset to 0');
    }
  };

  // 마우스 드래그 핸들러 (데스크톱용)
  const handleMouseDown = (e: React.MouseEvent) => {
    // console.log('🖱️ Mouse Down:', { clientY: e.clientY });
    // e.preventDefault();
    e.stopPropagation();
    setIsMouseDown(true);
    setMouseEnd(null);
    setMouseStart(e.clientY);
    setIsDragging(true);
    // setDragOffset(0);
    // console.log('🎬 Mouse dragging started');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStart === null) return;
    // e.preventDefault();
    e.stopPropagation();
    const currentY = e.clientY;
    setMouseEnd(currentY);
    
    // 드래그 오프셋 계산 (시각적 피드백)
    const offset = (mouseStart - currentY) * 0.3; // 100% 반응도로 증가
    const clampedOffset = Math.max(-300, Math.min(300, offset)); // -300px ~ 300px로 범위 확대
    setDragOffset(clampedOffset);
    
    // console.log('🔄 Mouse Move:', { 
    //   mouseStart, 
    //   currentY, 
    //   offset, 
    //   clampedOffset,
    //   dragOffset: clampedOffset,
    //    prevTransform: `translateY(${clampedOffset < 0 ? Math.max(0, -clampedOffset * 0.3) : -100}%)`,
    //    nextTransform: `translateY(${clampedOffset > 0 ? Math.min(0, -clampedOffset * 0.3) : 100}%)`
    // });
  };

  const handleMouseUp = () => {
    if (!isMouseDown || !mouseStart) {
      // console.log('🖱️ Mouse Up - no valid drag');
      setIsMouseDown(false);
      setIsDragging(false);
      // setDragOffset(0);
      return;
    }
    
    const distance = mouseEnd !== null ? mouseStart - mouseEnd : 0;
    const isUpSwipe = distance > 50; // 위로 드래그 (다음 비디오)
    const isDownSwipe = distance < -50; // 아래로 드래그 (이전 비디오)
    const isClick = Math.abs(distance) < 10; // 10px 미만 움직임은 클릭으로 간주

    // console.log('🏁 Mouse Up:', { 
    //   distance, 
    //   isUpSwipe, 
    //   isDownSwipe,
    //   isClick,
    //   currentIndex,
    //   allVideosLength: allVideos.length 
    // });

    // console.log(distance)

    // 드래그 상태 초기화
    setIsDragging(false);
    
    if (isUpSwipe) {
      // 다음 비디오로
      navigateToVideo('next');
      // console.log('next')
    } else if (isDownSwipe) {
      // 이전 비디오로
      navigateToVideo('prev');
      // console.log('prev')
    } else{
      // 충분하지 않은 드래그는 원래 위치로 복원
      setDragOffset(0);
      // 강제 리렌더링을 위한 추가 상태 업데이트
      setIsDragging(false);
      // 즉시 시각적 피드백을 위한 강제 업데이트
      setTimeout(() => {
        setDragOffset(0);
      }, 0);
    }
    setIsMouseDown(false);
    setMouseStart(null);
    setMouseEnd(null);
  };

  // ESC 키로 닫기 및 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // e.preventDefault();
        e.stopPropagation();
        handleClose();
      } else if (e.key === "ArrowUp") {
        // 위 화살표: 이전 비디오
        // e.preventDefault();
        e.stopPropagation();
        navigateToVideo('prev');
      } else if (e.key === "ArrowDown") {
        // 아래 화살표: 다음 비디오
        // e.preventDefault();
        e.stopPropagation();
        navigateToVideo('next');
      }
    };
    
    // 이벤트 리스너를 capture 모드로 추가하여 우선순위 높이기
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handleClose, currentIndex, allVideos, router]);

  // 유튜브 API 로드 + 플레이어 초기화 (최초 1회만)
  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      initPlayer();
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    function initPlayer() {
      const YT = (window as any).YT;
      if (!YT || player) return; // 이미 플레이어가 있으면 생성하지 않음

      // iOS 감지 (플레이어 생성 시점에 직접 감지)
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // console.log('🎬 Creating player - iOS detected:', isIOSDevice);

      // 첫 번째 비디오로 플레이어 생성
      const firstVideoId = getVideoId(allVideos[currentVideoIndex]?.videoUrl || '');

      const playerInstance = new YT.Player("yt-player", {
        videoId: firstVideoId,
        playerVars: {
          autoplay: 1,
          mute: isIOSDevice ? 1 : 0, // iOS는 음소거 상태로 자동재생, 다른 기기는 소리 켜짐
          controls: 1, // 기본 컨트롤 표시
          modestbranding: 1, // 유튜브 로고 최소화
          playsinline: 1,
          disablekb: 1, // 키보드 단축키 비활성화
          // fs: 0, // 전체화면 버튼 비활성화
          rel: 0, // 관련 영상 비활성화
          iv_load_policy: 3, // 주석 비활성화
          cc_load_policy: 0, // 자막 비활성화
          autohide: 0, // 컨트롤 항상 표시
          // showinfo: 0, // 동영상 정보 숨김 -> 사용정지됨
          enablejsapi: 1, // JavaScript API 활성화
        },
        events: {
          onReady: (event: any) => {
            setIsLoading(false);
            setPlayer(event.target);
            
            // 비디오 길이 가져오기
            const duration = event.target.getDuration();
            setVideoDuration(duration);
            setEndTime(duration);
            // console.log(`🎬 Video duration: ${formatTime(duration)}`);
            
            // iOS는 음소거 상태로 자동재생, 다른 기기는 소리와 함께 자동재생
            if (isIOSDevice) {
              // console.log('🎬 iOS detected - Starting muted autoplay');
              try {
                event.target.mute(); // iOS에서 음소거 확실히 설정
                setTimeout(() => {
                  event.target.playVideo(); // 약간의 지연 후 자동재생 시작
                  // console.log('▶️ Play command sent for iOS');
                }, 100);
                setIsPlaying(true);
                setIsMuted(true);
                setNeedsUserInteraction(false); // 자동재생 성공하므로 프롬프트 불필요
                // console.log('✅ YouTube player ready - Muted autoplay started (iOS)');
              } catch (error) {
                // console.error('❌ iOS autoplay failed:', error);
                setIsPlaying(false);
                setNeedsUserInteraction(true); // 실패 시 사용자 상호작용 필요
              }
            } else {
              // console.log('🎬 Non-iOS detected - Starting normal autoplay');
              try {
                event.target.playVideo();
                setIsPlaying(true);
                setIsMuted(false);
                // console.log('✅ YouTube player ready - Autoplay started (non-iOS)');
              } catch (error) {
                // console.error('❌ Autoplay failed:', error);
                setIsPlaying(false);
              }
            }
          },
          onStateChange: (event: any) => {
            // YouTube 플레이어 상태 변화 감지
            const state = event.data;
            if (state === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (state === YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (state === YT.PlayerState.ENDED) {
              // 영상 종료 시 다음 영상으로 자동 전환
              // URL에서 직접 현재 videoId를 가져와서 사용
              const currentVideoId = parseInt(videoId) || 0;
              // console.log('🏁 Video ended - moving to next video', {
              //   currentVideoId,
              //   totalVideos: allVideos.length,
              //   hasNext: currentVideoId < allVideos.length - 1
              // });
              
              // 다음 영상이 있으면 자동으로 넘어가기
              if (currentVideoId < allVideos.length - 1) {
                // console.log('⬆️ Auto-advancing to next video:', currentVideoId + 1);
                router.push(`/our-stories/${currentVideoId + 1}`);
              } else {
                // 마지막 영상이면 처음 영상으로 돌아가기
                // console.log('🔄 Last video - returning to first video');
                router.push(`/our-stories/0`);
              }
            }
            // console.log('🎬 Player state changed:', state);
          },
          onError: () => {
            setHasError(true);
            setIsLoading(false);
          },
        },
      });
    }
  }, []); // 의존성 배열 비움 - 최초 1회만 실행

  // videoId 변경 시 비디오만 교체 (플레이어 재생성 없음)
  useEffect(() => {
    if (!player || !currentVideo) return;

    const newVideoId = getVideoId(currentVideo.videoUrl);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // console.log(`📱 [ANDROID DEBUG] 비디오 변경 시작 - ${newVideoId} (Android: ${isAndroid})`);

    // 성능 및 네트워크 상태 감지
    const detectPerformance = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const memory = (performance as any).memory;
      
      const performanceInfo = {
        connectionType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 'unknown',
        rtt: connection?.rtt || 'unknown',
        memoryUsed: memory ? `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB` : 'unknown',
        memoryLimit: memory ? `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB` : 'unknown',
        deviceMemory: (navigator as any).deviceMemory || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
      };
      
      // console.log(`📱 [PERFORMANCE DEBUG] 기기 성능 정보:`, performanceInfo);
      
      // 저사양 기기 판단
      const isLowEndDevice = 
        connection?.effectiveType === 'slow-2g' || 
        connection?.effectiveType === '2g' ||
        (navigator as any).deviceMemory < 2 ||
        navigator.hardwareConcurrency < 4;
      
      if (isLowEndDevice) {
        console.warn(`📱 [PERFORMANCE DEBUG] 저사양 기기 감지 - 최적화 모드 적용`);
        return { isLowEnd: true, performanceInfo };
      }
      
      return { isLowEnd: false, performanceInfo };
    };

    const { isLowEnd, performanceInfo } = detectPerformance();

    // DOM 요소가 존재하는지 확인 (재시도 로직 포함)
    const checkDOMAndLoad = () => {
      const playerElement = document.getElementById("yt-player");
      if (!playerElement) {
        console.warn(`📱 [ANDROID DEBUG] yt-player DOM 요소를 찾을 수 없음 - 재시도 중...`);
        
        // DOM 요소가 없으면 여러 번 재시도 (저사양 기기에서는 더 많은 재시도)
        let retryCount = 0;
        const maxRetries = isLowEnd ? 8 : 3; // 저사양 기기: 8회, 고사양 기기: 3회
        const retryInterval = isLowEnd ? 300 : 100; // 저사양 기기: 500ms, 고사양 기기: 100ms
        
        const retryDOMCheck = () => {
          retryCount++;
          const retryElement = document.getElementById("yt-player");
          
          // console.log(`📱 [ANDROID DEBUG] DOM 요소 재시도 ${retryCount}/${maxRetries}:`, {
          //   found: !!retryElement,
          //   elementId: retryElement?.id
          // });
          
          if (retryElement) {
            // console.log(`📱 [ANDROID DEBUG] yt-player DOM 요소 재시도 성공 - 비디오 로드 계속`);
            loadVideo();
            return;
          }
          
          if (retryCount >= maxRetries) {
            // console.error(`📱 [ANDROID DEBUG] yt-player DOM 요소 재시도 최종 실패 (${maxRetries}회) - 비디오 로드 중단`);
            setHasError(true);
            setIsLoading(false);
            return;
          }
          
          // 다음 재시도 예약
          setTimeout(retryDOMCheck, retryInterval);
        };
        
        setTimeout(retryDOMCheck, retryInterval);
        return;
      }
      
      loadVideo();
    };

    const loadVideo = () => {
      // 안드로이드에서는 플레이어 상태 확인 후 안전하게 로드
      if (isAndroid) {
      try {
        // 플레이어가 DOM에 연결되어 있는지 확인 (재시도 로직 추가)
        const playerElement = document.getElementById("yt-player");
        // console.log(`📱 [ANDROID DEBUG] DOM 요소 확인:`, {
        //   playerElement: !!playerElement,
        //   playerElementId: playerElement?.id,
        //   playerExists: !!player,
        //   currentVideoId: newVideoId
        // });
        
        if (!playerElement) {
          // console.error(`📱 [ANDROID DEBUG] yt-player DOM 요소를 찾을 수 없음 - 비디오 로드 중단`);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // 플레이어 상태 확인
        let playerState;
        try {
          playerState = player.getPlayerState();
          // console.log(`📱 [ANDROID DEBUG] 현재 플레이어 상태: ${playerState}`);
        } catch (error) {
          // console.error(`📱 [ANDROID DEBUG] 플레이어 상태 확인 실패:`, error);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // 플레이어가 준비되지 않은 경우 잠시 대기
        if (playerState === -1) { // UNSTARTED
          // console.log(`📱 [ANDROID DEBUG] 플레이어가 준비되지 않음 - 재시도`);
          setTimeout(() => {
            try {
              player.loadVideoById({
                videoId: newVideoId,
                startSeconds: 0,
              });
              // console.log(`📱 [ANDROID DEBUG] loadVideoById 재시도 성공`);
            } catch (error) {
              console.error(`📱 [ANDROID DEBUG] loadVideoById 재시도 실패:`, error);
              setHasError(true);
              setIsLoading(false);
            }
          }, 500);
          return;
        }

        // 정상적인 비디오 로드
        try {
          player.loadVideoById({
            videoId: newVideoId,
            startSeconds: 0,
          });
          // console.log(`📱 [ANDROID DEBUG] loadVideoById 호출 완료`);
        } catch (error) {
          // console.error(`📱 [ANDROID DEBUG] loadVideoById 호출 실패:`, error);
          setHasError(true);
          setIsLoading(false);
          return;
        }
        
      } catch (error) {
        // console.error(`📱 [ANDROID DEBUG] 비디오 로드 실패:`, error);
        setHasError(true);
        setIsLoading(false);
        return;
      }
    } else {
      // 다른 플랫폼은 기존 로직
      player.loadVideoById({
        videoId: newVideoId,
        startSeconds: 0,
      });
    }

    // 비디오 정보 업데이트
    const checkDuration = setInterval(() => {
      try {
        const duration = player.getDuration();
        if (duration > 0) {
          const isAndroid = /Android/.test(navigator.userAgent);
          // if (isAndroid) {
          //   console.log(`📱 [ANDROID DEBUG] 새 비디오 로드 완료 - ${newVideoId}`);
          // }
          
          setVideoDuration(duration);
          setEndTime(duration);
          setCurrentTime(0);
          clearInterval(checkDuration);
        }
      } catch (error) {
        console.error(`📱 [ANDROID DEBUG] 비디오 정보 업데이트 실패:`, error);
        clearInterval(checkDuration);
      }
    }, 100);

    return () => clearInterval(checkDuration);
    };

    // DOM 확인 및 비디오 로드 시작
    checkDOMAndLoad();
  }, [currentVideoIndex, player]);

  // 현재 시간 추적 및 구간 반복 재생
  useEffect(() => {
    if (!player || !isPlaying) return;

    const interval = setInterval(() => {
      try {
        // 플레이어가 유효한지 확인
        if (!player || typeof player.getCurrentTime !== 'function') {
          console.warn('📱 [ANDROID DEBUG] 플레이어가 유효하지 않음 - 인터벌 중단');
          clearInterval(interval);
          return;
        }
        
        const current = player.getCurrentTime();
        setCurrentTime(current);
      } catch (error) {
        console.error('📱 [ANDROID DEBUG] getCurrentTime 에러:', error);
        clearInterval(interval);
        return;
      }

      // console.log(currentTime) -> undefined

      // 구간 반복 재생 체크
      // if (isLoopMode && endTime > 0 && current >= endTime) {
      //   console.log(`🔄 Loop: Reached end time ${formatTime(endTime)}, seeking to start ${formatTime(startTime)}`);
      //   seekToTime(startTime);
      // }
    }, 100); // 100ms마다 체크

    return () => clearInterval(interval);
  }, [player, isPlaying, isLoopMode, startTime, endTime, seekToTime, formatTime]);

  
  // 로딩 타임아웃: 10초 안에 로드 안 되면 에러 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div
      className={`video-fullscreen ${isDragging ? 'dragging' : ''}`}
      style={{
        backgroundColor: isDragging ? `rgba(0, 0, 0, ${0.8 + Math.abs(dragOffset) * 0.002})` : "black",
      }}
      // 포스트 방식: 드래그는 드래그 레이어에서만 처리, 메인 컨테이너는 iOS 스크롤 방지만
      onTouchMove={(e) => {
        // iOS 스크롤 방지만 처리
        if (isDragging) {
          // e.preventDefault();
        }
      }}
    >

      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "40vh",
          background: "linear-gradient(to bottom, rgba(0,0,0,1) 10%, rgba(0,0,0,0))",
          zIndex: 10001,
        }}
      /> */}

      <div 
        className="close-button-container"
        onTouchStart={(e) => {
          // console.log('🔥 Button Area Touch Start - Event fired!');
          e.stopPropagation(); // 드래그 레이어로 이벤트 전파 방지
          // handleTouchStart(e); // 버튼 영역에서는 드래그 비활성화
        }}
        onMouseDown={(e) => {
          // console.log('🔥 Button Area Mouse Down - Event fired!');
          e.stopPropagation(); // 드래그 레이어로 이벤트 전파 방지
          // handleMouseDown(e); // 버튼 영역에서는 드래그 비활성화
        }}
      >
        <button
          className="close-button"
          onClick={handleClose}
          onTouchStart={(e) => {
            // console.log('🔥 Close Button Touch Start');
            e.stopPropagation(); // 드래그 레이어로 이벤트 전파 방지
          }}
          onTouchEnd={(e) => {
            // console.log('🔥 Close Button Touch End');
            e.stopPropagation();
            handleClose(); // 터치 종료 시 닫기 실행
          }}
        >
          ←
        </button>
      </div>

      {/* 재생구간조절 슬라이더 */}
      { videoDuration > 0 && (
        <div className="seek-slider"
        onTouchStart={(e) => {
          // console.log('🎛️ Seek Slider Touch Start');
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          // console.log('🎛️ Seek Slider Mouse Down');
          e.stopPropagation();
        }}
        >
          {/* 시간 표시 */}
          <div className="time-display">
            <span>현재: {formatTime(Math.round(currentTime))}</span>

            <div className="control-buttons"
            onTouchStart={(e) => {
              // console.log('🔥 Control Area Touch Start - Event fired!');
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // console.log('🔥 Control Area Mouse Down - Event fired!');
              e.stopPropagation();
            }}
            >
              {/* 재생/일시정지 버튼 */}
              <button
                className="control-button"
                onClick={togglePlayPause}
                onTouchStart={(e) => {
                  // console.log('🎮 Play/Pause Button Touch Start');
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => {
                  // console.log('🎮 Play/Pause Button Touch End');
                  e.stopPropagation();
                  togglePlayPause();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
                }}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>

              {/* 음소거 토글 버튼 */}
              <button
                className="control-button"
                onClick={toggleMute}
                onTouchStart={(e) => {
                  // console.log('🔊 Mute Button Touch Start');
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => {
                  // console.log('🔊 Mute Button Touch End');
                  e.stopPropagation();
                  toggleMute();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
                }}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div> 

            {/* <span>종료: {formatTime(Math.round(videoDuration) - Math.round(currentTime))}</span> */}
            <span>종료: {formatTime(Math.round(endTime))}</span>

          </div>


          {/* 메인 슬라이더 */}
          <div className="main-slider"
          onClick={(e) => {
            // console.log('🎯 Slider Click - Desktop');
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const newTime = percentage * videoDuration;
            seekToTime(newTime);
          }}
          onTouchStart={(e) => {
            // console.log('🎯 Slider Touch Start - Mobile');
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            // console.log('🎯 Slider Touch End - Mobile');
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const touchX = e.changedTouches[0].clientX - rect.left;
            const percentage = touchX / rect.width;
            const newTime = percentage * videoDuration;
            seekToTime(newTime);
          }}
          >
            {/* 슬라이더 배경 */}
            <div className="slider-background" />
            
            {/* 진행 바 */}
            <div 
              className="progress-bar"
              style={{
                width: `${(currentTime / videoDuration) * 100}%`,
              }}
            />
            
            {/* 시작점 핸들 */}
            <div
              className="handle start-handle"
              style={{
                left: `${(startTime / videoDuration) * 100}%`,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const startDrag = (e: MouseEvent) => {
                  const rect = (e.target as HTMLElement).parentElement!.getBoundingClientRect();
                  const newX = e.clientX - rect.left;
                  const percentage = Math.max(0, Math.min(1, newX / rect.width));
                  const newTime = percentage * videoDuration;
                  setStartTime(newTime);
                };
                const stopDrag = () => {
                  document.removeEventListener('mousemove', startDrag);
                  document.removeEventListener('mouseup', stopDrag);
                };
                document.addEventListener('mousemove', startDrag);
                document.addEventListener('mouseup', stopDrag);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                // e.preventDefault();
                const startTouch = (e: TouchEvent) => {
                  const rect = (e.target as HTMLElement).parentElement!.getBoundingClientRect();
                  const newX = e.touches[0].clientX - rect.left;
                  const percentage = Math.max(0, Math.min(1, newX / rect.width));
                  const newTime = percentage * videoDuration;
                  setStartTime(newTime);
                };
                const stopTouch = () => {
                  document.removeEventListener('touchmove', startTouch);
                  document.removeEventListener('touchend', stopTouch);
                };
                document.addEventListener('touchmove', startTouch, { passive: false });
                document.addEventListener('touchend', stopTouch);
              }}
            />
            
            {/* 종료점 핸들 */}
            <div
              className="handle end-handle"
              style={{
                left: `${(endTime / videoDuration) * 100}%`,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const startDrag = (e: MouseEvent) => {
                  const rect = (e.target as HTMLElement).parentElement!.getBoundingClientRect();
                  const newX = e.clientX - rect.left;
                  const percentage = Math.max(0, Math.min(1, newX / rect.width));
                  const newTime = percentage * videoDuration;
                  setEndTime(newTime);
                };
                const stopDrag = () => {
                  document.removeEventListener('mousemove', startDrag);
                  document.removeEventListener('mouseup', stopDrag);
                };
                document.addEventListener('mousemove', startDrag);
                document.addEventListener('mouseup', stopDrag);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                // e.preventDefault();
                const startTouch = (e: TouchEvent) => {
                  const rect = (e.target as HTMLElement).parentElement!.getBoundingClientRect();
                  const newX = e.touches[0].clientX - rect.left;
                  const percentage = Math.max(0, Math.min(1, newX / rect.width));
                  const newTime = percentage * videoDuration;
                  setEndTime(newTime);
                };
                const stopTouch = () => {
                  document.removeEventListener('touchmove', startTouch);
                  document.removeEventListener('touchend', stopTouch);
                };
                document.addEventListener('touchmove', startTouch, { passive: false });
                document.addEventListener('touchend', stopTouch);
              }}
            />
          </div>

          {/* 컨트롤 버튼들 */}
          {/* <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center"
          }}>
            <button
              onClick={resetSeekRange}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "background-color 0.2s ease"
              }}
            >
              🔄 초기화
            </button>
          </div> */}
        </div>
      )}

      {/* 비디오 정보 */}
      {currentVideo && (
        <div className={`video-info ${showSeekControls ? 'with-seek-controls' : ''}`}>
          {/* <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            {currentVideo.title}
          </h3>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            {currentIndex + 1} / {allVideos.length}
          </p> */}
        </div>
      )}

      {/* iOS 자동재생 프롬프트 */}
      {/* {needsUserInteraction && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "2rem",
          borderRadius: "12px",
          textAlign: "center",
          zIndex: 10004,
          maxWidth: "80%",
          pointerEvents: "auto",
          touchAction: "auto"
        }}
        onTouchStart={(e) => {
          // console.log('🎬 iOS Play Prompt Touch Start');
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          // console.log('🎬 iOS Play Prompt Mouse Down');
          e.stopPropagation();
        }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>▶️</div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: "bold" }}>
            영상을 재생하려면 탭하세요
          </h3>
          <p style={{ fontSize: "1rem", opacity: 0.8, marginBottom: "1.5rem" }}>
            iOS에서는 사용자 상호작용 후에 영상이 재생됩니다
          </p>
          <button
            onClick={handleUserInteraction}
            onTouchStart={(e) => {
              // console.log('🎬 iOS Play Button Touch Start');
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              // console.log('🎬 iOS Play Button Touch End');
              e.stopPropagation();
              handleUserInteraction();
            }}
            style={{
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              cursor: "pointer",
              touchAction: "auto",
              pointerEvents: "auto",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#cc0000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ff0000";
            }}
          >
            재생하기
          </button>
        </div>
      )} */}

      {/* 드래그 방향 힌트 */}
      {isDragging && Math.abs(dragOffset) > 10 && (
        <div 
          className={`drag-hint ${dragOffset > 0 ? 'top' : 'bottom'}`}
          style={{
            opacity: Math.min(1, Math.abs(dragOffset) / 50),
          }}
        >
          {/* {dragOffset > 0 ? "⬆️ 다음 영상" : "⬇️ 이전 영상"} */}
        </div>
      )}

      {hasError ? (
        <div className="error-container">
          <p>⚠️ 영상을 불러올 수 없습니다.</p>
          <button
            className="error-button"
            onClick={handleClose}
            onTouchStart={(e) => {
              // console.log('🔥 Error Close Button Touch Start');
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              // console.log('🔥 Error Close Button Touch End');
              e.stopPropagation();
              handleClose();
            }}
          >
            닫기
          </button>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="loading-text">
              로딩 중...
            </div>
          )}
          {/* 비디오 스택 컨테이너 */}
          <div className="video-stack-container">
            {/* 이전 비디오 (위쪽에 위치) */}
            {prevVideo && (
              <div 
                className={`video-item prev-video ${isDragging ? 'dragging' : ''}`}
                ref={prevVideoRef}
                style={{
                  transform: `translateY(${dragOffset < 0 ? Math.max(0, -dragOffset * 0.3) : -100}%)`,
                }}
                onMouseEnter={() => {
                  // console.log('🔍 Prev Video Debug:', {
                  //   dragOffset,
                  //   transform: `translateY(${dragOffset < 0 ? Math.max(0, -dragOffset * 0.3) : -100}%)`,
                  //   opacity: dragOffset < 0 ? Math.min(1, Math.abs(dragOffset) / 50) : 0,
                  //   prevVideo: prevVideo?.title
                  // });
                }}
              >
                <div className="video-content">
                  {/* 유튜브 썸네일 이미지 */}
                  <img
                    className="thumbnail"
                    src={`https://img.youtube.com/vi/${getVideoId(prevVideo.videoUrl)}/maxresdefault.jpg`}
                    alt={prevVideo.title}
                  />
                  {/* 오버레이 텍스트 */}
                  <div className="overlay-text">
                    {/* <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                      ⬇️ {prevVideo.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                      이전 영상
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {/* 현재 비디오 - 포스트의 allowsHitTesting(false) 개념 적용 */}
            <div
              className={`current-video ${isDragging ? 'dragging' : ''}`}
              style={{
                transform: `translateY(${-dragOffset * 0.3}%)`, // 모든 영상 감도 통일
              }}
            >
              {/* 유튜브 API가 iframe 주입할 컨테이너 */}
              <div
                id="yt-player"
                className="youtube-container"
              />
              
              {/* 드래그 감지 레이어 - 상단/하단으로 분리하여 가운데는 YouTube 컨트롤 작동 */}
              {/* 상단 드래그 영역 */}
              <div className="drag-layer top"
                onTouchStart={(e) => {
                  // console.log('🎯 Drag Layer TOP Touch Start');
                  e.stopPropagation();
                  // e.preventDefault();
                  setTouchEnd(null);
                  setTouchStart(e.targetTouches[0].clientY);
                  setIsDragging(true);
                }}
                onMouseDown={(e) => {
                  // console.log('🎯 Drag Layer TOP Mouse Down');
                  e.stopPropagation();
                  // e.preventDefault();
                  handleMouseDown(e);
                }}
                onTouchMove={(e) => {
                  if (isDragging && touchStart !== null) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleTouchMove(e);
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleMouseMove(e);
                  }
                }}
                onTouchEnd={() => {
                  if (isDragging && touchStart !== null) {
                    handleTouchEnd();
                  }
                }}
                onMouseUp={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
                onMouseLeave={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
              />
              
              {/* 하단 드래그 영역 */}
              <div className="drag-layer bottom"
                onTouchStart={(e) => {
                  //console.log('🎯 Drag Layer BOTTOM Touch Start');
                  e.stopPropagation();
                  // e.preventDefault();
                  setTouchEnd(null);
                  setTouchStart(e.targetTouches[0].clientY);
                  setIsDragging(true);
                }}
                onMouseDown={(e) => {
                  // console.log('🎯 Drag Layer BOTTOM Mouse Down');
                  e.stopPropagation();
                  // e.preventDefault();
                  handleMouseDown(e);
                }}
                onTouchMove={(e) => {
                  if (isDragging && touchStart !== null) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleTouchMove(e);
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleMouseMove(e);
                  }
                }}
                onTouchEnd={() => {
                  if (isDragging && touchStart !== null) {
                    handleTouchEnd();
                  }
                }}
                onMouseUp={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
                onMouseLeave={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
              />
              
              {/* 좌측 드래그 영역 */}
              <div className="drag-layer left"
                onTouchStart={(e) => {
                  // console.log('🎯 Drag Layer LEFT Touch Start');
                  e.stopPropagation();
                  // e.preventDefault();
                  setTouchEnd(null);
                  setTouchStart(e.targetTouches[0].clientY);
                  setIsDragging(true);
                }}
                onMouseDown={(e) => {
                  // console.log('🎯 Drag Layer LEFT Mouse Down');
                  e.stopPropagation();
                  // e.preventDefault();
                  handleMouseDown(e);
                }}
                onTouchMove={(e) => {
                  if (isDragging && touchStart !== null) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleTouchMove(e);
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleMouseMove(e);
                  }
                }}
                onTouchEnd={() => {
                  if (isDragging && touchStart !== null) {
                    handleTouchEnd();
                  }
                }}
                onMouseUp={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
                onMouseLeave={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
              />
              
              {/* 우측 드래그 영역 */}
              <div className="drag-layer right"
                onTouchStart={(e) => {
                  // console.log('🎯 Drag Layer RIGHT Touch Start');
                  e.stopPropagation();
                  // e.preventDefault();
                  setTouchEnd(null);
                  setTouchStart(e.targetTouches[0].clientY);
                  setIsDragging(true);
                }}
                onMouseDown={(e) => {
                  //console.log('🎯 Drag Layer RIGHT Mouse Down');
                  e.stopPropagation();
                  // e.preventDefault();
                  handleMouseDown(e);
                }}
                onTouchMove={(e) => {
                  if (isDragging && touchStart !== null) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleTouchMove(e);
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging) {
                    e.stopPropagation();
                    // e.preventDefault();
                    handleMouseMove(e);
                  }
                }}
                onTouchEnd={() => {
                  if (isDragging && touchStart !== null) {
                    handleTouchEnd();
                  }
                }}
                onMouseUp={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
                onMouseLeave={() => {
                  if (isDragging) {
                    handleMouseUp();
                  }
                }}
              />

            </div>

            {/* 다음 비디오 (아래쪽에 위치) */}
            {nextVideo && (
              <div 
                className={`video-item next-video ${isDragging ? 'dragging' : ''}`}
                ref={nextVideoRef}
                style={{
                  transform: `translateY(${dragOffset > 0 ? Math.min(0, -dragOffset * 0.3) : 100}%)`,
                  opacity: dragOffset > 0 ? Math.min(1, dragOffset / 50) : 0,
                }}
                onMouseEnter={() => {
                  // console.log('🔍 Next Video Debug:', {
                  //   dragOffset,
                  //   transform: `translateY(${dragOffset > 0 ? Math.min(0, -dragOffset * 0.3) : 100}%)`,
                  //   opacity: dragOffset > 0 ? Math.min(1, dragOffset / 50) : 0,
                  //   nextVideo: nextVideo?.title
                  // });
                }}
              >
                <div className="video-content">
                  {/* 유튜브 썸네일 이미지 */}
                  <img
                    className="thumbnail"
                    src={`https://img.youtube.com/vi/${getVideoId(nextVideo.videoUrl)}/maxresdefault.jpg`}
                    alt={nextVideo.title}
                  />
                  {/* 오버레이 텍스트 */}
                  <div className="overlay-text">
                    <div className="title">
                      ⬆️ {nextVideo.title}
                    </div>
                    <div className="subtitle">
                      다음 영상
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
