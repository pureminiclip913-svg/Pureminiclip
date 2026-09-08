import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Volume2,
  Save,
  Radio,
} from 'lucide-react';
import { Voice, ToastNotification } from '../types';
import { AVAILABLE_MODELS, AVAILABLE_FORMATS } from '../components/SettingsPanel';
import { api } from '../services/api';

interface SettingsProps {
  voices: Voice[];
  defaultVoiceId: string;
  onSetDefaultVoiceId: (id: string) => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  voices,
  defaultVoiceId,
  onSetDefaultVoiceId,
  addToast,
}) => {
  const [selectedVoice, setSelectedVoice] = useState(defaultVoiceId);
  const [selectedModel, setSelectedModel] = useState('eleven_multilingual_v2');
  const [selectedFormat, setSelectedFormat] = useState('mp3_44100_128');
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [statusMessage, setStatusMessage] = useState<string>('Not tested');

  const handleTestConnection = async () => {
    setIsCheckingConnection(true);
    setConnectionStatus('unknown');
    setStatusMessage('Checking ElevenLabs backend proxy...');

    try {
      const res = await api.checkHealth();
      if (res.status === 'ok') {
        setConnectionStatus('connected');
        setStatusMessage(
          res.elevenlabsConfigured
            ? 'ElevenLabs API connected & authenticated successfully.'
            : 'Backend connected (running with high-fidelity mock voice catalog).'
        );
        addToast({
          type: 'success',
          title: 'Connection Successful',
          message: res.elevenlabsConfigured
            ? 'ElevenLabs API credentials verified.'
            : 'Backend operational. Add ELEVENLABS_API_KEY in .env to use live ElevenLabs keys.',
        });
      }
    } catch (err: any) {
      setConnectionStatus('error');
      setStatusMessage(err.message || 'Failed to connect to backend.');
      addToast({
        type: 'error',
        title: 'Connection Check Failed',
        message: err.message || 'Could not reach server endpoint.',
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    onSetDefaultVoiceId(selectedVoice);
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Default voice and synthesis configuration updated.',
    });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800/80">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure API connection status, default neural voice personas, and audio output preferences.
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        {/* ElevenLabs API Connection Card */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">ElevenLabs API Connectivity</h3>
                <p className="text-xs text-slate-400">
                  Backend proxy handles API key authentication securely.
                </p>
              </div>
            </div>

            <button
              id="btn-test-connection"
              type="button"
              onClick={handleTestConnection}
              disabled={isCheckingConnection}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/40 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingConnection ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Test Connection</span>
            </button>
          </div>

          {/* Status badge */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            {connectionStatus === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : connectionStatus === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Radio className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-mono">
              Status: <strong className="text-slate-100">{statusMessage}</strong>
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Note: Your <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">ELEVENLABS_API_KEY</code> is kept strictly on the Express server in your environment configuration and is never exposed in browser code.
          </p>
        </div>

        {/* Studio Defaults Form */}
        <form onSubmit={handleSaveDefaults} className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-5">
          <h3 className="font-bold text-sm text-slate-100 pb-2 border-b border-slate-800">
            Studio Defaults
          </h3>

          {/* Default Voice */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Default Voice Persona
            </label>
            <select
              id="select-default-voice"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              {voices.map((v) => (
                <option key={v.voice_id} value={v.voice_id}>
                  {v.name} ({v.labels?.accent || 'Neural'} - {v.labels?.gender || 'Voice'})
                </option>
              ))}
            </select>
          </div>

          {/* Default Model */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Default Neural Synthesis Model
            </label>
            <select
              id="select-default-model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.latency}
                </option>
              ))}
            </select>
          </div>

          {/* Default Output Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Default Output Quality & Encoding
            </label>
            <select
              id="select-default-format"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              {AVAILABLE_FORMATS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              id="btn-save-settings"
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
