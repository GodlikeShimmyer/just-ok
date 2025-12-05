import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Player from './Player';
import SettingsModal from './SettingsModal';
import { ScrollArea } from '@/components/ui/scroll-area';

const MainLayout: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-card to-background rounded-lg m-2 ml-0">
          <TopBar onSettingsClick={() => setSettingsOpen(true)} />
          <ScrollArea className="flex-1">
            <div className="p-6">
              <Outlet />
            </div>
          </ScrollArea>
        </main>
      </div>
      <Player />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default MainLayout;
