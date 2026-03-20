"use client";

import { createContext, useContext, useReducer } from "react";

type Action =
  | { type: "serviceIdSet"; payload: string }
  | { type: "tokenSet"; payload: string }
  | { type: "randStringSet"; payload: string }
  | { type: "requestDateSet"; payload: Date }
  | { type: "refererSet"; payload: string }
  | { type: "sdIdSet"; payload: number };

export interface GlobalConfigState {
  setRandString: string;
  requestDate: Date;
  token: string;
  serviceId: string;
  referer?: string;
  sd_id?: number;
}

interface GlobalConfigContext extends GlobalConfigState {
  dispatch: React.Dispatch<Action>;
}

const initialState: GlobalConfigState = {
  setRandString: "",
  requestDate: new Date(),
  token: "",
  serviceId: "",
};

function configReducer(
  state: GlobalConfigState,
  action: Action,
): GlobalConfigState {
  switch (action.type) {
    case "serviceIdSet":
      return { ...state, serviceId: action.payload };
    case "tokenSet":
      return { ...state, token: action.payload };
    case "randStringSet":
      return { ...state, setRandString: action.payload };
    case "requestDateSet":
      return { ...state, requestDate: action.payload };
    case "refererSet":
      return { ...state, referer: action.payload };
    case "sdIdSet":
      return { ...state, sd_id: action.payload };
    default:
      return state;
  }
}

export const GlobalConfigContext = createContext<GlobalConfigContext>({
  ...initialState,
  dispatch: () => {},
});

export const useGlobalConfigState = () => {
  const state = useContext(GlobalConfigContext);
  if (!state) throw new Error("GlobalConfigProvider not found");
  return state;
};

export default function GlobalConfigProvider({
  children,
  props,
}: {
  children: React.ReactNode;
  props: GlobalConfigState;
}) {
  const [state, dispatch] = useReducer(configReducer, props);

  return (
    <GlobalConfigContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GlobalConfigContext.Provider>
  );
}
