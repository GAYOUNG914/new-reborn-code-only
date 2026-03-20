import React, { useState } from 'react';
import { VideoContext } from './VideoContext';

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <VideoContext.Provider value={{ playingId, setPlayingId }}>
      {children}
    </VideoContext.Provider>
  );
};
