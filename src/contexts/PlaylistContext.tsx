import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Track, Playlist } from '@/types/music';

interface LocalPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdAt: Date;
}

interface PlaylistContextType {
  localPlaylists: LocalPlaylist[];
  likedSongs: Track[];
  createPlaylist: (name: string, description?: string) => LocalPlaylist;
  deletePlaylist: (id: string) => void;
  updatePlaylist: (id: string, updates: Partial<LocalPlaylist>) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  toggleLikedSong: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  getPlaylist: (id: string) => LocalPlaylist | undefined;
}

const PlaylistContext = createContext<PlaylistContextType | null>(null);

export const useLocalPlaylists = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('useLocalPlaylists must be used within a PlaylistProvider');
  }
  return context;
};

const STORAGE_KEY = 'epstify_playlists';
const LIKED_SONGS_KEY = 'epstify_liked_songs';

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localPlaylists, setLocalPlaylists] = useState<LocalPlaylist[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [likedSongs, setLikedSongs] = useState<Track[]>(() => {
    const stored = localStorage.getItem(LIKED_SONGS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localPlaylists));
  }, [localPlaylists]);

  useEffect(() => {
    localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(likedSongs));
  }, [likedSongs]);

  const createPlaylist = useCallback((name: string, description = '') => {
    const newPlaylist: LocalPlaylist = {
      id: `local-${Date.now()}`,
      name,
      description,
      coverUrl: '/placeholder.svg',
      tracks: [],
      createdAt: new Date(),
    };
    setLocalPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setLocalPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePlaylist = useCallback((id: string, updates: Partial<LocalPlaylist>) => {
    setLocalPlaylists(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setLocalPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          // Avoid duplicates
          if (p.tracks.some(t => t.id === track.id)) return p;
          const updatedTracks = [...p.tracks, track];
          return {
            ...p,
            tracks: updatedTracks,
            coverUrl: p.tracks.length === 0 ? track.coverUrl : p.coverUrl,
          };
        }
        return p;
      })
    );
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setLocalPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          return {
            ...p,
            tracks: p.tracks.filter(t => t.id !== trackId),
          };
        }
        return p;
      })
    );
  }, []);

  const toggleLikedSong = useCallback((track: Track) => {
    setLikedSongs(prev => {
      const exists = prev.some(t => t.id === track.id);
      if (exists) {
        return prev.filter(t => t.id !== track.id);
      }
      return [track, ...prev];
    });
  }, []);

  const isLiked = useCallback((trackId: string) => {
    return likedSongs.some(t => t.id === trackId);
  }, [likedSongs]);

  const getPlaylist = useCallback((id: string) => {
    return localPlaylists.find(p => p.id === id);
  }, [localPlaylists]);

  return (
    <PlaylistContext.Provider
      value={{
        localPlaylists,
        likedSongs,
        createPlaylist,
        deletePlaylist,
        updatePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        toggleLikedSong,
        isLiked,
        getPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
