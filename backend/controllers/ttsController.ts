import { Request, Response, NextFunction } from 'express';
import { ttsService } from '../services/ttsService.js';
import { storageService } from '../services/storageService.js';
import { databaseService } from '../services/databaseService.js';
import { voiceService } from '../services/voiceService.js';
import { usageService } from '../services/usageService.js';
import { GenerationRecord } from '../types.js';

/**
 * Generate TTS audio.
 *
 * Provider selection is authoritative:
 * - google-*  -> Google
 * - sarvam-*  -> Sarvam AI Bulbul v3
 * - everything else -> ElevenLabs
 *
 * There is NO automatic provider/voice fallback.
 */
export async function generateTTS(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      text,
      voiceId,
      modelId = 'eleven_multilingual_v2',
      stability = 0.5,
      similarity = 0.75,
      style = 0.0,
      speed = 1.0,
      outputFormat = 'mp3_44100_128',
      projectId,
    } = req.body;

    if (typeof text !== 'string' || !text.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TEXT',
          message: 'Text is required.',
        },
      });
      return;
    }

    if (typeof voiceId !== 'string' || !voiceId.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_VOICE',
          message: 'voiceId is required.',
        },
      });
      return;
    }

    const trimmedText = text.trim();
    const normalizedVoiceId = voiceId.trim();

    const isGoogleVoice = normalizedVoiceId.startsWith('google-');
    const isSarvamVoice = normalizedVoiceId.startsWith('sarvam-');

    // Provider-specific models are intentionally fixed because these providers
    // require their own model identifiers. ElevenLabs receives the exact
    // modelId selected by the client.
    const effectiveModelId = isGoogleVoice
      ? 'google_neural_tts'
      : isSarvamVoice
        ? 'bulbul:v3'
        : modelId;

    // VOXIA character quota applies only to ElevenLabs generations.
    // Google and Sarvam are not charged against ElevenLabs credits.
    if (!isGoogleVoice && !isSarvamVoice) {
      const hasQuota = await usageService.hasAvailableQuota(trimmedText.length);

      if (!hasQuota) {
        res.status(403).json({
          success: false,
          error: {
            code: 'QUOTA_EXCEEDED',
            message: 'Insufficient character credits remaining in your VOXIA plan.',
          },
        });
        return;
      }
    }

    const voice = await voiceService.getVoiceById(normalizedVoiceId);
    const voiceName = voice?.name || 'Voice';

    const voiceSettings = {
      stability: Number(stability),
      similarity_boost: Number(similarity),
      style: Number(style),
      use_speaker_boost: true,
      speed: Number(speed),
    };

    // IMPORTANT:
    // ttsService is responsible for calling ONLY the provider represented by
    // normalizedVoiceId. If that provider fails, the error is propagated.
    const result = await ttsService.generateSpeech({
      text: trimmedText,
      voiceId: normalizedVoiceId,
      modelId: effectiveModelId,
      voiceSettings,
      outputFormat,
    });

    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
    const estimatedDuration = Math.max(1, Math.round((wordCount / 140) * 60));
    const today = new Date().toISOString().split('T')[0];

    const ext = result.format.startsWith('wav')
      ? 'wav'
      : result.format.startsWith('pcm')
        ? 'raw'
        : 'mp3';

    const downloadFileName = `voxia-tts-${today}.${ext}`;
    const genId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Track ElevenLabs usage only.
    if (!isGoogleVoice && !isSarvamVoice) {
      await usageService.trackGeneration(trimmedText.length);
    }

    // Save generation metadata.
    // No fallback metadata is written because provider fallback is disabled.
    const generationRecord: GenerationRecord = {
      id: genId,
      text: trimmedText,
      voiceId: normalizedVoiceId,
      voiceName,
      modelId: effectiveModelId,
      audioUrl: `/api/audio/${downloadFileName}`,
      audioFileName: downloadFileName,
      format: result.format,
      characterCount: trimmedText.length,
      wordCount,
      durationSeconds: estimatedDuration,
      createdAt: new Date().toISOString(),
      status: 'completed',
      settings: voiceSettings,
      projectId: projectId || undefined,
    };

    await databaseService.createGeneration(generationRecord);

    // Keep audio in memory for subsequent API access without writing it to disk.
    storageService.cacheAudioInMemory(
      genId,
      result.audioBuffer,
      result.contentType,
      downloadFileName
    );

    const headers: Record<string, string | number> = {
      'Content-Type': result.contentType,
      'Content-Length': result.audioBuffer.length,
      'Content-Disposition': `inline; filename="${downloadFileName}"`,
      'X-Generation-Id': genId,
      'X-Voice-Name': encodeURIComponent(voiceName),
      'X-Voice-Id': normalizedVoiceId,
      'X-Model-Id': effectiveModelId,
      'X-Character-Count': String(trimmedText.length),
      'X-Word-Count': String(wordCount),
      'X-Duration-Seconds': String(estimatedDuration),
      'X-Audio-Format': ext,
      'X-Download-Filename': downloadFileName,
    };

    res.writeHead(200, headers);
    res.end(result.audioBuffer);
  } catch (err) {
    // Provider errors (including Sarvam quota/API errors) are passed to the
    // application's error handler. Nothing is silently retried with another voice.
    next(err);
  }
}

/**
 * Stream TTS audio.
 *
 * The selected provider/voice/model remains authoritative for every chunk.
 * There is NO automatic fallback.
 */
export async function streamTTS(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      text,
      voiceId,
      modelId = 'eleven_multilingual_v2',
      stability = 0.5,
      similarity = 0.75,
      style = 0.0,
      speed = 1.0,
      outputFormat = 'mp3_44100_128',
      projectId,
    } = req.body;

    if (typeof text !== 'string' || !text.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TEXT',
          message: 'Text is required.',
        },
      });
      return;
    }

    if (typeof voiceId !== 'string' || !voiceId.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_VOICE',
          message: 'voiceId is required.',
        },
      });
      return;
    }

    const trimmedText = text.trim();
    const normalizedVoiceId = voiceId.trim();

    const isGoogleVoice = normalizedVoiceId.startsWith('google-');
    const isSarvamVoice = normalizedVoiceId.startsWith('sarvam-');

    const effectiveModelId = isGoogleVoice
      ? 'google_neural_tts'
      : isSarvamVoice
        ? 'bulbul:v3'
        : modelId;

    // Check VOXIA character quota only for ElevenLabs.
    if (!isGoogleVoice && !isSarvamVoice) {
      const hasQuota = await usageService.hasAvailableQuota(trimmedText.length);

      if (!hasQuota) {
        res.status(403).json({
          success: false,
          error: {
            code: 'QUOTA_EXCEEDED',
            message: 'Insufficient character credits remaining in your VOXIA plan.',
          },
        });
        return;
      }
    }

    const voice = await voiceService.getVoiceById(normalizedVoiceId);
    const voiceName = voice?.name || 'Voice';

    const voiceSettings = {
      stability: Number(stability),
      similarity_boost: Number(similarity),
      style: Number(style),
      use_speaker_boost: true,
      speed: Number(speed),
    };

    const streamResult = await ttsService.streamSpeech({
      text: trimmedText,
      voiceId: normalizedVoiceId,
      modelId: effectiveModelId,
      voiceSettings,
      outputFormat,
    });

    const { stream, contentType } = streamResult;

    const reader = stream.getReader();

    // Pre-read one chunk so provider initialization/API failures can be caught
    // before HTTP streaming headers are committed.
    const first = await reader.read();

    const today = new Date().toISOString().split('T')[0];

    const ext = outputFormat.startsWith('wav')
      ? 'wav'
      : outputFormat.startsWith('pcm')
        ? 'raw'
        : 'mp3';

    const downloadFileName = `voxia-tts-${today}.${ext}`;
    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
    const estimatedDuration = Math.max(1, Math.round((wordCount / 140) * 60));
    const genId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Content-Disposition', `inline; filename="${downloadFileName}"`);
    res.setHeader('X-Voxia-Streaming', 'true');
    res.setHeader('X-Generation-Id', genId);
    res.setHeader('X-Voice-Name', encodeURIComponent(voiceName));
    res.setHeader('X-Voice-Id', normalizedVoiceId);
    res.setHeader('X-Model-Id', effectiveModelId);
    res.setHeader('X-Character-Count', String(trimmedText.length));
    res.setHeader('X-Word-Count', String(wordCount));
    res.setHeader('X-Duration-Seconds', String(estimatedDuration));
    res.setHeader('X-Audio-Format', ext);
    res.setHeader('X-Download-Filename', downloadFileName);

    const collectedChunks: Buffer[] = [];

    if (first.value) {
      const chunkBuf = Buffer.from(first.value);
      collectedChunks.push(chunkBuf);
      res.write(chunkBuf);
    }

    if (first.done) {
      res.end();
      return;
    }

    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          res.end();
          break;
        }

        if (value) {
          const chunkBuf = Buffer.from(value);
          collectedChunks.push(chunkBuf);
          res.write(chunkBuf);
        }
      }

      // Post-stream accounting/storage should not interrupt an already
      // completed audio response.
      try {
        if (!isGoogleVoice && !isSarvamVoice) {
          await usageService.trackGeneration(trimmedText.length);
        }

        const totalBuffer = Buffer.concat(collectedChunks);

        storageService.cacheAudioInMemory(
          genId,
          totalBuffer,
          contentType,
          downloadFileName
        );

        const record: GenerationRecord = {
          id: genId,
          text: trimmedText,
          voiceId: normalizedVoiceId,
          voiceName,
          modelId: effectiveModelId,
          audioUrl: `/api/audio/${downloadFileName}`,
          audioFileName: downloadFileName,
          format: ext,
          characterCount: trimmedText.length,
          wordCount,
          durationSeconds: estimatedDuration,
          createdAt: new Date().toISOString(),
          status: 'completed',
          settings: voiceSettings,
          projectId: projectId || undefined,
        };

        await databaseService.createGeneration(record);
      } catch (err) {
        console.warn('Notice during post-stream accounting:', err);
      }
    };

    pump().catch((err) => {
      console.error('Error during streaming chunk pipe:', err);

      if (!res.headersSent) {
        next(err);
      } else {
        res.end();
      }
    });
  } catch (err) {
    next(err);
  }
}
