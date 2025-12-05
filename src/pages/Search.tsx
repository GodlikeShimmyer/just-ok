import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockTracks, mockArtists, mockAlbums, mockPlaylists, searchCategories } from '@/data/mockData';
import TrackCard from '@/components/epstify/TrackCard';
import ArtistCard from '@/components/epstify/ArtistCard';
import PlaylistCard from '@/components/epstify/PlaylistCard';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
  ];

  // Filter results based on query
  const filteredTracks = mockTracks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase())
  );

  const filteredArtists = mockArtists.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAlbums = mockAlbums.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.artist.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPlaylists = mockPlaylists.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!query) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Browse all</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {searchCategories.map((category) => (
            <div
              key={category.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform relative"
              style={{ backgroundColor: category.color }}
            >
              <span className="absolute top-4 left-4 text-xl font-bold text-foreground">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Pills */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeFilter === filter.id
                ? 'bg-foreground text-background'
                : 'bg-muted hover:bg-hover-highlight'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Top Result & Songs */}
      {(activeFilter === 'all' || activeFilter === 'songs') && filteredTracks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Top Result */}
          {activeFilter === 'all' && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Top result</h2>
              <div className="p-5 bg-card rounded-lg hover:bg-hover-highlight transition-colors cursor-pointer group card-hover h-[220px]">
                <img
                  src={filteredTracks[0].coverUrl}
                  alt={filteredTracks[0].title}
                  className="w-24 h-24 rounded shadow-lg mb-4"
                />
                <h3 className="text-3xl font-bold mb-2">{filteredTracks[0].title}</h3>
                <p className="text-muted-foreground">
                  <span className="text-sm">Song</span>
                  <span className="mx-2">•</span>
                  <span className="text-foreground font-medium">{filteredTracks[0].artist}</span>
                </p>
                <button className="play-button-overlay !bottom-5 !right-5 shadow-xl">
                  <svg className="w-6 h-6 text-accent-foreground fill-current ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </section>
          )}

          {/* Songs */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Songs</h2>
            <div className="space-y-1">
              {filteredTracks.slice(0, 4).map((track, index) => (
                <TrackCard key={track.id} track={track} variant="row" index={index + 1} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Artists */}
      {(activeFilter === 'all' || activeFilter === 'artists') && filteredArtists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {(activeFilter === 'all' || activeFilter === 'albums') && filteredAlbums.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAlbums.map((album) => (
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
        </section>
      )}

      {/* Playlists */}
      {(activeFilter === 'all' || activeFilter === 'playlists') && filteredPlaylists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredTracks.length === 0 &&
        filteredArtists.length === 0 &&
        filteredAlbums.length === 0 &&
        filteredPlaylists.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">No results found for "{query}"</h2>
            <p className="text-muted-foreground">
              Please make sure your words are spelled correctly, or use fewer or different keywords.
            </p>
          </div>
        )}
    </div>
  );
};

export default Search;
