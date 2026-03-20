import { createContext, useContext } from 'react';

export const VideoContext = createContext<{
  playingId: number | null;
  setPlayingId: (id: number | null) => void;
}>({
  playingId: null,
  setPlayingId: () => {},
});
