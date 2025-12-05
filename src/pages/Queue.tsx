import React from 'react';
import { Play, Pause, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/contexts/PlayerContext';

const Queue: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    queue, 
    history, 
    togglePlay, 
    playTrack,
    removeFromQueue,
    clearQueue 
  } = usePlayer();

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Queue</h1>
        {queue.length > 0 && (
          <button
            onClick={clearQueue}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear queue
          </button>
        )}
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Now playing
          </h2>
          <div
            onClick={togglePlay}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
          >
            <div className="relative">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-14 h-14 rounded shadow"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded">
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-accent">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
          </div>
        </section>
      )}

      {/* Next in Queue */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Next in queue
        </h2>
        {queue.length > 0 ? (
          <div className="space-y-1">
            {queue.map((item, index) => (
              <div
                key={`${item.track.id}-${index}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="w-6 text-center text-muted-foreground text-sm">
                  {index + 1}
                </div>
                <img
                  src={item.track.coverUrl}
                  alt={item.track.title}
                  className="w-10 h-10 rounded shadow cursor-pointer"
                  onClick={() => playTrack(item.track)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{item.track.artist}</p>
                </div>
                <button
                  onClick={() => removeFromQueue(index)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Add songs to your queue</p>
          </div>
        )}
      </section>

      {/* Recently Played */}
      {history.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Recently played
          </h2>
          <div className="space-y-1">
            {history.slice(0, 10).map((track, index) => (
              <div
                key={`history-${track.id}-${index}`}
                onClick={() => playTrack(track)}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="w-6 text-center text-muted-foreground text-sm">
                  {index + 1}
                </div>
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded shadow"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Queue;
