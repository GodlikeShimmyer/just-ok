import React, { useState } from 'react';
import { Plus, Search, Check, Music } from 'lucide-react';
import { useLocalPlaylists } from '@/contexts/PlaylistContext';
import { Track } from '@/types/music';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AddToPlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: Track | null;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  open,
  onOpenChange,
  track,
}) => {
  const { localPlaylists, createPlaylist, addTrackToPlaylist } = useLocalPlaylists();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const filteredPlaylists = localPlaylists.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToPlaylist = (playlistId: string, playlistName: string) => {
    if (!track) return;
    addTrackToPlaylist(playlistId, track);
    toast.success(`Added to ${playlistName}`);
    onOpenChange(false);
  };

  const handleCreateAndAdd = () => {
    if (!newPlaylistName.trim() || !track) return;
    const playlist = createPlaylist(newPlaylistName.trim());
    addTrackToPlaylist(playlist.id, track);
    toast.success(`Added to ${playlist.name}`);
    setNewPlaylistName('');
    setShowCreate(false);
    onOpenChange(false);
  };

  const isInPlaylist = (playlistId: string) => {
    if (!track) return false;
    const playlist = localPlaylists.find(p => p.id === playlistId);
    return playlist?.tracks.some(t => t.id === track.id) || false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add to playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Find a playlist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted border-none"
            />
          </div>

          {/* Create New */}
          {showCreate ? (
            <div className="flex gap-2">
              <Input
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="bg-muted border-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
              />
              <button
                onClick={handleCreateAndAdd}
                disabled={!newPlaylistName.trim()}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-md font-semibold text-sm hover:bg-accent/90 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-semibold">New playlist</span>
            </button>
          )}

          {/* Playlist List */}
          <ScrollArea className="h-60">
            <div className="space-y-1">
              {filteredPlaylists.map((playlist) => {
                const added = isInPlaylist(playlist.id);
                return (
                  <button
                    key={playlist.id}
                    onClick={() => !added && handleAddToPlaylist(playlist.id, playlist.name)}
                    disabled={added}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {playlist.coverUrl !== '/placeholder.svg' ? (
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <Music className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="font-medium text-sm truncate flex-1 text-left">
                      {playlist.name}
                    </span>
                    {added && <Check className="w-5 h-5 text-accent" />}
                  </button>
                );
              })}

              {filteredPlaylists.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  {searchQuery ? 'No playlists found' : 'No playlists yet'}
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistModal;
