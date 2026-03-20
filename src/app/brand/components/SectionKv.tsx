"use client";

import Image from "next/image";
import "../styles/SectionKv.scss";
import KvVideo from "./KvVideo";
import KvLyricMotion from "./KvLyricMotion";
import gsap from "gsap";
import KvScrollMotion from "@/components/new-reborn/KvScrollMotion";


import bgImg from "@/app/assets/images/contents/brand_kv_bg_pc.png";
import bgImgMo from "@/app/assets/images/contents/brand_kv_bg_mo.png";
import { useEffect, useRef } from 'react';
import { resetNodes } from '@/utils/utils';


export default function SectionKv() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const scrollMotionRef = useRef<HTMLDivElement>(null);

  let timeline: gsap.core.Timeline;
  let sectionHeight = 0;

  // 전체 section
  useEffect(() => {
    function createSecTimeline() {
      if(timeline) timeline.kill();
      resetNodes(sectionRef.current as Element);
      
      timeline = gsap.timeline({ paused: true });

    }

    function handleScroll() {
      if (!sectionRef.current || !timeline || !bgImageRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      // bg-image position 동적 변경
      if (sectionBottom <= windowHeight) {
        bgImageRef.current.classList.add('absolute');
        scrollMotionRef.current?.classList.add('absolute');
      } else {
        bgImageRef.current.classList.remove('absolute');
        scrollMotionRef.current?.classList.remove('absolute');
      }
      
      // 섹션이 화면에 보이는 범위 계산
      // 섹션이 화면에 완전히 들어왔을 때부터 시작
      if (sectionTop <= 0 && sectionBottom >= windowHeight) {
        // 스크롤 진행도 계산 (0~1)
        const scrollProgress = Math.abs(sectionTop) / (sectionHeight - windowHeight);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
        
        // timeline progress 업데이트
        timeline.progress(clampedProgress);
        
        // console.log('Scroll progress:', clampedProgress);
      } else if (sectionTop > 0) {
        // 섹션이 화면 위에 있을 때
        timeline.progress(0);
      } else if (sectionBottom < windowHeight) {
        // 섹션이 화면 아래로 완전히 벗어났을 때
        timeline.progress(1);
      }
    }

    // 초기 설정
    createSecTimeline();
    sectionHeight = sectionRef.current?.offsetHeight || 0;
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      sectionHeight = sectionRef.current?.offsetHeight || 0;
      createSecTimeline();
    });

    // 정리
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeline) timeline.kill();
    };
  }, []);

  return (
    <div className="section-kv" ref={sectionRef}>
      <div className="section-kv-data-wrapper">
        <div className="kv-hero-section">
          <div className="kv-title-wrapper" ref={titleRef}>
            <div className="kv-title-section_title h4_n" data-aos="fade-up" data-aos-duration="500" data-aos-delay="100" >
                브랜드 소개
            </div>
            <div className="kv-title-section_desc s1_n" data-aos="fade-up" data-aos-duration="500" data-aos-delay="200">
                리본회생의 사람들이 내부 과정을 <br />
                그려나가는 이야기
            </div>
          </div>
          <div className="kv-video-wrapper" ref={videoSectionRef}>
            <KvVideo />
          </div>
        </div>
        <div className="kv-lyric-section">
          <KvLyricMotion bgImageRef={bgImageRef as React.RefObject<HTMLDivElement>} scrollMotionRef={scrollMotionRef as React.RefObject<HTMLDivElement>} />
        </div>
      </div>
      <div className="bg-image" ref={bgImageRef}>
        <div className="images">
          <Image className="pc-tablet-only" src={bgImg} alt="bg" width={1920} height={1080} />
          <Image className="mo-only" src={bgImgMo} alt="bg" width={400} height={870} />
        </div>
      </div>
      <div className="scroll-motion-wrapper" ref={scrollMotionRef} data-aos="fade-in" data-aos-duration="1000" data-aos-delay="300">
        <KvScrollMotion />
      </div>
    </div>
  );
}