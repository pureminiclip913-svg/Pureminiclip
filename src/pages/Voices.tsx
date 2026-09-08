import React, { useState } from 'react';
import {
  Search,
  Filter,
  Volume2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Voice, NavigationTab } from '../types';
import { VoiceCard } from '../components/VoiceCard';

interface VoicesProps {
  voices: Voice[];
  selectedVoiceId: string;
  onSelectVoiceAndStudio: (voiceId: string) => void;
  onRefreshVoices: () => void;
  isRefreshing?: boolean;
}

export const Voices: React.FC<VoicesProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoiceAndStudio,
  onRefreshVoices,
  isRefreshing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAccent, setSelectedAccent] = useState<string>('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Extract unique accents
  const uniqueAccents = Array.from(
    new Set(
      voices
        .map((v) => v.labels?.accent)
        .filter((a): a is string => Boolean(a && a.trim().length > 0))
    )
  );

  const handlePlayPreview = (voice: Voice) => {
    if (!voice.preview_url) return;

    if (previewingVoiceId === voice.voice_id) {
      audioElement?.pause();
      setPreviewingVoiceId(null);
    } else {
      audioElement?.pause();
      const audio = new Audio(voice.preview_url);
      audio.onended = () => setPreviewingVoiceId(null);
      audio.play().catch(console.warn);
      setAudioElement(audio);
      setPreviewingVoiceId(voice.voice_id);
    }
  };

  const filteredVoices = voices.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.labels?.use_case?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.labels?.accent?.toLowerCase().includes(searchQuery.toLowerCase());

    const voiceGender = v.labels?.gender?.toLowerCase() || '';
    const matchesGender =
      selectedGender === 'all' ||
      (selectedGender === 'female' && voiceGender.includes('female')) ||
      (selectedGender === 'male' && voiceGender.includes('male') && !voiceGender.includes('female'));

    const matchesAccent =
      selectedAccent === 'all' || v.labels?.accent === selectedAccent;

    return matchesSearch && matchesGender && matchesAccent;
  });

  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Voice Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audition and select from {voices.length} high-fidelity AI neural voices.
          </p>
        </div>

        <button
          id="btn-refresh-voices"
          onClick={onRefreshVoices}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Catalog</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#0c101a] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="voices-page-search"
            type="text"
            placeholder="Search by name, accent, character, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Gender Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', 'female', 'male'].map((g) => (
            <button
              key={g}
              id={`filter-gender-${g}`}
              onClick={() => setSelectedGender(g)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                selectedGender === g
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {g === 'all' ? 'All Genders' : g}
            </button>
          ))}
        </div>

        {/* Accent Filter Dropdown */}
        {uniqueAccents.length > 0 && (
          <select
            id="filter-accent-select"
            value={selectedAccent}
            onChange={(e) => setSelectedAccent(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Accents ({uniqueAccents.length})</option>
            {uniqueAccents.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map((voice) => (
          <VoiceCard
            key={voice.voice_id}
            voice={voice}
            isSelected={voice.voice_id === selectedVoiceId}
            onSelect={() => onSelectVoiceAndStudio(voice.voice_id)}
            onPlayPreview={handlePlayPreview}
            isPlayingPreview={previewingVoiceId === voice.voice_id}
          />
        ))}
      </div>

      {filteredVoices.length === 0 && (
        <div className="p-16 rounded-3xl bg-[#0c101a] border border-slate-800 text-center text-slate-400 space-y-3">
          <p className="text-base font-semibold text-slate-300">No voices match your search</p>
          <p className="text-xs text-slate-500">Try changing your search terms or clearing your filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGender('all');
              setSelectedAccent('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
