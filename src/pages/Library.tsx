import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, List, LayoutGrid, Search, ChevronDown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockPlaylists, mockArtists, mockAlbums } from '@/data/mockData';
import PlaylistCard from '@/components/epstify/PlaylistCard';
import ArtistCard from '@/components/epstify/ArtistCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterType = 'playlists' | 'artists' | 'albums';
type SortType = 'recent' | 'added' | 'alphabetical' | 'creator';
type ViewType = 'grid' | 'list';

const Library: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'playlists', label: 'Playlists' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
  ];

  const sortOptions: { id: SortType; label: string }[] = [
    { id: 'recent', label: 'Recently played' },
    { id: 'added', label: 'Recently added' },
    { id: 'alphabetical', label: 'Alphabetical' },
    { id: 'creator', label: 'Creator' },
  ];

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Library</h1>
        <Link
          to="/playlist/new"
          className="w-8 h-8 rounded-full hover:bg-hover-highlight flex items-center justify-center transition-colors"
        >
          <Plus className="w-5 h-5" />
        </Link>
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

      {/* Content */}
      {(activeFilter === null || activeFilter === 'playlists') && (
        <section>
          {activeFilter !== 'playlists' && (
            <h2 className="text-lg font-semibold mb-4">Playlists</h2>
          )}
          
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
                  {mockPlaylists[0].tracks.length} songs
                </p>
              </Link>

              {mockPlaylists.slice(1).map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
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
                    Playlist • {mockPlaylists[0].tracks.length} songs
                  </p>
                </div>
              </Link>
              {mockPlaylists.slice(1).map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-hover-highlight transition-colors"
                >
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{playlist.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Playlist • {playlist.owner}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {(activeFilter === null || activeFilter === 'artists') && (
        <section>
          {activeFilter !== 'artists' && (
            <h2 className="text-lg font-semibold mb-4">Artists</h2>
          )}
          <div className={cn(
            viewType === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
              : 'space-y-2'
          )}>
            {mockArtists.map((artist) =>
              viewType === 'grid' ? (
                <ArtistCard key={artist.id} artist={artist} />
              ) : (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-hover-highlight transition-colors"
                >
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{artist.name}</p>
                    <p className="text-sm text-muted-foreground">Artist</p>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      )}

      {(activeFilter === null || activeFilter === 'albums') && (
        <section>
          {activeFilter !== 'albums' && (
            <h2 className="text-lg font-semibold mb-4">Albums</h2>
          )}
          <div className={cn(
            viewType === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
              : 'space-y-2'
          )}>
            {mockAlbums.map((album) =>
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
        </section>
      )}
    </div>
  );
};

export default Library;
