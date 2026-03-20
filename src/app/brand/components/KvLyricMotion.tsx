"use client";

import "../styles/KvLyricMotion.scss";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { resetNodes } from "@/utils/utils";

import arrowImg from "@/app/assets/images/contents/brand_kv_lyric_arrow.png";

interface KvLyricMotionProps {
  bgImageRef: React.RefObject<HTMLDivElement>;
  scrollMotionRef: React.RefObject<HTMLDivElement>;
}

export default function KvLyricMotion({ bgImageRef, scrollMotionRef }: KvLyricMotionProps) {
  const lyricSectionRef = useRef<HTMLDivElement>(null);
  const lyricItemWrapperRef = useRef<HTMLDivElement>(null);
  const lyricItemRef1 = useRef<HTMLDivElement>(null);
  const lyricItemRef2 = useRef<HTMLDivElement>(null);
  const lyricItemRef3 = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [marginNum, setMarginNum] = useState(isMobile ? 130 : 150);
  // 폰트 pc 일 때 24->36 , 모바일 일 때 16->24

  let timeline: gsap.core.Timeline;
  let sectionHeight = 0;

  // 리사이즈 이벤트 처리
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      setMarginNum(newIsMobile ? 130 : 150);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    function createSecTimeline() {
      if(timeline) timeline.kill();
      // resetNodes(lyricSectionRef.current as Element);
      
      timeline = gsap.timeline({ 
        paused: true,
        onUpdate: () => {
          // 현재 progress에 따라 활성 요소 결정
          const progress = timeline.progress();
          const lyricItems = lyricSectionRef.current?.querySelectorAll('.lyric-item');
          
          if (lyricItems) {
            lyricItems.forEach((item, index) => {
              // progress 구간별로 활성 요소 결정 (lyricItem 개수만큼 구간으로 나눔)
              const stage = Math.floor(progress * lyricItems.length);
              item.classList.toggle('on', index === stage);
            });
          }
        }
      });

      // 초기 y 값 설정 (0, marginNum, marginNum * 2)
      gsap.set(lyricItemRef1.current, { y: '0px' });
      gsap.set(lyricItemRef2.current, { y: `${marginNum}px` });
      gsap.set(lyricItemRef3.current, { y: `${marginNum * 2}px` });

      // timeline.to(lyricItemWrapperRef.current, 
      //   {opacity: 1, y: '0', duration: 0.3, ease: 'ease'}, 
      //   0
      // );
      
      // 첫 번째 기점 (0.33): 모든 p 요소를 -150px씩 이동, 세 번째 요소 opacity 1로
      timeline.to([lyricItemRef1.current, lyricItemRef2.current, lyricItemRef3.current], 
        {y: `-=${marginNum}px`, duration: 0.3, ease: 'linear'}, 
        0.33
      );
      timeline.to(lyricItemRef3.current, 
        {opacity: 1, duration: 0.3, ease: 'linear'}, 
        0.33
      );
      
      // 두 번째 기점 (0.66): 모든 p 요소를 다시 -150px씩 이동, 첫 번째 요소 opacity 0으로
      timeline.to([lyricItemRef1.current, lyricItemRef2.current, lyricItemRef3.current], 
        {y: `-=${marginNum}px`, duration: 0.3, ease: 'linear'}, 
        0.66
      );
      timeline.to(lyricItemRef1.current, 
        {opacity: 0, duration: 0.3, ease: 'linear'}, 
        0.66
      );
      
      // console.log('Timeline created:', timeline);
    }

    function handleScroll() {
      if (!lyricSectionRef.current || !timeline) return;
      
      const rect = lyricSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      
      // 섹션이 화면에 보이는 범위 계산
      if (sectionTop <= 0 && sectionBottom >= windowHeight) {
        // 스크롤 진행도 계산 (0~1)
        const scrollProgress = Math.abs(sectionTop) / (sectionHeight - windowHeight);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // timeline progress 업데이트
        timeline.progress(clampedProgress);

        //화면 dim
        if(!bgImageRef.current?.classList.contains('dim-opacity')){
          bgImageRef.current?.classList.add('dim-opacity');
        }
        if(!lyricSectionRef.current?.classList.contains('active')){
          lyricSectionRef.current?.classList.add('active');
        }
        if(!scrollMotionRef.current?.classList.contains('fade-out')){
          scrollMotionRef.current?.classList.add('fade-out');
        }
        
        // console.log('Scroll progress:', clampedProgress);
      } else if (sectionTop > 0) {
        // 섹션이 화면 위에 있을 때
        timeline.progress(0);
        
        //화면 dim
        if(bgImageRef.current?.classList.contains('dim-opacity')){
          bgImageRef.current?.classList.remove('dim-opacity');
        }
        if(lyricSectionRef.current?.classList.contains('active')){
          lyricSectionRef.current?.classList.remove('active');
        }
        if(scrollMotionRef.current?.classList.contains('fade-out')){
          scrollMotionRef.current?.classList.remove('fade-out');
        }
      } else if (sectionBottom < windowHeight) {
        // 섹션이 화면 아래로 완전히 벗어났을 때
        timeline.progress(1);
        
        // 마지막 lyricItem에 on 클래스 유지
        const lyricItems = lyricSectionRef.current.querySelectorAll('.lyric-item');
        lyricItems.forEach((item, index) => {
          if (index === lyricItems.length - 1) {
            item.classList.add('on');
          } else {
            item.classList.remove('on');
          }
        });
      }
    }

    // 초기 설정
    createSecTimeline();
    sectionHeight = lyricSectionRef.current?.offsetHeight || 0;
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      sectionHeight = lyricSectionRef.current?.offsetHeight || 0;
      createSecTimeline();
    });

    // 정리
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeline) timeline.kill();
    };
  }, [isMobile, marginNum]);

  return (
    <div className="kv-lyric-motion" ref={lyricSectionRef}>
      <div className="sticky">
        <div className="kv-lyric-motion-inner">
          <div className="lyric-item-wrapper" ref={lyricItemWrapperRef}>
            <div className="lyric-item lyric-item-01 on">
              <p className="s1_n" ref={lyricItemRef1}>누구나 처음은 <br />낯설고 두렵습니다.</p>
            </div>
            <div className="lyric-item lyric-item-02">  
              <p className="s1_n" ref={lyricItemRef2}>
                우리는 처음부터 잘할 수 없고, <br />
                때로는 실수하기도 하죠.
              </p>
            </div>
            <div className="lyric-item lyric-item-03">
              <p className="s1_n" ref={lyricItemRef3}>
                리본회생은 다시 시작할 수 있다는 <br />
                용기와 위로를 담아 <br />
                <strong>세 가지 시선</strong>으로 이야기를 전합니다.
              </p>
            </div>
            <div className="lyric-arrow">
              <Image src={arrowImg} alt="arrow" width={230} height={10} />
              {/* <div className="arrow-mid"></div>
              <div className="arrow-end"></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}