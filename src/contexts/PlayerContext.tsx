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
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    const handleError = (e: Event) => {
      console.log('Audio playback error - track may not have preview available');
      // If no preview URL, simulate playback for demo purposes
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [repeat]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = useCallback((track: Track) => {
    if (currentTrack) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 49)]);
    }
    
    setCurrentTrack({ ...track, isLiked: likedTracks.has(track.id) });
    setProgress(0);

    if (audioRef.current) {
      if (track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play().catch(console.log);
        setIsPlaying(true);
      } else {
        // No preview URL - set duration from track data for UI display
        setDuration(track.duration);
        setIsPlaying(true);
        // Start a timer to simulate progress
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= track.duration) {
              clearInterval(interval);
              if (repeat === 'one') {
                return 0;
              }
              nextTrack();
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
        
        // Store interval ID for cleanup
        (audioRef.current as any).simulatedInterval = interval;
      }
    }
  }, [currentTrack, likedTracks, repeat]);

  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if ((audioRef.current as any).simulatedInterval) {
        clearInterval((audioRef.current as any).simulatedInterval);
      }
    }
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    if (currentTrack && audioRef.current) {
      if (currentTrack.audioUrl) {
        audioRef.current.play().catch(console.log);
      } else {
        // Resume simulated playback
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= currentTrack.duration) {
              clearInterval(interval);
              if (repeat === 'one') {
                return 0;
              }
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
        (audioRef.current as any).simulatedInterval = interval;
      }
      setIsPlaying(true);
    }
  }, [currentTrack, repeat]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [isPlaying, pauseTrack, resumeTrack]);

  const nextTrack = useCallback(() => {
    // Clean up any simulated interval
    if (audioRef.current && (audioRef.current as any).simulatedInterval) {
      clearInterval((audioRef.current as any).simulatedInterval);
    }

    if (queue.length > 0) {
      const nextItem = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(nextItem.track);
    } else if (currentTrack && repeat === 'one') {
      setProgress(0);
      if (audioRef.current && currentTrack.audioUrl) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.log);
      }
    } else {
      setIsPlaying(false);
    }
  }, [queue, currentTrack, repeat, playTrack]);

  const prevTrack = useCallback(() => {
    if (progress > 3) {
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else if (history.length > 0) {
      const prevTrack = history[0];
      setHistory(prev => prev.slice(1));
      if (currentTrack) {
        setQueue(prev => [{ track: currentTrack, addedBy: 'user' }, ...prev]);
      }
      setCurrentTrack({ ...prevTrack, isLiked: likedTracks.has(prevTrack.id) });
      setProgress(0);
      
      if (audioRef.current) {
        if (prevTrack.audioUrl) {
          audioRef.current.src = prevTrack.audioUrl;
          audioRef.current.play().catch(console.log);
        }
      }
    }
  }, [progress, history, currentTrack, likedTracks]);

  const seekTo = useCallback((time: number) => {
    setProgress(time);
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.currentTime = time;
    }
  }, [currentTrack]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
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
