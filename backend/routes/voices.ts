import { Router } from 'express';
import { getVoices, getVoiceById, previewVoice } from '../controllers/voiceController.js';

const router = Router();

// GET /api/voices - List all available voices
router.get('/', getVoices);

// POST /api/voices/preview - Preview voice audio
router.post('/preview', previewVoice);

// GET /api/voices/:voiceId - Get specific voice details
router.get('/:voiceId', getVoiceById);

export default router;
