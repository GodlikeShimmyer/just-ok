import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, List, LayoutGrid, Search, ChevronDown, Heart, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalPlaylists } from '@/contexts/PlaylistContext';
import { useFeaturedPlaylists, useNewReleases, useRecommendations } from '@/hooks/useSpotify';
import PlaylistCard from '@/components/epstify/PlaylistCard';
import TrackCard from '@/components/epstify/TrackCard';
import CreatePlaylistModal from '@/components/epstify/CreatePlaylistModal';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterType = 'playlists' | 'albums' | 'tracks';
type SortType = 'recent' | 'added' | 'alphabetical';
type ViewType = 'grid' | 'list';

const Library: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);

  const { localPlaylists, likedSongs } = useLocalPlaylists();
  const { data: featuredPlaylists, isLoading: loadingPlaylists } = useFeaturedPlaylists();
  const { data: albums, isLoading: loadingAlbums } = useNewReleases();
  const { data: tracks, isLoading: loadingTracks } = useRecommendations();

  const filters: { id: FilterType; label: string }[] = [
    { id: 'playlists', label: 'Playlists' },
    { id: 'albums', label: 'Albums' },
    { id: 'tracks', label: 'Tracks' },
  ];

  const sortOptions: { id: SortType; label: string }[] = [
    { id: 'recent', label: 'Recently played' },
    { id: 'added', label: 'Recently added' },
    { id: 'alphabetical', label: 'Alphabetical' },
  ];

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? null : filter);
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Library</h1>
        <button
          onClick={() => setCreatePlaylistOpen(true)}
          className="w-8 h-8 rounded-full hover:bg-hover-highlight flex items-center justify-center transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
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

      {/* Sort & View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-hover-highlight transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          {showSearch && (
            <input
              type="text"
              placeholder="Search in Your Library"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-muted-foreground focus:border-foreground outline-none text-sm py-1 px-2 w-48 transition-colors"
              autoFocus
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {sortOptions.find((s) => s.id === sortBy)?.label}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={cn(
                    'cursor-pointer',
                    sortBy === option.id && 'text-accent'
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center border-l border-border pl-2 ml-2">
            <button
              onClick={() => setViewType('list')}
              className={cn(
                'p-2 rounded transition-colors',
                viewType === 'list' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('grid')}
              className={cn(
                'p-2 rounded transition-colors',
                viewType === 'grid' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Your Playlists */}
      {(activeFilter === null || activeFilter === 'playlists') && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Your Playlists</h2>
          
          {viewType === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {/* Liked Songs Card */}
              <Link
                to="/collection/tracks"
                className="p-4 bg-gradient-to-br from-primary/80 to-secondary rounded-lg transition-all duration-300 hover:from-primary hover:to-secondary/80 group card-hover block"
              >
                <div className="relative mb-4">
                  <div className="w-full aspect-square rounded-md shadow-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Heart className="w-16 h-16 text-foreground fill-foreground" />
                  </div>
                  <button className="play-button-overlay shadow-xl">
                    <svg className="w-6 h-6 text-accent-foreground fill-current ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold truncate mb-1">Liked Songs</h3>
                <p className="text-sm text-foreground/80 truncate">
                  {likedSongs.length} songs
                </p>
              </Link>

              {/* Local Playlists */}
              {localPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/local-playlist/${playlist.id}`}
                  className="p-4 bg-card rounded-lg transition-all duration-300 hover:bg-hover-highlight group card-hover block"
                >
                  <div className="relative mb-4">
                    {playlist.coverUrl !== '/placeholder.svg' ? (
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        className="w-full aspect-square object-cover rounded-md shadow-lg"
                      />
                    ) : (
                      <div className="w-full aspect-square rounded-md shadow-lg bg-muted flex items-center justify-center">
                        <Music className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <button className="play-button-overlay shadow-xl">
                      <svg className="w-6 h-6 text-accent-foreground fill-current ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="font-semibold truncate mb-1">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {playlist.tracks.length} songs
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/collection/tracks"
                className="flex items-center gap-3 p-2 rounded-md hover:bg-hover-highlight transition-colors"
              >
                <div className="w-12 h-12 rounded bg-gradient-to-br from-primary/80 to-secondary flex items-center justify-center">
                  <Heart className="w-5 h-5 text-foreground fill-foreground" />
                </div>
                <div>
                  <p className="font-medium">Liked Songs</p>
                  <p className="text-sm text-muted-foreground">
                    Playlist • {likedSongs.length} songs
                  </p>
                </div>
              </Link>
              {localPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/local-playlist/${playlist.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-hover-highlight transition-colors"
                >
                  {playlist.coverUrl !== '/placeholder.svg' ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <Music className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{playlist.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Playlist • {playlist.tracks.length} songs
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Featured Playlists */}
      {(activeFilter === null || activeFilter === 'playlists') && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Featured Playlists</h2>
          {loadingPlaylists ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {featuredPlaylists?.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Albums */}
      {(activeFilter === null || activeFilter === 'albums') && (
        <section>
          <h2 className="text-lg font-semibold mb-4">New Releases</h2>
          {loadingAlbums ? (
            <LoadingSkeleton />
          ) : (
            <div className={cn(
              viewType === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                : 'space-y-2'
            )}>
              {albums?.map((album) =>
                viewType === 'grid' ? (
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
                ) : (
                  <div
                    key={album.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-hover-highlight transition-colors cursor-pointer"
                  >
                    <img
                      src={album.coverUrl}
                      alt={album.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{album.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Album • {album.artist}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      )}

      {/* Tracks */}
      {(activeFilter === null || activeFilter === 'tracks') && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Recommended Tracks</h2>
          {loadingTracks ? (
            <LoadingSkeleton />
          ) : (
            <div className={cn(
              viewType === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                : 'space-y-2'
            )}>
              {tracks?.map((track) => (
                <TrackCard key={track.id} track={track} variant={viewType === 'grid' ? 'card' : 'row'} />
              ))}
            </div>
          )}
        </section>
      )}

      <CreatePlaylistModal
        open={createPlaylistOpen}
        onOpenChange={setCreatePlaylistOpen}
      />
    </div>
  );
};

export default Library;
