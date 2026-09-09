export type NavigationTab =
  | 'landing'
  | 'dashboard'
  | 'studio'
  | 'voices'
  | 'history'
  | 'projects'
  | 'settings'
  | 'usage'
  | 'account';

export interface VoiceLabels {
  accent?: string;
  description?: string;
  age?: string;
  gender?: string;
  use_case?: string;
  [key: string]: string | undefined;
}

export interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
  labels?: VoiceLabels;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  speed: number;
}

export interface TTSModel {
  id: string;
  name: string;
  description: string;
  languages: string;
  latency: string;
  badge?: string;
}

export interface Generation {
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
}

export interface Project {
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

export interface UsageHistoryItem {
  date: string;
  characters: number;
  generations: number;
}

export interface UsageInfo {
  tier: string;
  characterLimit: number;
  characterCount: number;
  charactersRemaining: number;
  nextResetDate: string;
  recentGenerations: number;
  historyUsage: UsageHistoryItem[];
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  elevenlabsConfigured: boolean;
  environment: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
