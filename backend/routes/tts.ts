import { Router } from 'express';
import { generateTTS, streamTTS } from '../controllers/ttsController.js';
import { validateTTSRequest } from '../middleware/validation.js';

const router = Router();

// POST /api/tts - Standard buffered TTS generation
router.post('/', validateTTSRequest, generateTTS);

// POST /api/tts/stream - Chunked streaming TTS synthesis
router.post('/stream', validateTTSRequest, streamTTS);

export default router;
