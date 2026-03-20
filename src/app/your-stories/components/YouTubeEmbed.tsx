// YouTubeEmbed.tsx (새로 생성하거나 기존 파일 수정)

import React, { useEffect, useRef } from 'react';

interface YouTubeEmbedProps {
  videoSrc: string;
  title: string;
}

export default function YouTubeEmbed({ 
  videoSrc, 
  title, 
}: YouTubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube API 스크립트 로드
  useEffect(() => {
    // 이미 스크립트가 로드되어 있으면 리턴
    if (window.YT) return;
    
    console.log('📜 [YOUTUBE] YouTube API 스크립트 로드 시작');
    
    // YouTube IFrame API 스크립트 추가
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    
    // 전역 콜백 함수 설정
    window.onYouTubeIframeAPIReady = () => {
      console.log('✅ [YOUTUBE] YouTube IFrame API 준비 완료');
    };
    
    document.head.appendChild(script);
    
    return () => {
      // cleanup은 하지 않음 (전역 API이므로)
    };
  }, []);

  return (
    <div className="youtube-embed-wrapper" style={{ width: '100%', height: '100%' }}>
      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        src={`${videoSrc}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        id={`youtube-player-${Math.random().toString(36).substr(2, 9)}`}
      />
    </div>
  );
}