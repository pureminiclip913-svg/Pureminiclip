import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { ToastNotification } from '../types';

interface AddSarvamKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
}

export const AddSarvamKeyModal: React.FC<AddSarvamKeyModalProps> = ({
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

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setStatus('error');
      setStatusMessage('Please enter or paste a valid Sarvam API key.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setStatusMessage('Verifying key with Sarvam AI Bulbul v3...');

    try {
      const res = await api.saveSarvamApiKey(cleanKey);
      if (res.valid) {
        setStatus('success');
        setStatusMessage('Sarvam AI key verified and saved! Bulbul v3 neural voices are active.');
        addToast({
          type: 'success',
          title: 'Sarvam AI Key Connected',
          message: 'Key verified! You can now synthesize high-quality Hindi and Indic speech.',
        });
        setApiKey('');
        if (onKeyUpdated) onKeyUpdated();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (res.quotaExceeded) {
        setStatus('error');
        setStatusMessage('Key saved, but Sarvam account reports 0 credits. Please recharge your account at sarvam.ai.');
        addToast({
          type: 'warning',
          title: 'Sarvam Key Saved (0 Credits)',
          message: 'The key was saved, but your Sarvam AI balance has 0 credits remaining.',
        });
        if (onKeyUpdated) onKeyUpdated();
      } else {
        setStatus('error');
        setStatusMessage(res.message || 'Verification failed. Please check your API key.');
        addToast({
          type: 'error',
          title: 'Sarvam Key Verification Failed',
          message: res.message || 'Could not verify Sarvam subscription key.',
        });
      }
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err?.message || 'Network error while connecting to Sarvam AI.');
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
      id="sarvam-key-modal-overlay"
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="sarvam-key-modal-card"
        className="w-full max-w-lg bg-[#0c101a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Add Sarvam AI API Key</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 border border-orange-500/30 text-orange-300">
                  Bulbul v3
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable 12 expressive, natural Indian language & Hindi neural voices.
              </p>
            </div>
          </div>

          <button
            id="btn-close-sarvam-modal"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Original Sarvam Neural Model First</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Your key connects directly to Sarvam AI's official Text-to-Speech API for Shubh, Meera, Pavithra, Kabir, and 8 other native Indian voices without unwanted voice switching.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia'].map((lang) => (
              <span
                key={lang}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="input-modal-sarvam-key" className="block text-xs font-semibold text-slate-300">
              Sarvam Subscription Key
            </label>
            <div className="relative">
              <input
                id="input-modal-sarvam-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste key (e.g. sk_...)"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500/60 font-mono transition-all"
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
                <RefreshCw className="w-4 h-4 text-orange-400 animate-spin shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{statusMessage}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <a
              href="https://sarvam.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-orange-400/90 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              <span>Get key from Sarvam AI</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              <button
                id="btn-cancel-sarvam-modal"
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-save-sarvam-modal"
                type="submit"
                disabled={isLoading || !apiKey.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/10 flex items-center gap-1.5"
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
