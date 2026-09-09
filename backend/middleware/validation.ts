import { Request, Response, NextFunction } from 'express';

const ALLOWED_MODELS = [
  'eleven_multilingual_v2',
  'eleven_turbo_v2_5',
  'eleven_flash_v2_5',
  'eleven_v3',
  'eleven_monolingual_v1',
];

const ALLOWED_FORMATS = [
  'mp3_44100_128',
  'mp3_44100_192',
  'mp3_22050_32',
  'wav_44100_16',
  'pcm_16000',
];

export function validateTTSRequest(req: Request, res: Response, next: NextFunction): void {
  const { text, voiceId, modelId, stability, similarity, style, speed, outputFormat } = req.body || {};

  // 1. Text validation
  if (!text || typeof text !== 'string') {
    res.status(400).json({
      success: false,
      error: {
        code: 'EMPTY_TEXT',
        message: 'Text is required and must be a non-empty string.',
      },
    });
    return;
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    res.status(400).json({
      success: false,
      error: {
        code: 'EMPTY_TEXT',
        message: 'Text cannot be empty or only whitespace.',
      },
    });
    return;
  }

  if (trimmed.length > 5000) {
    res.status(400).json({
      success: false,
      error: {
        code: 'TEXT_TOO_LONG',
        message: `Text exceeds maximum allowed length of 5,000 characters (received ${trimmed.length} characters).`,
      },
    });
    return;
  }

  // 2. Voice ID validation
  if (!voiceId || typeof voiceId !== 'string' || voiceId.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_VOICE_ID',
        message: 'A valid voiceId string is required.',
      },
    });
    return;
  }

  // 3. Model ID validation (if provided)
  if (modelId && typeof modelId === 'string' && !ALLOWED_MODELS.includes(modelId)) {
    res.status(400).json({
      success: false,
      error: {
        code: 'UNSUPPORTED_MODEL',
        message: `Model '${modelId}' is not supported. Supported models: ${ALLOWED_MODELS.join(', ')}`,
      },
    });
    return;
  }

  // 4. Output format validation (if provided)
  if (outputFormat && typeof outputFormat === 'string' && !ALLOWED_FORMATS.includes(outputFormat)) {
    res.status(400).json({
      success: false,
      error: {
        code: 'UNSUPPORTED_FORMAT',
        message: `Output format '${outputFormat}' is not supported. Supported: ${ALLOWED_FORMATS.join(', ')}`,
      },
    });
    return;
  }

  // 5. Numeric ranges
  if (stability !== undefined) {
    const s = Number(stability);
    if (isNaN(s) || s < 0 || s > 1) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_NUMERIC_RANGE',
          message: 'Stability must be a number between 0.0 and 1.0.',
        },
      });
      return;
    }
  }

  if (similarity !== undefined) {
    const sim = Number(similarity);
    if (isNaN(sim) || sim < 0 || sim > 1) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_NUMERIC_RANGE',
          message: 'Similarity must be a number between 0.0 and 1.0.',
        },
      });
      return;
    }
  }

  if (style !== undefined) {
    const st = Number(style);
    if (isNaN(st) || st < 0 || st > 1) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_NUMERIC_RANGE',
          message: 'Style exaggeration must be a number between 0.0 and 1.0.',
        },
      });
      return;
    }
  }

  if (speed !== undefined) {
    const sp = Number(speed);
    if (isNaN(sp) || sp < 0.5 || sp > 2.0) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_NUMERIC_RANGE',
          message: 'Speed must be a number between 0.5 and 2.0.',
        },
      });
      return;
    }
  }

  next();
}
