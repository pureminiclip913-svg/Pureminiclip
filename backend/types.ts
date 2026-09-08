export type TTSProviderType = 'elevenlabs' | 'soniox';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
  speed?: number;
}

export interface Voice {
  voice_id: string;
  name: string;
  provider: TTSProviderType;
  category?: string;
  description?: string;
  preview_url?: string;
  free_tier_compatible?: boolean;
  is_paid_only?: boolean;
  language?: string;
  supportedFormats?: string[];
  labels?: {
    accent?: string;
    description?: string;
    age?: string;
    gender?: string;
    use_case?: string;
    [key: string]: string | undefined;
  };
  samples?: Array<{
    sample_id: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    hash: string;
  }>;
}

export interface TTSRequestPayload {
  provider?: TTSProviderType;
  text: string;
  voiceId: string;
  language?: string;
  modelId?: string;
  stability?: number;
  similarity?: number;
  style?: number;
  speed?: number;
  outputFormat?: string;
  projectId?: string;
}

export interface GenerateSpeechOptions {
  text: string;
  voiceId: string;
  language?: string;
  modelId?: string;
  voiceSettings?: VoiceSettings;
  outputFormat?: string;
}

export interface TTSResult {
  audioBuffer: Buffer;
  contentType: string;
  format: string;
  characterCount: number;
  provider: TTSProviderType;
  wasFallenBack?: boolean;
  fallbackVoiceId?: string;
  fallbackVoiceName?: string;
  fallbackNotice?: string;
}

export interface StreamSpeechResult {
  stream: ReadableStream<Uint8Array>;
  contentType: string;
  format: string;
  provider: TTSProviderType;
  wasFallenBack?: boolean;
  fallbackVoiceName?: string;
}

export interface ITTSProvider {
  readonly provider: TTSProviderType;
  hasApiKey(): boolean;
  generateSpeech(options: GenerateSpeechOptions): Promise<TTSResult>;
  streamSpeech(options: GenerateSpeechOptions): Promise<StreamSpeechResult>;
}

export interface GenerationRecord {
  id: string;
  provider?: TTSProviderType;
  text: string;
  voiceId: string;
  voiceName: string;
  modelId: string;
  language?: string;
  audioUrl: string;
  audioFileName: string;
  format: string;
  characterCount: number;
  wordCount: number;
  durationSeconds?: number;
  createdAt: string;
  status: 'completed' | 'streaming' | 'failed';
  settings: VoiceSettings;
  projectId?: string;
  wasFallenBack?: boolean;
  fallbackNotice?: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  description?: string;
  text: string;
  voiceId: string;
  modelId: string;
  settings: VoiceSettings;
  createdAt: string;
  updatedAt: string;
  generationCount: number;
}

export interface UsageRecord {
  tier: string;
  characterLimit: number;
  characterCount: number;
  charactersRemaining: number;
  nextResetDate: string;
  recentGenerations: number;
  historyUsage: Array<{
    date: string;
    characters: number;
    generations: number;
  }>;
}

