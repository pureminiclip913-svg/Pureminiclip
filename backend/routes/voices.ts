import { Router } from 'express';
import { getVoices, getVoiceById, previewVoice, getVoicePreviewAudio } from '../controllers/voiceController.js';

const router = Router();

// GET /api/voices - List all available voices
router.get('/', getVoices);

// GET /api/voices/preview-audio/:voiceId - Stream audio preview for voice
router.get('/preview-audio/:voiceId', getVoicePreviewAudio);

// POST /api/voices/preview - Preview voice audio metadata
router.post('/preview', previewVoice);

// GET /api/voices/:voiceId - Get specific voice details
router.get('/:voiceId', getVoiceById);

export default router;
