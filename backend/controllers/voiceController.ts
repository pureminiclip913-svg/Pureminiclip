import { Request, Response, NextFunction } from 'express';
import { voiceService } from '../services/voiceService.js';
import { ttsService } from '../services/ttsService.js';

// Ephemeral cache for generated preview audio samples
const previewCache = new Map<string, Buffer>();

export async function getVoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const result = await voiceService.getVoices(forceRefresh);

    res.status(200).json({
      success: true,
      provider: result.provider,
      hasApiKey: result.hasApiKey,
      count: result.voices.length,
      voices: result.voices,
    });
  } catch (err) {
    next(err);
  }
}

export async function getVoiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { voiceId } = req.params;
    const voice = await voiceService.getVoiceById(voiceId);

    if (!voice) {
      res.status(404).json({
        success: false,
        error: {
          code: 'VOICE_NOT_FOUND',
          message: `Voice with ID '${voiceId}' was not found.`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      voice,
    });
  } catch (err) {
    next(err);
  }
}

export async function previewVoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { voiceId } = req.body || {};
    if (!voiceId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_VOICE_ID',
          message: 'voiceId is required to preview a voice.',
        },
      });
      return;
    }

    const voice = await voiceService.getVoiceById(voiceId);
    if (!voice) {
      res.status(404).json({
        success: false,
        error: {
          code: 'VOICE_NOT_FOUND',
          message: `Voice with ID '${voiceId}' was not found.`,
        },
      });
      return;
    }

    if (!voice.preview_url) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PREVIEW_UNAVAILABLE',
          message: `No preview audio available for voice '${voice.name}'.`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      voiceId: voice.voice_id,
      name: voice.name,
      previewUrl: voice.preview_url,
    });
  } catch (err) {
    next(err);
  }
}

export async function getVoicePreviewAudio(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { voiceId } = req.params;
    const voice = await voiceService.getVoiceById(voiceId);

    if (!voice) {
      res.status(404).send('Voice not found');
      return;
    }

    // If already cached in memory
    const cached = previewCache.get(voiceId);
    if (cached) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', cached.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(cached);
      return;
    }

    // If Google free voice, synthesize official sample in that voice's accent
    if (voice.provider === 'google' || voice.voice_id.startsWith('google-')) {
      const sampleText = voice.sampleText || `Hello, this is ${voice.name}, ready for your voice productions.`;
      const lang = voice.languageCode || voice.labels?.language_code || 'en-US';
      const buffer = await ttsService.fetchTTSChunk(sampleText, lang);
      previewCache.set(voiceId, buffer);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
      return;
    }

    // If Sarvam AI voice, synthesize Hindi preview sample via Sarvam API
    if (voice.provider === 'sarvam' || voice.voice_id.startsWith('sarvam-')) {
      const sampleText = voice.sampleText || `नमस्कार, यह सर्वम एआई की ${voice.name} आवाज़ है।`;
      try {
        const result = await ttsService.synthesizeWithSarvamAI({
          text: sampleText,
          voiceId,
          outputFormat: 'mp3_44100_128',
        });
        if (result.audioBuffer && result.audioBuffer.length > 0) {
          previewCache.set(voiceId, result.audioBuffer);
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', result.audioBuffer.length);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.send(result.audioBuffer);
          return;
        }
      } catch (err: any) {
        console.warn(`[VoiceController] Sarvam preview failed for ${voiceId}:`, err);
        res.status(502).send(err?.message || 'Sarvam voice preview failed.');
        return;
      }
      res.status(503).send('Preview currently unavailable for this voice');
      return;
    }

    // If ElevenLabs preview URL is present and remote
    if (voice.preview_url && voice.preview_url.startsWith('http')) {
      res.redirect(voice.preview_url);
      return;
    }

    res.status(404).send('Preview audio not available');
  } catch (err) {
    next(err);
  }
}
