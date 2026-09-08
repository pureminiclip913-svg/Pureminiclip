import React from 'react';
import {
  Mic,
  AudioLines,
  FolderKanban,
  History,
  Gauge,
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  TrendingUp,
  Clock,
  Radio,
} from 'lucide-react';
import { NavigationTab, Voice, Generation, Project, UsageInfo } from '../types';

interface DashboardProps {
  onNavigate: (tab: NavigationTab) => void;
  voices: Voice[];
  generations: Generation[];
  projects: Project[];
  usage: UsageInfo | null;
  onSelectVoiceAndStudio: (voiceId: string) => void;
  onPlayAudio: (url: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  voices,
  generations,
  projects,
  usage,
  onSelectVoiceAndStudio,
  onPlayAudio,
}) => {
  const recentGens = generations.slice(0, 4);
  const featuredVoices = voices.slice(0, 4);

  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-6 lg:p-10 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1322] to-[#0a1120] border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VOXIA AI Voice Platform</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Welcome to your Voice Workspace
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Synthesize natural human speech, test multiple accents and speeds, and export audio for your media projects.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            id="dash-btn-open-studio"
            onClick={() => onNavigate('studio')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Open Studio</span>
          </button>
          <button
            id="dash-btn-voice-library"
            onClick={() => onNavigate('voices')}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <AudioLines className="w-4 h-4" />
            <span>Voice Catalog</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Credits Available</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {usage ? usage.charactersRemaining.toLocaleString() : '85,750'}
          </div>
          <p className="text-[11px] text-slate-400">
            of {usage?.characterLimit?.toLocaleString() || '100,000'} monthly chars
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Generations</span>
            <History className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {generations.length}
          </div>
          <p className="text-[11px] text-slate-400">Total synthesized clips</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {projects.length}
          </div>
          <p className="text-[11px] text-slate-400">Workspace folders</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c101a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">AI Voices</span>
            <AudioLines className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {voices.length}
          </div>
          <p className="text-[11px] text-slate-400">Available neural personas</p>
        </div>
      </div>

      {/* Grid: Recent Generations (Left) & Voices / Projects (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Generations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Recent Audio Generations</span>
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View all
            </button>
          </div>

          {recentGens.length > 0 ? (
            <div className="space-y-3">
              {recentGens.map((gen) => (
                <div
                  key={gen.id}
                  className="p-4 rounded-2xl bg-[#0c101a] border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <button
                      onClick={() => onPlayAudio(gen.audioUrl)}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-200">{gen.voiceName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {gen.characterCount} chars
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {gen.text}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {new Date(gen.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0c101a] border border-slate-800 text-center text-slate-400 space-y-3">
              <Mic className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-xs">No audio synthesized yet.</p>
              <button
                onClick={() => onNavigate('studio')}
                className="text-xs text-cyan-400 font-semibold hover:underline"
              >
                Create your first generation in Studio →
              </button>
            </div>
          )}
        </div>

        {/* Featured Voices & Projects (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Voice Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm">Recommended Voices</h3>
              <button
                onClick={() => onNavigate('voices')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Catalog
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {featuredVoices.map((voice) => (
                <div
                  key={voice.voice_id}
                  onClick={() => onSelectVoiceAndStudio(voice.voice_id)}
                  className="p-3.5 rounded-xl bg-[#0c101a] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-200">
                      {voice.name.charAt(0)}
                    </div>
                    {voice.labels?.accent && (
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {voice.labels.accent}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {voice.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {voice.labels?.use_case || 'Versatile'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Projects Access */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm">Saved Projects</h3>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                All Projects
              </button>
            </div>

            <div className="space-y-2">
              {projects.slice(0, 2).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onNavigate('projects')}
                  className="p-3.5 rounded-xl bg-[#0c101a] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-semibold text-xs text-slate-200">{proj.name}</h5>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                      {proj.text}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
