import { SectionInfo, useMixpanel } from "./useMixpanel";
import {
  daangn,
  googleAnalytics,
  kakao as kakaoModule,
  meta as metaModule,
  smartlog as smartlogModule,
  naver,
  googleAds,
} from "@starlawfirm/tracking";

// 카카오 이벤트 타입 정의
export type KakaoTracking =
  | { type: "signUp"; tag: string }
  | { type: "search"; keyword: string; tag: string }
  | { type: "participation"; tag: string };

// 전체 트래킹 파라미터 타입
export type TrackingParams = {
  mixpanel: SectionInfo;
  event: string;
  kakao?: KakaoTracking;
  daangn?: string;
  meta?: string;
  smartlog?: string;
  naver?: string;
  googleAds?: string;
};

const suffixList = [
  "A", "B", "C", "D", "E",
  "AA","AB","AC","A_1",
  "BA","BB","BC",
  "CA","CB","CC","C_1",
  "DA","DB","DC","D_1",
  "EA","EB","EC",
  "FA","FB","FC",
  "GA","GB","GC","G_1","G_2",
  "HA","HB","HC","H_1","H_2","H_3",
  "IA","IB","IC","I_1","I_2","I_3",
  "C_SU1c", "C_SU1k", "C_SU2c", "C_SU2k",
  "C_BS1c", "C_BS1k", "C_BS2c", "C_BS2k",
  "C_DG1c", "C_DG1k", "C_DG2c", "C_DG2k",
  "C_DJ1c", "C_DJ1k", "C_DJ2c", "C_DJ2k"
];

function makeEvents(baseName: string): {
  [key: string]: Partial<TrackingParams> & { event: string };
} {
  const isKakaoOrCall = baseName === "kakao" || baseName === "call";
  return suffixList.reduce((acc, suffix) => {
    const key = `${baseName}${suffix}`;
    acc[key] = {
      event: "consult_action",
      daangn: isKakaoOrCall ? "Purchase" : "SubmitApplication",
      kakao: {
        type: isKakaoOrCall ? "signUp" : "participation",
        tag: key,
      },
      googleAds: isKakaoOrCall ? "Lead" : "Consult",
      meta: isKakaoOrCall ? "Lead" : "Consult",
      smartlog: isKakaoOrCall ? "order" : "q",
      naver: !isKakaoOrCall
        ? "lead"
        : baseName === "call"
        ? "custom001"
        : "custom002",
    };
    return acc;
  }, {} as { [key: string]: Partial<TrackingParams> & { event: string } });
}

const eventBases = [
  "signUpPopup",
  "signUp",
  "signUpTry",
  "dateTime",
  "date",
  "time",
  "consultContent",
  "marriageTypes",
  "childrenWith",
  "call",
  "callTry",
  "kakao",
  "kakaoTry",
  "signUpCall",
  "signUpKakao",
  "immediate",
];

const adTargetInfo: {
  [key: string]: Partial<TrackingParams> & { event: string };
} = eventBases.reduce((acc, base) => ({ ...acc, ...makeEvents(base) }), {});

function toMixpanelKey(eventKey: string): string {
  const matchedSuffix = suffixList
    .sort((a, b) => b.length - a.length)
    .find(suffix => eventKey.endsWith(suffix));

  if (!matchedSuffix) return eventKey;

  const base = eventKey.slice(0, -matchedSuffix.length);
  const snake = base
    .replace(/([A-Z])/g, "_$1")
    .replace(/^_/, "")
    .toLowerCase();
  return `${matchedSuffix.toLowerCase()}_${snake}`;
}

export const useAllTracking = () => {
  const { sendSectionMixpanel } = useMixpanel();

  const sendTracking = ({
    eventKey,
    mixpanel,
  }: {
    eventKey: string;
    mixpanel: SectionInfo;
  }) => {
    const mixpanelParams = {
      ...mixpanel,
      action_type: toMixpanelKey(eventKey),
    };

    sendSectionMixpanel(mixpanelParams);
    if (googleAnalytics.event) googleAnalytics.event?.(eventKey);
  };

  const sendCounselTracking = ({
    eventKey,
    mixpanel,
    channels = {
      googleAnalytics: true,
      daangn: true,
      smartlog: true,
      meta: true,
      naver: true,
      googleAds: true,
    },
  }: {
    eventKey: string;
    mixpanel: SectionInfo;
    channels?: {
      googleAnalytics?: boolean;
      daangn?: boolean;
      smartlog?: boolean;
      meta?: boolean;
      naver?: boolean;
      googleAds?: boolean;
    }
  }) => {
    const autoParams = adTargetInfo[eventKey];
    if (!autoParams) return;

    const {
      event,
      kakao,
      daangn: daangnEvent,
      meta: metaEvent,
      smartlog: smartlogEvent,
      naver: naverEvent,
      googleAds: googleAdsEvent,
    } = autoParams;

    const mixpanelParams = {
      ...mixpanel,
      action_type: toMixpanelKey(eventKey),
    };

    sendSectionMixpanel(mixpanelParams);
    if (channels.googleAnalytics && googleAnalytics.event) {
      googleAnalytics.event?.(eventKey);
      console.log("googleAnalytics.event", eventKey);
    }
    if (channels.daangn && daangnEvent) {
      daangn.event?.(daangnEvent);
      console.log("daangn.event", daangnEvent);
    }
    if (channels.smartlog && smartlogEvent) {
      smartlogModule.track?.(event, smartlogEvent);
      console.log("smartlogModule.track", event, smartlogEvent);
    }
    if (channels.meta && metaEvent) {
      metaModule.event?.(metaEvent, { content_name: "이혼공감솔루션 문의(전환)" });
      console.log("metaModule.event", metaEvent);
    }
    if (channels.naver && naverEvent) {
      naver.event?.(naverEvent);
      console.log("naver.event", naverEvent);
    }
    if (channels.googleAds && googleAdsEvent) {
      googleAds.event?.(toMixpanelKey(eventKey));
      console.log("googleAds.event", toMixpanelKey(eventKey));
    }
    // const pixelId = process.env.NEXT_PUBLIC_DASI_KAKAO_ID || "";

    // if (
    //   typeof window !== "undefined" &&
    //   window.kakaoPixel &&
    //   pixelId &&
    //   kakao
    // ) {
    //   const kakaoPixel = window.kakaoPixel(pixelId);
    //   if (kakao.type === "signUp") {
    //     kakaoPixel.signUp?.(pixelId, kakao.tag);
    //   } else if (kakao.type === "participation") {
    //     kakaoPixel.participation?.(pixelId, kakao.tag);
    //   } else if (kakao.type === "search") {
    //     kakaoPixel.search?.(pixelId, kakao.keyword, kakao.tag);
    //   }
    // }
  };

  return {
    sendTracking,
    sendCounselTracking,
  };
};
