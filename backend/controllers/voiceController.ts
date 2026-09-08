import { Request, Response, NextFunction } from 'express';
import { voiceService } from '../services/voiceService.js';

export async function getVoices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const providerFilter = (req.query.provider as any) || 'all';
    const result = await voiceService.getVoices(forceRefresh, providerFilter);

    res.status(200).json({
      success: true,
      provider: result.provider,
      providers: result.providers,
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
