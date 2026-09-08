import WebSocket from 'ws';
import {
  GenerateSpeechOptions,
  TTSResult,
  StreamSpeechResult,
  ITTSProvider,
  TTSProviderType,
} from '../types.js';

const SONIOX_WS_URL = 'wss://tts-rt.soniox.com/tts-websocket';
const DEFAULT_SONIOX_MODEL = 'tts-rt-v2';
const DEFAULT_SONIOX_VOICE = 'Adrian';

/**
 * Soniox Real-Time Text-to-Speech Service
 * Communicates directly with Soniox WebSocket endpoint using tts-rt-v2 model.
 * Audio is received as base64-encoded chunks and processed purely in memory.
 */
export class SonioxService implements ITTSProvider {
  public readonly provider: TTSProviderType = 'soniox';

  private getApiKey(): string | null {
    const key = process.env.SONIOX_API_KEY;
    if (!key || key.trim().length === 0 || key === 'MY_SONIOX_API_KEY') {
      return null;
    }
    return key.trim();
  }

  public hasApiKey(): boolean {
    return this.getApiKey() !== null;
  }

  /**
   * Resolves the requested audio format to Soniox supported format string
   */
  private resolveAudioFormat(requestedFormat?: string): { sonioxFormat: string; mimeType: string; fileExt: string } {
    if (!requestedFormat) {
      return { sonioxFormat: 'mp3', mimeType: 'audio/mpeg', fileExt: 'mp3' };
    }

    const fmt = requestedFormat.toLowerCase();
    if (fmt.includes('wav')) {
      return { sonioxFormat: 'wav', mimeType: 'audio/wav', fileExt: 'wav' };
    }
    if (fmt.includes('pcm')) {
      return { sonioxFormat: 'pcm_s16le', mimeType: 'audio/pcm', fileExt: 'raw' };
    }
    if (fmt.includes('flac')) {
      return { sonioxFormat: 'flac', mimeType: 'audio/flac', fileExt: 'flac' };
    }
    if (fmt.includes('opus')) {
      return { sonioxFormat: 'opus', mimeType: 'audio/opus', fileExt: 'opus' };
    }

    // Default to MP3
    return { sonioxFormat: 'mp3', mimeType: 'audio/mpeg', fileExt: 'mp3' };
  }

  /**
   * Generates speech by connecting to Soniox WebSocket, buffering all chunks in memory,
   * and returning a complete TTSResult.
   */
  public async generateSpeech(options: GenerateSpeechOptions): Promise<TTSResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error: any = new Error(
        'Soniox API key is not configured. Please add SONIOX_API_KEY to your environment (.env file) or Settings.'
      );
      error.statusCode = 401;
      error.code = 'MISSING_SONIOX_API_KEY';
      throw error;
    }

    const {
      text,
      voiceId = DEFAULT_SONIOX_VOICE,
      language = 'en',
      modelId = DEFAULT_SONIOX_MODEL,
      outputFormat,
    } = options;

    const { sonioxFormat, mimeType, fileExt } = this.resolveAudioFormat(outputFormat);
    const streamId = `soniox_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return new Promise<TTSResult>((resolve, reject) => {
      let ws: WebSocket | null = null;
      let keepAliveInterval: NodeJS.Timeout | null = null;
      let connectionTimeout: NodeJS.Timeout | null = null;
      let isResolved = false;
      const audioChunks: Buffer[] = [];

      const cleanup = () => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        if (connectionTimeout) clearTimeout(connectionTimeout);
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
          try {
            ws.close();
          } catch {
            // Ignore close errors
          }
        }
      };

      const finishWithError = (err: any) => {
        if (isResolved) return;
        isResolved = true;
        cleanup();
        reject(err);
      };

      try {
        ws = new WebSocket(SONIOX_WS_URL);
      } catch (wsErr) {
        return finishWithError(new Error(`Failed to initialize Soniox WebSocket: ${wsErr}`));
      }

      // 25 second connection timeout
      connectionTimeout = setTimeout(() => {
        finishWithError(new Error('Connection to Soniox WebSocket timed out.'));
      }, 25000);

      ws.on('open', () => {
        if (connectionTimeout) clearTimeout(connectionTimeout);

        // 1. Send configuration frame
        const configMessage = {
          api_key: apiKey,
          stream_id: streamId,
          model: modelId || DEFAULT_SONIOX_MODEL,
          language: language || 'en',
          voice: voiceId || DEFAULT_SONIOX_VOICE,
          audio_format: sonioxFormat,
        };

        ws?.send(JSON.stringify(configMessage));

        // 2. Start keep-alive heartbeats every 15s to maintain connection
        keepAliveInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ keep_alive: true }));
          }
        }, 15000);

        // 3. Send text in chunks (or whole text) and signal end of text
        const textPayload = {
          text: text,
          text_end: false,
          stream_id: streamId,
        };
        ws?.send(JSON.stringify(textPayload));

        // Signal text completion
        const endPayload = {
          text: '',
          text_end: true,
          stream_id: streamId,
        };
        ws?.send(JSON.stringify(endPayload));
      });

      ws.on('message', (rawData: WebSocket.RawData) => {
        try {
          const messageStr = rawData.toString('utf8');
          const data = JSON.parse(messageStr);

          // Check for API errors
          if (data.error_code || data.error_message || data.error) {
            const errorMsg = data.error_message || data.error || `Soniox error: ${data.error_code}`;
            const err: any = new Error(errorMsg);
            err.code = data.error_code || 'SONIOX_API_ERROR';
            err.statusCode = data.error_code === 401 ? 401 : 500;
            return finishWithError(err);
          }

          // Accumulate audio chunks
          if (data.audio) {
            const chunkBuffer = Buffer.from(data.audio, 'base64');
            audioChunks.push(chunkBuffer);
          }

          // Check for stream completion
          if (data.audio_end === true || data.terminated === true) {
            if (!isResolved) {
              isResolved = true;
              cleanup();

              const totalBuffer = Buffer.concat(audioChunks);
              resolve({
                audioBuffer: totalBuffer,
                contentType: mimeType,
                format: fileExt,
                characterCount: text.length,
                provider: 'soniox',
                wasFallenBack: false,
              });
            }
          }
        } catch (parseErr) {
          // If message is binary audio directly (fallback)
          if (Buffer.isBuffer(rawData)) {
            audioChunks.push(rawData);
          }
        }
      });

      ws.on('error', (error) => {
        finishWithError(new Error(`Soniox WebSocket error: ${error.message || error}`));
      });

      ws.on('close', (code, reason) => {
        if (!isResolved) {
          if (audioChunks.length > 0) {
            isResolved = true;
            cleanup();
            const totalBuffer = Buffer.concat(audioChunks);
            resolve({
              audioBuffer: totalBuffer,
              contentType: mimeType,
              format: fileExt,
              characterCount: text.length,
              provider: 'soniox',
              wasFallenBack: false,
            });
          } else {
            const reasonStr = reason ? reason.toString('utf8') : '';
            finishWithError(new Error(`Soniox connection closed unexpectedly (code: ${code}). ${reasonStr}`));
          }
        }
      });
    });
  }

  /**
   * Streams speech in real-time from Soniox WebSocket.
   * Yields base64-decoded chunks as they arrive into a Web ReadableStream.
   */
  public async streamSpeech(options: GenerateSpeechOptions): Promise<StreamSpeechResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error: any = new Error(
        'Soniox API key is not configured. Please add SONIOX_API_KEY to your environment (.env file) or Settings.'
      );
      error.statusCode = 401;
      error.code = 'MISSING_SONIOX_API_KEY';
      throw error;
    }

    const {
      text,
      voiceId = DEFAULT_SONIOX_VOICE,
      language = 'en',
      modelId = DEFAULT_SONIOX_MODEL,
      outputFormat,
    } = options;

    const { sonioxFormat, mimeType, fileExt } = this.resolveAudioFormat(outputFormat);
    const streamId = `soniox_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        let ws: WebSocket | null = null;
        let keepAliveInterval: NodeJS.Timeout | null = null;
        let isClosed = false;

        const cleanup = () => {
          if (keepAliveInterval) clearInterval(keepAliveInterval);
          if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            try {
              ws.close();
            } catch {
              // Ignore
            }
          }
        };

        try {
          ws = new WebSocket(SONIOX_WS_URL);
        } catch (err) {
          controller.error(err);
          return;
        }

        ws.on('open', () => {
          // Send configuration
          const configMessage = {
            api_key: apiKey,
            stream_id: streamId,
            model: modelId || DEFAULT_SONIOX_MODEL,
            language: language || 'en',
            voice: voiceId || DEFAULT_SONIOX_VOICE,
            audio_format: sonioxFormat,
          };
          ws?.send(JSON.stringify(configMessage));

          // Send keep-alive
          keepAliveInterval = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ keep_alive: true }));
            }
          }, 15000);

          // Send text content
          ws?.send(
            JSON.stringify({
              text: text,
              text_end: false,
              stream_id: streamId,
            })
          );

          // Send text completion
          ws?.send(
            JSON.stringify({
              text: '',
              text_end: true,
              stream_id: streamId,
            })
          );
        });

        ws.on('message', (rawData: WebSocket.RawData) => {
          try {
            const messageStr = rawData.toString('utf8');
            const data = JSON.parse(messageStr);

            if (data.error_code || data.error_message || data.error) {
              const errText = data.error_message || data.error || `Soniox error: ${data.error_code}`;
              controller.error(new Error(errText));
              cleanup();
              return;
            }

            if (data.audio) {
              const chunkBuffer = Buffer.from(data.audio, 'base64');
              controller.enqueue(new Uint8Array(chunkBuffer));
            }

            if (data.audio_end === true || data.terminated === true) {
              if (!isClosed) {
                isClosed = true;
                cleanup();
                controller.close();
              }
            }
          } catch {
            if (Buffer.isBuffer(rawData)) {
              controller.enqueue(new Uint8Array(rawData));
            }
          }
        });

        ws.on('error', (err) => {
          if (!isClosed) {
            isClosed = true;
            cleanup();
            controller.error(err);
          }
        });

        ws.on('close', () => {
          if (!isClosed) {
            isClosed = true;
            cleanup();
            controller.close();
          }
        });
      },
    });

    return {
      stream,
      contentType: mimeType,
      format: fileExt,
      provider: 'soniox',
      wasFallenBack: false,
    };
  }
}

export const sonioxService = new SonioxService();
