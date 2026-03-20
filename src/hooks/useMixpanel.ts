import { useCookies } from "next-client-cookies";
import { useVisitor } from "@/hooks/useVisitor";
import { useGlobalConfigState } from "@/context/ConfigContext";
import { mixpanel } from "@starlawfirm/tracking";
import { useEffect, useState } from "react";

interface MixpanelData {
  distinct_id?: string;
  insert_id?: string;
  referrer: string;
  domain: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  duration: number;
}

export interface SectionInfo {
  event: string;
  section?: string;
  event_detail?: string;
  button_name?: string;
  action_type?: string;
  content_name?: string;
  article_num?: string;
  content_interaction?: string;
  request_consult_type?: string;
  request_date?: string | null;
  request_time?: string | null;
  request_now?: boolean;
  contact_method?: "kakao" | "call";
  tag_name?: string[];
  article_link?: string;
  wanna_date?: string | null;
  wanna_time?: string | null;
  wanna_now?: boolean;
  children_type?: string;
  marriage_type?: string;
  counsel_types?: string[];
  phone_number?: string;
  navigation_method?: string;
  emotion_value?: string;
  lawyer_gender?: string;
  qna_question?: string;
  user_choice?: string;
  category?: string;
  is_outside_consultation_hours?: boolean;
}

interface MixpanelPostData {
  event: string;
  properties: {
    distinct_id?: string;
    insert_id?: string;
    referrer: string;
    domain: string;
    event_detail: string | string[] | boolean;
    section?: string;
    button_name?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    duration: number;
  };
}

export const sendMixData = async (data: MixpanelPostData) => {
  try {
    const response = await fetch("https://mixpanel.da-si.com/metric", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Mixpanel 데이터 전송 실패:", error);
    throw error;
  }
};

export const useMixpanel = () => {
  const cookieStore = useCookies();
  const state = useGlobalConfigState();
  const { data: visitorData, error } = useVisitor({ extendedResult: false }, { immediate: true });

  const [distinctId, setDistinctId] = useState<string | undefined>();

  useEffect(() => {
    if (error) {
      console.error("FingerprintJS Error:", error);
    }
  }, [error]);

  const visitTime = cookieStore.get("STL_visit_time");
  const serviceId = cookieStore.get("STAR_SERVICE_ID");
  const utmUrl = cookieStore.get("first-connect-utm-url");
  const utmParams = utmUrl ? new URLSearchParams(utmUrl) : null;
  const visitorId = visitorData?.visitorId ?? cookieStore.get("VISITOR_ID");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDistinctId(visitorId);

      if (visitorId && window.mixpanel) {
        window.mixpanel.identify(visitorId);

        let fullUrl = window.location.href;
        try {
          fullUrl = decodeURIComponent(fullUrl);
        } catch (e) {
          console.error("URL 디코딩 실패:", e);
        }

        window.mixpanel.register({
          full_url_path: fullUrl,
        });
      }
    }
  }, [visitorId]);

  const calculateDuration = () => {
    if (!visitTime) return 0;
    const visitDate = new Date(visitTime);
    if (isNaN(visitDate.getTime())) return 0;
    return Math.max(0, new Date().getTime() - visitDate.getTime());
  };

  const getCommonData = (): MixpanelData => {
    const utmSource = utmParams?.get("utm_source");
    const utmMedium = utmParams?.get("utm_medium");
    const utmCampaign = utmParams?.get("utm_campaign");

    return {
      referrer: state.referer === undefined ? "direct" : state.referer,
      domain: window.location.href,
      duration: calculateDuration(),
      ...(visitorId && { visitor_id: visitorId }),
      ...(distinctId && { distinct_id: distinctId }),
      ...(serviceId && { insert_id: serviceId }),
      ...(utmSource && { utm_source: utmSource }),
      ...(utmMedium && { utm_medium: utmMedium }),
      ...(utmCampaign && { utm_campaign: utmCampaign }),
    };
  };

  const sendSectionMixpanel = (sectionInfo: SectionInfo) => {
    if (!window.mixpanel) return;

    const eventDetailMap: Record<string, keyof SectionInfo> = {
      section_view: "section",
      click_button: "button_name",
      consult_action: "action_type",
    };

    const detailKey = eventDetailMap[sectionInfo.event];
    const detailValue = detailKey ? sectionInfo[detailKey] : undefined;

    const properties = {
      ...getCommonData(),
      event_detail: detailValue || sectionInfo.event,
      ...(detailValue ? { [detailKey]: detailValue } : {}),
      ...sectionInfo,
    };

    // console.log("data :", {
    //   event: sectionInfo.event,
    //   properties,
    // });

    sendMixData({
      event: sectionInfo.event,
      properties,
    });
  };

  return {
    sendSectionMixpanel,
  };
};
