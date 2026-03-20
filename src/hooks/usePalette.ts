"use client";

import { useState, useEffect } from "react";

type HSL = { h: number; s: number; l: number };

const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const mod = (n: number, m: number) => ((n % m) + m) % m;

// ==== HEX <-> RGB/HSL ====
function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim();
  const m = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h.padEnd(6, '0').slice(0, 6);
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  const to2 = (v: number) => v.toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = 60 * (((g - b) / d) % 6); break;
      case g: h = 60 * (((b - r) / d) + 2); break;
      case b: h = 60 * (((r - g) / d) + 4); break;
    }
  }
  return { h: mod(h, 360), s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(mod(h / 60, 2) - 1));
  const m = l - C / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (0 <= h && h < 60) { r1 = C; g1 = X; b1 = 0; }
  else if (60 <= h && h < 120) { r1 = X; g1 = C; b1 = 0; }
  else if (120 <= h && h < 180) { r1 = 0; g1 = C; b1 = X; }
  else if (180 <= h && h < 240) { r1 = 0; g1 = X; b1 = C; }
  else if (240 <= h && h < 300) { r1 = X; g1 = 0; b1 = C; }
  else { r1 = C; g1 = 0; b1 = X; }
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return { r, g, b };
}

function hslToHex({ h, s, l }: HSL) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// ==== WCAG 대비 계산용 (상대 휘도) ====
function relLuminance(r: number, g: number, b: number) {
  const srgb = [r, g, b].map(v => v / 255).map(v =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  const [R, G, B] = srgb;
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1: string, hex2: string) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  const L1 = relLuminance(a.r, a.g, a.b);
  const L2 = relLuminance(b.r, b.g, b.b);
  const [hi, lo] = [Math.max(L1, L2), Math.min(L1, L2)];
  return (hi + 0.05) / (lo + 0.05);
}

// 목적 대비가 되도록 L을 미세 조정
function tuneLightnessForContrast(baseHex: string, hsl: HSL, target = 3.0) {
  let best = { ...hsl };
  let bestHex = hslToHex(best);
  let bestRatio = contrastRatio(baseHex, bestHex);

  // 위/아래로 10스텝씩 탐색 (±0.2)
  const steps = 10;
  for (const dir of [-1, +1]) {
    for (let i = 1; i <= steps; i++) {
      const lTry = clamp(hsl.l + dir * 0.02 * i, 0.05, 0.95);
      const candidate = { ...hsl, l: lTry };
      const hex = hslToHex(candidate);
      const cr = contrastRatio(baseHex, hex);
      if (cr > bestRatio) { bestRatio = cr; best = candidate; bestHex = hex; }
      if (cr >= target) return candidate; // 목표 달성 시 조기 종료
    }
  }
  return best;
}

// ==== 메인: 팔레트 생성 ====
export function palette5(hex: string) {
  const baseRgb = hexToRgb(hex);
  const base = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  const baseL = clamp(base.l, 0.12, 0.88);

  // 유사색 (채도 조금 죽이고, 명도 변화를 각각 다르게)
  const a1: HSL = { h: mod(base.h - 30, 360), s: clamp(base.s * 0.9, 0.05, 0.95), l: clamp(baseL + 0.08, 0.1, 0.9) };
  const a2: HSL = { h: mod(base.h - 15, 360), s: clamp(base.s * 0.9, 0.05, 0.95), l: baseL };
  const a3: HSL = { h: mod(base.h + 15, 360), s: clamp(base.s * 0.9, 0.05, 0.95), l: clamp(baseL - 0.06, 0.1, 0.9) };

  // 보색 (180° 회전 + 대비 보정)
  const comp0: HSL = {
    h: mod(base.h + 180, 360),
    s: clamp(0.1 + 0.9 * base.s, 0.15, 0.9),
    l: baseL
  };
  const comp = tuneLightnessForContrast(hex, comp0, 3.0);

  // 무채색 (채도 거의 0, 명도는 기본에서 ±0.12 이동)
  const grayLike: HSL = { h: base.h, s: 0.02, l: clamp(baseL - 0.12, 0.12, 0.88) };
  if (contrastRatio(hex, hslToHex(grayLike)) < 1.5) {
    grayLike.l = clamp(baseL + 0.12, 0.12, 0.88);
  }

  return {
    base: hex.toUpperCase(),
    analogous: [hslToHex(a1), hslToHex(a2), hslToHex(a3)],
    complementary: hslToHex(comp),
    nearAchromatic: hslToHex(grayLike)
  };
}

// 이미지에서 dominant color 추출 후 팔레트 생성하는 훅
const colorCache = new Map<string, string>(); // 캐시

export const useDominantColorPalette = (imageSrc: string) => {
  const [dominantColor, setDominantColor] = useState<string>('#000000');
  const [palette, setPalette] = useState(palette5('#000000'));

  useEffect(() => {
    if (!imageSrc) return;

     if (colorCache.has(imageSrc)) {
      setDominantColor(colorCache.get(imageSrc)!);
      return;
    }


    const extractDominantColor = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        try {
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (!imageData) return;
          
          const data = imageData.data;
          const colorCounts: { [key: string]: number } = {};
          
          // 샘플링하여 성능 향상 (모든 픽셀 대신 일부만)
          for (let i = 0; i < data.length; i += 16) { // 4픽셀씩 건너뛰기
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // 색상을 그룹화 (정밀도를 낮춰서 유사한 색상들을 묶음)
            const colorKey = `${Math.floor(r / 32) * 32},${Math.floor(g / 32) * 32},${Math.floor(b / 32) * 32}`;
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
          }
          
          // 가장 많이 사용된 색상 찾기
          let maxCount = 0;
          let dominantColorKey = '';
          
          Object.entries(colorCounts).forEach(([colorKey, count]) => {

            if (count > maxCount) {
              maxCount = count;
              dominantColorKey = colorKey;
            }
          });

          
          if (dominantColorKey) {
            const [r, g, b] = dominantColorKey.split(',').map(Number);
            const hexColor = rgbToHex(r, g, b);
            setDominantColor(hexColor);
            setPalette(palette5(hexColor));
          }
        } catch (error) {
          console.log('색상 추출 실패:', error);
        }
      };
      
      img.src = imageSrc;
    };

    extractDominantColor();
  }, [imageSrc]);

  return { dominantColor, palette };
};