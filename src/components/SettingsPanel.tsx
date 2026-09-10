import React from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  Layers,
  Volume2,
  Gauge,
} from 'lucide-react';
import { VoiceSettings, TTSModel } from '../types';

export const AVAILABLE_MODELS: TTSModel[] = [
  {
    id: 'eleven_multilingual_v2',
    name: 'Eleven Multilingual v2',
    description: 'Lifelike, natural speech synthesis across 29 languages. Recommended default.',
    languages: '29 Languages',
    latency: '~280ms',
    badge: 'Popular',
  },
  {
    id: 'google_neural_tts',
    name: 'Google Neural TTS',
    description: 'Ultra-fast neural voice synthesizer with free zero-quota English and Hindi voices.',
    languages: 'English & Hindi',
    latency: '~120ms',
    badge: '100% Free',
  },
  {
    id: 'eleven_turbo_v2_5',
    name: 'Eleven Turbo v2.5',
    description: 'Balanced high quality with fast inference speed across 32 languages.',
    languages: '32 Languages',
    latency: '~150ms',
    badge: 'Fast',
  },
  {
    id: 'eleven_flash_v2_5',
    name: 'Eleven Flash v2.5',
    description: 'Ultra-low latency streaming optimized for real-time conversational agents.',
    languages: '32 Languages',
    latency: '~75ms',
    badge: 'Real-time',
  },
  {
    id: 'eleven_v3',
    name: 'Eleven v3 (Expressive)',
    description: 'Emotionally expressive neural speech with dramatic range and character depth.',
    languages: '70+ Languages',
    latency: '~350ms',
    badge: 'Studio FX',
  },
];

export const AVAILABLE_FORMATS = [
  { id: 'mp3_44100_128', label: 'MP3 • 44.1kHz • 128 kbps (Standard)' },
  { id: 'mp3_44100_192', label: 'MP3 • 44.1kHz • 192 kbps (High Fidelity)' },
  { id: 'mp3_22050_32', label: 'MP3 • 22.05kHz • 32 kbps (Lightweight)' },
  { id: 'wav_44100_16', label: 'WAV • 44.1kHz • 16-bit (Broadcast)' },
  { id: 'pcm_16000', label: 'PCM • 16kHz (Raw Audio)' },
];

interface SettingsPanelProps {
  settings: VoiceSettings;
  onChangeSettings: (newSettings: VoiceSettings) => void;
  selectedModel: string;
  onChangeModel: (modelId: string) => void;
  outputFormat: string;
  onChangeFormat: (format: string) => void;
  onResetDefaults: () => void;
  className?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onChangeSettings,
  selectedModel,
  onChangeModel,
  outputFormat,
  onChangeFormat,
  onResetDefaults,
  className = '',
}) => {
  const updateSetting = <K extends keyof VoiceSettings>(key: K, val: VoiceSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: val,
    });
  };

  return (
    <div
      id="voice-settings-panel"
      className={`p-5 rounded-2xl bg-[#0b0e17] border border-slate-800/90 shadow-xl space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">Voice Configuration</h3>
        </div>
        <button
          id="btn-reset-voice-settings"
          type="button"
          onClick={onResetDefaults}
          title="Reset settings to defaults"
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>AI Model</span>
          <span className="text-[10px] text-slate-400">Neural Engine</span>
        </label>
        <div className="space-y-2">
          {AVAILABLE_MODELS.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
              <div
                key={model.id}
                id={`model-option-${model.id}`}
                onClick={() => onChangeModel(model.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-slate-100 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200">{model.name}</span>
                  {model.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {model.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{model.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
                  <span>{model.languages}</span>
                  <span>•</span>
                  <span>{model.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stability Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Stability</span>
          <span className="font-mono text-cyan-400 font-semibold">{settings.stability.toFixed(2)}</span>
        </div>
        <input
          id="setting-stability-range"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.stability}
          onChange={(e) => updateSetting('stability', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>More Variable (Expressive)</span>
          <span>More Stable (Monotone)</span>
        </div>
      </div>

      {/* Similarity / Clarity Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Similarity & Clarity</span>
          <span className="font-mono text-cyan-400 font-semibold">{settings.similarity_boost.toFixed(2)}</span>
        </div>
        <input
          id="setting-similarity-range"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.similarity_boost}
          onChange={(e) => updateSetting('similarity_boost', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Low (Background Noise)</span>
          <span>High (Exact Voice Match)</span>
        </div>
      </div>

      {/* Style Exaggeration Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Style Exaggeration</span>
          <span className="font-mono text-cyan-400 font-semibold">{settings.style.toFixed(2)}</span>
        </div>
        <input
          id="setting-style-range"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.style}
          onChange={(e) => updateSetting('style', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Neutral Delivery</span>
          <span>Dramatic Acting</span>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Speed (Pace)</span>
          <span className="font-mono text-cyan-400 font-semibold">{settings.speed.toFixed(2)}x</span>
        </div>
        <input
          id="setting-speed-range"
          type="range"
          min="0.5"
          max="2.0"
          step="0.05"
          value={settings.speed}
          onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>0.5x (Slow)</span>
          <span>1.0x</span>
          <span>2.0x (Fast)</span>
        </div>
      </div>

      {/* Speaker Boost Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div>
          <span className="text-xs font-medium text-slate-200 block">Speaker Boost</span>
          <span className="text-[10px] text-slate-400">Boosts voice clarity and loudness</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id="toggle-speaker-boost"
            type="checkbox"
            checked={settings.use_speaker_boost}
            onChange={(e) => updateSetting('use_speaker_boost', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
        </label>
      </div>

      {/* Output Format Picker */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">Output Format</label>
        <select
          id="select-output-format"
          value={outputFormat}
          onChange={(e) => onChangeFormat(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
        >
          {AVAILABLE_FORMATS.map((fmt) => (
            <option key={fmt.id} value={fmt.id}>
              {fmt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
