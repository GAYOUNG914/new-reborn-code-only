"use client";

import Image from "next/image";
import ReadMoreButton from "@/components/new-reborn/ReadMoreButton";
import useIsMobile from "@/utils/useIsMobile";
import type { VlogResponse } from "@/types/OurStories";
import VlogCardItem from "./VlogCardItem";
import { useState, useCallback, useRef, useEffect } from "react";

type VlogCardProps = {
  type: "work" | "culture";
  title: string;
  description: string;
  coverImage: {
    mobile: string;
    pc: string;
    widthMo: number;
    heightMo: number;
    widthPc: number;
    heightPc: number;
  };
  data: VlogResponse[];
  setActiveVideoUrl: (url: string) => void;
};


export function VlogCard({
  type,
  title,
  description,
  coverImage,
  data,
  setActiveVideoUrl,
}: VlogCardProps) {

  const isMobile = useIsMobile();

  const coverSrc = isMobile ? coverImage.mobile : coverImage.pc;
  const coverWidth = isMobile ? coverImage.widthMo : coverImage.widthPc;
  const coverHeight = isMobile ? coverImage.heightMo : coverImage.heightPc;



  // 현재 재생 중인 영상 ID
  const [playingId, setPlayingId] = useState<number | null>(null);
  
  // 클릭으로 재생된 영상 ID (마우스 이탈해도 계속 재생)
  const [clickedId, setClickedId] = useState<number | null>(null);
  
  // 모든 영상의 YouTube 플레이어 상태를 추적
  const playerStatesRef = useRef<Record<number, number>>({});
  
  // 디버깅을 위한 강제 리렌더링 상태
  const [debugCounter, setDebugCounter] = useState(0);
  

  // 플레이어 상태 업데이트
  const updatePlayerState = useCallback((videoId: number, state: number) => {

    // const prevState = playerStatesRef.current[videoId];
    playerStatesRef.current[videoId] = state;
    
    // 디버깅을 위한 강제 리렌더링
    setDebugCounter(prev => prev + 1);
    
    // YouTube API가 로드된 경우에만 상태에 따른 처리
    // if (typeof window !== 'undefined' && window.YT?.PlayerState) {
      
    //   switch (state) {
    //     case window.YT.PlayerState.ENDED:
    //       console.log(`🔚 [UPDATE] 영상 ${videoId} 종료됨 - 상태 정리`);
    //       // 종료된 영상의 모든 상태 정리
    //       if (playingId === videoId) setPlayingId(null);
    //       if (clickedId === videoId) setClickedId(null);
    //       // 잠시 후 상태에서 제거
    //       setTimeout(() => {
    //         delete playerStatesRef.current[videoId];
    //         setDebugCounter(prev => prev + 1);
    //         console.log(`🗑️ [UPDATE] 영상 ${videoId} 상태 제거됨`);
    //       }, 100);
    //       break;
          
    //     case window.YT.PlayerState.PAUSED:
    //       console.log(`⏸️ [UPDATE] 영상 ${videoId} 일시정지됨`);
    //       break;
          
    //     case window.YT.PlayerState.PLAYING:
    //       console.log(`▶️ [UPDATE] 영상 ${videoId} 재생 중`);
    //       break;
          
    //     case window.YT.PlayerState.BUFFERING:
    //       console.log(`⏳ [UPDATE] 영상 ${videoId} 버퍼링 중`);
    //       break;
          
    //     default:
    //       console.log(`📝 [UPDATE] 영상 ${videoId} 기타 상태: ${getStateString(state)}`);
    //   }
    // }
  }, [playingId, clickedId]);

  // playingId 변경시 즉시 상태 추가 (YouTube API 콜백을 기다리지 않음)
  useEffect(() => {

    if (playingId !== null && typeof window !== 'undefined' && window.YT?.PlayerState) {
      playerStatesRef.current[playingId] = window.YT.PlayerState.PLAYING;
      setDebugCounter(prev => prev + 1);
    }
  }, [playingId]);

  // playingId가 null이 되면 이전 영상 상태 정리
  const prevPlayingIdRef = useRef<number | null>(null);


  useEffect(() => {
    if (prevPlayingIdRef.current !== null && playingId === null) {
      delete playerStatesRef.current[prevPlayingIdRef.current];
      setDebugCounter(prev => prev + 1);
    }
    prevPlayingIdRef.current = playingId;
  }, [playingId]);

  // 다른 영상이 실제로 재생 중인지 확인
  const isOtherVideoPlaying = useCallback((currentVideoId: number) => {
    
    // YouTube API가 로드되지 않았으면 false 반환
    if (typeof window === 'undefined' || !window.YT?.PlayerState) {
      return false;
    }
    
    const allEntries = Object.entries(playerStatesRef.current);
    
    const otherPlayingVideos = allEntries.filter(([videoId, state]) => {
      const videoIdNum = Number(videoId);
      const isOtherVideo = videoIdNum !== currentVideoId;
      const isActuallyPlaying = state === window.YT.PlayerState.PLAYING || 
                               state === window.YT.PlayerState.BUFFERING;
      return isOtherVideo && isActuallyPlaying;
    });
    
    const result = otherPlayingVideos.length > 0;
    
    return result;
  }, [playingId, clickedId, debugCounter]);

  
  // 영상 상태 강제 정리 함수
  const cleanupVideoState = useCallback((videoId: number) => {
    delete playerStatesRef.current[videoId];
    setDebugCounter(prev => prev + 1);
    
    if (playingId === videoId) setPlayingId(null);
    if (clickedId === videoId) setClickedId(null);
  }, [playingId, clickedId]);

  
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 아이템이 보일 때 VlogCardItem에서 report
  const handleVisible = useCallback((id: number) => {
    setVisibleIds(prev => {
      // 중복 방지
      const updated = Array.from(new Set([...prev, id]));

      // 오름차순 정렬 (id가 DOM 순서대로라면)
      return updated.sort((a, b) => a - b);
    });
  }, []);

  useEffect(() => {
    // if (!isMobile) return;
    
    if (visibleIds.length === 0) {
      setPlayingId(null);
      return;
    }

    setPlayingId(visibleIds[currentIndex]);

    const timeoutId = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % visibleIds.length);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isMobile, visibleIds, currentIndex]);




  return (
    <div className={`vlog-card ${type}`}>
      {/* Cover */}
      <div className="vlog-card_cover">
        <Image
          src={coverSrc}
          alt={type}
          width={coverWidth}
          height={coverHeight}
        />
      </div>

      {/* Contents */}
      <div className="vlog-card_contents">
        <div className="vlog-card_contents-head">
          <span>{title.toUpperCase()}</span>
          <p>
            {description}
          </p>
        </div>

        <div className="vlog-card_contents-body grid gap-4">
          {data.flatMap((res) =>
            res.result?.contents?.map((item) => (
              <VlogCardItem
                key={item.id}
                id={item.id}
                item={item}
                playingId={playingId}
                setPlayingId={setPlayingId}
                updatePlayerState={updatePlayerState}
                playerStatesRef={playerStatesRef}
                isOtherVideoPlaying={isOtherVideoPlaying}
                onClick={setActiveVideoUrl}
                cleanupVideoState={cleanupVideoState}
                visibleIds={visibleIds}
                setVisibleIds={setVisibleIds}
              />
            ))
          )}
        </div>

        <ReadMoreButton color="black" />
      </div>
    </div>
  );
}
