import React from 'react';
import { useNewReleases, useFeaturedPlaylists, useRecommendations } from '@/hooks/useSpotify';
import PlaylistCard from '@/components/epstify/PlaylistCard';
import TrackCard from '@/components/epstify/TrackCard';
import { Skeleton } from '@/components/ui/skeleton';

const Home: React.FC = () => {
  const { data: newReleases, isLoading: loadingReleases } = useNewReleases();
  const { data: featuredPlaylists, isLoading: loadingPlaylists } = useFeaturedPlaylists();
  const { data: recommendations, isLoading: loadingRecs } = useRecommendations();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const LoadingSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-card rounded-lg">
          <Skeleton className="w-full aspect-square rounded-md mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting Section */}
      <section>
        <h1 className="text-3xl font-bold mb-6">{getGreeting()}</h1>
        {loadingPlaylists ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredPlaylists?.slice(0, 6).map((playlist) => (
              <PlaylistCard 
                key={playlist.id} 
                playlist={playlist} 
                variant="row" 
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Featured Playlists</h2>
          <button className="text-sm text-muted-foreground hover:underline font-semibold">
            Show all
          </button>
        </div>
        {loadingPlaylists ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {featuredPlaylists?.slice(0, 6).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended Tracks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Recommended for you</h2>
          <button className="text-sm text-muted-foreground hover:underline font-semibold">
            Show all
          </button>
        </div>
        {loadingRecs ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recommendations?.slice(0, 12).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </section>

      {/* New Releases */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">New Releases</h2>
          <button className="text-sm text-muted-foreground hover:underline font-semibold">
            Show all
          </button>
        </div>
        {loadingReleases ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {newReleases?.slice(0, 6).map((album) => (
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
                  {album.releaseYear} • {album.artist}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
