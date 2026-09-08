import { Request, Response, NextFunction } from 'express';
import { ttsManager } from '../services/ttsManager.js';
import { storageService } from '../services/storageService.js';
import { databaseService } from '../services/databaseService.js';
import { voiceService } from '../services/voiceService.js';
import { usageService } from '../services/usageService.js';
import { GenerationRecord, TTSProviderType } from '../types.js';

export async function generateTTS(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      provider,
      text,
      voiceId,
      language = 'en',
      modelId,
      stability = 0.5,
      similarity = 0.75,
      style = 0.0,
      speed = 1.0,
      outputFormat = 'mp3_44100_128',
      projectId,
    } = req.body;

    const trimmedText = text.trim();

    // Check character credit quota
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

    // Resolve voice name
    const voice = await voiceService.getVoiceById(voiceId);
    const voiceName = voice?.name || 'Voice';

    // Generate speech using unified TTS manager (routes to ElevenLabs or Soniox)
    const result = await ttsManager.generateSpeech(
      {
        text: trimmedText,
        voiceId,
        language,
        modelId,
        voiceSettings: {
          stability: Number(stability),
          similarity_boost: Number(similarity),
          style: Number(style),
          use_speaker_boost: true,
          speed: Number(speed),
        },
        outputFormat,
      },
      provider as TTSProviderType | undefined
    );

    const effectiveVoiceName = result.wasFallenBack && result.fallbackVoiceName ? result.fallbackVoiceName : voiceName;
    const effectiveVoiceId = result.wasFallenBack && result.fallbackVoiceId ? result.fallbackVoiceId : voiceId;

    // Compute metrics and browser download filename
    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
    const estimatedDuration = Math.max(1, Math.round((wordCount / 140) * 60));
    const today = new Date().toISOString().split('T')[0];
    const ext = result.format.startsWith('wav') ? 'wav' : result.format.startsWith('pcm') ? 'raw' : 'mp3';
    const downloadFileName = `voxia-tts-${today}.${ext}`;
    const genId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Track usage quota (without writing files to server disk)
    await usageService.trackGeneration(trimmedText.length);

    // Save generation metadata record to DB for session & history tracking
    const generationRecord: GenerationRecord = {
      id: genId,
      provider: result.provider,
      language: language || undefined,
      text: trimmedText,
      voiceId: effectiveVoiceId,
      voiceName: effectiveVoiceName,
      modelId: modelId || (result.provider === 'soniox' ? 'tts-rt-v2' : 'eleven_multilingual_v2'),
      audioUrl: `/api/audio/${downloadFileName}`,
      audioFileName: downloadFileName,
      format: result.format,
      characterCount: trimmedText.length,
      wordCount,
      durationSeconds: estimatedDuration,
      createdAt: new Date().toISOString(),
      status: 'completed',
      settings: {
        stability: Number(stability),
        similarity_boost: Number(similarity),
        style: Number(style),
        use_speaker_boost: true,
        speed: Number(speed),
      },
      projectId: projectId || undefined,
      wasFallenBack: result.wasFallenBack,
      fallbackNotice: result.fallbackNotice,
    };
    await databaseService.createGeneration(generationRecord);

    // Cache in RAM for ephemeral requests with zero disk storage footprint
    storageService.cacheAudioInMemory(genId, result.audioBuffer, result.contentType, downloadFileName);

    // Return the audio directly to the frontend as binary audio response
    res.writeHead(200, {
      'Content-Type': result.contentType,
      'Content-Length': result.audioBuffer.length,
      'Content-Disposition': `inline; filename="${downloadFileName}"`,
      'X-TTS-Provider': result.provider,
      'X-Generation-Id': genId,
      'X-Voice-Name': encodeURIComponent(effectiveVoiceName),
      'X-Voice-Id': effectiveVoiceId,
      'X-Voice-Fallback': result.wasFallenBack ? 'true' : 'false',
      'X-Voice-Fallback-Name': result.fallbackVoiceName || '',
      'X-Voice-Fallback-Notice': encodeURIComponent(result.fallbackNotice || ''),
      'X-Model-Id': modelId || (result.provider === 'soniox' ? 'tts-rt-v2' : 'eleven_multilingual_v2'),
      'X-Character-Count': String(trimmedText.length),
      'X-Word-Count': String(wordCount),
      'X-Duration-Seconds': String(estimatedDuration),
      'X-Audio-Format': ext,
      'X-Download-Filename': downloadFileName,
    });
    res.end(result.audioBuffer);
  } catch (err) {
    next(err);
  }
}

export async function streamTTS(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      provider,
      text,
      voiceId,
      language = 'en',
      modelId,
      stability = 0.5,
      similarity = 0.75,
      style = 0.0,
      speed = 1.0,
      outputFormat = 'mp3_44100_128',
      projectId,
    } = req.body;

    const trimmedText = text.trim();

    // Check quota
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

    const voice = await voiceService.getVoiceById(voiceId);
    const voiceName = voice?.name || 'Voice';

    const { stream, contentType, format, provider: activeProvider, wasFallenBack, fallbackVoiceName } = await ttsManager.streamSpeech(
      {
        text: trimmedText,
        voiceId,
        language,
        modelId,
        voiceSettings: {
          stability: Number(stability),
          similarity_boost: Number(similarity),
          style: Number(style),
          use_speaker_boost: true,
          speed: Number(speed),
        },
        outputFormat,
      },
      provider as TTSProviderType | undefined
    );

    const effectiveVoiceName = wasFallenBack && fallbackVoiceName ? fallbackVoiceName : voiceName;
    const effectiveVoiceId = wasFallenBack ? 'CwhRBWXzGAHq8TQ4Fs17' : voiceId;

    const today = new Date().toISOString().split('T')[0];
    const ext = format || (outputFormat.startsWith('wav') ? 'wav' : outputFormat.startsWith('pcm') ? 'raw' : 'mp3');
    const downloadFileName = `voxia-tts-${today}.${ext}`;
    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length;
    const estimatedDuration = Math.max(1, Math.round((wordCount / 140) * 60));
    const genId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Set streaming headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Content-Disposition', `inline; filename="${downloadFileName}"`);
    res.setHeader('X-Voxia-Streaming', 'true');
    res.setHeader('X-TTS-Provider', activeProvider);
    res.setHeader('X-Generation-Id', genId);
    res.setHeader('X-Voice-Name', encodeURIComponent(effectiveVoiceName));
    res.setHeader('X-Voice-Id', effectiveVoiceId);
    res.setHeader('X-Voice-Fallback', wasFallenBack ? 'true' : 'false');
    if (wasFallenBack && fallbackVoiceName) {
      res.setHeader('X-Voice-Fallback-Name', fallbackVoiceName);
    }
    res.setHeader('X-Model-Id', modelId || (activeProvider === 'soniox' ? 'tts-rt-v2' : 'eleven_multilingual_v2'));
    res.setHeader('X-Character-Count', String(trimmedText.length));
    res.setHeader('X-Word-Count', String(wordCount));
    res.setHeader('X-Duration-Seconds', String(estimatedDuration));
    res.setHeader('X-Audio-Format', ext);
    res.setHeader('X-Download-Filename', downloadFileName);

    const reader = stream.getReader();
    const collectedChunks: Buffer[] = [];

    // Read and pipe chunks directly to response
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

      // Track usage and record in database without writing files to disk
      try {
        await usageService.trackGeneration(trimmedText.length);
        const totalBuffer = Buffer.concat(collectedChunks);

        // Store in ephemeral memory cache for optional subsequent lookup
        storageService.cacheAudioInMemory(genId, totalBuffer, contentType, downloadFileName);

        const record: GenerationRecord = {
          id: genId,
          provider: activeProvider,
          language: language || undefined,
          text: trimmedText,
          voiceId: effectiveVoiceId,
          voiceName: effectiveVoiceName,
          modelId: modelId || (activeProvider === 'soniox' ? 'tts-rt-v2' : 'eleven_multilingual_v2'),
          audioUrl: `/api/audio/${downloadFileName}`,
          audioFileName: downloadFileName,
          format: ext,
          characterCount: trimmedText.length,
          wordCount,
          durationSeconds: estimatedDuration,
          createdAt: new Date().toISOString(),
          status: 'completed',
          settings: {
            stability: Number(stability),
            similarity_boost: Number(similarity),
            style: Number(style),
            use_speaker_boost: true,
            speed: Number(speed),
          },
          projectId: projectId || undefined,
          wasFallenBack,
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
