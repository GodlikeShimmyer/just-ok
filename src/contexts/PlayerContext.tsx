import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Track, QueueItem, RepeatMode, PlayerState } from '@/types/music';

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleLike: (trackId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set(['1', '3', '5', '7']));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulated progress for demo (since we don't have real audio files)
  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= currentTrack.duration) {
            if (repeat === 'one') {
              return 0;
            }
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrack, repeat]);

  const playTrack = useCallback((track: Track) => {
    if (currentTrack) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 49)]);
    }
    setCurrentTrack({ ...track, isLiked: likedTracks.has(track.id) });
    setDuration(track.duration);
    setProgress(0);
    setIsPlaying(true);
  }, [currentTrack, likedTracks]);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [isPlaying, pauseTrack, resumeTrack]);

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
      const nextItem = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(nextItem.track);
    } else if (currentTrack && repeat === 'one') {
      setProgress(0);
    }
  }, [queue, currentTrack, repeat, playTrack]);

  const prevTrack = useCallback(() => {
    if (progress > 3) {
      setProgress(0);
    } else if (history.length > 0) {
      const prevTrack = history[0];
      setHistory(prev => prev.slice(1));
      if (currentTrack) {
        setQueue(prev => [{ track: currentTrack, addedBy: 'user' }, ...prev]);
      }
      setCurrentTrack({ ...prevTrack, isLiked: likedTracks.has(prevTrack.id) });
      setDuration(prevTrack.duration);
      setProgress(0);
    }
  }, [progress, history, currentTrack, likedTracks]);

  const seekTo = useCallback((time: number) => {
    setProgress(time);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, { track, addedBy: 'user' }]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const toggleLike = useCallback((trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
    
    if (currentTrack?.id === trackId) {
      setCurrentTrack(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
    }
  }, [currentTrack]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        shuffle,
        repeat,
        queue,
        history,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleLike,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
