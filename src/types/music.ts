export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl?: string;
  addedAt?: Date;
  isLiked?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  owner: string;
  tracks: Track[];
  isPublic: boolean;
  createdAt: Date;
  totalDuration: number;
  likesCount: number;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  monthlyListeners: number;
  isVerified: boolean;
  genres: string[];
  topTracks: Track[];
  albums: Album[];
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  tracks: Track[];
  totalDuration: number;
}

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  playlists: Playlist[];
  likedSongs: Track[];
  recentlyPlayed: Track[];
}

export interface QueueItem {
  track: Track;
  addedBy: 'user' | 'autoplay';
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: QueueItem[];
  history: Track[];
}
