"use client";

import { useEffect, useRef, useState, useMemo, useLayoutEffect, useCallback } from 'react';
import "../styles/AudioPlayer.scss";
import Image from 'next/image';

import playIcon from "@/app/assets/images/icons/icon_ys_play.png";
import pauseIcon from "@/app/assets/images/icons/icon_ys_pause.png";
import refreshIcon from "@/app/assets/images/icons/icon_ys_refesh.png";
import { audioManager } from '../hooks/useAudioManager';

// 스키마 기반 타입 정의
interface AudioContent {
  id: number;
  title: string;
  voiceActor: string;
  subtitle: string;
  tagIds: string[];
  imageUrl: string;
  audioUrl: string;
  timeLength: number;
  hide: boolean;
}

interface AudioPlayerProps {
  content: AudioContent; // 스키마 기반 콘텐츠 객체
  className?: string;
}

export default function AudioPlayer({ content, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingOnSeekStartRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // HTML5 Audio 초기화
  useEffect(() => {
    const audio = new Audio(content.audioUrl);
    audioRef.current = audio;
    
    // 초기 duration 설정
    setDuration(content.timeLength);
    
    // 이벤트 리스너 설정
    const handleLoadedMetadata = () => {
      // console.log('Audio loaded metadata:', {
      //   duration: audio.duration,
      //   apiDuration: content.timeLength
      // });
      setDuration(audio.duration || content.timeLength);
    };
    
    const handleTimeUpdate = () => {
      const currentAudioTime = audio.currentTime;
      const audioDuration = audio.duration || duration || content.timeLength;
      
      // 오디오 끝에 가까우면 정확한 값으로 조정
      if (audioDuration - currentAudioTime < 0.1) {
        setCurrentTime(audioDuration);
      } else {
        setCurrentTime(currentAudioTime);
      }
      
      // 5초마다 디버그 로그
      if (Math.floor(currentAudioTime) % 5 === 0 && Math.abs(currentAudioTime % 1) < 0.1) {
        // console.log('TimeUpdate:', {
        //   currentTime: currentAudioTime.toFixed(2),
        //   duration: audioDuration.toFixed(2),
        //   remaining: (audioDuration - currentAudioTime).toFixed(2)
        // });
      }
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
      setIsEnded(false);
      audioManager.pauseAllExcept(content.id);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      if (audioManager.getCurrentlyPlaying() === content.id) {
        audioManager.setCurrentlyPlaying(null);
      }
    };
    
    const handleEnded = () => {
      const finalDuration = audio.duration || duration || content.timeLength;
      // console.log('Audio ended - setting final values:', {
      //   audioDuration: audio.duration,
      //   currentDuration: duration,
      //   finalDuration
      // });
      setIsPlaying(false);
      setIsEnded(true);
      // 정확히 duration과 같은 값으로 설정하여 remainingTime이 0이 되도록
      setCurrentTime(finalDuration);
      if (audioManager.getCurrentlyPlaying() === content.id) {
        audioManager.setCurrentlyPlaying(null);
      }
    };
    
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
    };
    
    // 이벤트 리스너 등록
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // 전역 일시정지 이벤트 리스너
    const handlePauseAudio = (event: CustomEvent) => {
      const { exceptId } = event.detail;
      if (exceptId !== content.id && audio && !audio.paused) {
        audio.pause();
        setIsPlaying(false);
      }
    };
    
    window.addEventListener('pauseAudio', handlePauseAudio as EventListener);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      window.removeEventListener('pauseAudio', handlePauseAudio as EventListener);
      
      if (audioManager.getCurrentlyPlaying() === content.id) {
        audioManager.setCurrentlyPlaying(null);
      }
    };
  }, [content.audioUrl, content.id]);

  // 타이틀 오버플로우 체크 함수
  const checkTitleOverflow = useCallback(() => {
    if (titleContainerRef.current && titleRef.current) {
      const containerWidth = titleContainerRef.current.clientWidth;
      const textWidth = titleRef.current.scrollWidth;

      // console.log("🔍 [OVERFLOW CHECK]", {
      //   containerWidth,
      //   textWidth,
      //   isOverflowing: textWidth > containerWidth
      // });

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
  }, []);

  // 재생/일시정지 토글 함수
  const handlePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!audioRef.current) return;


    // 재생 전에 오버플로우 체크
    if (audioRef.current.paused) {
      checkTitleOverflow();
    }

    if (!audioRef.current.paused) {
      // 현재 재생 중이면 일시정지
      audioRef.current.pause();
      e.currentTarget.classList.remove("playing");
      e.currentTarget.classList.add("stop");
    } else {
      // 현재 정지 중이면 재생
      audioRef.current.play();
      e.currentTarget.classList.add("playing");
      e.currentTarget.classList.remove("stop");
    }
  };

  // 시간 포맷 함수
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 시크 함수 - 클릭 위치 계산
  const calculateSeekPosition = (clientX: number) => {
    if (!progressBarRef.current || !audioRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = x / rect.width;
    
    if (percentage < 0) percentage = 0;
    if (percentage > 1) percentage = 1;

    const newTime = audioRef.current.duration * percentage;
    
    // 현재 시간 업데이트
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // 드래그 시작
  const handleSeekStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    e.preventDefault(); // 기본 동작 방지
    
    wasPlayingOnSeekStartRef.current = !audioRef.current.paused;
    if (wasPlayingOnSeekStartRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setIsSeeking(true);
    
    // 클릭/터치 위치로 즉시 이동
    if ('touches' in e) {
      calculateSeekPosition(e.touches[0].clientX);
    } else {
      calculateSeekPosition(e.clientX);
    }
  };

  // 드래그 중
  const handleSeekMove = (e: MouseEvent | TouchEvent) => {
    if (!isSeeking) return;

    e.preventDefault();
    
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    calculateSeekPosition(clientX);
  };

  // 드래그 종료
  const handleSeekEnd = () => {
    setIsSeeking(false);
    
    // 드래그 시작 전에 재생 중이었다면 다시 재생
    if (wasPlayingOnSeekStartRef.current && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 전역 이벤트 리스너 추가/제거
  useEffect(() => {
    if (isSeeking) {
      document.addEventListener('mousemove', handleSeekMove);
      document.addEventListener('mouseup', handleSeekEnd);
      document.addEventListener('touchmove', handleSeekMove, { passive: false });
      document.addEventListener('touchend', handleSeekEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleSeekMove);
      document.removeEventListener('mouseup', handleSeekEnd);
      document.removeEventListener('touchmove', handleSeekMove);
      document.removeEventListener('touchend', handleSeekEnd);
    };
  }, [isSeeking]);

  // 진행률 계산
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;



  // 타이틀 오버플로우
  const titleContainerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useLayoutEffect(() => {
    // 컴포넌트 마운트 시 초기 오버플로우 체크
    checkTitleOverflow();
  }, [content.title, checkTitleOverflow]);

  // 재생 상태 변경 시에도 오버플로우 체크
  useEffect(() => {
    if (isPlaying) {
      checkTitleOverflow();
    }
  }, [isPlaying, checkTitleOverflow]);

  return (
    <div className={`player-wrap ${className}`}>
      <div className="player-item">
        <div className="controls">

            <div className="player-wrapper">

              <div className="player-left">
                <button 
                    onClick={handlePlayPause}
                    className={`${isPlaying ? "playing" : "stop"} player-button`}
                  >
                  <div className="player-thumbnail">
                    <Image
                      src={content.imageUrl}
                      alt={content.title}
                      width={212}
                      height={212}
                      className="thumbnail-image"
                      onError={(e) => {
                        // 이미지 로드 실패 시 기본 이미지로 대체
                        const target = e.target as HTMLImageElement;
                        target.src = '/workout-v2/audio/your-stories/reterview/default-thumbnail.jpg';
                      }}
                    />
                    {/* 재생/일시정지,새로고침 아이콘 오버레이 */}
                    <div className={`thumbnail-overlay fadeElement show ${isEnded ? 'dark' : ''}`}>
                      <div className={`thumbnail-overlay_image ${isEnded ? 'refresh' : ''}`}>
                        {isEnded ? <Image src={refreshIcon} alt="refresh" width={49} height={49} /> : <Image src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? "pause" : "play"} width={52} height={52} />}
                      </div>
                    </div>
                  </div>
                </button>
                <div className="player-content">
                  {/* 상단: 성우 정보 */}
                  <div className="player-content_header">
                    <div className="player-content_header_left">
                      <div className="badge">
                        {content.voiceActor}
                      </div>
                      <div className="subtitle">
                        {content.subtitle}
                      </div>
                    </div>
                    {/* 하단: 태그 */}
                    <div className="player-content_tags gray02">
                      {content.tagIds.map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>                    
                  </div>
                  {/* 중앙: 메인 제목 */}
                  {/* <div className="player-content_title">
                    <strong>{content.title}</strong>
                  </div> */}

                  <div className="player-content_title" ref={titleContainerRef}>
                    <span 
                      className={`marquee ${isOverflow && isPlaying ? "animate" : ""}`}
                    >
                      <span ref={titleRef} className="marquee__inner">
                        <strong>{content.title}</strong>
                        {
                          isOverflow && isPlaying &&
                          <strong aria-hidden="true">{content.title}</strong>
                        }
                      </span>
                    </span>
                  </div>

                  <div 
                    className="progress-bar-wrapper"
                  >
                    <div className="time-display_current time-display">
                      <span>{formatTime(Math.round(currentTime))}</span>
                    </div>

                    <div 
                    ref={progressBarRef}
                    className="progress-bar-container"
                    onMouseDown={handleSeekStart}
                    onTouchStart={handleSeekStart}
                    style={{ cursor: 'pointer' }}
                  >
                      <div
                        className="progress-bar"
                        style={{ width: `${progressPercentage}%` }}
                      />
                      <div
                        className="seek-handle"
                        style={{ left: `${progressPercentage}%` }}
                      />
                    </div>

                    <div className="time-display_duration time-display">
                      <span>{formatTime(Math.round(duration) - Math.round(currentTime))}</span>
                    </div>
                    
                  </div>                  
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}