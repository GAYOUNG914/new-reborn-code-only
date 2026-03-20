/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="gtag.js" />
declare module "gtag.js";

export {};

import { ReactNode, RefObject } from "react";

export interface DatetimeParams {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  timestamp?: number;
}

declare global {
  interface String {
    /**
     * 대상 문자열에 특정 문자열을 원하는 위치에 삽입합니다.
     * @param {number} offset 특정 문자열을 삽입할 위치를 지정합니다. (before)
     * @param {string} text 삽입할 문자열입니다.
     * @param {number} [removeCount=0] 기존의 문자열 중 삽입할 위치 뒤 덮어쓸 범위를 지정합니다.
     * @returns {string} 변경된 문자열을 반환합니다.
     */
    splice: (arg1: number, arg2: string, arg3?: number) => string;
  }

  interface Window {
    pageConstants: any;
    gtag: Gtag.Gtag;
    dataLayer: window.dataLayer | [];
    wcs_add: any;
    wcs_do: any;
    kakaoPixel: any;
    fbq: any;
    karrotPixel: any;
    wcs: any;
    Kakao: any;
    mixpanel: any;

    YT: {
      Player: new (element: HTMLElement | HTMLIFrameElement | string, config: {
        height?: string;
        width?: string;
        videoId?: string;
        playerVars?: Record<string, number | string>;
        events?: {
          onStateChange: (event: { data: number }) => void;
          onReady?: any;
          onError?: any;
        };
      }) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }

  interface ElementBaseProps {
    children?: ReactNode;
  }
}
