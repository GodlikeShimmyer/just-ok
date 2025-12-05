import React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Track } from '@/types/music';
import { usePlayer } from '@/contexts/PlayerContext';

interface TrackCardProps {
  track: Track;
  variant?: 'card' | 'row';
  index?: number;
  showImage?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ 
  track, 
  variant = 'card',
  index,
  showImage = true 
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  if (variant === 'row') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-md transition-colors group cursor-pointer',
          isCurrentTrack ? 'bg-hover-highlight' : 'hover:bg-hover-highlight'
        )}
      >
        {/* Index/Play Button */}
        <div className="flex items-center justify-center">
          {isThisPlaying ? (
            <div className="w-4 h-4 flex items-end gap-0.5">
              <div className="w-1 bg-accent animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
              <div className="w-1 bg-accent animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
              <div className="w-1 bg-accent animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <span className={cn(
                'text-muted-foreground group-hover:hidden',
                isCurrentTrack && 'text-accent'
              )}>
                {index}
              </span>
              <Play className="w-4 h-4 hidden group-hover:block fill-current" />
            </>
          )}
        </div>

        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0">
          {showImage && (
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-10 h-10 rounded"
            />
          )}
          <div className="min-w-0">
            <p className={cn(
              'font-medium truncate',
              isCurrentTrack && 'text-accent'
            )}>
              {track.title}
            </p>
            <p className="text-sm text-muted-foreground truncate hover:underline">
              {track.artist}
            </p>
          </div>
        </div>

        {/* Album */}
        <p className="text-sm text-muted-foreground truncate flex items-center hover:underline">
          {track.album}
        </p>

        {/* Duration */}
        <p className="text-sm text-muted-foreground flex items-center justify-end">
          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-4 bg-card rounded-lg transition-all duration-300 hover:bg-hover-highlight group cursor-pointer card-hover"
      onClick={handleClick}
    >
      <div className="relative mb-4">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          className={cn(
            'play-button-overlay shadow-xl',
            isThisPlaying && 'opacity-100 translate-y-0'
          )}
        >
          {isThisPlaying ? (
            <Pause className="w-6 h-6 text-accent-foreground fill-current" />
          ) : (
            <Play className="w-6 h-6 text-accent-foreground fill-current ml-1" />
          )}
        </button>
      </div>
      <h3 className="font-semibold truncate mb-1">{track.title}</h3>
      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
    </div>
  );
};

export default TrackCard;
