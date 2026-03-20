"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface ModalState {
  checked: boolean;
  modalText: string;
  triggercheck: string;
  counselText: string;
}

type ModalAction =
  | {
      type: "checkedSet";
      checked: boolean;
    }
  | {
      type: "modalTextSet";
      modalText: string;
    }
  | {
      type: "triggercheckSet";
      triggercheck: string;
    }
  | {
      type: "counselTypeSet";
      counselText: string;
    };

const initialState: ModalState = {
  checked: false,
  modalText: "",
  triggercheck: "",
  counselText: "",
};
const ModalContext = createContext<{
  state: ModalState;
  dispatch: React.Dispatch<ModalAction>;
} | null>(null);

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "checkedSet":
      return {
        ...state,
        checked: action.checked,
      };
    case "modalTextSet":
      return {
        ...state,
        modalText: action.modalText,
      };
    case "triggercheckSet":
      return {
        ...state,
        triggercheck: action.triggercheck,
      };
    case "counselTypeSet":
      return {
        ...state,
        counselText: action.counselText,
      };
    default:
      return state;
  }
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
