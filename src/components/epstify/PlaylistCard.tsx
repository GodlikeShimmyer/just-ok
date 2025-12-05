import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Playlist } from '@/types/music';
import { usePlayer } from '@/contexts/PlayerContext';

interface PlaylistCardProps {
  playlist: Playlist;
  variant?: 'card' | 'row';
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, variant = 'card' }) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (playlist.tracks.length === 0) return;
    
    const firstTrack = playlist.tracks[0];
    if (currentTrack?.id === firstTrack.id) {
      togglePlay();
    } else {
      playTrack(firstTrack);
    }
  };

  if (variant === 'row') {
    return (
      <Link
        to={`/playlist/${playlist.id}`}
        className="flex items-center bg-muted/30 rounded-md overflow-hidden hover:bg-muted/50 transition-colors group h-20"
      >
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-20 h-20 object-cover"
        />
        <span className="px-4 font-semibold truncate flex-1">{playlist.name}</span>
        <button
          onClick={handlePlayClick}
          className="w-12 h-12 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all mr-4 shadow-lg hover:scale-105"
        >
          <Play className="w-5 h-5 text-accent-foreground fill-current ml-1" />
        </button>
      </Link>
    );
  }

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="p-4 bg-card rounded-lg transition-all duration-300 hover:bg-hover-highlight group card-hover block"
    >
      <div className="relative mb-4">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          onClick={handlePlayClick}
          className="play-button-overlay shadow-xl"
        >
          <Play className="w-6 h-6 text-accent-foreground fill-current ml-1" />
        </button>
      </div>
      <h3 className="font-semibold truncate mb-1">{playlist.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {playlist.description || `By ${playlist.owner}`}
      </p>
    </Link>
  );
};

export default PlaylistCard;
