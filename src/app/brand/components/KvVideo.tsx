"use client";

import { useEffect, useRef, useState } from 'react';
import "../styles/KvVideo.scss";
import Hls from 'hls.js';
import Image from 'next/image';


import thumbnailImg from "@/app/assets/images/contents/brand_kv_thumbnail.png";
import brandLogo from "@/app/assets/images/contents/brand_kv_logo.png";
import soundIcon from "@/app/assets/images/icons/icon_brand_sound.png";
import muteIcon from "@/app/assets/images/icons/icon_brand_mute.png";

export default function KvVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qualitySelectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [hls, setHls] = useState<Hls | null>(null);
  const [status, setStatus] = useState('플레이어 초기화 중...');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // 초기 상태를 true로 설정 (muted 속성과 일치)
  const streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  const showStatus = (message: string) => {
    setStatus(message);
    // console.log(message);
  };

  const showErrorMsg = (message: string) => {
    setError(message);
    setShowError(true);
    console.error(message);
  };

  const hideError = () => {
    setShowError(false);
  };

  const initializePlayer = () => {
    hideError();
    const video = videoRef.current;
    if (!video) return;

    // 기존 HLS 인스턴스 정리
    if (hls) {
      hls.destroy();
      setHls(null);
    }

    // 비디오 요소 초기화
    video.removeAttribute('src');
    video.load();

    // 사파리는 HLS를 네이티브 지원하므로 직접 소스 설정
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      showStatus('사파리 네이티브 HLS 사용');
      video.src = streamUrl;
      
      video.addEventListener('loadedmetadata', function() {
        showStatus('비디오 로드 완료 (사파리 네이티브)');
        setIsVideoLoaded(true);
      });
      
      video.addEventListener('play', function() {
        setIsPlaying(true);
      });
      
      video.addEventListener('pause', function() {
        setIsPlaying(false);
      });
      
      video.addEventListener('ended', function() {
        setIsEnded(true);
        setIsPlaying(false);
        showStatus('영상 재생 완료');
      });


      // JavaScript로 4초 후 정지 - test
      // video.addEventListener('timeupdate', function() {
      //   if (video.currentTime >= 4) {
      //     setIsEnded(true);
      //     setIsPlaying(false);
      //     showStatus('영상 재생 완료');
      //     video.pause();
      //     video.currentTime = 0;
      //   }
      // });
      
      video.addEventListener('error', function(e) {
        showErrorMsg('사파리 네이티브 HLS 오류: ' + (e as any).message);
      });
      
    } else if (Hls.isSupported()) {
      // HLS.js를 지원하는 브라우저 (Chrome, Firefox 등)
      showStatus('HLS.js 사용');
      
      const hlsInstance = new Hls({
        debug: false, // 디버그 모드 비활성화
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      // ended 이벤트 리스너 추가 (HLS.js용)
      video.addEventListener('play', function() {
        setIsPlaying(true);
      });
      
      video.addEventListener('pause', function() {
        setIsPlaying(false);
      });
      
      video.addEventListener('ended', function() {
        setIsEnded(true);
        setIsPlaying(false);
        showStatus('영상 재생 완료');
      });

      // JavaScript로 4초 후 정지 - test
      // video.addEventListener('timeupdate', function() {
      //   if (video.currentTime >= 4) {
      //     setIsEnded(true);
      //     setIsPlaying(false);
      //     showStatus('영상 재생 완료');
      //     video.pause();
      //     video.currentTime = 0;
      //   }
      // });
      
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
        showStatus(`HLS 매니페스트 로드 완료 (${data.levels.length}개 화질)`);
        setIsVideoLoaded(true);
        
        // 화질 옵션 추가
        if (qualitySelectRef.current) {
          qualitySelectRef.current.innerHTML = '<option value="-1">자동</option>';
          data.levels.forEach((level, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.textContent = `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`;
            qualitySelectRef.current?.appendChild(option);
          });
        }
      });
      
      // hlsInstance.on(Hls.Events.ERROR, function(event, data) {
      //   console.error('HLS.js 오류:', data);
        
      //   if (data.fatal) {
      //     switch(data.type) {
      //       case Hls.ErrorTypes.NETWORK_ERROR:
      //         showErrorMsg('네트워크 오류가 발생했습니다.');
      //         hlsInstance.startLoad();
      //         break;
      //       case Hls.ErrorTypes.MEDIA_ERROR:
      //         showErrorMsg('미디어 오류가 발생했습니다.');
      //         hlsInstance.recoverMediaError();
      //         break;
      //       default:
      //         showErrorMsg(`복구할 수 없는 오류: ${data.details}`);
      //         hlsInstance.destroy();
      //         break;
      //     }
      //   }
      // });
      
      // HLS 인스턴스 설정
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      setHls(hlsInstance);
      
    } else {
      showErrorMsg('이 브라우저는 HLS를 지원하지 않습니다.');
    }
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (video) {
      setIsEnded(false);
      video.play().catch(e => {
        showErrorMsg('재생 실패: ' + (e as Error).message);
      });
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
      showStatus(video.muted ? '음소거됨' : '음소거 해제됨');
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen().catch(e => {
        showErrorMsg('전체화면 실패: ' + (e as Error).message);
      });
    } else if ((video as any).webkitRequestFullscreen) {
      // 사파리용
      (video as any).webkitRequestFullscreen();
    }
  };

  const changeQuality = () => {
    const level = parseInt(qualitySelectRef.current?.value || '-1');
    
    if (hls) {
      hls.currentLevel = level;
      const selectedOption = qualitySelectRef.current?.options[qualitySelectRef.current.selectedIndex];
      showStatus(level === -1 ? '자동 화질 선택' : `화질 변경: ${selectedOption?.text}`);
    }
  };

  useEffect(() => {
    showStatus('플레이어 초기화 중...');
    initializePlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // Intersection Observer를 사용한 스크롤 감지
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video || !isVideoLoaded) return;

          // 섹션이 20% 이상 보이면 재생, 20% 미만이면 일시정지
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            if (video.paused && !isEnded) {
              video.play().catch(e => {
                console.warn('자동 재생 실패:', e);
              });
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: [0, 0.2, 0.5, 1.0], // 0%, 20%, 50%, 100% 지점에서 감지
        rootMargin: '0px 0px -10% 0px' // 하단 10% 여백 추가
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVideoLoaded, isEnded]);

  return (
    // <div className="kv-video" ref={containerRef} data-aos="fade-in" data-aos-duration="1000">
    <div className="kv-video" ref={containerRef} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" >
      <div className="player-container">
        <div className="video-wrapper">
          <video 
            ref={videoRef}
            controls 
            playsInline 
            muted
          >
            브라우저에서 비디오를 지원하지 않습니다.
          </video>

          {/* 백그라운드 이미지 */}
          <div className="vid-bg-image">
            <Image 
                src={thumbnailImg} 
                alt="Video thumbnail" 
                width={800} 
                height={450}
                className="thumbnail-image"
              />   
          </div>

          {/* 썸네일 오버레이 - 재생 전, 로드 전, 재생완료, 정지, 일시정지 */} 
          {(isEnded) && (
            <div className="thumbnail-overlay">
              <Image 
                src={thumbnailImg} 
                alt="Video thumbnail" 
                width={800} 
                height={450}
                className="thumbnail-image"
              />                  
              <div className="replay-overlay">
                <div className="center">
                  <div className="text">
                    다시 시작해
                  </div>
                  <button onClick={playVideo} className="replay-button">
                      브랜드 필름 다시보기
                  </button>
                </div>
                <div className="bottom">
                  <Image src={brandLogo} alt="brand-logo" />
                </div>
              </div>
            </div>
          )}             

          {/* {(isPlaying) && (
            <button onClick={toggleMute} className="mute-button">
              {isMuted ? 
              <Image src={muteIcon} alt="mute-icon" />
              :<Image src={soundIcon} alt="sound-icon" /> }
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}