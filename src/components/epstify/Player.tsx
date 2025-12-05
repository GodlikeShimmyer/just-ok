import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Heart,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  ListMusic,
  Mic2,
  MonitorSpeaker,
  PictureInPicture2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/contexts/PlayerContext';
import { Slider } from '@/components/ui/slider';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Player: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  if (!currentTrack) {
    return (
      <footer className="h-[90px] bg-player border-t border-border px-4 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Select a track to start playing</p>
      </footer>
    );
  }

  return (
    <footer className="h-[90px] bg-player border-t border-border px-4 grid grid-cols-3 items-center">
      {/* Track Info */}
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-14 h-14 rounded shadow-lg"
        />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate hover:underline cursor-pointer">
            {currentTrack.title}
          </p>
          <p className="text-xs text-muted-foreground truncate hover:underline cursor-pointer">
            {currentTrack.artist}
          </p>
        </div>
        <button
          onClick={() => toggleLike(currentTrack.id)}
          className={cn(
            'p-1 transition-all hover:scale-110',
            currentTrack.isLiked ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Heart 
            className={cn(
              'w-4 h-4 transition-all',
              currentTrack.isLiked && 'fill-accent like-animation'
            )} 
          />
        </button>
        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <PictureInPicture2 className="w-4 h-4" />
        </button>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={cn(
              'p-2 transition-all hover:scale-110 has-tooltip relative',
              shuffle ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Shuffle className="w-4 h-4" />
            <span className="tooltip-hint">Shuffle (Ctrl+S)</span>
          </button>
          
          <button
            onClick={prevTrack}
            className="p-2 text-muted-foreground hover:text-foreground transition-all hover:scale-110 has-tooltip relative"
          >
            <SkipBack className="w-5 h-5 fill-current" />
            <span className="tooltip-hint">Previous (Ctrl+←)</span>
          </button>
          
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform has-tooltip relative"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-background fill-background" />
            ) : (
              <Play className="w-5 h-5 text-background fill-background ml-0.5" />
            )}
            <span className="tooltip-hint">Play/Pause (Space)</span>
          </button>
          
          <button
            onClick={nextTrack}
            className="p-2 text-muted-foreground hover:text-foreground transition-all hover:scale-110 has-tooltip relative"
          >
            <SkipForward className="w-5 h-5 fill-current" />
            <span className="tooltip-hint">Next (Ctrl+→)</span>
          </button>
          
          <button
            onClick={toggleRepeat}
            className={cn(
              'p-2 transition-all hover:scale-110 has-tooltip relative',
              repeat !== 'off' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <RepeatIcon className="w-4 h-4" />
            <span className="tooltip-hint">Repeat (Ctrl+R)</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(progress)}
          </span>
          <div className="flex-1 group">
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={([value]) => seekTo(value)}
              className="cursor-pointer"
            />
          </div>
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume & Extra Controls */}
      <div className="flex items-center justify-end gap-2">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={cn(
            'p-2 transition-colors',
            showQueue ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <ListMusic className="w-4 h-4" />
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MonitorSpeaker className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 w-32">
          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <VolumeIcon className="w-4 h-4" />
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className="cursor-pointer"
          />
        </div>

        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};

export default Player;
