import React from 'react';
import { mockPlaylists, recentlyPlayedTracks, madeForYouPlaylists, mockArtists } from '@/data/mockData';
import PlaylistCard from '@/components/epstify/PlaylistCard';
import TrackCard from '@/components/epstify/TrackCard';
import ArtistCard from '@/components/epstify/ArtistCard';

const Home: React.FC = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting Section */}
      <section>
        <h1 className="text-3xl font-bold mb-6">{getGreeting()}</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {mockPlaylists.slice(0, 6).map((playlist) => (
            <PlaylistCard 
              key={playlist.id} 
              playlist={playlist} 
              variant="row" 
            />
          ))}
        </div>
      </section>

      {/* Made For You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Made for you</h2>
          <button className="text-sm text-muted-foreground hover:underline font-semibold">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {madeForYouPlaylists.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-card rounded-lg transition-all duration-300 hover:bg-hover-highlight group card-hover cursor-pointer"
            >
              <div className="relative mb-4">
                <img
                  src={item.coverUrl}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-md shadow-lg"
                />
                <button className="play-button-overlay shadow-xl">
                  <svg className="w-6 h-6 text-accent-foreground fill-current ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <h3 className="font-semibold truncate mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Recently played</h2>
          <button className="text-sm text-muted-foreground hover:underline font-semibold">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recentlyPlayedTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Popular artists</h2>
          <button className="text-sm text-muted-foreground hover:underline font-semibold">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mockArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Your Top Mixes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Your playlists</h2>
          <button className="text-sm text-muted-foreground hover:underline font-semibold">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mockPlaylists.slice(1).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
