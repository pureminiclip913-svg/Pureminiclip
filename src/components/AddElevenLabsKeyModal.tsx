import React, { useState } from 'react';
import {
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Globe,
  Languages,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { ToastNotification } from '../types';

interface AddElevenLabsKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
}

const INDIC_LANGUAGES = [
  { name: 'Hindi', script: 'हिन्दी', code: 'hi' },
  { name: 'Tamil', script: 'தமிழ்', code: 'ta' },
  { name: 'Telugu', script: 'తెలుగు', code: 'te' },
  { name: 'Bengali', script: 'বাংলা', code: 'bn' },
  { name: 'Marathi', script: 'मराठी', code: 'mr' },
  { name: 'Gujarati', script: 'ગુજરાતી', code: 'gu' },
  { name: 'Kannada', script: 'ಕನ್ನಡ', code: 'kn' },
  { name: 'Malayalam', script: 'മലയാളം', code: 'ml' },
  { name: 'Punjabi', script: 'ਪੰਜਾਬੀ', code: 'pa' },
  { name: 'Urdu', script: 'اردو', code: 'ur' },
];

export const AddElevenLabsKeyModal: React.FC<AddElevenLabsKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
  addToast,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [accountDetails, setAccountDetails] = useState<{
    tier?: string;
    characterLimit?: number;
    characterCount?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setStatus('error');
      setStatusMessage('Please enter or paste a valid ElevenLabs API key.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setStatusMessage('Verifying key with ElevenLabs API...');
    setAccountDetails(null);

    try {
      const res = await api.saveElevenLabsApiKey(cleanKey);
      if (res.valid) {
        setStatus('success');
        setAccountDetails({
          tier: res.tier,
          characterLimit: res.characterLimit,
          characterCount: res.characterCount,
        });
        setStatusMessage(
          res.message ||
            `ElevenLabs key verified and active! Tier: ${res.tier || 'Active'}.`
        );
        addToast({
          type: 'success',
          title: 'ElevenLabs Key Connected',
          message: `Verified! Tier: ${res.tier || 'Active'}. Full voice library & Indic speech enabled.`,
        });
        setApiKey('');
        if (onKeyUpdated) onKeyUpdated();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatus('error');
        setStatusMessage(
          res.message || 'Verification failed. Please check your ElevenLabs API key.'
        );
        addToast({
          type: 'error',
          title: 'Verification Failed',
          message: res.message || 'ElevenLabs API rejected the key.',
        });
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err?.message || 'Network error while contacting ElevenLabs API.');
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: err?.message || 'Failed to communicate with server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="elevenlabs-key-modal-overlay"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="elevenlabs-key-modal-card"
        className="w-full max-w-lg bg-[#0c101a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Add ElevenLabs API Key</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Multilingual v2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Unlock official studio voices, high-resolution neural speech, and custom clones.
              </p>
            </div>
          </div>

          <button
            id="btn-close-elevenlabs-modal"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indic Language Compatibility Indicators */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>Indic Language Compatibility</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              10 Indic Scripts Supported
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            ElevenLabs Multilingual v2 delivers native pronunciation and prosody across Indian languages with real-time accent adaptation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
            {INDIC_LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className="px-2 py-1 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-1 text-[10px]"
              >
                <span className="text-slate-300 font-medium truncate">{lang.name}</span>
                <span className="text-cyan-400 font-normal font-sans text-[10px] opacity-80">{lang.script}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="input-modal-elevenlabs-key" className="block text-xs font-semibold text-slate-300">
              ElevenLabs API Key (xi-api-key)
            </label>
            <div className="relative">
              <input
                id="input-modal-elevenlabs-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste key (e.g. sk_...)"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Account Details if verified */}
          {accountDetails && (
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-center">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-mono">Plan Tier</span>
                <span className="text-xs font-bold text-cyan-300 capitalize">{accountDetails.tier || 'Active'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-mono">Quota</span>
                <span className="text-xs font-bold text-slate-200">
                  {accountDetails.characterLimit != null ? accountDetails.characterLimit.toLocaleString() : 'Active'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-mono">Used</span>
                <span className="text-xs font-bold text-slate-200">
                  {accountDetails.characterCount != null ? accountDetails.characterCount.toLocaleString() : '0'}
                </span>
              </div>
            </div>
          )}

          {/* Status feedback */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                status === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : status === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : status === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{statusMessage}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <a
              href="https://elevenlabs.io/app/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cyan-400/90 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Get key from ElevenLabs</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              <button
                id="btn-cancel-elevenlabs-modal"
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-save-elevenlabs-modal"
                type="submit"
                disabled={isLoading || !apiKey.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/10 flex items-center gap-1.5"
              >
                {isLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>{isLoading ? 'Verifying...' : 'Save & Activate'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
