import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface CounselState {
  category: "call" | "kakao" | null;
  phoneNumber: string;
  wannaDate: string | null;
  wannaTime: string | null;
  wannaNow: boolean;
  isPrivacyAgreed: boolean;
  counselTypes: string[];
  // marriageType: string;
  // childrenType: string;
  modalOpen: boolean;
  locationTracking: string;
  isCounselSuccess: boolean;
  // lawyerType: string;
  clickTime: string | null;
  prevPhoneNumber: string | null;
}

export type BaseAction =
  | { type: "categorySet"; category: "call" | "kakao" }
  | { type: "phoneNumberSet"; phoneNumber: string }
  | { type: "wannaDateSet"; wannaDate: string | null }
  | { type: "wannaTimeSet"; wannaTime: string | null }
  | { type: "wannaNowSet"; wannaNow: boolean }
  | { type: "isPrivacyAgreedSet"; isPrivacyAgreed: boolean };

export type WorkoutAction =
  | BaseAction
  | { type: "counselTypesSet"; counselTypes: string[] }
  // | { type: "marriageTypeSet"; marriageType: string }
  // | { type: "childrenTypeSet"; childrenType: string }
  | { type: "modalOpenSet"; modalOpen: boolean }
  | { type: "isCounselSuccessSet"; isCounselSuccess: boolean }
  | { type: "locationTrackingSet"; locationTracking: string }
  // | { type: "lawyerTypeSet"; lawyerType: string }
  | { type: "clickTimeSet"; clickTime: string | null }
  | { type: "prevPhoneNumberSet"; prevPhoneNumber: string | null }
  | { type: "dataReset" };

export type CounselAction = WorkoutAction;

export const initialState: CounselState = {
  category: null,
  phoneNumber: "",
  wannaDate: null,
  wannaTime: null,
  wannaNow: false,
  isPrivacyAgreed: true,
  counselTypes: [],
  // marriageType: "",
  // childrenType: "",
  modalOpen: false,
  locationTracking: "",
  isCounselSuccess: false,
  // lawyerType: "",
  clickTime: null,
  prevPhoneNumber: null,
};

export function counselReducer(
  state: CounselState,
  action: CounselAction,
): CounselState {
  switch (action.type) {
    case "categorySet":
      return { ...state, category: action.category };
    case "phoneNumberSet":
      return { ...state, phoneNumber: action.phoneNumber };
    case "wannaDateSet":
      return { ...state, wannaDate: action.wannaDate };
    case "wannaTimeSet":
      return { ...state, wannaTime: action.wannaTime };
    case "wannaNowSet":
      return { ...state, wannaNow: action.wannaNow };
    case "isPrivacyAgreedSet":
      return { ...state, isPrivacyAgreed: action.isPrivacyAgreed };
    case "counselTypesSet":
      return { ...state, counselTypes: action.counselTypes };
    case "modalOpenSet":
      return { ...state, modalOpen: action.modalOpen };
    case "isCounselSuccessSet":
      return { ...state, isCounselSuccess: action.isCounselSuccess };
    case "locationTrackingSet":
      return { ...state, locationTracking: action.locationTracking };
    case "clickTimeSet":
      return { ...state, clickTime: action.clickTime };
    case "prevPhoneNumberSet":
      return { ...state, prevPhoneNumber: action.prevPhoneNumber };
    case "dataReset":
      return {
        ...state,
        category: null,
        phoneNumber: "",
        wannaDate: null,
        wannaTime: null,
        wannaNow: false,
        isPrivacyAgreed: true,
        modalOpen: false,
        isCounselSuccess: false,
        counselTypes: [],
        // marriageType: "",
        // childrenType: "",
        locationTracking: "",
        // lawyerType: "",
        clickTime: null,
        prevPhoneNumber: null,
      };
    default:
      return state;
  }
}

// Context 생성
const CounselContext = createContext<{
  state: CounselState;
  dispatch: React.Dispatch<CounselAction>;
} | null>(null);

// Provider 컴포넌트
export function CounselProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(counselReducer, initialState);

  return (
    <CounselContext.Provider value={{ state, dispatch }}>
      {children}
    </CounselContext.Provider>
  );
}

// Custom Hook
export function useCounsel() {
  const context = useContext(CounselContext);

  if (!context) {
    throw new Error("useCounsel must be used within a CounselProvider");
  }

  return context;
}
