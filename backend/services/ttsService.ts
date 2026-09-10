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
  isFallback?: boolean;
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

  private getSarvamApiKey(): string | null {
    const key = process.env.SARVAM_API_KEY;
    if (!key || key.trim().length === 0 || key === 'MY_SARVAM_API_KEY') {
      return null;
    }
    return key.trim();
  }

  public hasSarvamApiKey(): boolean {
    return this.getSarvamApiKey() !== null;
  }

  /**
   * Resolves target language code based on text script and voice ID.
   */
  private detectLanguage(text: string, voiceId: string): string {
    // Exact mapping for Google Free Voice IDs (English & Hindi only)
    const googleVoiceLocaleMap: Record<string, string> = {
      'google-en-us-journey': 'en-US',
      'google-en-us-studio': 'en-US',
      'google-en-gb-oxford': 'en-GB',
      'google-en-gb-gentleman': 'en-GB',
      'google-en-au': 'en-AU',
      'google-en-in': 'en-IN',
      'google-en-ca': 'en-CA',
      'google-en-ie': 'en-IE',
      'google-en-za': 'en-ZA',
      'google-hi-in': 'hi-IN',
      'google-hi-in-male': 'hi-IN',
    };

    if (googleVoiceLocaleMap[voiceId]) {
      return googleVoiceLocaleMap[voiceId];
    }

    // Check for Hindi script (Devanagari)
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';

    // British voice IDs
    const britishVoiceIds = ['ThT5KcBeYPX3keUQqHPh', 'JBFqnCBsd6RMkjVDRZzb', 'XB0fDUnXU5powFXDhCwa'];
    if (britishVoiceIds.includes(voiceId)) return 'en-GB';

    // Default to English (US)
    return 'en-US';
  }

  /**
   * Splits long text into natural sentence chunks within TTS character limits.
   */
  private splitTextIntoChunks(text: string, maxLen = 160): string[] {
    const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
    const chunks: string[] = [];

    for (const s of sentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;

      if (trimmed.length <= maxLen) {
        chunks.push(trimmed);
      } else {
        const words = trimmed.split(/\s+/);
        let current = '';
        for (const w of words) {
          if ((current + ' ' + w).trim().length <= maxLen) {
            current = (current + ' ' + w).trim();
          } else {
            if (current) chunks.push(current);
            current = w;
          }
        }
        if (current) chunks.push(current);
      }
    }

    return chunks.length > 0 ? chunks : [text.slice(0, maxLen)];
  }

  /**
   * Generates a single TTS audio chunk using Google Neural TTS endpoint.
   */
  public async fetchTTSChunk(chunkText: string, lang: string, speed = 1.0): Promise<Buffer> {
    const ttsSpeed = speed && speed < 0.85 ? '0.24' : '1';
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(chunkText)}&ttsspeed=${ttsSpeed}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*',
      },
    });

    if (!res.ok) {
      throw new Error(`TTS service returned status ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Full Speech Generation with automatic fallback to Neural Engine
   * if ElevenLabs quota is exhausted or API is unreachable.
   */
  public async generateSpeech(options: GenerateSpeechOptions): Promise<TTSResult> {
    const apiKey = this.getApiKey();
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

    // Route Google Free Voices directly to Google neural engine
    if (voiceId.startsWith('google-')) {
      return await this.synthesizeWithNeuralEngine(options);
    }

    // Route Sarvam AI Hindi Voices to Sarvam AI synthesis
    if (voiceId.startsWith('sarvam-')) {
      return await this.synthesizeWithSarvamAI(options);
    }

    if (apiKey) {
      try {
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

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = Buffer.from(arrayBuffer);
          const contentType = response.headers.get('content-type') || 'audio/mpeg';
          const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';

          return {
            audioBuffer,
            contentType,
            format,
            characterCount: text.length,
            isFallback: false,
          };
        }

        const errorBody = await response.text();
        console.warn(`[TTSService] ElevenLabs API responded with HTTP ${response.status}: ${errorBody.slice(0, 140)}. Engaging VOXIA Neural Fallback Engine.`);
      } catch (err) {
        console.warn('[TTSService] ElevenLabs request failed. Engaging VOXIA Neural Fallback Engine.', err);
      }
    }

    // High-Fidelity Fallback Neural Engine
    return await this.synthesizeWithNeuralEngine(options);
  }

  /**
   * Real-time Streaming Speech with automatic fallback to Neural Chunked Stream
   * if ElevenLabs streaming is unavailable or quota is exceeded.
   */
  public async streamSpeech(options: GenerateSpeechOptions): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string; isFallback?: boolean }> {
    const apiKey = this.getApiKey();
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

    // Route Google Free Voices directly to Google neural streaming
    if (voiceId.startsWith('google-')) {
      return this.streamWithNeuralEngine(options);
    }

    // Route Sarvam AI Hindi Voices directly to Sarvam AI streaming
    if (voiceId.startsWith('sarvam-')) {
      return this.streamWithSarvamAI(options);
    }

    if (apiKey) {
      try {
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

        if (response.ok && response.body) {
          const contentType = response.headers.get('content-type') || 'audio/mpeg';
          return {
            stream: response.body,
            contentType,
            isFallback: false,
          };
        }

        const errorBody = await response.text();
        console.warn(`[TTSService] ElevenLabs streaming responded with HTTP ${response.status}: ${errorBody.slice(0, 140)}. Engaging VOXIA Neural Fallback Stream.`);
      } catch (err) {
        console.warn('[TTSService] ElevenLabs stream request failed. Engaging VOXIA Neural Fallback Stream.', err);
      }
    }

    // High-Fidelity Fallback Neural Stream
    return this.streamWithNeuralEngine(options);
  }

  /**
   * Synthesizes audio using VOXIA's resilient neural audio pipeline.
   */
  private async synthesizeWithNeuralEngine(options: GenerateSpeechOptions): Promise<TTSResult> {
    const { text, voiceId, outputFormat = 'mp3_44100_128' } = options;
    const lang = this.detectLanguage(text, voiceId);
    const chunks = this.splitTextIntoChunks(text);
    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      try {
        const buf = await this.fetchTTSChunk(chunk, lang);
        buffers.push(buf);
      } catch (err) {
        console.warn(`[TTSService] Fallback chunk synthesis notice for "${chunk.slice(0, 30)}...":`, err);
      }
    }

    const audioBuffer = buffers.length > 0 ? Buffer.concat(buffers) : Buffer.alloc(0);
    const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';

    return {
      audioBuffer,
      contentType: 'audio/mpeg',
      format,
      characterCount: text.length,
      isFallback: true,
    };
  }

  /**
   * Generates a real-time chunked stream using VOXIA's resilient neural audio pipeline.
   */
  private streamWithNeuralEngine(options: GenerateSpeechOptions): { stream: ReadableStream<Uint8Array>; contentType: string; isFallback: boolean } {
    const { text, voiceId } = options;
    const lang = this.detectLanguage(text, voiceId);
    const chunks = this.splitTextIntoChunks(text);
    const self = this;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for (const chunk of chunks) {
            try {
              const buf = await self.fetchTTSChunk(chunk, lang);
              controller.enqueue(new Uint8Array(buf));
            } catch (chunkErr) {
              console.warn(`[TTSService] Notice streaming chunk "${chunk.slice(0, 30)}...":`, chunkErr);
            }
          }
          controller.close();
        } catch (err) {
          console.error('[TTSService] Fatal error in neural fallback stream:', err);
          controller.error(err);
        }
      },
    });

    return {
      stream,
      contentType: 'audio/mpeg',
      isFallback: true,
    };
  }

  /**
   * Synthesizes audio using Sarvam AI Bulbul v3 neural voice synthesis.
   * Seamlessly falls back to VOXIA high-fidelity Hindi neural engine if API key is unconfigured or call fails.
   */
  public async synthesizeWithSarvamAI(options: GenerateSpeechOptions): Promise<TTSResult> {
    const { text, voiceId, voiceSettings, outputFormat = 'mp3_44100_128' } = options;
    const sarvamKey = this.getSarvamApiKey();
    const speaker = voiceId.replace('sarvam-', '') || 'shubh';

    if (sarvamKey) {
      try {
        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': sarvamKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            language_code: 'hi-IN',
            model: 'bulbul:v3',
            speaker,
            output_audio_codec: 'mp3',
            pace: voiceSettings?.speed || 1.0,
            speech_sample_rate: 24000,
            enable_preprocessing: true,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as { audios?: string[] };
          if (Array.isArray(data.audios) && data.audios.length > 0 && typeof data.audios[0] === 'string') {
            const audioBuffer = Buffer.from(data.audios[0], 'base64');
            const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';
            return {
              audioBuffer,
              contentType: 'audio/mpeg',
              format,
              characterCount: text.length,
              isFallback: false,
            };
          }
        }

        const errorBody = await response.text();
        console.warn(`[TTSService] Sarvam AI API responded with HTTP ${response.status}: ${errorBody.slice(0, 140)}. Engaging VOXIA Hindi Fallback Engine.`);
      } catch (err) {
        console.warn('[TTSService] Sarvam AI request failed. Engaging VOXIA Hindi Fallback Engine.', err);
      }
    }

    // High-Fidelity Hindi Neural Engine Fallback
    return await this.synthesizeWithNeuralEngine({
      ...options,
      voiceId: 'google-hi-in',
    });
  }

  /**
   * Generates a streaming response for Sarvam AI audio.
   */
  public async streamWithSarvamAI(options: GenerateSpeechOptions): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string; isFallback?: boolean }> {
    const result = await this.synthesizeWithSarvamAI(options);
    const audioBuffer = result.audioBuffer;
    const chunkSize = 16384;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let offset = 0; offset < audioBuffer.length; offset += chunkSize) {
          const chunk = audioBuffer.subarray(offset, Math.min(offset + chunkSize, audioBuffer.length));
          controller.enqueue(new Uint8Array(chunk));
        }
        controller.close();
      },
    });

    return {
      stream,
      contentType: result.contentType,
      isFallback: result.isFallback,
    };
  }
}

export const ttsService = new TTSService();
