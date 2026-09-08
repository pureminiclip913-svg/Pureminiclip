import { Router } from 'express';
import { getUsage } from '../controllers/usageController.js';

const router = Router();

// GET /api/usage - Retrieve usage and credit statistics
router.get('/', getUsage);

export default router;
