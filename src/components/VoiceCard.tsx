import React, { useState } from 'react';
import { Play, Pause, ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { Voice } from '../types';

interface VoiceCardProps {
  voice: Voice;
  isSelected?: boolean;
  onSelect: (voice: Voice) => void;
  onPlayPreview: (voice: Voice) => void;
  isPlayingPreview?: boolean;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({
  voice,
  isSelected = false,
  onSelect,
  onPlayPreview,
  isPlayingPreview = false,
}) => {
  return (
    <div
      id={`voice-card-${voice.voice_id}`}
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
        isSelected
          ? 'bg-gradient-to-b from-cyan-950/20 to-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
          : 'bg-[#0c101a] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      <div>
        {/* Top bar with avatar, name & badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-colors ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800/80 text-slate-200 border-slate-700 group-hover:border-slate-600'
              }`}
            >
              {voice.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                {voice.name}
              </h4>
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                {voice.voice_id.slice(0, 14)}...
              </p>
            </div>
          </div>

          {voice.category && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80 capitalize">
              {voice.category}
            </span>
          )}
        </div>

        {/* Labels / Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {voice.labels?.gender && (
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800/60 text-slate-300 border border-slate-700/60 capitalize">
              {voice.labels.gender}
            </span>
          )}
          {voice.labels?.accent && (
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
              {voice.labels.accent}
            </span>
          )}
          {voice.labels?.use_case && (
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800/60 text-slate-300 border border-slate-700/60 capitalize">
              {voice.labels.use_case}
            </span>
          )}
          {voice.labels?.description && (
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800/60 text-slate-400 border border-slate-700/60 capitalize">
              {voice.labels.description}
            </span>
          )}
        </div>

        {/* Description text */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
          {voice.description || 'Natural expressive voice optimized for lifelike conversational dialogue and clear narration.'}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
        {/* Preview Button */}
        {voice.preview_url ? (
          <button
            id={`btn-card-preview-${voice.voice_id}`}
            onClick={() => onPlayPreview(voice)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isPlayingPreview
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {isPlayingPreview ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Sample</span>
              </>
            )}
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 italic">No sample audio</span>
        )}

        {/* Select & Use Button */}
        <button
          id={`btn-card-select-${voice.voice_id}`}
          onClick={() => onSelect(voice)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isSelected
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 border border-slate-700'
          }`}
        >
          <span>{isSelected ? 'Active in Studio' : 'Use Voice'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
