import "../styles/ShapeSwiper.scss";
import Image from "next/image";
import useIsMobile from "@/utils/useIsMobile";
import BrandTitle from "./BrandTitle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ShapeItem, ShapeSwiperItem } from "@/types/Brand";
import { getLenis } from "@/utils/lenis";

gsap.registerPlugin(ScrollTrigger);

// 전역 플래그: 현재 Lenis를 제어하고 있는 ShapeSwiper ID
let currentControllingSwiperId: string | null = null;

interface ShapeSwiperProps {
  sectionName: string;
  title: string;
  subTitle: string;
  list: ShapeSwiperItem[];
  shapes: ShapeItem[];
}

export default function ShapeSwiper({
  sectionName,
  title,
  subTitle,
  list,
  shapes
}: ShapeSwiperProps) {

  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);
  const originalLerpRef = useRef<number | null>(null);
  const isInSectionRef = useRef(false);
  const isLastSlideStoppedRef = useRef(false); // 마지막 슬라이드에서 stop 상태
  
  // 고유 ID 생성 (sectionName 사용)
  const swiperId = useRef(sectionName).current;

  const [fadeTitle, setFadeTitle] = useState(list[0].title);
  const [fadeSubTitle, setFadeSubTitle] = useState(list[0].subTitle);
  const [fadeDesc, setFadeDesc] = useState<{ __html: string }>({
    __html: list[0].desc,
  });

  const lenis = getLenis();

  // iOS + /brand 페이지에서 전역 터치 스크롤 속도 조정
  useEffect(() => {
    if (!isMobile) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isBrandPage = typeof window !== 'undefined' && window.location.pathname.includes('/brand');
    
    if (isIOS && isBrandPage && lenis) {
      const originalGlobalLerp = lenis.options.lerp || 0.1;
      const slowLerp = 0.06; // brand 페이지 전역 느린 속도
      
      lenis.options.lerp = slowLerp;
      // console.log(`[Global] /brand 페이지 - 느린 터치 스크롤 적용: ${slowLerp}`);
      
      return () => {
        // cleanup: 원래 속도로 복구
        lenis.options.lerp = originalGlobalLerp;
        // console.log(`[Global] /brand 페이지 이탈 - 원래 속도 복구: ${originalGlobalLerp}`);
      };
    }
  }, [isMobile, lenis]);

  // 모바일: 페이지 스크롤로 슬라이드 제어
  useEffect(() => {
    if (!isMobile || !containerRef.current || !innerRef.current) return;

    const container = containerRef.current;
    const inner = innerRef.current;
    const bullets = container.querySelectorAll<HTMLLIElement>(".b-c_pagination .bullet");
    const box = container.querySelector<HTMLDivElement>(".b-c_box");
    const slideCount = list.length;
    
    // iOS 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // URL 기반 설정 - /brand 페이지에서는 더 느린 터치 스크롤
    const isBrandPage = typeof window !== 'undefined' && window.location.pathname.includes('/brand');
    
    // Lenis 인스턴스 가져오기
    // const lenis = typeof window !== 'undefined' ? (window as any).lenis : null;

    // iOS용 슬라이드 인덱스 계산 (각 구간에 더 오래 머물도록)
    const getSlideIndexForIOS = (progress: number): number => {
      // iOS: 각 슬라이드 구간을 더 넓게 설정
      // 첫 슬라이드는 40%, 중간 슬라이드는 30%, 마지막은 30%
      // 예: 3개 슬라이드 → 0.0~0.4 (슬라이드 0), 0.4~0.7 (슬라이드 1), 0.7~1.0 (슬라이드 2)
      
      if (slideCount === 2) {
        return progress < 0.5 ? 0 : 1;
      }
      
      if (slideCount === 3) {
        if (progress < 0.4) return 0;
        if (progress < 0.7) return 1;
        return 2;
      }
      
      // 4개 이상인 경우 동적 계산
      const thresholds: number[] = [];
      for (let i = 1; i < slideCount; i++) {
        thresholds.push(0.4 + (i - 1) * (0.6 / (slideCount - 1)));
      }
      
      for (let i = 0; i < thresholds.length; i++) {
        if (progress < thresholds[i]) return i;
      }
      return slideCount - 1;
    };

    // 스크롤 진행도에 따라 슬라이드 업데이트
    const updateSlideFromScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // 섹션이 화면에 있는지 체크 (더 넓은 범위)
      const isCurrentlyInSection = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;
      
      // iOS Lenis lerp 제어 (현재 제어권이 있는 경우에만)
      if (isIOS && lenis) {
        if (isCurrentlyInSection && !isInSectionRef.current) {
          // 섹션 진입: 제어권 획득
          if (currentControllingSwiperId === null || currentControllingSwiperId === swiperId) {
            currentControllingSwiperId = swiperId;
            
            if (originalLerpRef.current === null) {
              originalLerpRef.current = lenis.options.lerp || 0.1;
            }
            // /brand 페이지에서는 더 느린 터치 스크롤
            const targetLerp = isBrandPage ? 0.02 : 0.03;
            lenis.options.lerp = targetLerp;
            // console.log(`[${swiperId}] lerp 설정: ${targetLerp} (brand: ${isBrandPage})`);
            isInSectionRef.current = true;
          }
        } else if (!isCurrentlyInSection && isInSectionRef.current) {
          // 섹션 이탈: 제어권 반납
          if (currentControllingSwiperId === swiperId) {
            if (originalLerpRef.current !== null) {
              lenis.options.lerp = originalLerpRef.current;
            }
            currentControllingSwiperId = null;
            isInSectionRef.current = false;
          }
        }
      }
      
      // 섹션이 화면에 진입했는지 체크
      if (rect.top > windowHeight || rect.bottom < 0) return;
      
      // 스크롤 진행도 계산 (0 ~ 1)
      const scrollProgress = Math.max(0, Math.min(1, 
        -rect.top / (containerHeight - windowHeight)
      ));
      
      // iOS와 안드로이드 다르게 처리
      const newIndex = isIOS 
        ? getSlideIndexForIOS(scrollProgress)
        : Math.min(slideCount - 1, Math.floor(scrollProgress * slideCount));
      
      // index 변경 시에만 업데이트
      if (prevIndexRef.current !== newIndex) {
        prevIndexRef.current = newIndex;
        setIndex(newIndex);

        
        // yPercent 계산 및 애니메이션
        const yPercent = -(newIndex * (100 / slideCount));
        gsap.to(inner, {
          yPercent,
          duration: 0.6,
          ease: "power1.out",
          // onStart: () => {
          //   if (isIOS && lenis && currentControllingSwiperId === swiperId) {
          //     lenis.stop();
          //     lenis.options.lerp = 0.0001;
          //     setTimeout(() => {
          //       lenis.start();
          //     }, 50);
          //   }
          // },
          // onComplete: () => {
          //   if (isIOS && lenis && currentControllingSwiperId === swiperId) {
          //     lenis.stop();
          //     setTimeout(() => {
          //       lenis.start();
          //     }, 50);
          //   }
          // }
        });
        
        bullets.forEach((b, i) => b.classList.toggle("active", i === newIndex));
        if (box) box.classList.toggle("hide", newIndex > 0);
      }
    };

    // 마지막 슬라이드에서 아래로 스크롤 시 다음 섹션으로
    let touchStartY = 0;
    
    const handleDownwardScroll = () => {
      if (isIOS && lenis && isLastSlideStoppedRef.current && currentControllingSwiperId === swiperId) {
        lenis.start();
        isLastSlideStoppedRef.current = false;
      }
    };
    
    const handleWheel = (e: WheelEvent) => {
      if (isLastSlideStoppedRef.current && e.deltaY > 0) {
        // 아래로 휠
        handleDownwardScroll();
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isLastSlideStoppedRef.current) {
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        if (diff > 30) {
          // 아래로 스와이프 (30px 이상)
          handleDownwardScroll();
        }
      }
    };

    // 스크롤 이벤트 리스너 (쓰로틀링)
    let ticking = false;
    let lastUpdateTime = 0;
    
    const handleScroll = () => {
      const now = Date.now();
      const throttleDelay = isIOS ? 150 : 0; // iOS는 150ms 쓰로틀링
      
      if (now - lastUpdateTime < throttleDelay) {
        return; // iOS에서 너무 빠른 스크롤 이벤트 무시
      }
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSlideFromScroll();
          lastUpdateTime = Date.now();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // iOS 전용: 마지막 슬라이드에서 아래로 스크롤 감지
    if (isIOS) {
      container.addEventListener('wheel', handleWheel, { passive: true });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
    }
    
    // 초기 상태 설정
    updateSlideFromScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      // iOS 이벤트 리스너 제거
      if (isIOS) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
      
      // cleanup: iOS Lenis 복구 (제어권이 있는 경우에만)
      if (isIOS && lenis && currentControllingSwiperId === swiperId) {
        // lerp 복구
        if (originalLerpRef.current !== null) {
          lenis.options.lerp = originalLerpRef.current;
          originalLerpRef.current = null;
        }
        // 멈춰있을 수 있으니 다시 시작
        lenis.start();
        
        // 제어권 반납
        currentControllingSwiperId = null;
      }
      isInSectionRef.current = false;
      isLastSlideStoppedRef.current = false;
    };
  }, [isMobile, list.length, swiperId]);

  // 데스크탑: 기존 GSAP ScrollTrigger
  useEffect(() => {
    if (isMobile || !containerRef.current || !innerRef.current) return;

    const container = containerRef.current;
    const inner = innerRef.current;
    const bullets = container.querySelectorAll<HTMLLIElement>(".b-c_pagination .bullet");
    const box = container.querySelector<HTMLDivElement>(".b-c_box");
    const slideCount = list.length;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        snap: {
          snapTo: 1 / (slideCount - 1),
          duration: { min: 0.3, max: 0.6 },
          delay: 0.5,
          ease: "linear"
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const newIndex = Math.round(progress * (slideCount - 1));
          
          if (prevIndexRef.current !== newIndex) {
            prevIndexRef.current = newIndex;
          setIndex(newIndex);

            bullets.forEach((b, i) => b.classList.toggle("active", i === newIndex));
            if (box) box.classList.toggle("hide", newIndex > 0);
          }
        },
      },
    });

    tl.to(inner, { yPercent: 0, ease: "none", duration: 1 })
      .to(inner, { yPercent: -33.33, ease: "none", duration: 1 })
      .to(inner, { yPercent: -66.66, ease: "none", duration: 1 });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isMobile, list.length]);



  // index가 바뀔 때마다 fade-in/out
  useEffect(() => {
    if (!textWrapRef.current) return;

    const textWrap = textWrapRef.current;

    // ⚡ 성능 최적화: 간단한 애니메이션
    const fadeOut = gsap.to(textWrap, {
      opacity: 0,
      duration: 0.2,
      ease: "power1.inOut",
      onComplete: () => {
        setFadeTitle(list[index].title);
        setFadeSubTitle(list[index].subTitle);
         setFadeDesc({ __html: list[index].desc });
        
        gsap.to(textWrap, {
      opacity: 1,
      duration: 0.3,
      ease: "power1.inOut"
        });
      }
    });

    return () => {
      fadeOut.kill();
    };
  }, [index, list]);



  return (
    <section className={`section-shape-swiper ${sectionName}`} ref={containerRef}>
      <div className={`section-shape-swiper-inner`}>
        <div className="b-c_head">
          <div className="b-c_head-inner">
            <BrandTitle title={title} desc={subTitle} />
          </div>
        </div>

        <div className="text-wrap" ref={textWrapRef}>
          <span className="title">{fadeTitle}</span>
          <span className="sub-title">{fadeSubTitle}</span>
          <p className="desc" dangerouslySetInnerHTML={fadeDesc} />
        </div>

        <div className="b-c_body">
          <div className="b-c_body-inner" ref={innerRef}>
            {list.map((item, i) => (
              <div className="b-c_item" key={i}>
                  <Image
                    src={isMobile ? item.imgSrcMo : item.imgSrcPc}
                    alt={item.title}
                    width={isMobile ? item.wMo : item.wPc}
                    height={isMobile ? item.hMo : item.hPc}
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
              </div>
            ))}
          </div>
        </div>

        <div className="b-c_box"></div>

        <div className="b-c_pagination">
          <ul>
            {list.map((_, i) => (
              <li key={i} className="bullet"></li>
            ))}
          </ul>
        </div>


        {shapes.map((shape) => (
          <div key={shape.id} className={`shape ${shape.id}`}>
            <Image
              src={isMobile ? shape.imgMo : shape.imgPc}
              alt={shape.id}
              width={isMobile ? shape.wMo : shape.wPc}
              height={isMobile ? shape.hMo : shape.hPc}
              loading="lazy"
            />
          </div>
        ))}

      </div>
    </section>
  );
}
