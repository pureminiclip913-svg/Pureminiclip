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
  category?: string;
  description?: string;
  preview_url?: string;
  provider?: 'google' | 'sarvam' | 'elevenlabs' | string;
  isFree?: boolean;
  sampleText?: string;
  languageCode?: string;
  labels?: {
    accent?: string;
    description?: string;
    age?: string;
    gender?: string;
    use_case?: string;
    language_code?: string;
    provider?: string;
    free?: string;
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
  text: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarity?: number;
  style?: number;
  speed?: number;
  outputFormat?: string;
  projectId?: string;
}

export interface GenerationRecord {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  modelId: string;
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
  isFallback?: boolean;
  fallbackReason?: string;
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
