import { useState, useRef, useCallback, useEffect } from 'react';
import VideoItem from './VideoItem';
import { YourStoriesContent } from '@/types/YourStories';

type Props = {
  className?: string;
  items: YourStoriesContent[];
  currentSize: number;
};

export default function VideoList({
  items,
  currentSize,
}: Props) {

  // 모바일 IntersectionObserver용 lockedId
  const [lockedId, setLockedId] = useState<number | null>(null);
  
  // 현재 재생 중인 영상 ID
  const [playingId, setPlayingId] = useState<number | null>(null);
  
  // 클릭으로 재생된 영상 ID (마우스 이탈해도 계속 재생)
  const [clickedId, setClickedId] = useState<number | null>(null);
  
  // 모든 영상의 YouTube 플레이어 상태를 추적
  const playerStatesRef = useRef<Record<number, number>>({});
  
  // 디버깅을 위한 강제 리렌더링 상태
  const [debugCounter, setDebugCounter] = useState(0);
  
  // 상태 문자열 변환 (디버깅용)
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
  }, [playingId, clickedId, debugCounter]); // debugCounter를 의존성에 추가

  // 영상 상태 강제 정리 함수
  const cleanupVideoState = useCallback((videoId: number) => {
    delete playerStatesRef.current[videoId];
    setDebugCounter(prev => prev + 1);
    
    if (playingId === videoId) setPlayingId(null);
    if (clickedId === videoId) setClickedId(null);
  }, [playingId, clickedId]);

  // 모든 영상 정지 함수 (터치 이벤트에서 사용)
  const stopAllVideos = useCallback(() => {
    // console.log('🛑 [STOP_ALL] 모든 영상 정지 요청');
    
    // 모든 플레이어 상태 정리
    Object.keys(playerStatesRef.current).forEach(videoId => {
      delete playerStatesRef.current[Number(videoId)];
    });
    
    // 상태 초기화
    setPlayingId(null);
    setClickedId(null);
    setLockedId(null);
    
    setDebugCounter(prev => prev + 1);
  }, [setPlayingId, setClickedId, setLockedId]);


  return (
    <div className="video-list" data-aos="fade-up">
      
      {items.map((item) => (
        <VideoItem
          key={item.id}
          id={item.id}
          data={item}
          currentSize={currentSize}
          lockedId={lockedId}
          setLockedId={setLockedId}
          playingId={playingId}
          setPlayingId={setPlayingId}
          clickedId={clickedId}
          setClickedId={setClickedId}
          playerStatesRef={playerStatesRef}
          updatePlayerState={updatePlayerState}
          isOtherVideoPlaying={isOtherVideoPlaying}
          cleanupVideoState={cleanupVideoState}
          stopAllVideos={stopAllVideos}
        />
      ))}
    </div>
  );
}