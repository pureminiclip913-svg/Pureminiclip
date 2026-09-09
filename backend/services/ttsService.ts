import { Readable } from 'stream';
import { VoiceSettings } from '../types.js';

export interface GenerateSpeechOptions {
  text: string;
  voiceId: string;
  modelId?: string;
  voiceSettings?: VoiceSettings;
  outputFormat?: string;
}

export interface TTSResult {
  audioBuffer: Buffer;
  contentType: string;
  format: string;
  characterCount: number;
}

export class TTSService {
  private getApiKey(): string | null {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key || key.trim().length === 0 || key === 'MY_ELEVENLABS_API_KEY') {
      return null;
    }
    return key.trim();
  }

  public hasApiKey(): boolean {
    return this.getApiKey() !== null;
  }

  public async generateSpeech(options: GenerateSpeechOptions): Promise<TTSResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error: any = new Error('ElevenLabs API key is not configured. Please add ELEVENLABS_API_KEY to your environment (.env file) or Settings.');
      error.statusCode = 401;
      error.code = 'MISSING_API_KEY';
      throw error;
    }

    const {
      text,
      voiceId,
      modelId = 'eleven_multilingual_v2',
      voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
        speed: 1.0,
      },
      outputFormat = 'mp3_44100_128',
    } = options;

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`;

    const payload = {
      text,
      model_id: modelId,
      voice_settings: {
        stability: voiceSettings.stability ?? 0.5,
        similarity_boost: voiceSettings.similarity_boost ?? 0.75,
        style: voiceSettings.style ?? 0.0,
        use_speaker_boost: voiceSettings.use_speaker_boost ?? true,
        speed: voiceSettings.speed ?? 1.0,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg, audio/wav, audio/*',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let parsedMessage = 'Failed to generate speech with ElevenLabs API';
      let errorCode = 'GENERATION_ERROR';

      try {
        const parsed = JSON.parse(errorBody);
        parsedMessage = parsed?.detail?.message || parsed?.message || parsedMessage;
        if (response.status === 401) {
          errorCode = 'INVALID_API_KEY';
          parsedMessage = 'Invalid ElevenLabs API key provided. Please verify your credentials.';
        } else if (response.status === 429) {
          errorCode = 'RATE_LIMIT_EXCEEDED';
          parsedMessage = 'ElevenLabs quota or rate limit exceeded. Check your plan or retry shortly.';
        } else if (response.status === 400) {
          errorCode = 'INVALID_REQUEST';
        }
      } catch {
        parsedMessage = `ElevenLabs error (${response.status}): ${errorBody.slice(0, 120)}`;
      }

      const err: any = new Error(parsedMessage);
      err.statusCode = response.status;
      err.code = errorCode;
      throw err;
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';

    return {
      audioBuffer,
      contentType,
      format,
      characterCount: text.length,
    };
  }

  public async streamSpeech(options: GenerateSpeechOptions): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error: any = new Error('ElevenLabs API key is not configured. Please add ELEVENLABS_API_KEY to your environment (.env file) or Settings.');
      error.statusCode = 401;
      error.code = 'MISSING_API_KEY';
      throw error;
    }

    const {
      text,
      voiceId,
      modelId = 'eleven_multilingual_v2',
      voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
        speed: 1.0,
      },
      outputFormat = 'mp3_44100_128',
    } = options;

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream?output_format=${encodeURIComponent(outputFormat)}`;

    const payload = {
      text,
      model_id: modelId,
      voice_settings: {
        stability: voiceSettings.stability ?? 0.5,
        similarity_boost: voiceSettings.similarity_boost ?? 0.75,
        style: voiceSettings.style ?? 0.0,
        use_speaker_boost: voiceSettings.use_speaker_boost ?? true,
        speed: voiceSettings.speed ?? 1.0,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg, audio/wav, audio/*',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      const errorBody = await response.text();
      let parsedMessage = 'Failed to stream speech from ElevenLabs API';
      let errorCode = 'STREAMING_ERROR';

      try {
        const parsed = JSON.parse(errorBody);
        parsedMessage = parsed?.detail?.message || parsed?.message || parsedMessage;
        if (response.status === 401) {
          errorCode = 'INVALID_API_KEY';
          parsedMessage = 'Invalid ElevenLabs API key provided.';
        } else if (response.status === 429) {
          errorCode = 'RATE_LIMIT_EXCEEDED';
        }
      } catch {
        parsedMessage = `ElevenLabs error (${response.status}): ${errorBody.slice(0, 120)}`;
      }

      const err: any = new Error(parsedMessage);
      err.statusCode = response.status;
      err.code = errorCode;
      throw err;
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    return {
      stream: response.body,
      contentType,
    };
  }
}

export const ttsService = new TTSService();
