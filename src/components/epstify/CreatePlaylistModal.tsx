import React, { useState } from 'react';
import { X, Music } from 'lucide-react';
import { useLocalPlaylists } from '@/contexts/PlaylistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CreatePlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (playlistId: string) => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  open,
  onOpenChange,
  onCreated,
}) => {
  const { createPlaylist } = useLocalPlaylists();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const playlist = createPlaylist(name.trim(), description.trim());
    setName('');
    setDescription('');
    onOpenChange(false);
    onCreated?.(playlist.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create playlist</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="flex gap-4">
            <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
              <Music className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <Input
                  placeholder="My Playlist"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Add an optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary resize-none h-20"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            By proceeding, you agree to give Epstify access to the image you choose to upload.
          </p>

          <div className="flex justify-end">
            <Button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-8"
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistModal;
