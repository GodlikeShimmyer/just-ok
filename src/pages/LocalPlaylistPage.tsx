import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Shuffle, 
  MoreHorizontal, 
  Clock,
  Search,
  Pencil,
  Trash2,
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalPlaylists } from '@/contexts/PlaylistContext';
import { usePlayer } from '@/contexts/PlayerContext';
import TrackCard from '@/components/epstify/TrackCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const LocalPlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylist, updatePlaylist, deletePlaylist, removeTrackFromPlaylist } = useLocalPlaylists();
  const { currentTrack, isPlaying, playTrack, togglePlay, shuffle, toggleShuffle } = usePlayer();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const playlist = getPlaylist(id || '');

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

  const totalDuration = playlist.tracks.reduce((acc, t) => acc + t.duration, 0);

  const filteredTracks = playlist.tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEdit = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    updatePlaylist(playlist.id, {
      name: editName.trim() || playlist.name,
      description: editDescription.trim(),
    });
    setEditModalOpen(false);
    toast.success('Playlist updated');
  };

  const handleDelete = () => {
    deletePlaylist(playlist.id);
    toast.success('Playlist deleted');
    navigate('/library');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8">
        {playlist.coverUrl !== '/placeholder.svg' ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-56 h-56 rounded-lg shadow-2xl object-cover"
          />
        ) : (
          <div className="w-56 h-56 rounded-lg shadow-2xl bg-muted flex items-center justify-center">
            <Music className="w-24 h-24 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wider mb-2">Playlist</p>
          <h1 className="text-6xl font-black mb-6 line-clamp-1">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-muted-foreground mb-2">{playlist.description}</p>
          )}
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">You</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {playlist.tracks.length} songs, {formatDuration(totalDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handlePlayAll}
          disabled={playlist.tracks.length === 0}
          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-card border-border">
            <DropdownMenuItem onClick={handleOpenEdit} className="cursor-pointer gap-2">
              <Pencil className="w-4 h-4" />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setDeleteDialogOpen(true)} 
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete playlist
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

      {playlist.tracks.length > 0 ? (
        <>
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
                key={`${track.id}-${index}`}
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
        </>
      ) : (
        <div className="text-center py-16">
          <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">This playlist is empty</h3>
          <p className="text-muted-foreground mb-4">
            Search for songs and right-click to add them to this playlist.
          </p>
          <Button onClick={() => navigate('/search')} variant="outline">
            Find songs
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                {playlist.coverUrl !== '/placeholder.svg' ? (
                  <img src={playlist.coverUrl} alt="" className="w-full h-full rounded-md object-cover" />
                ) : (
                  <Music className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="Playlist name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-muted border-none"
                />
                <Textarea
                  placeholder="Add an optional description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-muted border-none resize-none h-20"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveEdit}
                className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-8"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete from Your Library?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete <span className="font-semibold text-foreground">{playlist.name}</span> from Your Library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-muted-foreground hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocalPlaylistPage;
