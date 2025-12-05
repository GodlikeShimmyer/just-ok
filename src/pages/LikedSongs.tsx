import React, { useState } from 'react';
import { Play, Pause, Heart, Clock, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTracks } from '@/data/mockData';
import { usePlayer } from '@/contexts/PlayerContext';
import TrackCard from '@/components/epstify/TrackCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortType = 'title' | 'artist' | 'album' | 'duration' | 'added';

const LikedSongs: React.FC = () => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('added');

  const likedTracks = mockTracks.filter((t) => t.isLiked);
  const isPlaylistPlaying = likedTracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlayAll = () => {
    if (likedTracks.length === 0) return;

    if (isPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(likedTracks[0]);
    }
  };

  const sortOptions: { id: SortType; label: string }[] = [
    { id: 'title', label: 'Title' },
    { id: 'artist', label: 'Artist' },
    { id: 'album', label: 'Album' },
    { id: 'duration', label: 'Duration' },
    { id: 'added', label: 'Date added' },
  ];

  const filteredTracks = likedTracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDuration = likedTracks.reduce((acc, t) => acc + t.duration, 0);
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  return (
    <div className="animate-fade-in">
      {/* Header with Gradient */}
      <div className="flex items-end gap-6 mb-8 p-8 -mx-6 -mt-6 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent">
        <div className="w-56 h-56 rounded-lg shadow-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Heart className="w-24 h-24 text-foreground fill-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wider mb-2">Playlist</p>
          <h1 className="text-6xl font-black mb-6">Liked Songs</h1>
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">You</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {likedTracks.length} songs, {formatDuration(totalDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          {isPlaylistPlaying ? (
            <Pause className="w-6 h-6 text-accent-foreground fill-current" />
          ) : (
            <Play className="w-6 h-6 text-accent-foreground fill-current ml-1" />
          )}
        </button>

        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          {showSearch && (
            <input
              type="text"
              placeholder="Search in Liked Songs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary w-48"
              autoFocus
            />
          )}

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
        </div>
      </div>

      {/* Track List Header */}
      <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border mb-2">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="flex justify-end">
          <Clock className="w-4 h-4" />
        </span>
      </div>

      {/* Tracks */}
      <div className="space-y-1">
        {filteredTracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            variant="row"
            index={index + 1}
          />
        ))}
      </div>

      {filteredTracks.length === 0 && likedTracks.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tracks match your search</p>
        </div>
      )}

      {likedTracks.length === 0 && (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Songs you like will appear here</h2>
          <p className="text-muted-foreground">
            Save songs by tapping the heart icon.
          </p>
        </div>
      )}
    </div>
  );
};

export default LikedSongs;
