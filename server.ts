import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import ttsRouter from './backend/routes/tts.js';
import voicesRouter from './backend/routes/voices.js';
import generationsRouter from './backend/routes/generations.js';
import projectsRouter from './backend/routes/projects.js';
import usageRouter from './backend/routes/usage.js';

import { storageService } from './backend/services/storageService.js';
import { ttsService } from './backend/services/ttsService.js';
import { rateLimiter } from './backend/middleware/rateLimit.js';
import { errorHandler } from './backend/middleware/errorHandler.js';
import { EnvLoader } from './backend/utils/envLoader.js';

dotenv.config();
EnvLoader.refreshEnv();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// CORS configuration dynamically driven by FRONTEND_URL
const configuredFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const configuredOrigins = configuredFrontendUrl
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const allAllowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultAllowedOrigins]));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from all origins (including null/sandboxed iframes, localhost, and *.run.app)
      callback(null, true);
    },
    credentials: false, // The app does not use cookies; disabling avoids browser CORS rejection when origin is null
    exposedHeaders: [
      'Content-Type',
      'Content-Disposition',
      'X-Voxia-Streaming',
      'X-Generation-Id',
      'X-Voice-Name',
      'X-Voice-Id',
      'X-Model-Id',
      'X-Character-Count',
      'X-Word-Count',
      'X-Duration-Seconds',
      'X-Audio-Format',
      'X-Download-Filename',
      'X-Voice-Fallback',
      'X-Voice-Fallback-Reason',
    ],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter);

// 1. Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const hasValidApiKey = Boolean(apiKey && apiKey.trim().length > 5 && apiKey !== 'MY_ELEVENLABS_API_KEY');
  const sarvamKey = process.env.SARVAM_API_KEY;
  const hasValidSarvamKey = Boolean(sarvamKey && sarvamKey.trim().length > 5 && sarvamKey !== 'MY_SARVAM_API_KEY');

  res.status(200).json({
    status: 'ok',
    service: 'VOXIA AI Audio Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    elevenlabsConfigured: hasValidApiKey,
    sarvamConfigured: hasValidSarvamKey,
    frontendUrl: configuredFrontendUrl,
    environment: process.env.NODE_ENV || 'development',
  });
});

// 2. Ephemeral in-memory audio serving with HTTP 206 Range support (zero disk dependencies)
app.get('/api/audio/:fileName', (req: Request, res: Response) => {
  const { fileName } = req.params;
  const safeFileName = path.basename(fileName);
  const cached = storageService.getAudioBuffer(safeFileName);

  if (!cached) {
    res.status(404).json({
      success: false,
      error: { code: 'AUDIO_NOT_FOUND', message: 'Audio file not found or session has expired.' },
    });
    return;
  }

  const { buffer, contentType } = cached;
  const fileSize = buffer.length;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const sliced = buffer.subarray(start, end + 1);

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    });
    res.end(sliced);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(buffer);
  }
});

// 3. API key validation/test endpoint
app.post('/api/settings/test-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body || {};
  const keyToTest = apiKey || process.env.ELEVENLABS_API_KEY;

  if (!keyToTest || keyToTest.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: 'No API key provided to test.',
    });
    return;
  }

  try {
    const checkRes = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
      headers: { 'xi-api-key': keyToTest.trim() },
    });

    if (checkRes.ok) {
      const data = await checkRes.json() as any;
      res.status(200).json({
        success: true,
        valid: true,
        tier: data.tier || 'active',
        characterLimit: data.character_limit,
        characterCount: data.character_count,
        status: data.status,
      });
    } else {
      res.status(checkRes.status).json({
        success: false,
        valid: false,
        message: 'Invalid API key or unauthorized by ElevenLabs.',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      valid: false,
      message: err?.message || 'Failed to reach ElevenLabs API.',
    });
  }
});

// 4. Sarvam AI key validation/test endpoint
app.post('/api/settings/test-sarvam-key', async (req: Request, res: Response) => {
  EnvLoader.refreshEnv();
  const { apiKey, save } = req.body || {};
  const keyToTest = (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 0)
    ? apiKey.trim()
    : process.env.SARVAM_API_KEY;

  if (!keyToTest || keyToTest.trim().length === 0) {
    res.status(200).json({
      success: false,
      valid: false,
      message: 'No Sarvam AI API key configured in server environment.',
    });
    return;
  }

  try {
    const checkRes = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': keyToTest.trim(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'नमस्ते',
        language_code: 'hi-IN',
        model: 'bulbul:v3',
        speaker: 'shubh',
      }),
    });

    if (checkRes.ok) {
      if (save) {
        EnvLoader.saveKey('SARVAM_API_KEY', keyToTest.trim());
      }
      res.status(200).json({
        success: true,
        valid: true,
        model: 'bulbul:v3',
        provider: 'Sarvam AI',
        status: 'active',
        supportedLanguages: ['hi-IN', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN', 'od-IN'],
        message: 'Sarvam AI connected! Original Bulbul v3 model voices are active.',
      });
    } else {
      const errorText = await checkRes.text();
      let isQuotaExceeded = false;
      let friendlyMessage = 'Invalid API key or unauthorized by Sarvam AI.';
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.error?.code === 'insufficient_quota_error' || checkRes.status === 402) {
          isQuotaExceeded = true;
          friendlyMessage = 'Sarvam AI account has 0 credits remaining (quota exhausted). Please recharge credits at sarvam.ai.';
        } else if (parsed?.error?.message) {
          friendlyMessage = parsed.error.message;
        }
      } catch {
        if (errorText) friendlyMessage = errorText.slice(0, 120);
      }

      if (save) {
        EnvLoader.saveKey('SARVAM_API_KEY', keyToTest.trim());
      }

      res.status(200).json({
        success: false,
        valid: false,
        quotaExceeded: isQuotaExceeded,
        status: checkRes.status,
        message: friendlyMessage,
      });
    }
  } catch (err: any) {
    res.status(200).json({
      success: false,
      valid: false,
      message: err?.message || 'Failed to connect to Sarvam AI API.',
    });
  }
});

// 5. Save Sarvam AI key endpoint
app.post('/api/settings/save-sarvam-key', async (req: Request, res: Response) => {
  const { apiKey } = req.body || {};
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    res.status(400).json({ success: false, message: 'A non-empty Sarvam API key is required.' });
    return;
  }
  const cleanKey = apiKey.trim();

  try {
    const checkRes = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': cleanKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'नमस्ते',
        language_code: 'hi-IN',
        model: 'bulbul:v3',
        speaker: 'shubh',
      }),
    });

    if (checkRes.ok) {
      EnvLoader.saveKey('SARVAM_API_KEY', cleanKey);
      res.status(200).json({
        success: true,
        valid: true,
        quotaExceeded: false,
        message: 'New Sarvam AI key saved and verified! Original Bulbul v3 voices are active.',
      });
      return;
    }

    const errorText = await checkRes.text();
    let isQuota = checkRes.status === 402;
    let msg = errorText;
    try {
      const parsed = JSON.parse(errorText);
      msg = parsed?.error?.message || parsed?.message || errorText;
      if (parsed?.error?.code === 'insufficient_quota_error' || isQuota) {
        isQuota = true;
      }
    } catch {}

    EnvLoader.saveKey('SARVAM_API_KEY', cleanKey);

    res.status(200).json({
      success: true,
      valid: false,
      quotaExceeded: isQuota,
      message: isQuota
        ? 'Key saved, but Sarvam reports 0 credits remaining. Please recharge your Sarvam credits.'
        : `Key saved with Sarvam status (${checkRes.status}): ${msg}`,
    });
  } catch (err: any) {
    EnvLoader.saveKey('SARVAM_API_KEY', cleanKey);
    res.status(200).json({
      success: true,
      valid: false,
      message: `Key saved, but could not verify with Sarvam AI: ${err.message}`,
    });
  }
});

// 5. Mount core API routes
app.use('/api/tts', ttsRouter);
app.use('/api/voices', voicesRouter);
app.use('/api/generations', generationsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/usage', usageRouter);

// Centralized error handler for API routes
app.use('/api', errorHandler);

// 5. Mount Vite middleware for development or serve dist in production
async function setupFrontend() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupFrontend().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`[VOXIA AI] Engine running on http://${HOST}:${PORT}`);
  });
});
