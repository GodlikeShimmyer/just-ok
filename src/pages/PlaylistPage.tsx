import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Shuffle, 
  Heart, 
  MoreHorizontal, 
  Clock,
  Download,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockPlaylists } from '@/data/mockData';
import { usePlayer } from '@/contexts/PlayerContext';
import TrackCard from '@/components/epstify/TrackCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentTrack, isPlaying, playTrack, togglePlay, shuffle, toggleShuffle } = usePlayer();
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const playlist = mockPlaylists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Playlist not found</p>
      </div>
    );
  }

  const isPlaylistPlaying = playlist.tracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlayAll = () => {
    if (playlist.tracks.length === 0) return;
    
    if (isPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(playlist.tracks[0]);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  const filteredTracks = playlist.tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-56 h-56 rounded-lg shadow-2xl object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wider mb-2">Playlist</p>
          <h1 className="text-6xl font-black mb-6 line-clamp-1">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-muted-foreground mb-2">{playlist.description}</p>
          )}
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">{playlist.owner}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {playlist.likesCount.toLocaleString()} likes
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {playlist.tracks.length} songs, {formatDuration(playlist.totalDuration)}
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

        <button
          onClick={toggleShuffle}
          className={cn(
            'p-3 transition-colors',
            shuffle ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Shuffle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setDownloadEnabled(!downloadEnabled)}
          className={cn(
            'p-3 transition-colors',
            downloadEnabled ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Download className="w-6 h-6" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card border-border">
            <DropdownMenuItem className="cursor-pointer">
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Share
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Copy link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          {showSearch && (
            <input
              type="text"
              placeholder="Search in playlist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary w-48"
              autoFocus
            />
          )}
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

      {filteredTracks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tracks match your search</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
