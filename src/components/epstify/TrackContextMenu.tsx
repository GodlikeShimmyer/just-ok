import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Play,
  Plus,
  Heart,
  ListMusic,
  Radio,
  Share2,
  UserPlus,
  Disc3,
  Music,
} from 'lucide-react';
import { Track } from '@/types/music';
import { usePlayer } from '@/contexts/PlayerContext';
import { useLocalPlaylists } from '@/contexts/PlaylistContext';
import { toast } from 'sonner';

interface TrackContextMenuProps {
  track: Track;
  children: React.ReactNode;
  onAddToPlaylist?: () => void;
}

const TrackContextMenu: React.FC<TrackContextMenuProps> = ({
  track,
  children,
  onAddToPlaylist,
}) => {
  const { playTrack, addToQueue } = usePlayer();
  const { localPlaylists, addTrackToPlaylist, toggleLikedSong, isLiked } = useLocalPlaylists();

  const liked = isLiked(track.id);

  const handleAddToQueue = () => {
    addToQueue(track);
    toast.success('Added to queue');
  };

  const handleToggleLike = () => {
    toggleLikedSong(track);
    toast.success(liked ? 'Removed from Liked Songs' : 'Added to Liked Songs');
  };

  const handleAddToPlaylist = (playlistId: string, playlistName: string) => {
    addTrackToPlaylist(playlistId, track);
    toast.success(`Added to ${playlistName}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://open.spotify.com/track/${track.id}`);
    toast.success('Link copied to clipboard');
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56 bg-card border-border">
        <ContextMenuItem onClick={() => playTrack(track)} className="gap-2">
          <Play className="w-4 h-4" />
          Play
        </ContextMenuItem>

        <ContextMenuItem onClick={handleAddToQueue} className="gap-2">
          <ListMusic className="w-4 h-4" />
          Add to queue
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <Plus className="w-4 h-4" />
            Add to playlist
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48 bg-card border-border">
            <ContextMenuItem onClick={onAddToPlaylist} className="gap-2">
              <Plus className="w-4 h-4" />
              New playlist
            </ContextMenuItem>
            <ContextMenuSeparator />
            {localPlaylists.slice(0, 5).map((playlist) => (
              <ContextMenuItem
                key={playlist.id}
                onClick={() => handleAddToPlaylist(playlist.id, playlist.name)}
                className="gap-2"
              >
                <Music className="w-4 h-4" />
                {playlist.name}
              </ContextMenuItem>
            ))}
            {localPlaylists.length === 0 && (
              <ContextMenuItem disabled className="text-muted-foreground">
                No playlists yet
              </ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem onClick={handleToggleLike} className="gap-2">
          <Heart className={`w-4 h-4 ${liked ? 'fill-accent text-accent' : ''}`} />
          {liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem className="gap-2">
          <Radio className="w-4 h-4" />
          Go to song radio
        </ContextMenuItem>

        {track.artistId && (
          <ContextMenuItem className="gap-2">
            <UserPlus className="w-4 h-4" />
            Go to artist
          </ContextMenuItem>
        )}

        {track.albumId && (
          <ContextMenuItem className="gap-2">
            <Disc3 className="w-4 h-4" />
            Go to album
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handleCopyLink} className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TrackContextMenu;
