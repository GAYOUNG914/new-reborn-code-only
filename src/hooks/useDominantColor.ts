import { useState, useEffect } from 'react';

export const useDominantColor = (imageSrc: string) => {
  const [dominantColor, setDominantColor] = useState<string>('#000000');

  useEffect(() => {
    if (!imageSrc) return;

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
            setDominantColor(`rgb(${r}, ${g}, ${b})`);
          }
        } catch (error) {
          console.log('색상 추출 실패:', error);
        }
      };
      
      img.src = imageSrc;
    };

    extractDominantColor();
  }, [imageSrc]);

  return dominantColor;
}; 