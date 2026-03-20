"use client";

import { Header, Footer, BackgroundWatcher } from "@starlawfirm/header-footer-layout";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState, createContext, useMemo, useContext, Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { type OutputData } from "@editorjs/editorjs";
import ArticleContentsView from "@/app/stories/article/ArticlePageHome";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import BaseAnalyticsProvider from "@/components/Analytics/BaseAnalyticsProvider";
import { useVisitor } from "@/hooks/useVisitor";
import { useCookies } from "next-client-cookies";
import { type ArticleContentsMetadata } from "@/types/contents";
import CounselEvent from "@/components/CounselEvent";
import { CounselProvider, useCounsel } from "@/context/CounselContext";
import CounselComponent from "@/components/CounselComponent";
import { ModalProvider } from "@/context/ModalContext";
import { SectionInfo, useMixpanel } from "@/hooks/useMixpanel";
import { getLenis } from '@/utils/lenis';
import { useLenisControl } from "@/hooks/useLenisControl";
import { UAParser } from "ua-parser-js";
import logger from '@/utils/logger';
import { useAllTracking } from "@/hooks/useAllTracking";

interface WorkoutClientWrapperProps {
  articleId: string;
  metadata: ArticleContentsMetadata;
  contents: OutputData;
  errorCheck: boolean;
}

export function WorkoutClientWrapper({
  articleId,
  metadata,
  contents,
  errorCheck = false,
}: WorkoutClientWrapperProps) {

  const cookieStore = useCookies();
  const { data: visitorData } = useVisitor({ extendedResult: false }, { immediate: false });
  const visitorId = visitorData?.visitorId ?? cookieStore.get("VISITOR_ID");
  const { state } = useCounsel();
  const moNav = document.querySelector('.moNavPop')?.classList.contains('view');

  if (state.modalOpen) {
    if (!moNav) {
      const lenis = getLenis();
      if (lenis) {
        lenis.stop();
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
    }
  } else {
    if (!moNav) {
      const lenis = getLenis();
      if (lenis) {
        lenis.start();
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
      }
    }
  }

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  const muiTheme = createTheme();
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={"ko"}
      dateFormats={{
        seconds: "YYYY년 MM월 DD일",
        normalDate: "YYYY년 MM월",
        shortDate: "YYYY년 MM월",
      }}
    >
      {/* <Suspense fallback={null}>
            <BaseAnalyticsProvider />
          </Suspense> */}
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ArticleContentsView
          content={contents ?? { blocks: [] }}
          metadata={metadata}
          userId={visitorId ?? ""}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

// 클라이언트 사이드에서만 로드할 컴포넌트들
const AOSInitNoSSR = dynamic(() => import("@/utils/AOSInit"), { ssr: false });
const LenisProviderNoSSR = dynamic(() => import("@/components/LenisProvider"), {
  ssr: false,
});

// 1. 애니메이션 상태 공유를 위한 컨텍스트 생성
const AnimationStatusContext = createContext({
  isHeaderAnimationDone: false,
  setIsHeaderAnimationDone: (isDone: boolean) => { },
});

// 페이지 전환 관리 컴포넌트
const PageTransition = ({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) => (
  <motion.div
    key={pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    id="pageTransitionWrapper"
  >
    {children}
  </motion.div>
);

function MainLayout({ children, setIsLoadingHeaderAnimationDone, defaultColor }: { children: React.ReactNode, setIsLoadingHeaderAnimationDone: (isDone: boolean) => void, defaultColor: "black" | "white" }) {
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const showLayout = !isMainPage || isMainPage;
  const { sendSectionMixpanel } = useMixpanel();

  const [moNavView, setMoNavView] = useState<boolean>(false);

  // useEffect(() => {
  //   // 첫 방문 여부 확인 (localStorage 사용)
  //   const isFirstVisit = localStorage.getItem('isFirstVisit');

  //   // 새로고침 시 로딩 영상 재생 (sessionStorage 사용)
  //   const isRestart = sessionStorage.getItem('isRestart');

  //   // 첫 방문이 아니라면 로딩 영상 숨김
  //   if (!isFirstVisit) {
  //     if(isRestart){
  //       sessionStorage.setItem('isRestart', 'false');
  //     }
  //     localStorage.setItem('isFirstVisit', 'true');
  //   }else{
  //     sessionStorage.setItem('isRestart', 'true');
  //   }

  // }, []);

  if (moNavView) {
    document.querySelector('.moNavCon')?.setAttribute("data-lenis-prevent-wheel", "");
    document.querySelector('.moNavCon')?.setAttribute("data-lenis-prevent-touch", "");
  }

  useLenisControl(moNavView);

  // 컨텐츠 로딩 상태 감지
  useEffect(() => {
    const checkContentLoaded = () => {
      const contentElements = document.querySelectorAll('#pageTransitionWrapper');
      if (contentElements.length > 0) {
        setIsContentLoaded(true);
      }
    };

    // 초기 체크
    checkContentLoaded();

    // MutationObserver를 사용하여 DOM 변경 감지
    const observer = new MutationObserver(checkContentLoaded);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  //header 와 counsel 애니메이션 처리
  useEffect(() => {

    if (pathname !== "/") return;
    const waitforLayout = () => {
      if (typeof window === "undefined") return;

      const header = document.querySelector("header") as HTMLElement;
      const counsel = document.querySelector(".counselWrap") as HTMLElement;
      const isRestart = sessionStorage.getItem('isRestart');

      if (header && counsel) {
        const onTransitionEnd = (event: TransitionEvent) => {
          if (event.propertyName === 'transform') {
            setIsLoadingHeaderAnimationDone(true);
            // scrollStart()
          }
        };
        header.addEventListener('transitionend', onTransitionEnd);

        requestAnimationFrame(() => {
          // header.style.opacity = '1';

          if (isRestart) {
            header.style.transition = "none";
            counsel.style.transition = "none";
          }

          header.style.transform = "translateY(0px)";
          counsel.style.transform = "translateY(0px)";
        });
      } else {
        setTimeout(waitforLayout, 100);
      }
    };

    waitforLayout();
  }, [pathname, setIsLoadingHeaderAnimationDone]);


  return (
    <>
      <AOSInitNoSSR />

      <CounselProvider>
        <ModalProvider>
          {showLayout && (
            <HeaderWrapper headType="workout" callback={sendSectionMixpanel} classChange={setMoNavView} defaultColor={defaultColor} />
          )}

          <LenisProviderNoSSR>
            <AnimatePresence mode="wait" initial={false}>
              <PageTransition pathname={pathname}>{children}</PageTransition>
            </AnimatePresence>
          </LenisProviderNoSSR>

          {showLayout && isContentLoaded && (
            <Footer footType="workout" callback={sendSectionMixpanel} />
          )}

          {showLayout && (
            <CounselComponent />
          )}
        </ModalProvider>
      </CounselProvider>
    </>
  );
}

export function HeaderWrapper({ headType = "workout", callback, classChange, defaultColor }: { headType: "main" | "workout" | "dasi", callback: (sectionInfo: SectionInfo) => void, classChange: Dispatch<SetStateAction<boolean>>, defaultColor: "black" | "white" | null }) {
  const { dispatch } = useCounsel();
  const { sendTracking } = useAllTracking();

  return (
    <BackgroundWatcher defaultFillColor={defaultColor ?? "white"} backgroundWatchCommand={false} scrollCommand={true} alwaysTransparent={false} unTransparent={false}>
      <Header headType={headType} callback={callback} classChange={classChange} dispatch={dispatch} sendTracking={sendTracking} />
    </BackgroundWatcher>
  );
}

export function RootLayoutClientWrapper({ children, defaultColor }: { children: ReactNode, defaultColor: "black" | "white" }) {
  const [isHeaderAnimationDone, setIsHeaderAnimationDone] = useState(false);

  return (
    <AnimationStatusContext.Provider value={{ isHeaderAnimationDone, setIsHeaderAnimationDone }}>
      <MainLayout setIsLoadingHeaderAnimationDone={setIsHeaderAnimationDone} defaultColor={defaultColor}>{children}</MainLayout>
    </AnimationStatusContext.Provider>
  );
}

export function MainClientWrapper({ uaParserData }: { uaParserData: UAParser.IResult | null }) {
  const [loading, setLoading] = useState(true);
  const [isLoadingAnimationDone, setIsLoadingAnimationDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isHeaderAnimationDone } = useContext(AnimationStatusContext);
  const isRestart = sessionStorage.getItem('isRestart');

  // useEffect(() => {
  //   if(isRestart){
  //     setIsLoadingAnimationDone(true);
  //   }

  //   const lenis = getLenis();
  //   if (lenis) {
  //     lenis.stop();
  //     document.body.style.overflow = "hidden";
  //     document.documentElement.style.overflow = "hidden";
  //   }
  // }, []);

  useEffect(() => {
    // if(isRestart){
    setIsLoadingAnimationDone(true);
    // }
  }, []);

  useEffect(() => {
    if (isHeaderAnimationDone) {
      setIsLoadingAnimationDone(true);
    }
  }, [isHeaderAnimationDone]);

  useEffect(() => {
    if (uaParserData) {
      setIsMobile(uaParserData.device.type === "mobile");
    }
    if (uaParserData === null && window) {
      const ua = window.navigator.userAgent;
      const uaParser = new UAParser(ua);
      const uaParserData = uaParser.getResult();
      setIsMobile(uaParserData.device.type === "mobile");
    }
  }, [uaParserData, window]);

  return (
    <>
      <></>
      <CounselEvent />
    </>
  );
}
