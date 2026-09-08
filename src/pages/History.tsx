import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Play,
  Pause,
  Download,
  Trash2,
  Search,
  ArrowUpRight,
  Sparkles,
  Clock,
  Layers,
} from 'lucide-react';
import { Generation, NavigationTab } from '../types';

interface HistoryProps {
  generations: Generation[];
  onDeleteGeneration: (id: string) => void;
  onClearAll: () => void;
  onOpenInStudio: (generation: Generation) => void;
  activeAudioUrl: string | null;
  onPlayAudio: (url: string) => void;
}

export const History: React.FC<HistoryProps> = ({
  generations,
  onDeleteGeneration,
  onClearAll,
  onOpenInStudio,
  activeAudioUrl,
  onPlayAudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const filteredGenerations = generations.filter((g) => {
    return (
      g.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.voiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.modelId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePlayToggle = (gen: Generation) => {
    if (playingId === gen.id) {
      audioEl?.pause();
      setPlayingId(null);
    } else {
      audioEl?.pause();
      const nextAudio = new Audio(gen.audioUrl);
      nextAudio.onended = () => setPlayingId(null);
      nextAudio.play().catch(console.warn);
      setAudioEl(nextAudio);
      setPlayingId(gen.id);
      onPlayAudio(gen.audioUrl);
    }
  };

  const handleDownload = (gen: Generation) => {
    const link = document.createElement('a');
    link.href = gen.audioUrl;
    link.download = gen.audioFileName || `voxia_${gen.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Generation History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, listen to, download, or re-open any previously synthesized audio file.
          </p>
        </div>

        {generations.length > 0 && (
          <button
            id="btn-clear-all-history"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your generation history?')) {
                onClearAll();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {generations.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="history-search-input"
            type="text"
            placeholder="Search history by text or voice name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      )}

      {/* Generations List */}
      {filteredGenerations.length > 0 ? (
        <div className="space-y-3">
          {filteredGenerations.map((gen) => {
            const isPlaying = playingId === gen.id;
            return (
              <div
                key={gen.id}
                id={`history-row-${gen.id}`}
                className="p-4 rounded-2xl bg-[#0c101a] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left Play & Text details */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <button
                    id={`btn-history-play-${gen.id}`}
                    onClick={() => handlePlayToggle(gen)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isPlaying
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-800/80 text-slate-200 border-slate-700 group-hover:border-cyan-500/40 hover:bg-slate-700'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-200">{gen.voiceName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                        {gen.modelId}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {gen.characterCount} chars
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        • {gen.format.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {gen.text}
                    </p>
                  </div>
                </div>

                {/* Right Metadata & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(gen.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Open in Studio button */}
                    <button
                      id={`btn-open-studio-${gen.id}`}
                      onClick={() => onOpenInStudio(gen)}
                      title="Load this generation into Studio"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-xs transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Studio</span>
                    </button>

                    {/* Download */}
                    <button
                      id={`btn-download-${gen.id}`}
                      onClick={() => handleDownload(gen)}
                      title="Download audio"
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      id={`btn-delete-${gen.id}`}
                      onClick={() => onDeleteGeneration(gen.id)}
                      title="Delete recording"
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-[#0c101a] border border-slate-800 text-center text-slate-400 space-y-3">
          <HistoryIcon className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-base font-semibold text-slate-300">No generation history</p>
          <p className="text-xs text-slate-400">
            Audio clips you generate in the studio will be preserved here with duration, character count, and audio files.
          </p>
        </div>
      )}
    </div>
  );
};
