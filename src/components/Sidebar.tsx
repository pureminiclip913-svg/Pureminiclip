import React from 'react';
import {
  Sparkles,
  Mic,
  AudioLines,
  FolderKanban,
  History,
  Gauge,
  Settings,
  User,
  LayoutDashboard,
  Compass,
  X,
} from 'lucide-react';
import { NavigationTab, UsageInfo } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  usage: UsageInfo | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  usage,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'studio', label: 'Studio', icon: Mic },
    { id: 'voices', label: 'Voice Library', icon: AudioLines },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'history', label: 'History', icon: History },
    { id: 'usage', label: 'Usage & Credits', icon: Gauge },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'account', label: 'Account', icon: User },
    { id: 'landing', label: 'Explore Landing', icon: Compass },
  ];

  const characterPercent = usage
    ? Math.min(100, Math.round((usage.characterCount / usage.characterLimit) * 100))
    : 15;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#080b12] border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  VOXIA
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">VOICE SYNTHESIS STUDIO</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/5 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
                {item.id === 'studio' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Usage & Plan Card at Bottom */}
        <div className="p-3 border-t border-slate-800/80">
          <div
            onClick={() => {
              onSelectTab('usage');
              onCloseMobile();
            }}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {usage?.tier || 'Creator Pro'}
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {usage ? (usage.charactersRemaining / 1000).toFixed(0) : 85}k left
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${characterPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>{usage?.characterCount?.toLocaleString() || '14,250'} used</span>
              <span>{usage?.characterLimit?.toLocaleString() || '100,000'} limit</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
