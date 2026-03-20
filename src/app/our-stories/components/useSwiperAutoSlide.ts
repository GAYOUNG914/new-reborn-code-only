import { useRef, useCallback } from "react";
import { Swiper as SwiperClass } from "swiper";

export function useSwiperAutoSlide(swiperRef: React.RefObject<SwiperClass | null>, delay = 2000) {
  const timerRef = useRef<number | null>(null);

  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      if (swiperRef.current && !swiperRef.current.destroyed) {
        swiperRef.current.slideNext();
      }
    }, delay);
  }, [swiperRef, delay]);

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { startAutoSlide, stopAutoSlide };
}