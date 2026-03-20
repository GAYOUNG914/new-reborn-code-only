import { useEffect } from "react";
import { getLenis } from "@/utils/lenis";

export function useLenisControl(isStop: boolean) {
  useEffect(() => {
    const lenis = getLenis();
    if (isStop) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [isStop]);
}