"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useCallback, useEffect } from 'react';
import PlayButton from "@/components/new-reborn/PlayButton";
import useIsMobile from "@/utils/useIsMobile";
import type { VlogItem } from "@/types/OurStories";

type VlogCardItemProps = {
  item: VlogItem;
  id: number;
  playingId: number | null;
  setPlayingId: Dispatch<SetStateAction<number | null>>;
  updatePlayerState: (videoId: number, state: number) => void;
  onClick: (url: string) => void;
  playerStatesRef: React.MutableRefObject<Record<number, number>>;
  isOtherVideoPlaying: (currentVideoId: number) => boolean;
  cleanupVideoState: (videoId: number) => void;
  visibleIds: number[];
  setVisibleIds: Dispatch<SetStateAction<number[]>>;
};

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  getPlayerState(): number;
}


function getEmbedUrl(url: string) {
  let videoId: string | null = null;

  // youtu.be 단축 링크
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) videoId = shortMatch[1];

  // watch?v=
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (!videoId && watchMatch?.[1]) videoId = watchMatch[1];

  // embed URL
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (!videoId && embedMatch?.[1]) videoId = embedMatch[1];

  // shorts URL
  const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (!videoId && shortsMatch?.[1]) videoId = shortsMatch[1];

  // videoId 있으면 embed URL 반환
  if (videoId) return `https://www.youtube.com/embed/${videoId}`;

  // fallback
  return url;
}


export default function VlogCardItem({ item, id, playingId, setPlayingId, updatePlayerState, onClick, playerStatesRef, isOtherVideoPlaying, visibleIds, setVisibleIds }: VlogCardItemProps) {


  const { videoUrl } = item;
  
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLDivElement | null>(null);
  const videoEmbedUrl = getEmbedUrl(videoUrl) + "?enablejsapi=1&autoplay=1&controls=0&rel=0&modestbranding=1&mute=1";

  const isPlaying = playingId === id;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      // console.log("📥 YouTube IFrame API script 삽입됨");
    }
  }, []);

  // ==========================
  // YouTube API 로드 확인 및 플레이어 초기화
  // ==========================
  const playerRef = useRef<YTPlayer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerInitialized = useRef<boolean>(false);

  const visibilityTimeout = useRef<NodeJS.Timeout | null>(null);


  // YouTube API 로드
  const waitForYouTubeAPI = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        // YouTube API 이미 로드됨
        // console.log('YouTube API 이미 로드됨')
        resolve();
        return;
      }

      const checkYT = () => {
        if (window.YT && window.YT.Player) {
          // YouTube API 로드 완료
          // console.log('YouTube API 로드 완료')
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
    if (typeof window !== 'undefined' && window.YT?.PlayerState) {
      switch (state) {
        case window.YT.PlayerState.ENDED:
          // console.log(`🔚 [STATE] 영상 ${videoId} 종료됨`);
          break;
          
        case window.YT.PlayerState.PAUSED:
          // console.log(`⏸️ [STATE] 영상 ${videoId} 일시정지됨`);
          break;
          
        case window.YT.PlayerState.PLAYING:
          // console.log(`▶️ [STATE] 영상 ${videoId} 재생 중`);
          break;
          
        case window.YT.PlayerState.BUFFERING:
          // console.log(`⏳ [STATE] 영상 ${videoId} 버퍼링 중`);
          break;
          
        default:
          // console.log(`📝 [STATE] 영상 ${videoId} 기타 상태: ${state}`);
      }
    }
  }, [updatePlayerState]);

  
  // ==========================
  // 리사이즈 초기화
  // ==========================
  useEffect(() => {
    setPlayingId(null);
  }, [isMobile, setPlayingId]);


  // ==========================
  // IntersectionObserver
  // ==========================
  useEffect(() => {
    // if (!isMobile) return;
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isFullyVisible = entry.isIntersecting && entry.intersectionRatio === 1;

        setVisibleIds(prev => {
          if (isFullyVisible && !prev.includes(id)) {
            return [...prev, id].sort((a, b) => a - b); // 정렬 보장
          }
          if (!isFullyVisible) {
            return prev.filter(v => v !== id);
          }
          return prev;
        });

      },
      { threshold: 1.0 }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [isMobile, id, setVisibleIds]);



  // 플레이어 초기화
  useEffect(() => {
    const initializePlayer = async () => {
      // if (!isMobile) return;
      if (!isPlaying || !iframeRef.current || playerInitialized.current) return;

      try {
        await waitForYouTubeAPI();

        if (!iframeRef.current || playerRef.current) {
          return;
        }

        // console.log(`🔧 [PLAYER] 영상 ${id} YT.Player 생성`);

        playerRef.current = new window.YT.Player(iframeRef.current, {
          height: '243',
          width: '162',
          videoId: getVideoId(videoEmbedUrl),
          playerVars: {
            autoplay: 1,
            mute: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
            // 추가 설정으로 이벤트 감지 개선
            disablekb: 0,  // 키보드 단축키 허용
            fs: 1,         // 전체화면 허용
            iv_load_policy: 3,
            loop: 0
          },
          events: {
            onReady: (event: any) => {
              // console.log(`✅ [PLAYER] 영상 ${id} 플레이어 준비 완료`);
              playerInitialized.current = true;

              // 준비 완료 후 재생 시작
              if (isPlaying) {
                // console.log(`▶️ [PLAYER] 영상 ${id} 자동 재생 시작`);
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // console.log(`🔄 [PLAYER] 영상 ${id} onStateChange 이벤트:`, event.data);
              handleStateChange(id, event);
            },
            onError: (event: any) => {
              // console.error(`❌ [PLAYER] 영상 ${id} 에러:`, event.data);
              playerInitialized.current = false;
            }
          }
        });

      } catch (error) {
        // console.error(`❌ [PLAYER] 영상 ${id} 초기화 실패:`, error);
        playerInitialized.current = false;
      }
    };

    initializePlayer();
  }, [isMobile, isPlaying, id, videoEmbedUrl, handleStateChange, waitForYouTubeAPI]);


  // 플레이어 정리
  useEffect(() => {
    if (!isPlaying && playerRef.current) {
      // console.log(`🧹 [PLAYER] 영상 ${id} 플레이어 정리`);

      try {
        // 플레이어 상태 체크 후 정리
        if (typeof playerRef.current.getPlayerState === 'function') {
          const currentState = playerRef.current.getPlayerState();
          // console.log(`📊 [PLAYER] 영상 ${id} 정리 전 상태:`);
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




  return (
    <div
      key={item.id}
      data-aos="fade-up"
      onClick={() => onClick(item.videoUrl)}
      className="vlog-card_contents-item cursor-pointer"
    >
      <div className="img-wrap relative" ref={videoRef}>

        {!isPlaying ? (
          <>
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={isMobile ? 374 : 300}
              height={isMobile ? 181 : 450}
              className="w-full h-full object-cover rounded-lg"
            />
            <PlayButton />
          </>
        ) : (
          <div className="vlog-video">
            <div className="yt-wrapper">
              <div className="yt-frame-container">
                <iframe
                  ref={iframeRef}
                  width="100%"
                  height="100%"
                  src={videoEmbedUrl}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

      </div>
      <p className="mt-2 text-sm font-medium">{item.title}</p>
    </div>
  );
}
