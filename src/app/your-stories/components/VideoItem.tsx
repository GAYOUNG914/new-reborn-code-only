import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { Dispatch, SetStateAction } from 'react';
import Image from "next/image";
import "../styles/VideoItem.scss";
import AOS from "aos";
import useIsMobile from "@/utils/useIsMobile";
import React from "react";
import { YourStoriesContent } from '@/types/YourStories';
import PlayButton from "@/components/new-reborn/PlayButton";
import VideoTime from "./VideoTime";
import Tooltip from "./Tooltip";
import { scrollTo } from "@/utils/lenis";


interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  getPlayerState(): number;
}

type Props = {
  data: YourStoriesContent;
  currentSize: number;
  lockedId: number | null;
  setLockedId: Dispatch<SetStateAction<number | null>>;
  id: number;
  playingId: number | null;
  setPlayingId: Dispatch<SetStateAction<number | null>>;
  clickedId: number | null;
  setClickedId: Dispatch<SetStateAction<number | null>>;
  playerStatesRef: React.MutableRefObject<Record<number, number>>;
  updatePlayerState: (videoId: number, state: number) => void;
  isOtherVideoPlaying: (currentVideoId: number) => boolean;
  cleanupVideoState: (videoId: number) => void;
  stopAllVideos: () => void; // 추가
};


export default function VideoItem({ 
  data, 
  currentSize, 
  lockedId, 
  setLockedId, 
  id,
  playingId,
  setPlayingId,
  clickedId,
  setClickedId,
  playerStatesRef,
  updatePlayerState,
  isOtherVideoPlaying,
  stopAllVideos
}: Props) {

  const { title, imageUrl, date, article, tagIds, info, videoUrl, timeLength } = data;
  const videoEmbedUrl = getEmbedUrl(videoUrl);

  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [needsMoreButton, setNeedsMoreButton] = useState(false);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const visibilityTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  
  // 터치 후 사용자 스크롤 감지를 위한 상태
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  // iOS 디바이스 감지
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);




  // 네이버웍스 인앱 브라우저 감지
  const isNaverWorksApp = () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // 네이버웍스 인앱 브라우저 감지
    return userAgent.includes('naverworks') || 
           userAgent.includes('naver-works') ||
           userAgent.includes('nwapp') ||
           (window as any).naverworks !== undefined;
  };

  // 카카오톡 인앱 브라우저 감지
  const isKakaoTalkApp = () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    return userAgent.includes('kakaotalk') || 
           userAgent.includes('kakaotalk-app') ||
           userAgent.includes('kakaotalk-app-ios') ||
           userAgent.includes('kakaotalk-app-android') ||
           (window as any).kakaotalk !== undefined;
  };

  // 카카오톡/네이버웍스 외 다른 인앱 브라우저 감지
  const isInAppBrowser = () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // 카카오톡과 네이버웍스는 제외하고 다른 인앱 브라우저 감지
    return userAgent.match(/inapp|snapchat|wirtschaftswoche|thunderbird|instagram|everytimeapp|whatsapp|electron|wadiz|aliapp|zumapp|kakaostory|band|twitter|daumapps|daumdevice\/mobile|fb_iab|fb4a|fban|fbios|fbss|trill/i) &&
           !userAgent.includes('kakaotalk') && 
           !userAgent.includes('naverworks') &&
           !userAgent.includes('naver-works') &&
           !userAgent.includes('nwapp');
  };

  // 안드로이드 디바이스 감지
  const isAndroid = () => {
    if (typeof window === 'undefined') return false;
    return /android/i.test(navigator.userAgent);
  };  

  // 카카오톡 인앱 감지 알림 (안드로이드/iOS 모두 적용)
  useEffect(() => {
    if (isKakaoTalkApp()) {
      const target_url = window.location.href;
      
      // 카카오톡 외부브라우저로 호출
      window.location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(target_url);
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 카카오톡/네이버웍스 외 다른 인앱 (안드로이드만 적용)
  useEffect(() => {
    if (isInAppBrowser() && isAndroid()) {
      // 이미 리다이렉션을 시도했는지 확인
      if (sessionStorage.getItem('redirectAttempted')) {
        return;
      }
      
      sessionStorage.setItem('redirectAttempted', 'true');
      const target_url = window.location.href;
      
      // Chrome으로 강제 리다이렉션
      window.location.href = 'intent://' + target_url.replace(/https?:\/\//i, '') + '#Intent;scheme=http;package=com.android.chrome;end';
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const numberFormatter = new Intl.NumberFormat("ko-KR");
  
  // 현재 영상의 재생 상태
  const isPlaying = playingId === id;
  const isClickedToPlay = clickedId === id;


  // ==========================
  // 텍스트 단락 판단
  // ==========================
  useEffect(() => {
    if (!textRef.current) return;

    const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
    const lines = textRef.current.scrollHeight / lineHeight;
    setNeedsMoreButton(lines >= 1);

  }, [article]);


  // ==========================
  // 전체화면 상태 추적 및 스크롤 복원 로직
  // ==========================
  useEffect(() => {
    let rotationTimeout: NodeJS.Timeout;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      const wasFullscreen = isFullscreen.current;
      isFullscreen.current = isCurrentlyFullscreen;
      
      // 전체화면 진입 시 - 현재 스크롤 위치 저장
      if (!wasFullscreen && isCurrentlyFullscreen) {
        // 현재 스크롤 위치를 정확히 저장
        videoPositionBeforeFullscreen.current = window.scrollY;
        // console.log('📍 전체화면 진입 - 스크롤 위치 저장:', videoPositionBeforeFullscreen.current);
      }
      
      // 전체화면 해제 시 - 저장된 스크롤 위치로 정확히 복원
      if (wasFullscreen && !isCurrentlyFullscreen) {
        // console.log('🔙 전체화면 해제 감지 - 저장된 스크롤 위치로 복원 시작');
        // console.log('📍 저장된 스크롤 위치:', videoPositionBeforeFullscreen.current);
        
        // 화면 회전이든 사용자 종료든 무조건 저장된 스크롤 위치로 복원
        isRestoringToVideo.current = true;
        
        // 약간의 지연을 두고 스크롤 복원 (DOM 업데이트 대기)
        setTimeout(() => {
          if (videoPositionBeforeFullscreen.current >= 0) {
            // 저장된 정확한 스크롤 위치로 복원
            window.scrollTo({
              top: videoPositionBeforeFullscreen.current,
              behavior: 'auto'
            });
            // console.log('✅ 저장된 스크롤 위치로 정확히 복원:', videoPositionBeforeFullscreen.current);
          }
          
          setTimeout(() => {
            isRestoringToVideo.current = false;
          }, 1000);
        }, 100);
        
        // 화면 회전으로 인한 해제인 경우 재진입 시도 (선택사항)
        if (isRotating.current && !userExitedFullscreen.current) {
          setTimeout(() => {
            const element = iframeRef.current;
            if (element && !userExitedFullscreen.current) {
              if (element.requestFullscreen) {
                element.requestFullscreen().catch(() => {
                  console.log('전체화면 재진입 실패 (안드로이드에서는 정상)');
                });
              } else if ((element as any).webkitRequestFullscreen) {
                (element as any).webkitRequestFullscreen();
              }
            }
          }, 150);
        }
        
        // 사용자가 직접 종료한 경우
        if (!isRotating.current) {
          userExitedFullscreen.current = true;
          console.log('👤 사용자가 전체화면 종료');
        }
      }
    };

    const handleOrientationChange = () => {
      // console.log('화면 회전 시작');
      isRotating.current = true;
      isResizing.current = true; // 일관성을 위해 추가
      
      // 회전 완료 후 상태 초기화 (여유있게 2초로 설정)
      clearTimeout(rotationTimeout);
      rotationTimeout = setTimeout(() => {
        isRotating.current = false;
        isResizing.current = false; // 함께 해제
        // console.log('화면 회전 완료');
      }, 2000);
    };

    // 전체화면 이벤트 리스너 등록 (크로스 브라우저)
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // 화면 회전 이벤트 리스너
    window.addEventListener('orientationchange', handleOrientationChange);
    // resize도 회전으로 간주 (일부 디바이스에서 orientationchange가 없을 수 있음)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      
      // 🚨 isRotating/isResizing 플래그를 동시에 켜서 타이밍 문제 해결 시도
      isRotating.current = true;
      isResizing.current = true; // 플래그 활성화
      
      resizeTimer = setTimeout(() => {
        isRotating.current = false;
        isResizing.current = false; // 플래그 비활성화
      }, 2000);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      clearTimeout(rotationTimeout);
      clearTimeout(resizeTimer);
    };
  }, []);

  // ==========================
  // 리사이즈 초기화 (리사이즈/회전/전체화면 중에는 유지)
  // ==========================
  useEffect(() => {
    // 🚨 스크롤 복원 중이면 상태 초기화 방지
    if (isRestoringToVideo.current) {
      // console.log('🔒 영상 위치 복원 중 - 상태 유지');
      return;
    }

    // 🚨 새로운 조건 추가: isResizing.current가 true이면 즉시 리턴 (최우선 체크)
    if (isResizing.current) {
      // console.log('isResizing 플래그 감지 - 상태 초기화 방지');
      return;
    }

    // 🚨 중요: 화면 회전 중이거나 전체화면 모드일 때는 플레이어 상태를 유지
    if (isRotating.current || isFullscreen.current) {
      // console.log('화면 회전 중 또는 전체화면 모드 - 플레이어 상태 유지');
      return;
    }

    // 리사이즈/회전/전체화면이 모두 아닐 때만 초기화
    // (예: PC ↔ Mobile 전환, 페이지 로드 등 정상적인 상황)
    if (isMobile) {
      setLockedId(null);
    }
    
    // isMobile이 변경되지 않았더라도 resize 이벤트에 의해 상위 컴포넌트 currentSize가
    // 변경되어 이 훅이 다시 실행될 수 있으므로, isResizing 플래그로 보호해야 함.
    setPlayingId(null);
    setClickedId(null);
  }, [isMobile, setLockedId, setPlayingId, setClickedId]);

  // ==========================
  // 모바일 IntersectionObserver (터치 이벤트보다 낮은 우선순위)
  // ==========================
  useEffect(() => {
     if (!isMobile || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio === 1;

         if (visibilityTimeout.current) {
          clearTimeout(visibilityTimeout.current);
          visibilityTimeout.current = null;
        }

        if (isVisible) {
          // 터치로 재생 중인 영상이 있고, 사용자가 스크롤하지 않은 경우에만 자동재생 방지
          if (clickedId !== null && clickedId !== id && !isUserScrolling) {
            // console.log(`🚫 [INTERSECTION] 영상 ${id} 자동재생 방지 - 다른 영상이 터치로 재생 중`);
            return;
          }
          
          setLockedId(id);

          visibilityTimeout.current = setTimeout(() => {
            // 재생 직전에 다시 한번 터치 재생 상태와 사용자 스크롤 상태 확인
            if (clickedId !== null && clickedId !== id && !isUserScrolling) {
              // console.log(`🚫 [INTERSECTION] 영상 ${id} 자동재생 취소 - 터치 재생 중`);
              return;
            }
            setPlayingId(id);
          }, 3000);
        } else if (lockedId === id) {
          // 터치로 재생 중인 영상이 아닌 경우에만 정지
          if (clickedId !== id) {
            setLockedId(null);
            setPlayingId(null);
          }
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
      if (visibilityTimeout.current) clearTimeout(visibilityTimeout.current);
    };
  }, [isMobile, id, lockedId, clickedId, isUserScrolling, setLockedId, setPlayingId]);

  // ==========================
  // 사용자 스크롤 감지 (터치 후 IntersectionObserver 재활성화용)
  // ==========================
  useEffect(() => {
    if (!isMobile || !isClickedToPlay) return;

    let lastScrollY = window.scrollY;
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      // 스크롤 변화가 감지되면 사용자 스크롤로 간주
      if (scrollDelta > 10) {
        setIsUserScrolling(true);
        
        // 스크롤이 멈춘 후 1초 뒤에 IntersectionObserver 재활성화
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          setIsUserScrolling(false);
          // console.log(`🔄 [SCROLL] 사용자 스크롤 완료 - IntersectionObserver 재활성화`);
          
          // 터치로 재생된 영상이 현재 화면에 보이지 않으면 상태 정리
          if (isClickedToPlay && videoRef.current) {
            const rect = videoRef.current.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isVisible) {
              // console.log(`🧹 [SCROLL] 터치 재생 영상 ${id} 화면에서 벗어남 - 상태 정리`);
              setClickedId(null);
              setPlayingId(null);
              setLockedId(null);
            }
          }
        }, 500);
      }
      
      lastScrollY = currentScrollY;
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [isMobile, isClickedToPlay]);

  // ==========================
  // 유튜브 URL 처리
  // ==========================
  function getEmbedUrl(url: string) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  // ==========================
  // YouTube API 로드 확인 및 플레이어 초기화
  // ==========================
  const playerRef = useRef<YTPlayer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerInitialized = useRef<boolean>(false);
  const isFullscreen = useRef<boolean>(false); // 전체화면 상태 추적
  const userExitedFullscreen = useRef<boolean>(false); // 사용자가 의도적으로 종료했는지
  const isRotating = useRef<boolean>(false); // 화면 회전 중인지
  const isResizing = useRef<boolean>(false); // 리사이즈 중인지 추적하는 새로운 ref
  
  // 전체화면 진입 전 영상 위치를 저장하는 ref 추가
  const videoPositionBeforeFullscreen = useRef<number>(0);
  const isRestoringToVideo = useRef<boolean>(false);


  // YouTube API 로드
  const waitForYouTubeAPI = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        // YouTube API 이미 로드됨
        resolve();
        return;
      }

      const checkYT = () => {
        if (window.YT && window.YT.Player) {
          // YouTube API 로드 완료
          resolve();
        } else {
          setTimeout(checkYT, 100);
        }
      };
      checkYT();
    });
  }, []);


  // 상태 변경 핸들러
  const handleStateChange = useCallback((videoId: number, event: any) => {
    const state = event.data;
    
    // 상태 업데이트 (반드시 호출)
    updatePlayerState(videoId, state);

    // 상태별 처리
    // if (typeof window !== 'undefined' && window.YT?.PlayerState) {
    //   switch (state) {
    //     case window.YT.PlayerState.ENDED:
    //       console.log(`🔚 [STATE] 영상 ${videoId} 종료됨`);
    //       break;
          
    //     case window.YT.PlayerState.PAUSED:
    //       console.log(`⏸️ [STATE] 영상 ${videoId} 일시정지됨`);
    //       break;
          
    //     case window.YT.PlayerState.PLAYING:
    //       console.log(`▶️ [STATE] 영상 ${videoId} 재생 중`);
    //       break;
          
    //     case window.YT.PlayerState.BUFFERING:
    //       console.log(`⏳ [STATE] 영상 ${videoId} 버퍼링 중`);
    //       break;
          
    //     default:
    //       console.log(`📝 [STATE] 영상 ${videoId} 기타 상태: ${state}`);
    //   }
    // }
  }, [updatePlayerState]);

  // 상태 문자열 변환
  const getStateString = (state: number): string => {
    if (typeof window === 'undefined' || !window.YT?.PlayerState) return `${state}`;
    
    const states: Record<number, string> = {
      [-1]: 'UNSTARTED',
      [0]: 'ENDED',
      [1]: 'PLAYING',
      [2]: 'PAUSED',
      [3]: 'BUFFERING',
      [5]: 'CUED'
    };
    return states[state] || `UNKNOWN(${state})`;
  };

  // 플레이어 초기화
  useEffect(() => {
    const initializePlayer = async () => {
      if (!isPlaying || !iframeRef.current || playerInitialized.current) return;
      
      // console.log(`🔧 [PLAYER] 영상 ${id} 플레이어 초기화 시작`);
      // console.log(`🔧 [PLAYER] 현재 상태 - isPlaying: ${isPlaying}, iframeRef: ${!!iframeRef.current}, playerInitialized: ${playerInitialized.current}`);
      
      try {
        await waitForYouTubeAPI();
        // console.log(`🔧 [PLAYER] YouTube API 로드 완료`);
        
        if (!iframeRef.current || playerRef.current) {
          // console.log(`🔧 [PLAYER] 초기화 조건 불만족 - iframeRef: ${!!iframeRef.current}, playerRef: ${!!playerRef.current}`);
          return;
        }
        
        // console.log(`🔧 [PLAYER] 영상 ${id} YT.Player 생성 시작`);
        
        const playerVars = {
          autoplay: 1,
          mute: !isClickedToPlay ? 1 : 0,
          controls: 1,  // 컨트롤 보이도록 변경
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          // 추가 설정으로 이벤트 감지 개선
          disablekb: 0,  // 키보드 단축키 허용
          fs: isNaverWorksApp() ? 0 : 1,  // 네이버웍스 인앱에서만 전체화면 비활성화
          iv_load_policy: 3,
          loop: 0,
          // iOS Safari 호환성을 위한 필수 설정
          playsinline: 1,  // iOS에서 인라인 재생 허용
          cc_load_policy: 0,  // 자막 자동 로드 비활성화
          start: 0  // 시작 시간 명시적 설정            
        };
        
        // console.log(`🔧 [PLAYER] 영상 ${id} 플레이어 설정:`, {
        //   videoId: getVideoId(videoEmbedUrl),
        //   isIOS: isIOS,
        //   isClickedToPlay: isClickedToPlay,
        //   mute: playerVars.mute,
        //   playerVars: playerVars
        // });
        
        playerRef.current = new window.YT.Player(iframeRef.current, {
          height: '257',
          width: '457',
          videoId: getVideoId(videoEmbedUrl),
          playerVars: playerVars,
          events: {
            onReady: (event: any) => {
              // console.log(`✅ [PLAYER] 영상 ${id} 플레이어 준비 완료`);
              // console.log(`✅ [PLAYER] onReady - isPlaying: ${isPlaying}, isClickedToPlay: ${isClickedToPlay}`);
              playerInitialized.current = true;
              
              // 준비 완료 후 재생 시작
              if (isPlaying) {
                // console.log(`▶️ [PLAYER] 영상 ${id} 자동 재생 시작`);
                try {
                  event.target.playVideo();
                  // console.log(`▶️ [PLAYER] 영상 ${id} playVideo() 호출 성공`);
                } catch (error) {
                  // console.error(`❌ [PLAYER] 영상 ${id} playVideo() 호출 실패:`, error);
                }
              }
            },
            onStateChange: (event: any) => {
              // console.log(`🔄 [PLAYER] 영상 ${id} onStateChange 이벤트:`, event.data, `(${getStateString(event.data)})`);
              handleStateChange(id, event);
              
              // iOS에서 UNSTARTED 상태로 되돌아가는 경우 터치 재생 중이면 강제 재시도
              if (isIOS && event.data === -1 && isClickedToPlay) {
                // console.log(`🍎 [PLAYER] iOS UNSTARTED 상태 감지 - 터치 재생 중이므로 강제 재시도`);
                setTimeout(() => {
                  if (playerRef.current && isClickedToPlay) {
                    try {
                      playerRef.current.playVideo();
                      // console.log(`🍎 [PLAYER] iOS 강제 재시도 완료`);
                    } catch (error) {
                      // console.warn(`🍎 [PLAYER] iOS 강제 재시도 실패:`, error);
                    }
                  }
                }, 100);
              }
            },
            onError: (event: any) => {
              // console.error(`❌ [PLAYER] 영상 ${id} 에러:`, event.data);
              playerInitialized.current = false;
            }
          }
        });
        
      } catch (error) {
        console.error(`❌ [PLAYER] 영상 ${id} 초기화 실패:`, error);
        playerInitialized.current = false;
      }
    };

    initializePlayer();
  }, [isPlaying, id, isClickedToPlay, videoEmbedUrl, handleStateChange, waitForYouTubeAPI]);


  // 플레이어 정리
  useEffect(() => {
    if (!isPlaying && playerRef.current) {
      // console.log(`🧹 [PLAYER] 영상 ${id} 플레이어 정리`);
      
      try {
        // 플레이어 상태 체크 후 정리
        if (typeof playerRef.current.getPlayerState === 'function') {
          const currentState = playerRef.current.getPlayerState();
          // console.log(`📊 [PLAYER] 영상 ${id} 정리 전 상태:`, getStateString(currentState));
        }
        
        // // 플레이어 제거
        // if (typeof playerRef.current.destroy === 'function') {
        //   playerRef.current.destroy();
        //   console.log(`🗑️ [PLAYER] 영상 ${id} destroy 완료`);
        // }

      } catch (error) {
        console.warn(`⚠️ [PLAYER] 영상 ${id} 정리 중 오류:`, error);
      }
      
      playerRef.current = null;
      playerInitialized.current = false;
    }
  }, [isPlaying, id]);

  // videoId 추출 함수
  const getVideoId = (embedUrl: string): string => {
    const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
    return match?.[1] || '';
  };

  // 전체화면 진입 전에 영상이 화면에 보이도록 조정하는 함수
  const requestFullscreenWithScroll = useCallback(() => {
    if (videoRef.current && iframeRef.current) {
      // 먼저 영상이 화면에 보이는지 확인
      const rect = videoRef.current.getBoundingClientRect();
      const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      if (!isFullyVisible) {
        // 영상이 화면에 완전히 보이지 않으면 스크롤 후 전체화면
        videoRef.current.scrollIntoView({ 
          behavior: 'auto', 
          block: 'center' 
        });
        
        setTimeout(() => {
          if (iframeRef.current) {
            if (iframeRef.current.requestFullscreen) {
              iframeRef.current.requestFullscreen();
            } else if ((iframeRef.current as any).webkitRequestFullscreen) {
              (iframeRef.current as any).webkitRequestFullscreen();
            }
          }
        }, 500);
      } else {
        // 이미 보이면 바로 전체화면
        if (iframeRef.current.requestFullscreen) {
          iframeRef.current.requestFullscreen();
        } else if ((iframeRef.current as any).webkitRequestFullscreen) {
          (iframeRef.current as any).webkitRequestFullscreen();
        }
      }
      
      // 전체화면 종료 플래그 초기화
      userExitedFullscreen.current = false;
    }
  }, []);
  


// ==========================
// 클릭 핸들러
// ==========================
const handleClick = useCallback(() => {
  // console.log(`🖱️ [CLICK] 영상 ${id} 클릭`);

  if (isPlaying && isClickedToPlay && playerRef.current && playerInitialized.current) {
    // 이미 클릭으로 재생 중인 경우 - 토글
    try {
      const currentState = playerRef.current.getPlayerState();
      // console.log(`⏯️ [CLICK] 영상 ${id} 토글 - 현재 상태: ${getStateString(currentState)}`);
      
      if (currentState === window.YT.PlayerState.PLAYING) {
        // console.log(`⏸️ [CLICK] 영상 ${id} 일시정지 실행`);
        playerRef.current.pauseVideo();
      } else if (currentState === window.YT.PlayerState.PAUSED) {
        // console.log(`▶️ [CLICK] 영상 ${id} 재생 재개`);
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error(`❌ [CLICK] 영상 ${id} 토글 오류:`, error);
    }
  } else {
    // 새로 재생 시작
    // console.log(`🆕 [CLICK] 영상 ${id} 새로운 재생 시작`);
    
    // 전체화면 종료 플래그 초기화 (새 재생 시작)
    userExitedFullscreen.current = false;
    
    // 모바일에서 lockedId가 설정된 상태에서 클릭한 경우 특별 처리
    if (isMobile && lockedId === id) {
      // console.log(`📱 [CLICK] 모바일 lockedId 상태에서 클릭 - 즉시 재생 시작`);
      setPlayingId(id);
      setClickedId(id);
      
      // visibilityTimeout 취소 (자동 재생 방지)
      if (visibilityTimeout.current) {
        clearTimeout(visibilityTimeout.current);
        visibilityTimeout.current = null;
      }
      
      // 플레이어가 준비되지 않은 경우를 대비한 재시도 로직
      const attemptPlay = () => {
        if (playerRef.current && playerInitialized.current) {
          try {
            playerRef.current.playVideo();
            // console.log(`▶️ [CLICK] 모바일 lockedId 상태에서 재생 성공`);
          } catch (error) {
            console.warn(`⚠️ [CLICK] 모바일 lockedId 상태에서 재생 실패:`, error);
            // 500ms 후 재시도
            setTimeout(attemptPlay, 500);
          }
        } else {
          // 플레이어가 아직 준비되지 않은 경우 200ms 후 재시도
          setTimeout(attemptPlay, 200);
        }
      };
      
      attemptPlay();
    } else {
      // 일반적인 재생 시작
      setPlayingId(id);
      setClickedId(id);
      playerRef.current && playerRef.current.playVideo();
    }
    
    // 호버 타이머 취소
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  }
}, [id, isPlaying, isClickedToPlay, setPlayingId, setClickedId, isMobile, lockedId]);

// ==========================
// 모바일 터치 핸들러 (스무스 스크롤 + 즉시 재생)
// ==========================
const handleTouch = useCallback((e: React.TouchEvent) => {
  // 모바일에서만 동작
  if (!isMobile) return;
  
  // 기본 클릭 이벤트 방지 (중복 실행 방지)
  e.preventDefault();
  
  // console.log(`📱 [TOUCH] 영상 ${id} 터치 감지 - 스무스 스크롤 + 즉시 재생`);
  // console.log(`📱 [TOUCH] 디바이스 정보 - isMobile: ${isMobile}, isIOS: ${isIOS}, userAgent: ${navigator.userAgent}`);
  // console.log(`📱 [TOUCH] 현재 상태 - playingId: ${playingId}, clickedId: ${clickedId}, lockedId: ${lockedId}`);
  // console.log(`📱 [TOUCH] 플레이어 상태 - playerRef: ${!!playerRef.current}, playerInitialized: ${playerInitialized.current}`);
  
  // 1. 먼저 모든 다른 재생 중인 영상들 정지
  if (playingId !== null && playingId !== id) {
    // console.log(`⏹️ [TOUCH] 다른 영상들 정지 - 현재 playingId: ${playingId}`);
    stopAllVideos();
  }
  
  // 2. 먼저 상태 설정 및 재생 시작 (iOS에서 자동재생 정책 우회)
  // console.log(`🎬 [TOUCH] 즉시 상태 설정 및 재생 시작 - playingId: ${id}, clickedId: ${id}`);
  setPlayingId(id);
  setClickedId(id);
  setLockedId(id);
  
  // IntersectionObserver 자동재생 타이머 취소
  if (visibilityTimeout.current) {
    clearTimeout(visibilityTimeout.current);
    visibilityTimeout.current = null;
    // console.log(`⏰ [TOUCH] visibilityTimeout 취소됨`);
  }
  
  // 3. 플레이어가 준비되지 않은 경우를 대비한 재시도 로직
  let retryCount = 0;
  const maxRetries = isIOS ? 10 : 5; // iOS에서는 더 많은 재시도
  
  const attemptPlay = () => {
    retryCount++;
    // console.log(`🎬 [TOUCH] 재생 시도 ${retryCount}/${maxRetries} - playerRef: ${!!playerRef.current}, playerInitialized: ${playerInitialized.current}`);
    
    if (retryCount > maxRetries) {
      // console.error(`❌ [TOUCH] 영상 ${id} 최대 재시도 횟수 초과 - 재생 포기`);
      return;
    }
    
    if (playerRef.current && playerInitialized.current) {
      try {
        playerRef.current.playVideo();
        // console.log(`▶️ [TOUCH] 영상 ${id} 터치 재생 성공 (시도 ${retryCount})`);
        
        // iOS에서 재생 성공 후 상태 확인 및 재생 보장
        if (isIOS) {
          setTimeout(() => {
            if (playerRef.current) {
              const state = playerRef.current.getPlayerState();
              // console.log(`📊 [TOUCH] iOS 재생 후 상태 확인: ${state} (${getStateString(state)})`);
              
              // UNSTARTED 상태로 되돌아간 경우 재생 재시도
              if (state === -1) { // UNSTARTED
                // console.log(`🔄 [TOUCH] iOS UNSTARTED 상태 감지 - 재생 재시도`);
                try {
                  playerRef.current.playVideo();
                  // console.log(`🔄 [TOUCH] iOS UNSTARTED 상태 재생 재시도 완료`);
                  
                  // 재시도 후 다시 상태 확인
                  setTimeout(() => {
                    if (playerRef.current) {
                      const newState = playerRef.current.getPlayerState();
                      // console.log(`📊 [TOUCH] iOS 재시도 후 상태: ${newState} (${getStateString(newState)})`);
                    }
                  }, 500);
                } catch (error) {
                  // console.error(`❌ [TOUCH] iOS UNSTARTED 상태 재생 재시도 실패:`, error);
                }
              }
            }
          }, 1000);
        }
      } catch (error) {
        // console.error(`❌ [TOUCH] 영상 ${id} 터치 재생 실패 (시도 ${retryCount}):`, error);
        // console.log(`🔄 [TOUCH] ${isIOS ? '300ms' : '500ms'} 후 재시도 예정`);
        // iOS에서는 더 짧은 간격으로 재시도
        setTimeout(attemptPlay, isIOS ? 300 : 500);
      }
    } else {
      // console.log(`⏳ [TOUCH] 플레이어 준비 중 (시도 ${retryCount}) - ${isIOS ? '100ms' : '200ms'} 후 재시도 예정`);
      // iOS에서는 더 짧은 간격으로 재시도
      setTimeout(attemptPlay, isIOS ? 100 : 200);
    }
  };
  
  // 4. 재생 시도 시작
  attemptPlay();
  
  // 5. 재생 시작 후 스무스 스크롤 (약간의 지연을 두어 재생이 먼저 시작되도록)
  setTimeout(() => {
    if (videoRef.current) {
      // 화면 가운데로 스크롤하기 위한 오프셋 계산
      const elementRect = videoRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementHeight = elementRect.height;
      
      // 요소가 화면 가운데 오도록 하는 스크롤 위치 계산
      const targetScrollTop = window.scrollY + elementRect.top - (viewportHeight / 2) + (elementHeight / 2);
      
      // console.log(`🔄 [TOUCH] 스크롤 시작 (재생 후) - targetScrollTop: ${targetScrollTop}`);
      
      scrollTo(targetScrollTop, {
        immediate: false,
        onComplete: () => {
          // console.log(`✅ [TOUCH] 스크롤 완료 - 영상 ${id} 화면 가운데 위치`);
        }
      });
    }
  }, isIOS ? 500 : 300); // iOS에서는 재생이 안정화될 때까지 조금 더 기다림
}, [id, isMobile, playingId, setPlayingId, setClickedId, setLockedId, stopAllVideos]);

  // ==========================
  // PC hover 재생
  // ==========================
  const startHoverTimer = useCallback(() => {
    if (isMobile) return;

    // console.log(`🖱️ 영상 ${id} 호버 시작`);

    // 이전 타이머 취소
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    // 2초 후 재생
    hoverTimeout.current = setTimeout(() => {
      // 재생 직전에 다른 영상 재생 상태 확인
      const otherVideoPlaying = isOtherVideoPlaying(id);
      // console.log(`⏰ 호버 타이머 완료 - 영상 ${id}`);
      // console.log(`🔍 다른 영상 재생 상태: ${otherVideoPlaying}`);
      
      if (!otherVideoPlaying) {
        // console.log(`✅ 영상 ${id} 호버 재생 시작 (다른 영상이 재생/버퍼링 중이 아님)`);
        setPlayingId(id);
      } else {
        // console.log(`❌ 영상 ${id} 호버 재생 취소 (다른 영상이 재생/버퍼링 중)`);
      }
    }, 2000);

  }, [id, isMobile, isOtherVideoPlaying, setPlayingId]);

  // ==========================
  // hover 종료 시 정지
  // ==========================
  const clearHoverTimer = useCallback(() => {
    if (isMobile) return;

    // console.log(`🖱️ 영상 ${id} 호버 종료`);

    // 타이머 취소
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
      // console.log(`⏰ 영상 ${id} 호버 타이머 취소`);
    }

    // 호버로 재생된 영상만 정지 (클릭으로 재생된 것은 유지)
    if (isPlaying && !isClickedToPlay) {
      
      // console.log(`⏹️ 영상 ${id} 호버 재생 정지`);
      setPlayingId(null);

    } else if (isPlaying && isClickedToPlay) {
      // console.log(`🔒 영상 ${id} 클릭 재생 중이므로 호버 종료해도 계속 재생`);
    }

  }, [id, isMobile, isPlaying, isClickedToPlay, setPlayingId]);


    useEffect(() => {
    if (isMobile) {
      AOS.init({ duration: 800 });
      AOS.refresh();
    } else {
      AOS.refreshHard();
    }
  }, [isMobile]);







  const titleContainerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useLayoutEffect(() => {
    if (titleContainerRef.current && titleRef.current) {
      const containerWidth = titleContainerRef.current.clientWidth;
      const textWidth = titleRef.current.scrollWidth;

      // console.log("container:", containerWidth, "text:", textWidth);

      if (textWidth > containerWidth) {
        setIsOverflow(true);
        
        titleContainerRef.current.style.setProperty(
          "--container-width",
          containerWidth + "px"
        );
        
        titleContainerRef.current.style.setProperty(
          "--text-width",
          textWidth + "px"
        );
      } else {
        setIsOverflow(false);
      }
    }
  }, [title]);





  return (
    <div className="u-video_item" {...(isMobile ? { "data-aos": "fade-up" } : {})}>

      <div className="u-video-container">
        <div className="light-core core1"></div>
        <div className="light-core core2"></div>
        
        <div className={`u-video-wrapper${isPlaying ? ' play' : ''} ${isMobile && lockedId === data.id ? 'active' : ''}`}
          onClick={handleClick}
          onTouchStart={handleTouch}
          onMouseEnter={startHoverTimer}
          onMouseLeave={clearHoverTimer}
          ref={videoRef}
        >
          <div className="light"></div>
          <div className="light2"></div>
          <div className="light-blur"></div>
          {!isPlaying && (
            <div className="u-thumnail">
              <Image src={imageUrl} alt={title} width={457} height={257} />
              <PlayButton />
              { timeLength && <VideoTime second={timeLength} /> }
            </div>
          )}
          <div className="u-video">
            {isPlaying && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div
                  ref={iframeRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#000'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="light-bg"></div>



      <div className="u-contents">
          <div className="u-contents_wrapper">

            <div className="u-contents-head">
              {/* {!info && <div className="u-contents-head_logo"></div> } */}
              <span className="u-contents-head_title" ref={titleContainerRef}>
              <span className={`marquee ${isOverflow && isPlaying ? "animate" : ""}`}>
                <span ref={titleRef} className="marquee__inner">
                  <span>{title}</span>
                  {
                    isOverflow && isPlaying &&
                    <span aria-hidden="true">{title}</span>
                  }
                </span>
              </span>
            </span>
              {info && <Tooltip info={info} />}
            </div>

            <div className="u-contents-body">

              <div className="u-contents-body_info">
                <span>U터뷰</span>
                <span className="u-contents-body_info_text">조회수 {numberFormatter.format(currentSize)}회</span>
                <span className="u-contents-body_info_text">{date}</span>
              </div>

              <div className="u-contents-body_desc"
                onClick={() => {
                  setIsExpanded(prev => !prev)
                }}
              >
                <p
                  className={`u-contents-body_desc-wrapper ${isExpanded ? "expanded" : ""}`}
                  ref={textRef} >
                  {article}
                </p>

                {needsMoreButton && !isExpanded && (
                  <button
                    type="button"
                    className="btn-more"
                  >
                    <span>더 보기</span>
                  </button>
                )}
              </div>

            </div>

            <div className="u-contents_tag">
              <div className="u-contents_tag-list">
                {tagIds.map((tag, index) => (
                  <span key={index} className="u-contents_tag_item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

      </div>


    </div>
  );
}