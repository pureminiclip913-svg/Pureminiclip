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
  Key,
  Eye,
  EyeOff,
  Sparkles,
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

  const [isCheckingSarvam, setIsCheckingSarvam] = useState(false);
  const [sarvamStatus, setSarvamStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [sarvamMessage, setSarvamMessage] = useState<string>('Not tested');
  const [newSarvamKey, setNewSarvamKey] = useState('');
  const [isSavingSarvam, setIsSavingSarvam] = useState(false);
  const [showSarvamKey, setShowSarvamKey] = useState(false);

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
            : 'Backend operational (running with high-fidelity mock voice catalog).'
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

  const handleTestSarvamConnection = async () => {
    setIsCheckingSarvam(true);
    setSarvamStatus('unknown');
    setSarvamMessage('Testing Sarvam AI Bulbul v3 API key...');

    try {
      const res = await api.testSarvamApiKey();
      if (res.valid) {
        setSarvamStatus('connected');
        setSarvamMessage('Sarvam AI connected! Original Bulbul v3 model voices are active.');
        addToast({
          type: 'success',
          title: 'Sarvam AI Verified',
          message: 'Original Bulbul v3 model voice is active and ready to synthesize.',
        });
      } else if (res.quotaExceeded) {
        setSarvamStatus('error');
        setSarvamMessage('Sarvam AI account has 0 credits. Please recharge your Sarvam credits or enter a new funded key.');
        addToast({
          type: 'warning',
          title: '0 Credits Remaining',
          message: 'Sarvam AI key has 0 credits. Enter a new key below to synthesize with original Sarvam model voices.',
        });
      } else {
        setSarvamStatus('error');
        setSarvamMessage(res.message || 'Sarvam AI API key not configured or invalid.');
        addToast({
          type: 'warning',
          title: 'Sarvam AI Notice',
          message: res.message || 'Add a valid SARVAM_API_KEY below.',
        });
      }
    } catch (err: any) {
      setSarvamStatus('error');
      setSarvamMessage(err.message || 'Failed to reach Sarvam AI test endpoint.');
      addToast({
        type: 'error',
        title: 'Sarvam Check Failed',
        message: err.message || 'Could not verify Sarvam AI key.',
      });
    } finally {
      setIsCheckingSarvam(false);
    }
  };

  const handleSaveSarvamKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSarvamKey.trim()) {
      addToast({
        type: 'warning',
        title: 'Empty Key',
        message: 'Please paste your Sarvam AI API subscription key before saving.',
      });
      return;
    }

    setIsSavingSarvam(true);
    setSarvamStatus('unknown');
    setSarvamMessage('Verifying and saving new Sarvam AI key...');

    try {
      const res = await api.saveSarvamApiKey(newSarvamKey.trim());
      if (res.valid) {
        setSarvamStatus('connected');
        setSarvamMessage('New Sarvam AI key activated! Original Bulbul v3 voices active.');
        addToast({
          type: 'success',
          title: 'Key Activated & Saved',
          message: 'Original Sarvam Bulbul v3 model voice is active and verified.',
        });
        setNewSarvamKey('');
      } else if (res.quotaExceeded) {
        setSarvamStatus('error');
        setSarvamMessage('Key saved, but Sarvam reports 0 credits remaining.');
        addToast({
          type: 'warning',
          title: 'Key Saved (0 Credits)',
          message: 'Saved successfully, but Sarvam returned 0 credits. Please recharge credits on your Sarvam account.',
        });
      } else {
        setSarvamStatus('error');
        setSarvamMessage(res.message);
        addToast({
          type: 'error',
          title: 'Verification Notice',
          message: res.message,
        });
      }
    } catch (err: any) {
      setSarvamStatus('error');
      setSarvamMessage(err.message || 'Failed to save key.');
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not save Sarvam API key.',
      });
    } finally {
      setIsSavingSarvam(false);
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

        {/* Sarvam AI Connection Card */}
        <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100">Sarvam AI API Connectivity</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    Bulbul v3
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Priority: Original Model Voice First
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Powers 12 expressive, natural Indian language & Hindi voices using original Sarvam Bulbul v3 model.
                </p>
              </div>
            </div>

            <button
              id="btn-test-sarvam-connection"
              type="button"
              onClick={handleTestSarvamConnection}
              disabled={isCheckingSarvam}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-orange-500/40 transition-all self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSarvam ? 'animate-spin text-orange-400' : ''}`} />
              <span>Test Connection</span>
            </button>
          </div>

          {/* Status badge */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            {sarvamStatus === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : sarvamStatus === 'error' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Radio className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-mono">
              Status: <strong className="text-slate-100">{sarvamMessage}</strong>
            </span>
          </div>

          {/* Add / Update New Sarvam API Key Form */}
          <form onSubmit={handleSaveSarvamKey} className="pt-2 border-t border-slate-800/80 space-y-3">
            <label htmlFor="input-sarvam-key" className="block text-xs font-semibold text-slate-300">
              Add / Update Sarvam AI API Key
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="input-sarvam-key"
                  type={showSarvamKey ? 'text' : 'password'}
                  value={newSarvamKey}
                  onChange={(e) => setNewSarvamKey(e.target.value)}
                  placeholder="Paste your new Sarvam API Key (e.g. sk_...)"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500/60 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSarvamKey(!showSarvamKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  title={showSarvamKey ? 'Hide key' : 'Show key'}
                >
                  {showSarvamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                id="btn-save-sarvam-key"
                type="submit"
                disabled={isSavingSarvam || !newSarvamKey.trim()}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-orange-500/10"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingSarvam ? 'Verifying & Saving...' : 'Save & Activate Key'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every Hindi & Indic voice synthesis and stream invokes the <strong className="text-slate-200">original Sarvam Bulbul v3 model voice</strong> directly using your authenticated Sarvam subscription key.
            </p>
          </form>
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
