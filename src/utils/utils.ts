"use client";

import gsap from 'gsap';
import { getLenis } from './lenis';

export function addClass(elem: Element | NodeListOf<Element>, className: string) {
  const nodeList = elem as NodeListOf<Element>;
  const length = nodeList.length;

  if (length > 1) {
    for (let i = 0; i < length; i++) {
      if (!nodeList[i].classList.contains(className)) {
        nodeList[i].classList.add(className);
      }
    }
  } else {
    if (!(elem as Element).classList.contains(className)) {
      (elem as Element).classList.add(className);
    }
  }
}

export function removeClass(elem: Element | NodeListOf<Element>, className: string) {
  const nodeList = elem as NodeListOf<Element>;
  const length = nodeList.length;

  if (length > 1) {
    for (let i = 0; i < length; i++) {
      if (nodeList[i].classList.contains(className)) {
        nodeList[i].classList.remove(className);
      }
    }
  } else {
    if ((elem as Element).classList.contains(className)) {
      (elem as Element).classList.remove(className);
    }
  }
}

// /* FPS 구하기 */
// export let fps = 0;
// let lastTime = performance.now();
// let frameCount = 0;

// export function getFPS() {
//   const now = performance.now();
//   const deltaTime = now - lastTime;
  
//   frameCount++;
  
//   if (deltaTime >= 1000) {
//     fps = frameCount;
//     frameCount = 0;
//     lastTime = now;
//   }

//   requestAnimationFrame(getFPS);
// }


export function resetNodes($target: Element) {
  [].forEach.call($target.querySelectorAll('*'), ($node: Element) => {
    if (($node as { _gsap?: unknown })._gsap) {
      gsap.set($node, { clearProps: true });
    }
  });
}


// 글자수 세기
export function countText (textarea: HTMLTextAreaElement, count: HTMLElement, textareaBox: HTMLElement, fixHeight: boolean) {

  const length = textarea.value.length;

  // 글자수 업데이트
  count.textContent = length.toString();

  // 글자가 입력되었을 때 스타일 변경
  if (length > 0) {
    textareaBox.classList.add('fill');
  } else {
    textareaBox.classList.remove('fill');
  }

  if (fixHeight) {
    textarea.style.height = 'auto';
    textarea.style.height = length > 0 ? `${textarea.scrollHeight}px` : 'revert-layer'; // 내용에 맞게 높이 조정
  }
  

}


export function scrollTop() {
  if (typeof window === 'undefined') return;
  const lenis = getLenis();
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(0, { offset: 0, immediate: true });
  } else {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }
}


// Countdown Timer
export function startCountdown(targetDate: string | number | Date, $section: HTMLElement) {
  // Check if we're on the client side
  if (typeof window === 'undefined') return;

  const $dayTimer = $section.querySelector('.day strong');
  const $hourTimer = $section.querySelector('.hour strong');
  const $minTimer = $section.querySelector('.min strong');
  const $secTimer = $section.querySelector('.sec strong');

  if (!$dayTimer || !$hourTimer || !$minTimer || !$secTimer) return;

  const targetTime = new Date(targetDate).getTime();

  function updateTimer() {
    const now = Date.now();
    const remainingTime = targetTime - now;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // 2자리로 만들기
    const formattedDay = String(days).padStart(2, "0");
    const formattedHour = String(hours).padStart(2, "0");
    const formattedMin = String(minutes).padStart(2, "0");
    const formattedSec = String(seconds).padStart(2, "0");

    if ($dayTimer && $hourTimer && $minTimer && $secTimer) {
      $dayTimer.textContent = formattedDay;
      $hourTimer.textContent = formattedHour;
      $minTimer.textContent = formattedMin;
      $secTimer.textContent = formattedSec;
    }
  }

  // 초기 실행 및 1초마다 갱신
  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);

  // Clean up interval on unmount
  return () => clearInterval(timerInterval);
}

export function hideFadeUp(target: string, duration: number = 0.5, delay: number = 0) {
  gsap.set(`${target} span`, {
    opacity: 0,
    yPercent: 100
  });
  
  gsap.to(`${target} span`, {
    opacity: 1,
    yPercent: 0,
    duration: duration,
    delay: delay,
    ease: 'expo.out'
  });
}

// 모바일 디바이스 체크
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

// 스크롤 제어
export function controlScroll(disable: boolean) {
  if (typeof window === 'undefined') return;
  
  const lenis = getLenis();
  
  if (disable) {
    if (isMobileDevice()) {
      // 모바일일 경우
      const disableScroll = () => {
        window.scrollTo(0, window.scrollY);
      };
      window.addEventListener('scroll', disableScroll);
      document.body.style.overflow = 'hidden';
    } else {
      // 데스크톱일 경우
      if (lenis) {
        lenis.stop();
        document.body.style.overflow = 'hidden';
      }
    }
  } else {
    // 스크롤 활성화
    if (isMobileDevice()) {
      window.removeEventListener('scroll', () => window.scrollTo(0, window.scrollY));
      document.body.style.overflow = '';
    } else {
      if (lenis) {
        lenis.start();
        document.body.style.overflow = '';
      }
    }
  }
}