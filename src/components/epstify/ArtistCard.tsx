import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BadgeCheck } from 'lucide-react';
import { Artist } from '@/types/music';
import { usePlayer } from '@/contexts/PlayerContext';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { playTrack } = usePlayer();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (artist.topTracks.length > 0) {
      playTrack(artist.topTracks[0]);
    }
  };

  const formatListeners = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="p-4 bg-card rounded-lg transition-all duration-300 hover:bg-hover-highlight group card-hover block"
    >
      <div className="relative mb-4">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full aspect-square object-cover rounded-full shadow-lg"
        />
        <button
          onClick={handlePlayClick}
          className="play-button-overlay shadow-xl"
        >
          <Play className="w-6 h-6 text-accent-foreground fill-current ml-1" />
        </button>
      </div>
      <div className="flex items-center gap-1 mb-1">
        <h3 className="font-semibold truncate">{artist.name}</h3>
        {artist.isVerified && (
          <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
        )}
      </div>
      <p className="text-sm text-muted-foreground truncate">
        {formatListeners(artist.monthlyListeners)} monthly listeners
      </p>
    </Link>
  );
};

export default ArtistCard;
