import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Check,
  User,
  X,
} from 'lucide-react';
import { Voice } from '../types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  className?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const selectedVoice = voices.find((v) => v.voice_id === selectedVoiceId) || voices[0];

  // Stop preview on modal close
  useEffect(() => {
    if (!isOpen && audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setPreviewingVoiceId(null);
    }
  }, [isOpen]);

  const handlePreview = (e: React.MouseEvent, voice: Voice) => {
    e.stopPropagation();
    if (!voice.preview_url) return;

    if (previewingVoiceId === voice.voice_id) {
      audioPreviewRef.current?.pause();
      setPreviewingVoiceId(null);
    } else {
      if (!audioPreviewRef.current) {
        audioPreviewRef.current = new Audio();
      }
      audioPreviewRef.current.src = voice.preview_url;
      audioPreviewRef.current.onended = () => setPreviewingVoiceId(null);
      audioPreviewRef.current.play().then(() => {
        setPreviewingVoiceId(voice.voice_id);
      }).catch((err) => {
        console.warn('Audio preview playback blocked:', err);
      });
    }
  };

  const filteredVoices = voices.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.labels?.accent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.labels?.use_case?.toLowerCase().includes(searchQuery.toLowerCase());

    const voiceGender = v.labels?.gender?.toLowerCase() || '';
    const matchesGender =
      genderFilter === 'all' ||
      (genderFilter === 'female' && voiceGender.includes('female')) ||
      (genderFilter === 'male' && voiceGender.includes('male') && !voiceGender.includes('female'));

    return matchesSearch && matchesGender;
  });

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        id="btn-open-voice-selector"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
            {selectedVoice?.name?.charAt(0) || 'V'}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-sm">{selectedVoice?.name || 'Select a Voice'}</span>
              {selectedVoice?.labels?.gender && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 capitalize">
                  {selectedVoice.labels.gender}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">
              {selectedVoice?.labels?.accent || 'Neural Voice'} • {selectedVoice?.labels?.use_case || 'Versatile'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-2 text-slate-400 group-hover:text-slate-200">
          {selectedVoice?.preview_url && (
            <div
              onClick={(e) => handlePreview(e, selectedVoice)}
              title="Preview selected voice"
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-cyan-300 transition-colors"
            >
              {previewingVoiceId === selectedVoice.voice_id ? (
                <Pause className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </div>
          )}
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Voice Selection Dropdown Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="w-full max-w-xl max-h-[85vh] bg-[#0c101a] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-base">Select Voice</h3>
                <p className="text-xs text-slate-400">Choose from available AI voices</p>
              </div>
              <button
                id="btn-close-voice-modal"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-800/60 bg-slate-950/40 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="voice-search-input"
                  type="text"
                  placeholder="Search by voice name, accent, tone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Gender filter tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGenderFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    genderFilter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  All Voices
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('female')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    genderFilter === 'female'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setGenderFilter('male')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    genderFilter === 'male'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Male
                </button>
                <span className="ml-auto text-xs text-slate-400">
                  {filteredVoices.length} found
                </span>
              </div>
            </div>

            {/* Voices List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[50vh]">
              {filteredVoices.map((voice) => {
                const isSelected = voice.voice_id === selectedVoiceId;
                const isPreviewing = previewingVoiceId === voice.voice_id;

                return (
                  <div
                    key={voice.voice_id}
                    id={`voice-option-${voice.voice_id}`}
                    onClick={() => {
                      onSelectVoice(voice.voice_id);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-slate-100 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                        {voice.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-100">{voice.name}</span>
                          {voice.is_paid_only ? (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950/70 border border-amber-800/70 text-amber-300 font-semibold">
                              Paid Tier
                            </span>
                          ) : voice.free_tier_compatible ? (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950/50 border border-emerald-800/40 text-emerald-300 font-semibold">
                              Free Ready
                            </span>
                          ) : null}
                          {voice.labels?.gender && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 capitalize">
                              {voice.labels.gender}
                            </span>
                          )}
                          {voice.labels?.accent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400">
                              {voice.labels.accent}
                            </span>
                          )}
                        </div>
                        {voice.description && (
                          <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                            {voice.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      {voice.preview_url && (
                        <button
                          type="button"
                          id={`btn-preview-voice-${voice.voice_id}`}
                          onClick={(e) => handlePreview(e, voice)}
                          title="Preview voice sample"
                          className={`p-2 rounded-lg border transition-colors ${
                            isPreviewing
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-cyan-300 hover:border-cyan-500/30'
                          }`}
                        >
                          {isPreviewing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>
                      )}

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredVoices.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm font-medium">No voices matching your filter</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
