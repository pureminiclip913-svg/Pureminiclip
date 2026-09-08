import {
  Voice,
  Generation,
  Project,
  UsageInfo,
  HealthStatus,
  VoiceSettings,
  TTSProviderType,
} from '../types';

export interface TTSRequestOptions {
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


class ApiService {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok || data.success === false) {
      const errorMsg = data?.error?.message || data?.message || `Request failed (${res.status})`;
      const error: any = new Error(errorMsg);
      error.code = data?.error?.code || 'API_ERROR';
      error.status = res.status;
      throw error;
    }

    return data as T;
  }

  // Health
  public async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${this.baseUrl}/health`);
    if (!res.ok) {
      throw new Error('Server health check failed');
    }
    return res.json();
  }

  public async checkHealth(): Promise<HealthStatus> {
    return this.getHealth();
  }

  // Voices
  public async getVoices(refresh = false, provider?: TTSProviderType | 'all'): Promise<Voice[]> {
    const params = new URLSearchParams();
    if (refresh) params.append('refresh', 'true');
    if (provider && provider !== 'all') params.append('provider', provider);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const res = await this.request<{ success: boolean; voices: Voice[]; provider: string; hasApiKey: boolean }>(
      `/voices${queryString}`
    );
    return res.voices;
  }

  public async getVoicesWithMetadata(
    refresh = false,
    provider?: TTSProviderType | 'all'
  ): Promise<{ voices: Voice[]; provider: string; providers?: { elevenlabs: boolean; soniox: boolean }; hasApiKey: boolean }> {
    const params = new URLSearchParams();
    if (refresh) params.append('refresh', 'true');
    if (provider && provider !== 'all') params.append('provider', provider);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return this.request<{ success: boolean; voices: Voice[]; provider: string; providers?: { elevenlabs: boolean; soniox: boolean }; hasApiKey: boolean }>(
      `/voices${queryString}`
    );
  }

  public async getVoiceById(voiceId: string): Promise<Voice> {
    const res = await this.request<{ success: boolean; voice: Voice }>(`/voices/${voiceId}`);
    return res.voice;
  }

  public async previewVoice(voiceId: string): Promise<{ previewUrl: string; name: string }> {
    return this.request<{ success: boolean; previewUrl: string; name: string; voiceId: string }>(
      '/voices/preview',
      {
        method: 'POST',
        body: JSON.stringify({ voiceId }),
      }
    );
  }

  // TTS Standard Generation - returns Blob URL for immediate browser playback and download
  public async generateTTS(options: TTSRequestOptions): Promise<Generation> {
    const res = await fetch(`${this.baseUrl}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg, audio/wav, audio/*',
      },
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      let errMessage = 'Speech synthesis failed';
      try {
        const errData = await res.json();
        errMessage = errData?.error?.message || errData?.message || errMessage;
      } catch {
        // Non-JSON response
      }
      throw new Error(errMessage);
    }

    const contentType = res.headers.get('content-type') || 'audio/mpeg';
    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const provider = (res.headers.get('x-tts-provider') as TTSProviderType) || options.provider;
    const voiceName = decodeURIComponent(res.headers.get('x-voice-name') || '') || 'Voice';
    const characterCount = parseInt(res.headers.get('x-character-count') || '0', 10) || options.text.length;
    const wordCount = parseInt(res.headers.get('x-word-count') || '0', 10) || options.text.split(/\s+/).filter(Boolean).length;
    const durationSeconds = parseInt(res.headers.get('x-duration-seconds') || '0', 10) || Math.max(1, Math.round((wordCount / 140) * 60));
    const format = res.headers.get('x-audio-format') || (contentType.includes('wav') ? 'wav' : 'mp3');
    const today = new Date().toISOString().split('T')[0];
    const downloadFilename = res.headers.get('x-download-filename') || `voxia-tts-${today}.${format}`;
    const id = res.headers.get('x-generation-id') || `gen_${Date.now()}`;

    const wasFallenBack = res.headers.get('x-voice-fallback') === 'true';
    const fallbackNotice = decodeURIComponent(res.headers.get('x-voice-fallback-notice') || '');
    const voiceId = res.headers.get('x-voice-id') || options.voiceId;

    return {
      id,
      provider,
      language: options.language,
      text: options.text,
      voiceId,
      voiceName,
      modelId: options.modelId || (provider === 'soniox' ? 'tts-rt-v2' : 'eleven_multilingual_v2'),
      audioUrl,
      audioFileName: downloadFilename,
      format,
      characterCount,
      wordCount,
      durationSeconds,
      createdAt: new Date().toISOString(),
      status: 'completed',
      settings: {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarity ?? 0.75,
        style: options.style ?? 0.0,
        use_speaker_boost: true,
        speed: options.speed ?? 1.0,
      },
      projectId: options.projectId,
      wasFallenBack,
      fallbackNotice: wasFallenBack ? (fallbackNotice || `Synthesized using ${voiceName} (standard free-tier compatible voice).`) : undefined,
    };
  }


  // TTS Streaming Generation (consumes binary chunks with Web Streams)
  public async streamTTS(
    options: TTSRequestOptions,
    onChunk: (chunk: Uint8Array, totalBytes: number) => void,
    onComplete: (audioBlob: Blob, audioUrl: string) => void,
    onError: (err: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/tts/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg, audio/wav, audio/*',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        let errMessage = 'Streaming synthesis failed';
        try {
          const errData = await response.json();
          errMessage = errData?.error?.message || errData?.message || errMessage;
        } catch {
          // Response was not JSON
        }
        throw new Error(errMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Readable stream not supported by browser.');
      }

      const chunks: Uint8Array[] = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          totalBytes += value.length;
          onChunk(value, totalBytes);
        }
      }

      const contentType = response.headers.get('content-type') || 'audio/mpeg';
      const audioBlob = new Blob(chunks, { type: contentType });
      const audioUrl = URL.createObjectURL(audioBlob);

      onComplete(audioBlob, audioUrl);
    } catch (err: any) {
      onError(err);
    }
  }

  // Generations
  public async getGenerations(): Promise<Generation[]> {
    const res = await this.request<{ success: boolean; generations: Generation[] }>('/generations');
    return res.generations;
  }

  public async getGenerationById(id: string): Promise<Generation> {
    const res = await this.request<{ success: boolean; generation: Generation }>(`/generations/${id}`);
    return res.generation;
  }

  public async deleteGeneration(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/generations/${id}`, {
      method: 'DELETE',
    });
  }

  public async clearAllGenerations(): Promise<void> {
    await this.request<{ success: boolean }>('/generations', {
      method: 'DELETE',
    });
  }

  // Projects
  public async getProjects(): Promise<Project[]> {
    const res = await this.request<{ success: boolean; projects: Project[] }>('/projects');
    return res.projects;
  }

  public async getProjectById(id: string): Promise<Project> {
    const res = await this.request<{ success: boolean; project: Project }>(`/projects/${id}`);
    return res.project;
  }

  public async createProject(data: {
    name: string;
    description?: string;
    text?: string;
    voiceId?: string;
    modelId?: string;
    settings?: VoiceSettings;
  }): Promise<Project> {
    const payload = {
      name: data.name,
      description: data.description || '',
      text: data.text || '',
      voiceId: data.voiceId || '21m00Tcm4TlvDq8ikWAM',
      modelId: data.modelId || 'eleven_multilingual_v2',
      settings: data.settings || {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
        speed: 1.0,
      },
    };
    const res = await this.request<{ success: boolean; project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.project;
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await this.request<{ success: boolean; project: Project }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.project;
  }

  public async deleteProject(id: string): Promise<void> {
    await this.request<{ success: boolean }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Usage
  public async getUsage(): Promise<UsageInfo> {
    const res = await this.request<{ success: boolean; usage: UsageInfo }>('/usage');
    return res.usage;
  }

  // Test ElevenLabs API key
  public async testApiKey(apiKey?: string): Promise<{ valid: boolean; tier?: string; message?: string }> {
    const res = await fetch(`${this.baseUrl}/settings/test-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    return res.json();
  }

  // Test Soniox API key
  public async testSonioxKey(apiKey?: string): Promise<{ valid: boolean; model?: string; message?: string }> {
    const res = await fetch(`${this.baseUrl}/settings/test-soniox-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    return res.json();
  }
}


export const api = new ApiService();
