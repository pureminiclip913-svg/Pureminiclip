import { Router } from 'express';
import { getUsage, resetUsage } from '../controllers/usageController.js';

const router = Router();

// GET /api/usage - Retrieve usage and credit statistics
router.get('/', getUsage);

// POST /api/usage/reset - Replenish/reset studio character allowance
router.post('/reset', resetUsage);

export default router;
