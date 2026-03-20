import gsap from 'gsap';
import { createContext, useContext, useState } from 'react';
import Logger from './logger';

const SequenceTransitionControlContext = createContext<{
  sectionOff: boolean;
  sectionOn: boolean;
  setSectionOff: (value: boolean) => void;
  setSectionOn: (value: boolean) => void;
}>({
  sectionOff: false,
  sectionOn: false,
  setSectionOff: () => { },
  setSectionOn: () => { },
});

export const useSequenceTransitionControl = () => {
  const context = useContext(SequenceTransitionControlContext);
  if (!context) {
    throw new Error('useSequenceTransitionControl must be used within a SequenceTransitionControlProvider');
  }
  return context;
}

export const SequenceTransitionControlProvider = ({ children }: { children: React.ReactNode }) => {
  const [sectionOff, setSectionOff] = useState(false);
  const [sectionOn, setSectionOn] = useState(false);
  return (
    <SequenceTransitionControlContext.Provider value={{ sectionOff, sectionOn, setSectionOff, setSectionOn }}>
      {children}
    </SequenceTransitionControlContext.Provider>
  )
}

export function useValueCommon() {
  const { sectionOff, sectionOn, setSectionOff, setSectionOn } = useSequenceTransitionControl();
  const log = Logger('useValueCommon');
  const offSection = (section: HTMLElement, duration?: number, delay?: number, callback?: () => void) => {
    log.debug('offSection');
    // if (sectionOff) return;
    // log.debug('offSection: sectionOff is false');
    setSectionOn(false);
    gsap.to(section, {
      opacity: 0,
      duration: duration || 1,
      delay: delay || 0,
      ease: 'power2.inOut',
      onComplete: () => {
        section.style.visibility = 'hidden';
        section.style.zIndex = '-1';
        section.classList.remove('on');
        section.classList.add('off');
        section.style.display = 'none';
        setSectionOff(true);
        if (callback) callback();
      }
    });
  };

  const onSection = (section: HTMLElement, duration?: number, delay?: number, callback?: () => void) => {
    log.debug('onSection');
    gsap.to(section, {
      opacity: 1,
      duration: duration || 1,
      delay: delay || 0,
      ease: 'power2.inOut',
      onStart: () => {
        section.style.visibility = 'visible';
        section.style.zIndex = '1';
        section.classList.remove('off');
        section.classList.add('on');
        section.style.display = 'block';
      },
      onComplete: () => {
        setSectionOn(true);
        setSectionOff(false);
        if (callback) callback();
      }
    });
  };

  //함수 추가 후 return에 추가
  return { offSection, onSection };
}