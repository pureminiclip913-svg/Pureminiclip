import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  Radio,
  Sliders,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
  ChevronRight,
  Headphones,
  FileAudio,
} from 'lucide-react';
import { NavigationTab, Voice } from '../types';

interface LandingProps {
  onNavigate: (tab: NavigationTab) => void;
  voices: Voice[];
  onSelectVoiceAndStudio: (voiceId: string) => void;
}

export const Landing: React.FC<LandingProps> = ({
  onNavigate,
  voices,
  onSelectVoiceAndStudio,
}) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);

  const sampleVoices = voices.slice(0, 4);

  const handleTogglePreview = (voice: Voice) => {
    if (!voice.preview_url) return;

    if (playingVoiceId === voice.voice_id) {
      activeAudioElement?.pause();
      setPlayingVoiceId(null);
    } else {
      activeAudioElement?.pause();
      const audio = new Audio(voice.preview_url);
      audio.onended = () => setPlayingVoiceId(null);
      audio.play().catch(console.warn);
      setActiveAudioElement(audio);
      setPlayingVoiceId(voice.voice_id);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#080b12]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">VOXIA</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('voices')}
              className="text-xs text-slate-300 hover:text-cyan-300 transition-colors hidden sm:inline-block"
            >
              Voice Library
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs text-slate-300 hover:text-cyan-300 transition-colors hidden sm:inline-block"
            >
              Dashboard
            </button>
            <button
              id="landing-btn-studio-top"
              onClick={() => onNavigate('studio')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-cyan-400 shadow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Next-Gen ElevenLabs Speech Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Give your words <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              a voice.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Create natural, expressive AI speech in seconds. Powered by industry-leading neural audio models with real-time streaming, human nuance, and granular acoustic control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="landing-btn-start-creating"
              onClick={() => onNavigate('studio')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 text-slate-950 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start creating</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="landing-btn-explore-voices"
              onClick={() => onNavigate('voices')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all"
            >
              Explore voices
            </button>
          </div>
        </div>

        {/* Interactive Voice Sample Showcase */}
        <div className="max-w-5xl mx-auto mt-16 p-6 rounded-3xl bg-[#0c101a]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span>Audition Featured Voice Models</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Click any voice to audition instant playback</p>
            </div>
            <button
              onClick={() => onNavigate('voices')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Browse all {voices.length} voices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {sampleVoices.map((voice) => {
              const isPlaying = playingVoiceId === voice.voice_id;
              return (
                <div
                  key={voice.voice_id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-slate-200">
                        {voice.name.charAt(0)}
                      </div>
                      {voice.labels?.accent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                          {voice.labels.accent}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {voice.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {voice.description || 'Natural expressive speech.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePreview(voice)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isPlaying
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isPlaying ? 'Pause' : 'Listen'}</span>
                    </button>
                    <button
                      onClick={() => onSelectVoiceAndStudio(voice.voice_id)}
                      title="Use in Studio"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Engineered for Creators, Developers & Enterprises
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to produce audiobooks, podcasts, game character dialogs, and video narrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Real-Time Audio Streaming</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesize and stream audio chunks instantly with latency under 150ms. No waiting for long audio buffers to finish rendering before listening begins.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Studio Acoustic Controls</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fine-tune stability, voice similarity, style exaggeration, and pacing with mathematical precision. Switch effortlessly between MP3, WAV, and raw PCM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-slate-800/90 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Multilingual & Accents</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eleven v3 and Multilingual v2 models support over 70 languages with native emotional intonations, local accents, and consistent timbre across tongues.
            </p>
          </div>
        </div>
      </section>

      {/* Usage & Credit Explainer */}
      <section className="py-16 px-6 bg-[#080b12] border-y border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Fair Character-Based Quota</span>
          <h2 className="text-3xl font-extrabold text-white">Transparent Credit Tracking</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            1 character in your script equals 1 credit. No hidden charges or unexpected rate limits. Every generation logs exact metadata with duration and format.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-extrabold text-white font-mono">10,000</div>
              <p className="text-xs font-semibold text-cyan-400 mt-1">Starter Tier</p>
              <p className="text-[11px] text-slate-400 mt-2">Perfect for quick voiceovers, YouTube shorts, and experimentation.</p>
            </div>
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 relative">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">Active</div>
              <div className="text-2xl font-extrabold text-white font-mono">100,000</div>
              <p className="text-xs font-semibold text-cyan-300 mt-1">Creator Pro</p>
              <p className="text-[11px] text-slate-400 mt-2">Generous monthly capacity for podcast episodes, explainer videos, and audiobooks.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-extrabold text-white font-mono">500,000+</div>
              <p className="text-xs font-semibold text-cyan-400 mt-1">Scale / Enterprise</p>
              <p className="text-[11px] text-slate-400 mt-2">Dedicated concurrency, priority streaming throughput, and custom voice models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full space-y-8">
        <h2 className="text-3xl font-extrabold text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#0c101a] border border-slate-800 space-y-2">
            <h4 className="font-semibold text-sm text-slate-200">How is audio synthesized in VOXIA AI?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              VOXIA AI connects via a secure server proxy to the ElevenLabs REST & streaming synthesis API. Your requests are processed server-side so credentials remain 100% hidden and secure.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#0c101a] border border-slate-800 space-y-2">
            <h4 className="font-semibold text-sm text-slate-200">Does streaming work in the browser?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes. The VOXIA studio utilizes HTTP chunked transfer encoding and browser Web Streams to receive chunks incrementally and play or store the result with zero artificial delay.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#0c101a] border border-slate-800 space-y-2">
            <h4 className="font-semibold text-sm text-slate-200">How do I configure my ElevenLabs API key?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">ELEVENLABS_API_KEY</code> in your backend <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">.env</code> file, or test key connectivity directly inside the app's Settings page.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-6 border-t border-slate-800/80 bg-[#06080d] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[10px] font-bold">
              V
            </div>
            <span className="font-semibold text-slate-300">VOXIA AI</span>
            <span>— Advanced Neural Voice Studio</span>
          </div>
          <div>
            Built with React, Express, Web Audio API & ElevenLabs Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};
