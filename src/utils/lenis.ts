"use client";

// import Lenis from '@studio-freight/lenis';
import Lenis from 'lenis';

export let lenis: Lenis | null = null;

// 클라이언트 사이드에서만 Lenis 초기화
export function initLenis() {
  // 이미 초기화되어 있다면 리턴
  if (typeof window === 'undefined') return;

  if (lenis) return;

  try {

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // console.log('isTouchDevice', isTouchDevice)

    lenis = new Lenis({
      // duration: isTouchDevice ? 1.8 : 1.2,
      duration: 1.2,
      wheelMultiplier: 0.5,
      touchMultiplier: 0.2,
      // touchMultiplier: 0.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      if (!lenis) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
  } catch (error) {
    console.error('Failed to initialize Lenis:', error);
  }
}

// lenis 인스턴스 가져오기
export function getLenis() {
  if (typeof window === 'undefined') return;
  
  return lenis;
}

// 스크롤 제어 함수
export function scrollTo(target: number | HTMLElement, options?: { immediate?: boolean; lock?: boolean; onComplete?: (lenis: Lenis) => void }) {
  if (!lenis) return;

  lenis.scrollTo(target, options);
} 