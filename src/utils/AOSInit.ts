"use client";

import { useEffect } from 'react';
import AOS from 'aos';

const AOSInit = () => {
  useEffect(() => {
    // 브라우저 환경인지 확인
    if (typeof window !== 'undefined') {
      // 사파리 브라우저 감지
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      AOS.init({
        // 사파리에 최적화된 설정
        duration: isSafari ? 600 : 800, // 사파리에서는 더 짧은 지속 시간
        delay: 100,
        mirror: true,
        easing: isSafari ? 'ease' : 'ease-out-cubic', // 사파리에서는 더 단순한 이징
        offset: 120, // 애니메이션 트리거 오프셋
        disable: false, // 필요한 경우 사파리에서 비활성화할 수 있음
      });

      // 리사이즈 시 AOS 재가동을 위한 디바운싱
      let resizeTimeout: NodeJS.Timeout;
      
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          // 리사이즈 완료 후 AOS 새로고침
          AOS.refresh();
        }, 250); // 250ms 디바운싱
      };

      // 리사이즈 이벤트 리스너 추가
      window.addEventListener('resize', handleResize);

      // 컴포넌트 언마운트 시 정리
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimeout);
      };
    }
  }, []);

  return null;
};

export default AOSInit;