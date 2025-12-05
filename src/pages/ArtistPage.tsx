import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Shuffle, BadgeCheck, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArtist } from '@/hooks/useSpotify';
import { usePlayer } from '@/contexts/PlayerContext';
import TrackCard from '@/components/epstify/TrackCard';
import { Skeleton } from '@/components/ui/skeleton';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentTrack, isPlaying, playTrack, togglePlay, shuffle, toggleShuffle } = usePlayer();

  const { data: artist, isLoading, error } = useArtist(id);

  if (isLoading) {
    return (
      <div className="animate-fade-in -mx-6 -mt-6">
        <div className="relative h-80 bg-gradient-to-b from-muted to-background flex items-end p-8">
          <div className="absolute bottom-8 left-8">
            <Skeleton className="h-16 w-64 mb-4" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Artist not found</p>
      </div>
    );
  }

  const isArtistPlaying = artist.topTracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlayAll = () => {
    if (artist.topTracks.length === 0) return;

    if (isArtistPlaying) {
      togglePlay();
    } else {
      playTrack(artist.topTracks[0]);
    }
  };

  const formatListeners = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} million`;
    }
    if (num >= 1000) {
      return `${Math.floor(num / 1000)},${String(num % 1000).padStart(3, '0')}`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="animate-fade-in -mx-6 -mt-6">
      {/* Hero Header */}
      <div
        className="relative h-80 bg-cover bg-center flex items-end p-8"
        style={{
          backgroundImage: `linear-gradient(transparent 0%, hsl(var(--background)) 100%), url(${artist.imageUrl})`,
        }}
      >
        <div className="flex items-center gap-4">
          {artist.isVerified && (
            <div className="flex items-center gap-2 text-primary">
              <BadgeCheck className="w-6 h-6 fill-primary" />
              <span className="text-sm font-medium">Verified Artist</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-8 left-8">
          <h1 className="text-7xl font-black mb-4">{artist.name}</h1>
          <p className="text-muted-foreground">
            {formatListeners(artist.monthlyListeners)} followers
          </p>
          {artist.genres.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {artist.genres.slice(0, 3).join(' • ')}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 p-6">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          {isArtistPlaying ? (
            <Pause className="w-6 h-6 text-accent-foreground fill-current" />
          ) : (
            <Play className="w-6 h-6 text-accent-foreground fill-current ml-1" />
          )}
        </button>

        <button
          onClick={toggleShuffle}
          className={cn(
            'p-3 transition-colors',
            shuffle ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Shuffle className="w-6 h-6" />
        </button>

        <button className="px-6 py-2 border border-muted-foreground rounded-full text-sm font-semibold hover:border-foreground hover:scale-105 transition-all flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Follow
        </button>
      </div>

      {/* Popular Tracks */}
      {artist.topTracks.length > 0 && (
        <section className="px-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular</h2>
          <div className="space-y-1">
            {artist.topTracks.slice(0, 5).map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                variant="row"
                index={index + 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {artist.albums.length > 0 && (
        <section className="px-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Discography</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {artist.albums.map((album) => (
              <div
                key={album.id}
                className="p-4 bg-card rounded-lg transition-all duration-300 hover:bg-hover-highlight group card-hover cursor-pointer"
              >
                <div className="relative mb-4">
                  <img
                    src={album.coverUrl}
                    alt={album.name}
                    className="w-full aspect-square object-cover rounded-md shadow-lg"
                  />
                  <button className="play-button-overlay shadow-xl">
                    <svg className="w-6 h-6 text-accent-foreground fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold truncate mb-1">{album.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {album.releaseYear} • Album
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArtistPage;
