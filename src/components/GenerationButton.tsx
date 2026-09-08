import React from 'react';
import { Sparkles, Radio, Loader2, Play } from 'lucide-react';

export type GenerationStatus = 'idle' | 'generating' | 'streaming' | 'ready' | 'error';

interface GenerationButtonProps {
  onGenerate: (streamMode: boolean) => void;
  status: GenerationStatus;
  disabled?: boolean;
  isStreamMode: boolean;
  onToggleStreamMode: (enabled: boolean) => void;
  characterCount: number;
}

export const GenerationButton: React.FC<GenerationButtonProps> = ({
  onGenerate,
  status,
  disabled = false,
  isStreamMode,
  onToggleStreamMode,
  characterCount,
}) => {
  const isBusy = status === 'generating' || status === 'streaming';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Stream Toggle Pill */}
      <button
        id="toggle-stream-mode"
        type="button"
        onClick={() => onToggleStreamMode(!isStreamMode)}
        title="Stream audio chunks in real-time as they are synthesized"
        className={`flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl border text-xs font-semibold transition-all ${
          isStreamMode
            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
            : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
        }`}
      >
        <Radio className={`w-3.5 h-3.5 ${isStreamMode ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
        <span>Real-Time Streaming</span>
      </button>

      {/* Main Generate Action Button */}
      <button
        id="btn-trigger-generation"
        type="button"
        onClick={() => onGenerate(isStreamMode)}
        disabled={disabled || isBusy || characterCount === 0}
        className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all cursor-pointer group"
      >
        {status === 'generating' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Generating Speech...</span>
          </>
        ) : status === 'streaming' ? (
          <>
            <Radio className="w-4 h-4 animate-pulse text-cyan-200" />
            <span>Streaming Audio...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span>{isStreamMode ? 'Stream Speech' : 'Generate Speech'}</span>
            <span className="text-xs opacity-75 font-normal ml-1">
              ({characterCount} chars)
            </span>
          </>
        )}
      </button>
    </div>
  );
};
