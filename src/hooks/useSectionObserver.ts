import { useEffect, useRef } from "react";

interface SectionConfig {
  className?: string;
  id?: string;
  event: string;
  section: string;
  offset?: number;
  [key: string]: unknown;
}

interface UseSectionObserverProps {
  sectionClassNames?: SectionConfig[];
  onIntersect?: (sectionInfo: SectionConfig) => void;
}

interface SectionPosition {
  top: number;
  bottom: number;
  section: SectionConfig;
}

const useSectionObserver = ({
  sectionClassNames = [],
  onIntersect,
}: UseSectionObserverProps) => {
  const sectionPositions = useRef<SectionPosition[]>([]);
  const lastIntersectedSection = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined" || !sectionClassNames?.length) return;

    // 섹션 위치 정보 초기화
    const updateSectionPositions = () => {
      sectionPositions.current = sectionClassNames
        .map((config) => {
          let element: Element | null = null;

          if (config.id) {
            element = document.getElementById(config.id);
          } else if (config.className) {
            element = document.querySelector(`[class*="${config.className}"]`);
          }

          if (!element) return null;

          const rect = element.getBoundingClientRect();
          return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            section: config,
          };
        })
        .filter((pos): pos is SectionPosition => pos !== null);
    };

    // 초기 위치 정보 설정
    updateSectionPositions();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      const currentSection = sectionPositions.current.find((pos) => {
        // offset이 있는 경우 해당 값을 더하고, 없는 경우 기본값(viewportHeight/2) 사용
        const scrollCenter =
          scrollY + (pos.section.offset ?? viewportHeight / 2);
        return scrollCenter >= pos.top && scrollCenter <= pos.bottom;
      });

      if (
        currentSection &&
        currentSection.section.section !== lastIntersectedSection.current
      ) {
        lastIntersectedSection.current = currentSection.section.section;
        onIntersect?.(currentSection.section);
      }
    };

    // 리사이즈 시 위치 정보 업데이트
    const handleResize = () => {
      updateSectionPositions();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [sectionClassNames, onIntersect]);
};

export default useSectionObserver;
