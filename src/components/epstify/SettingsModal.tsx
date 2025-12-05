import React, { useState } from 'react';
import { X, User, Lock, Eye, Music2, Monitor, Globe, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettingsTab = 'account' | 'privacy' | 'playback' | 'devices' | 'language' | 'advanced';

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [crossfade, setCrossfade] = useState(0);
  const [gaplessPlayback, setGaplessPlayback] = useState(true);
  const [automix, setAutomix] = useState(true);
  const [normalizeVolume, setNormalizeVolume] = useState(false);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [recentlyPlayedVisible, setRecentlyPlayedVisible] = useState(true);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
    { id: 'playback', label: 'Playback', icon: <Music2 className="w-4 h-4" /> },
    { id: 'devices', label: 'Devices', icon: <Monitor className="w-4 h-4" /> },
    { id: 'language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 bg-card border-border overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-48 bg-sidebar border-r border-border p-4">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-lg font-bold">Settings</DialogTitle>
            </DialogHeader>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    activeTab === tab.id
                      ? 'bg-hover-highlight text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-hover-highlight/50'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Account</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Username</p>
                      <p className="text-sm text-muted-foreground">epstify_user</p>
                    </div>
                    <button className="text-sm text-primary hover:underline">Edit</button>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">user@epstify.com</p>
                    </div>
                    <button className="text-sm text-primary hover:underline">Edit</button>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">••••••••</p>
                    </div>
                    <button className="text-sm text-primary hover:underline">Change</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <button className="text-destructive hover:underline text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Privacy</h2>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Recently played visibility</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see what you've been listening to
                    </p>
                  </div>
                  <Switch
                    checked={recentlyPlayedVisible}
                    onCheckedChange={setRecentlyPlayedVisible}
                  />
                </div>
              </div>
            )}

            {activeTab === 'playback' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Playback</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Crossfade</p>
                      <span className="text-sm text-muted-foreground">{crossfade}s</span>
                    </div>
                    <Slider
                      value={[crossfade]}
                      max={12}
                      step={1}
                      onValueChange={([value]) => setCrossfade(value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Gapless playback</p>
                      <p className="text-sm text-muted-foreground">
                        Remove silence between tracks
                      </p>
                    </div>
                    <Switch
                      checked={gaplessPlayback}
                      onCheckedChange={setGaplessPlayback}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automix</p>
                      <p className="text-sm text-muted-foreground">
                        Smooth transitions between songs
                      </p>
                    </div>
                    <Switch
                      checked={automix}
                      onCheckedChange={setAutomix}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Normalize volume</p>
                      <p className="text-sm text-muted-foreground">
                        Set the same volume level for all tracks
                      </p>
                    </div>
                    <Switch
                      checked={normalizeVolume}
                      onCheckedChange={setNormalizeVolume}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Hardware acceleration</p>
                      <p className="text-sm text-muted-foreground">
                        Use hardware acceleration when available
                      </p>
                    </div>
                    <Switch
                      checked={hardwareAcceleration}
                      onCheckedChange={setHardwareAcceleration}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Devices</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Monitor className="w-8 h-8 text-accent" />
                    <div>
                      <p className="font-medium">Web Player (Chrome)</p>
                      <p className="text-sm text-accent">Currently playing</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Language</h2>
                
                <div>
                  <p className="font-medium mb-2">App language</p>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Advanced</h2>
                
                <div className="space-y-6">
                  <div>
                    <p className="font-medium mb-2">Storage</p>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Cache: 128 MB</p>
                      <button className="text-sm text-primary hover:underline">
                        Clear cache
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Download quality</p>
                    <Select defaultValue="high">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Streaming quality</p>
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
