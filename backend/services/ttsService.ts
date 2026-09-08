import {
  VoiceSettings,
  GenerateSpeechOptions,
  TTSResult,
  StreamSpeechResult,
  ITTSProvider,
  TTSProviderType,
} from '../types.js';
import { splitTextIntoChunks, concatenateMp3Buffers } from '../utils/textSplitter.js';

export { GenerateSpeechOptions, TTSResult };

// Standard verified ElevenLabs premade voice guaranteed to work on all Free & Paid accounts
export const VERIFIED_FREE_TIER_VOICE_ID = 'CwhRBWXzGAHq8TQ4Fs17';
export const VERIFIED_FREE_TIER_VOICE_NAME = 'Roger';

export class TTSService implements ITTSProvider {
  public readonly provider: TTSProviderType = 'elevenlabs';

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

  /**
   * Performs a single text-to-speech HTTP request to ElevenLabs with automatic fallback
   * if the account lacks permissions for library or professional voices.
   */
  private async fetchSingleChunk(
    chunkText: string,
    voiceId: string,
    modelId: string,
    voiceSettings: VoiceSettings,
    outputFormat: string,
    apiKey: string
  ): Promise<{ buffer: Buffer; contentType: string; wasFallenBack: boolean }> {
    const makeRequest = async (targetVoiceId: string) => {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(targetVoiceId)}?output_format=${encodeURIComponent(outputFormat)}`;
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

      return await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg, audio/wav, audio/*',
        },
        body: JSON.stringify(payload),
      });
    };

    let activeVoiceId = voiceId;
    let wasFallenBack = false;
    let response = await makeRequest(activeVoiceId);

    // Handle 402 "Free users cannot use library voices via the API"
    if (!response.ok) {
      const errorBody = await response.text();
      const isLibraryVoiceError =
        response.status === 402 ||
        errorBody.includes('library voices via the API') ||
        errorBody.includes('upgrade your subscription');

      if (isLibraryVoiceError && activeVoiceId !== VERIFIED_FREE_TIER_VOICE_ID) {
        console.warn(
          `[VOXIA Fallback] Selected voice (${activeVoiceId}) requires a paid ElevenLabs plan. Auto-recovering with standard premade voice: ${VERIFIED_FREE_TIER_VOICE_NAME} (${VERIFIED_FREE_TIER_VOICE_ID}).`
        );
        activeVoiceId = VERIFIED_FREE_TIER_VOICE_ID;
        wasFallenBack = true;
        response = await makeRequest(activeVoiceId);
      } else {
        // Parse error message
        let parsedMessage = 'Failed to generate speech with ElevenLabs API';
        let errorCode = 'GENERATION_ERROR';

        try {
          const parsed = JSON.parse(errorBody);
          parsedMessage = parsed?.detail?.message || parsed?.message || parsedMessage;
          if (response.status === 401) {
            errorCode = 'INVALID_API_KEY';
            parsedMessage = 'Invalid ElevenLabs API key provided. Please verify your credentials in Settings.';
          } else if (response.status === 429) {
            errorCode = 'RATE_LIMIT_EXCEEDED';
            parsedMessage = 'ElevenLabs rate limit exceeded. Please wait a moment before trying again.';
          } else if (response.status === 402) {
            errorCode = 'PAYMENT_REQUIRED';
            parsedMessage = 'ElevenLabs subscription limit reached or voice requires a paid plan.';
          }
        } catch {
          parsedMessage = `ElevenLabs error (${response.status}): ${errorBody.slice(0, 150)}`;
        }

        const err: any = new Error(parsedMessage);
        err.statusCode = response.status;
        err.code = errorCode;
        throw err;
      }
    }

    if (!response.ok) {
      const errorBody = await response.text();
      const err: any = new Error(`ElevenLabs generation failed (${response.status}): ${errorBody.slice(0, 150)}`);
      err.statusCode = response.status;
      throw err;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    return { buffer, contentType, wasFallenBack };
  }

  /**
   * Generates speech for arbitrary text length.
   * If text > 4,000 characters (e.g. 5,948 characters), it transparently splits text into
   * natural sentence/paragraph chunks, generates each chunk, and seamlessly stitches the audio.
   */
  public async generateSpeech(options: GenerateSpeechOptions): Promise<TTSResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error: any = new Error(
        'ElevenLabs API key is not configured. Please add ELEVENLABS_API_KEY to your environment (.env file) or Settings.'
      );
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

    // Split text into safe chunks (<= 4000 characters each)
    const chunks = splitTextIntoChunks(text, 4000);
    const buffers: Buffer[] = [];
    let wasFallenBack = false;
    let currentVoiceId = voiceId;
    let contentType = 'audio/mpeg';

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const result = await this.fetchSingleChunk(
        chunkText,
        currentVoiceId,
        modelId,
        voiceSettings,
        outputFormat,
        apiKey
      );

      if (result.wasFallenBack) {
        wasFallenBack = true;
        currentVoiceId = VERIFIED_FREE_TIER_VOICE_ID;
      }
      buffers.push(result.buffer);
      contentType = result.contentType;
    }

    const format = outputFormat.startsWith('wav') ? 'wav' : 'mp3';
    const audioBuffer = format === 'mp3' ? concatenateMp3Buffers(buffers) : Buffer.concat(buffers);

    return {
      audioBuffer,
      contentType,
      format,
      characterCount: text.length,
      provider: 'elevenlabs',
      wasFallenBack,
      fallbackVoiceId: wasFallenBack ? VERIFIED_FREE_TIER_VOICE_ID : undefined,
      fallbackVoiceName: wasFallenBack ? VERIFIED_FREE_TIER_VOICE_NAME : undefined,
      fallbackNotice: wasFallenBack
        ? `Selected voice requires an ElevenLabs paid subscription. VOXIA automatically synthesized your audio with ${VERIFIED_FREE_TIER_VOICE_NAME} (Standard Free-Tier voice).`
        : undefined,
    };
  }

  /**
   * Streams speech for arbitrary text length.
   * If text > 4,000 characters, it streams chunk 1, then chunk 2, etc. consecutively
   * without closing the stream until all text is synthesized.
   */
  public async streamSpeech(
    options: GenerateSpeechOptions
  ): Promise<StreamSpeechResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error: any = new Error(
        'ElevenLabs API key is not configured. Please add ELEVENLABS_API_KEY to your environment (.env file) or Settings.'
      );
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

    const chunks = splitTextIntoChunks(text, 4000);
    let activeVoiceId = voiceId;
    let wasFallenBack = false;

    // Helper to open a stream for a specific chunk
    const fetchChunkStream = async (chunkText: string, targetVoiceId: string) => {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(targetVoiceId)}/stream?output_format=${encodeURIComponent(outputFormat)}`;
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

      let res = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg, audio/wav, audio/*',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        const isLibraryVoiceError =
          res.status === 402 ||
          errorBody.includes('library voices via the API') ||
          errorBody.includes('upgrade your subscription');

        if (isLibraryVoiceError && targetVoiceId !== VERIFIED_FREE_TIER_VOICE_ID) {
          console.warn(
            `[VOXIA Stream Fallback] Selected voice (${targetVoiceId}) requires a paid plan. Auto-recovering with ${VERIFIED_FREE_TIER_VOICE_NAME}.`
          );
          activeVoiceId = VERIFIED_FREE_TIER_VOICE_ID;
          wasFallenBack = true;
          return fetchChunkStream(chunkText, activeVoiceId);
        }

        let parsedMessage = 'Failed to stream speech from ElevenLabs API';
        try {
          const parsed = JSON.parse(errorBody);
          parsedMessage = parsed?.detail?.message || parsed?.message || parsedMessage;
        } catch {
          parsedMessage = `ElevenLabs error (${res.status}): ${errorBody.slice(0, 150)}`;
        }

        const err: any = new Error(parsedMessage);
        err.statusCode = res.status;
        throw err;
      }

      return res;
    };

    const ext = outputFormat.startsWith('wav') ? 'wav' : 'mp3';

    // If single chunk, test stream immediately to capture content-type and headers
    if (chunks.length === 1) {
      const res = await fetchChunkStream(chunks[0], activeVoiceId);
      const contentType = res.headers.get('content-type') || 'audio/mpeg';

      return {
        stream: res.body!,
        contentType,
        format: ext,
        provider: 'elevenlabs',
        wasFallenBack,
        fallbackVoiceName: wasFallenBack ? VERIFIED_FREE_TIER_VOICE_NAME : undefined,
      };
    }

    // For multi-chunk long text, create a unified stream piping each section sequentially
    const contentType = outputFormat.startsWith('wav') ? 'audio/wav' : 'audio/mpeg';

    const multiStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for (let i = 0; i < chunks.length; i++) {
            const res = await fetchChunkStream(chunks[i], activeVoiceId);
            if (!res.body) continue;

            const reader = res.body.getReader();
            let isFirstReadOfChunk = true;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                // If subsequent chunk in MP3, strip ID3 header from beginning of chunk if present
                if (i > 0 && isFirstReadOfChunk && outputFormat.startsWith('mp3')) {
                  const buf = Buffer.from(value);
                  const stripped = Buffer.from(
                    buf.length > 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33
                      ? buf.subarray(10 + (((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f)))
                      : buf
                  );
                  controller.enqueue(new Uint8Array(stripped));
                } else {
                  controller.enqueue(value);
                }
                isFirstReadOfChunk = false;
              }
            }
          }
          controller.close();
        } catch (streamErr) {
          controller.error(streamErr);
        }
      },
    });

    return {
      stream: multiStream,
      contentType,
      format: ext,
      provider: 'elevenlabs',
      wasFallenBack,
      fallbackVoiceName: wasFallenBack ? VERIFIED_FREE_TIER_VOICE_NAME : undefined,
    };
  }
}

export const ttsService = new TTSService();
