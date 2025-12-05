import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Download,
  ChevronRight,
  Music2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { mockPlaylists } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [libraryExpanded, setLibraryExpanded] = useState(true);
  const [downloadEnabled, setDownloadEnabled] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-[280px] h-full flex flex-col bg-sidebar p-2 gap-2">
      {/* Logo & Main Nav */}
      <div className="bg-card rounded-lg p-4">
        <div className="mb-6">
          <Logo size="md" />
        </div>
        
        <nav className="space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-4 px-3 py-3 rounded-md transition-all duration-200 group',
                isActive(path)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon 
                className={cn(
                  'w-6 h-6 transition-transform group-hover:scale-110',
                  isActive(path) && 'text-foreground'
                )} 
              />
              <span className="font-semibold">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Library Section */}
      <div className="bg-card rounded-lg flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <button
            onClick={() => setLibraryExpanded(!libraryExpanded)}
            className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6 transition-transform group-hover:scale-110" />
              <span className="font-semibold">Your Library</span>
            </div>
            <ChevronRight 
              className={cn(
                'w-5 h-5 transition-transform duration-200',
                libraryExpanded && 'rotate-90'
              )} 
            />
          </button>
        </div>

        {libraryExpanded && (
          <>
            {/* Action buttons */}
            <div className="px-4 pb-3 flex gap-2">
              <Link
                to="/playlist/new"
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-hover-highlight transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </Link>
              <button
                onClick={() => setDownloadEnabled(!downloadEnabled)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors',
                  downloadEnabled ? 'bg-accent text-accent-foreground' : 'bg-muted hover:bg-hover-highlight'
                )}
              >
                <Download className="w-4 h-4" />
                {downloadEnabled && <span className="text-xs">✓</span>}
              </button>
            </div>

            {/* Playlists */}
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1 pb-4">
                {/* Liked Songs */}
                <Link
                  to="/collection/tracks"
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-md transition-all hover:bg-hover-highlight group',
                    isActive('/collection/tracks') && 'bg-hover-highlight'
                  )}
                >
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-primary/80 to-secondary flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-foreground fill-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-sm">Liked Songs</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Playlist • {mockPlaylists[0].tracks.length} songs
                    </p>
                  </div>
                </Link>

                {/* User Playlists */}
                {mockPlaylists.slice(1).map((playlist) => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-md transition-all hover:bg-hover-highlight group',
                      isActive(`/playlist/${playlist.id}`) && 'bg-hover-highlight'
                    )}
                  >
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate text-sm">{playlist.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Playlist • {playlist.owner}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
