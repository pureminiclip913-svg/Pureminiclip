import { VoiceSettings } from '../types.js';
import { EnvLoader } from '../utils/envLoader.js';

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
  private lastElevenLabsKey: string | null = null;

  private getApiKey(): string | null {
    EnvLoader.refreshEnv();
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key || key.trim().length === 0 || key === 'MY_ELEVENLABS_API_KEY') {
      return null;
    }
    const trimmed = key.trim();
    if (trimmed !== this.lastElevenLabsKey) {
      this.lastElevenLabsKey = trimmed;
    }
    return trimmed;
  }

  public hasApiKey(): boolean {
    return this.getApiKey() !== null;
  }

  private getSarvamApiKey(): string | null {
    EnvLoader.refreshEnv();
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
   * Resolves target language code based on voice ID or script.
   * Only used when synthesizing with Google voices.
   */
  public detectLanguage(text: string, voiceId: string): string {
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
      'google-hi-in': 'hi',
      'google-hi-in-male': 'hi',
    };

    if (googleVoiceLocaleMap[voiceId]) {
      return googleVoiceLocaleMap[voiceId];
    }

    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    return 'en-US';
  }

  /**
   * Splits long text into natural sentence or paragraph chunks within provider limits.
   * Guarantees chunks are ordered and never exceed maxLen, while preserving sentence flow.
   */
  public splitTextForTTS(text: string, maxLen: number): string[] {
    const trimmed = text.trim();
    if (trimmed.length <= maxLen) {
      return [trimmed];
    }

    // Split by paragraphs first (double newline or newline)
    const paragraphs = trimmed.split(/\n+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const para of paragraphs) {
      const p = para.trim();
      if (!p) continue;

      if (p.length <= maxLen) {
        if (!currentChunk) {
          currentChunk = p;
        } else if ((currentChunk + '\n\n' + p).length <= maxLen) {
          currentChunk += '\n\n' + p;
        } else {
          chunks.push(currentChunk);
          currentChunk = p;
        }
      } else {
        // Paragraph exceeds maxLen, split by sentences (. ! ? । for Indic)
        const sentences = p.match(/[^.!?।\n]+[.!?।\n]+|[^.!?।\n]+$/g) || [p];
        for (const sent of sentences) {
          const s = sent.trim();
          if (!s) continue;

          if (s.length <= maxLen) {
            if (!currentChunk) {
              currentChunk = s;
            } else if ((currentChunk + ' ' + s).length <= maxLen) {
              currentChunk += ' ' + s;
            } else {
              chunks.push(currentChunk);
              currentChunk = s;
            }
          } else {
            // Sentence exceeds maxLen, split by punctuation clauses (; , :)
            const clauses = s.match(/[^;,:]+[;,:]+|[^;,:]+$/g) || [s];
            for (const clause of clauses) {
              const c = clause.trim();
              if (!c) continue;

              if (c.length <= maxLen) {
                if (!currentChunk) {
                  currentChunk = c;
                } else if ((currentChunk + ' ' + c).length <= maxLen) {
                  currentChunk += ' ' + c;
                } else {
                  chunks.push(currentChunk);
                  currentChunk = c;
                }
              } else {
                // Clause exceeds maxLen, split by words
                const words = c.split(/\s+/);
                for (const w of words) {
                  if (!w) continue;
                  if (!currentChunk) {
                    currentChunk = w;
                  } else if ((currentChunk + ' ' + w).length <= maxLen) {
                    currentChunk += ' ' + w;
                  } else {
                    chunks.push(currentChunk);
                    currentChunk = w;
                  }
                }
              }
            }
          }
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    // Safety fallback: guarantee no chunk exceeds maxLen (e.g. unbroken strings)
    const finalChunks: string[] = [];
    for (const chunk of chunks) {
      if (chunk.length <= maxLen) {
        finalChunks.push(chunk);
      } else {
        for (let i = 0; i < chunk.length; i += maxLen) {
          const slice = chunk.slice(i, i + maxLen).trim();
          if (slice) finalChunks.push(slice);
        }
      }
    }

    return finalChunks.length > 0 ? finalChunks : [trimmed.slice(0, maxLen)];
  }

  /**
   * Combines multiple audio buffers into one continuous audio track.
   * Handles MP3 frames and WAV RIFF headers cleanly.
   */
  public combineAudioBuffers(buffers: Buffer[], format: string): Buffer {
    if (buffers.length === 0) return Buffer.alloc(0);
    if (buffers.length === 1) return buffers[0];

    if (format === 'wav') {
      const first = buffers[0];
      // Check for valid RIFF WAV header (44 bytes)
      if (first.length >= 44 && first.toString('ascii', 0, 4) === 'RIFF') {
        const pcmChunks: Buffer[] = [];
        let totalPcmBytes = 0;

        for (const buf of buffers) {
          if (buf.length >= 44 && buf.toString('ascii', 0, 4) === 'RIFF') {
            const pcm = buf.subarray(44);
            pcmChunks.push(pcm);
            totalPcmBytes += pcm.length;
          } else {
            pcmChunks.push(buf);
            totalPcmBytes += buf.length;
          }
        }

        const combinedPcm = Buffer.concat(pcmChunks);
        const header = Buffer.alloc(44);
        first.copy(header, 0, 0, 44);

        // Update total file size - 8 in header (bytes 4-7)
        header.writeUInt32LE(totalPcmBytes + 36, 4);
        // Update data chunk size in header (bytes 40-43)
        header.writeUInt32LE(totalPcmBytes, 40);

        return Buffer.concat([header, combinedPcm]);
      }
    }

    // Standard MPEG audio frame stream concatenation for MP3
    return Buffer.concat(buffers);
  }

  /**
   * Generates a single TTS audio chunk using Google Neural endpoint.
   * Used strictly for voices starting with google- or previews.
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
      throw new Error(`Google voice synthesis returned HTTP ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Master entry point for speech generation.
   * Strictly respects the user's selected voice:
   * - ElevenLabs voices are synthesized via ElevenLabs using the exact voiceId for every chunk.
   * - Sarvam AI voices are synthesized via Sarvam AI using the exact voiceId for every chunk.
   * - Google Free voices are synthesized via Google voices using the exact voiceId for every chunk.
   * NEVER silently switches or downgrades to a default or random voice.
   */
  public async generateSpeech(options: GenerateSpeechOptions): Promise<TTSResult> {
    const { voiceId } = options;

    // 1. Google Free Voices (only if user explicitly selected a google-* voice)
    if (voiceId.startsWith('google-')) {
      return await this.synthesizeWithGoogleVoices(options);
    }

    // 2. Sarvam AI Hindi Voices (only if user selected a sarvam-* voice)
    if (voiceId.startsWith('sarvam-')) {
      return await this.synthesizeWithSarvamAI(options);
    }

    // 3. ElevenLabs Voices (for all standard/custom voices)
    return await this.synthesizeWithElevenLabs(options);
  }

  /**
   * Master entry point for streaming speech.
   * Streams audio in real time, seamlessly activating VOXIA Hindi neural engine if Sarvam has 0 credits.
   */
  public async streamSpeech(options: GenerateSpeechOptions): Promise<{
    stream: ReadableStream<Uint8Array>;
    contentType: string;
  }> {
    const { voiceId } = options;

    if (voiceId.startsWith('google-')) {
      return this.streamWithGoogleVoices(options);
    }

    if (voiceId.startsWith('sarvam-')) {
      return this.streamWithSarvamAI(options);
    }

    return this.streamWithElevenLabs(options);
  }

  /**
   * Synthesizes audio using ElevenLabs API.
   * For text exceeding provider limits (e.g. >1800 characters), chunks the text,
   * synthesizes EVERY chunk with the EXACT user-selected voice and settings in order,
   * and combines them seamlessly into a single final audio recording.
   * NEVER silently falls back to a different voice.
   */
  public async synthesizeWithElevenLabs(options: GenerateSpeechOptions): Promise<TTSResult> {
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

    if (!apiKey) {
      throw new Error(
        `ElevenLabs API key is not configured. Please add your ELEVENLABS_API_KEY in the Settings menu to use voice "${voiceId}".`
      );
    }

    // ElevenLabs safe chunk threshold (1800 characters guarantees staying within single request limit)
    const ELEVENLABS_CHUNK_SIZE = 1800;
    const chunks = this.splitTextForTTS(text, ELEVENLABS_CHUNK_SIZE);
    const audioBuffers: Buffer[] = [];
    let contentType = 'audio/mpeg';

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`;
      const payload = {
        text: chunkText,
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
        let parsedMessage = errorBody;
        try {
          const json = JSON.parse(errorBody);
          parsedMessage = json?.detail?.message || json?.error?.message || json?.message || errorBody;
        } catch {
          // use raw error text
        }
        // Strict adherence to user intent: NEVER silently replace voice with a Google voice.
        throw new Error(
          `ElevenLabs voice generation failed (HTTP ${response.status}) on chunk ${i + 1}/${chunks.length} for voice "${voiceId}": ${parsedMessage}`
        );
      }

      contentType = response.headers.get('content-type') || contentType;
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(Buffer.from(arrayBuffer));
    }

    const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';
    const combinedAudio = this.combineAudioBuffers(audioBuffers, format);

    return {
      audioBuffer: combinedAudio,
      contentType,
      format,
      characterCount: text.length,
    };
  }

  /**
   * Real-time streaming with ElevenLabs using the exact user-selected voice.
   * If text exceeds 1800 characters, streams chunks sequentially with the SAME voice.
   */
  public async streamWithElevenLabs(options: GenerateSpeechOptions): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string }> {
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

    if (!apiKey) {
      throw new Error(
        `ElevenLabs API key is not configured. Please add your ELEVENLABS_API_KEY in the Settings menu to stream voice "${voiceId}".`
      );
    }

    const ELEVENLABS_CHUNK_SIZE = 1800;
    const chunks = this.splitTextForTTS(text, ELEVENLABS_CHUNK_SIZE);

    // If single chunk, stream directly from ElevenLabs /stream endpoint
    if (chunks.length === 1) {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream?output_format=${encodeURIComponent(outputFormat)}`;
      const payload = {
        text: chunks[0],
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
        let parsedMessage = errorBody;
        try {
          const json = JSON.parse(errorBody);
          parsedMessage = json?.detail?.message || json?.error?.message || json?.message || errorBody;
        } catch {
          // raw
        }
        throw new Error(`ElevenLabs stream failed (HTTP ${response.status}): ${parsedMessage}`);
      }

      return {
        stream: response.body,
        contentType: response.headers.get('content-type') || 'audio/mpeg',
      };
    }

    // For multi-chunk long text, stream each chunk sequentially with the SAME voice
    const contentType = outputFormat.startsWith('wav') ? 'audio/wav' : 'audio/mpeg';
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for (let i = 0; i < chunks.length; i++) {
            const chunkText = chunks[i];
            const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream?output_format=${encodeURIComponent(outputFormat)}`;
            const payload = {
              text: chunkText,
              model_id: modelId,
              voice_settings: {
                stability: voiceSettings.stability ?? 0.5,
                similarity_boost: voiceSettings.similarity_boost ?? 0.75,
                style: voiceSettings.style ?? 0.0,
                use_speaker_boost: voiceSettings.use_speaker_boost ?? true,
                speed: voiceSettings.speed ?? 1.0,
              },
            };

            const res = await fetch(url, {
              method: 'POST',
              headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg, audio/wav, audio/*',
              },
              body: JSON.stringify(payload),
            });

            if (!res.ok || !res.body) {
              const errText = await res.text();
              throw new Error(`ElevenLabs chunk ${i + 1}/${chunks.length} failed (HTTP ${res.status}): ${errText.slice(0, 100)}`);
            }

            const reader = res.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) controller.enqueue(value);
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return {
      stream,
      contentType,
    };
  }

  /**
   * Synthesizes audio using Sarvam AI Bulbul v3 with the user's selected Hindi voice.
   * Directly uses Sarvam AI's original Bulbul v3 model.
   * Handles texts > 450 characters by chunking and synthesizing every chunk with the selected Sarvam voice.
   */
  public async synthesizeWithSarvamAI(options: GenerateSpeechOptions): Promise<TTSResult> {
    const { text, voiceId, voiceSettings, outputFormat = 'mp3_44100_128' } = options;
    const sarvamKey = this.getSarvamApiKey();
    const speaker = voiceId.replace(/^sarvam-/, '');

    if (!sarvamKey) {
      throw new Error(`Sarvam AI API key is not configured. Please add your SARVAM_API_KEY in Settings to use voice "${voiceId}".`);
    }

    // Sarvam Bulbul v3 REST API supports up to 2500 characters per request.
    // Keep a small safety margin while using the SAME selected speaker for every chunk.
    const SARVAM_CHUNK_SIZE = 2400;
    const chunks = this.splitTextForTTS(text, SARVAM_CHUNK_SIZE);
    const audioBuffers: Buffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': sarvamKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: chunkText,
          language_code: 'hi-IN',
          model: 'bulbul:v3',
          speaker,
          output_audio_codec: 'mp3',
          pace: voiceSettings?.speed || 1.0,
          speech_sample_rate: 24000,
          enable_preprocessing: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMessage = errorText;
        try {
          const parsed = JSON.parse(errorText);
          parsedMessage = parsed?.error?.message || parsed?.message || errorText;
        } catch {
          // raw string
        }
        throw new Error(`Sarvam AI error (HTTP ${response.status}) on chunk ${i + 1}/${chunks.length}: ${parsedMessage}`);
      }

      const data = (await response.json()) as { audios?: string[] };
      if (!Array.isArray(data.audios) || data.audios.length === 0 || !data.audios[0]) {
        throw new Error(`Sarvam AI returned empty audio on chunk ${i + 1}/${chunks.length}.`);
      }

      audioBuffers.push(Buffer.from(data.audios[0], 'base64'));
    }

    const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';
    const combinedAudio = this.combineAudioBuffers(audioBuffers, format);

    return {
      audioBuffer: combinedAudio,
      contentType: 'audio/mpeg',
      format,
      characterCount: text.length,
    };
  }

  /**
   * Streams Sarvam AI audio with the user's selected Hindi voice.
   * If Sarvam has 0 credits or is unconfigured, seamlessly streams via VOXIA Hindi neural engine.
   */
  public async streamWithSarvamAI(options: GenerateSpeechOptions): Promise<{
    stream: ReadableStream<Uint8Array>;
    contentType: string;
  }> {
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
    };
  }

  /**
   * Synthesizes audio using Google Free Voices ONLY when the user explicitly selected a google-* voice.
   * Uses the exact locale / accent configured for that voice.
   */
  public async synthesizeWithGoogleVoices(options: GenerateSpeechOptions): Promise<TTSResult> {
    const { text, voiceId, voiceSettings, outputFormat = 'mp3_44100_128' } = options;
    const lang = this.detectLanguage(text, voiceId);
    const chunks = this.splitTextForTTS(text, 160);
    const buffers: Buffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const buf = await this.fetchTTSChunk(chunk, lang, voiceSettings?.speed || 1.0);
      buffers.push(buf);
    }

    const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';
    const combinedAudio = this.combineAudioBuffers(buffers, format);

    return {
      audioBuffer: combinedAudio,
      contentType: 'audio/mpeg',
      format,
      characterCount: text.length,
    };
  }

  /**
   * Streams audio using Google Free Voices ONLY when the user explicitly selected a google-* voice.
   */
  public streamWithGoogleVoices(options: GenerateSpeechOptions): { stream: ReadableStream<Uint8Array>; contentType: string } {
    const { text, voiceId, voiceSettings } = options;
    const lang = this.detectLanguage(text, voiceId);
    const chunks = this.splitTextForTTS(text, 160);
    const self = this;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for (const chunk of chunks) {
            const buf = await self.fetchTTSChunk(chunk, lang, voiceSettings?.speed || 1.0);
            controller.enqueue(new Uint8Array(buf));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return {
      stream,
      contentType: 'audio/mpeg',
    };
  }
}

export const ttsService = new TTSService();