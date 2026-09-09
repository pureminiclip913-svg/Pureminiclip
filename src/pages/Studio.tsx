import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCw,
  SlidersHorizontal,
  Layers,
  FileText,
  AlertCircle,
  Radio,
  Bookmark,
  Check,
} from 'lucide-react';
import {
  Voice,
  VoiceSettings,
  Generation,
  Project,
  ToastNotification,
} from '../types';
import { TextEditor } from '../components/TextEditor';
import { VoiceSelector } from '../components/VoiceSelector';
import { SettingsPanel, AVAILABLE_MODELS } from '../components/SettingsPanel';
import { GenerationButton, GenerationStatus } from '../components/GenerationButton';
import { AudioPlayer } from '../components/AudioPlayer';
import { api } from '../services/api';

interface StudioProps {
  voices: Voice[];
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  activeProject: Project | null;
  onSaveProject: (text: string, voiceId: string, settings: VoiceSettings) => void;
  onGenerationComplete: (gen: Generation) => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
  speed: 1.0,
};

export const Studio: React.FC<StudioProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice,
  activeProject,
  onSaveProject,
  onGenerationComplete,
  addToast,
}) => {
  const [text, setText] = useState<string>(
    activeProject?.text ||
      'In the quiet moments before dawn, the world holds its breath. VOXIA AI brings depth and warmth to every spoken syllable, turning narrative concepts into auditory experiences that resonate.'
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    activeProject?.modelId || 'eleven_multilingual_v2'
  );
  const [settings, setSettings] = useState<VoiceSettings>(
    activeProject?.settings || DEFAULT_SETTINGS
  );
  const [outputFormat, setOutputFormat] = useState<string>('mp3_44100_128');
  const [isStreamMode, setIsStreamMode] = useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const [lastGeneration, setLastGeneration] = useState<Generation | null>(null);
  const [showMobileSettings, setShowMobileSettings] = useState<boolean>(false);

  // Sync if project changes
  useEffect(() => {
    if (activeProject) {
      setText(activeProject.text);
      if (activeProject.voiceId) onSelectVoice(activeProject.voiceId);
      if (activeProject.modelId) setSelectedModel(activeProject.modelId);
      if (activeProject.settings) setSettings(activeProject.settings);
    }
  }, [activeProject]);

  const selectedVoice = voices.find((v) => v.voice_id === selectedVoiceId) || voices[0];

  const handleGenerate = async (useStreaming: boolean) => {
    const trimmed = text.trim();
    if (!trimmed) {
      addToast({
        type: 'error',
        title: 'Empty Script',
        message: 'Please enter text into the editor before generating speech.',
      });
      return;
    }

    if (useStreaming) {
      // Real-time chunked streaming
      setGenerationStatus('streaming');
      addToast({
        type: 'info',
        title: 'Streaming Synthesis',
        message: 'Receiving real-time audio chunks from the voice model...',
      });

      await api.streamTTS(
        {
          text: trimmed,
          voiceId: selectedVoiceId,
          modelId: selectedModel,
          stability: settings.stability,
          similarity: settings.similarity_boost,
          style: settings.style,
          speed: settings.speed,
          outputFormat,
          projectId: activeProject?.id,
        },
        (chunk, totalBytes) => {
          // Streaming progress callback
        },
        (audioBlob, audioUrl) => {
          setActiveAudioUrl(audioUrl);
          setGenerationStatus('ready');

          const today = new Date().toISOString().split('T')[0];
          const ext = outputFormat.startsWith('wav') ? 'wav' : 'mp3';
          const newGen: Generation = {
            id: `stream_${Date.now()}`,
            text: trimmed,
            voiceId: selectedVoiceId,
            voiceName: selectedVoice?.name || 'AI Voice',
            modelId: selectedModel,
            audioUrl,
            audioFileName: `voxia-tts-${today}.${ext}`,
            format: ext,
            characterCount: trimmed.length,
            wordCount: trimmed.split(/\s+/).length,
            durationSeconds: Math.max(1, Math.round((trimmed.split(/\s+/).length / 140) * 60)),
            createdAt: new Date().toISOString(),
            status: 'completed',
            settings,
            projectId: activeProject?.id,
          };

          setLastGeneration(newGen);
          onGenerationComplete(newGen);

          addToast({
            type: 'success',
            title: 'Stream Ready',
            message: `Stream completed (${trimmed.length} characters synthesized).`,
          });
        },
        (err) => {
          setGenerationStatus('error');
          console.error('Streaming error:', err);
          addToast({
            type: 'error',
            title: 'Streaming Synthesis Failed',
            message: err.message || 'Check your ElevenLabs API credentials or network connection.',
          });
        }
      );
    } else {
      // Standard buffered generation
      setGenerationStatus('generating');
      try {
        const gen = await api.generateTTS({
          text: trimmed,
          voiceId: selectedVoiceId,
          modelId: selectedModel,
          stability: settings.stability,
          similarity: settings.similarity_boost,
          style: settings.style,
          speed: settings.speed,
          outputFormat,
          projectId: activeProject?.id,
        });

        setActiveAudioUrl(gen.audioUrl);
        setLastGeneration(gen);
        setGenerationStatus('ready');
        onGenerationComplete(gen);

        addToast({
          type: 'success',
          title: 'Audio Generated',
          message: `Voice "${gen.voiceName}" synthesized successfully (${gen.characterCount} characters).`,
        });
      } catch (err: any) {
        setGenerationStatus('error');
        addToast({
          type: 'error',
          title: 'Generation Failed',
          message: err.message || 'Failed to synthesize speech with ElevenLabs API.',
        });
      }
    }
  };

  const handleRegenerate = () => {
    handleGenerate(isStreamMode);
  };

  const handleSaveCurrentProject = () => {
    onSaveProject(text, selectedVoiceId, settings);
    addToast({
      type: 'success',
      title: 'Project Saved',
      message: 'Script, voice selection, and acoustic parameters saved.',
    });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#07090e] p-4 lg:p-8 flex flex-col">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Voice Studio
            </h1>
            {activeProject && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {activeProject.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate lifelike conversational audio and voiceovers powered by ElevenLabs neural models.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-save-project"
            onClick={handleSaveCurrentProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save Project</span>
          </button>

          <button
            id="btn-toggle-mobile-settings"
            onClick={() => setShowMobileSettings(!showMobileSettings)}
            className="xl:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left (Editor & Audio Player), Right (Voice Settings Panel) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        {/* Left Column (8 cols): Voice Selector, Text Editor, Generation Controls, Audio Player */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Voice Selector Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <VoiceSelector
                voices={voices}
                selectedVoiceId={selectedVoiceId}
                onSelectVoice={onSelectVoice}
              />
            </div>

            {lastGeneration && (
              <button
                id="btn-regenerate-audio"
                onClick={handleRegenerate}
                disabled={generationStatus === 'generating' || generationStatus === 'streaming'}
                title="Regenerate audio with current parameters"
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors shrink-0"
              >
                <RotateCw className={`w-3.5 h-3.5 ${generationStatus === 'generating' ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            )}
          </div>

          {/* Text Editor */}
          <TextEditor
            value={text}
            onChange={setText}
            onGenerate={() => handleGenerate(isStreamMode)}
            onSave={handleSaveCurrentProject}
            isGenerating={generationStatus === 'generating' || generationStatus === 'streaming'}
          />

          {/* Generation Action Button & Stream Mode Switch */}
          <GenerationButton
            onGenerate={handleGenerate}
            status={generationStatus}
            isStreamMode={isStreamMode}
            onToggleStreamMode={setIsStreamMode}
            characterCount={text.length}
          />

          {/* Custom Audio Player with real Web Audio API Waveform */}
          <div className="mt-2">
            <AudioPlayer
              audioUrl={activeAudioUrl}
              title={lastGeneration ? `${lastGeneration.voiceName} • ${lastGeneration.characterCount} chars` : undefined}
              subtitle={lastGeneration ? `Model: ${lastGeneration.modelId} • Format: ${lastGeneration.format.toUpperCase()}` : undefined}
              fileName={lastGeneration?.audioFileName}
            />
          </div>
        </div>

        {/* Right Column (4 cols): Settings Panel (Desktop) */}
        <div className="hidden xl:block xl:col-span-4">
          <div className="sticky top-6">
            <SettingsPanel
              settings={settings}
              onChangeSettings={setSettings}
              selectedModel={selectedModel}
              onChangeModel={setSelectedModel}
              outputFormat={outputFormat}
              onChangeFormat={setOutputFormat}
              onResetDefaults={() => setSettings(DEFAULT_SETTINGS)}
            />
          </div>
        </div>

        {/* Mobile Slide-in Settings Modal */}
        {showMobileSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md xl:hidden">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <SettingsPanel
                settings={settings}
                onChangeSettings={setSettings}
                selectedModel={selectedModel}
                onChangeModel={setSelectedModel}
                outputFormat={outputFormat}
                onChangeFormat={setOutputFormat}
                onResetDefaults={() => setSettings(DEFAULT_SETTINGS)}
              />
              <button
                onClick={() => setShowMobileSettings(false)}
                className="w-full mt-3 py-3 rounded-xl bg-slate-800 text-slate-100 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
