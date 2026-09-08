import { Router } from 'express';
import { getGenerations, getGenerationById, deleteGeneration, clearAllGenerations } from '../controllers/generationController.js';

const router = Router();

// GET /api/generations - List user generations history
router.get('/', getGenerations);

// DELETE /api/generations - Clear all generations
router.delete('/', clearAllGenerations);

// GET /api/generations/:id - Get specific generation
router.get('/:id', getGenerationById);

// DELETE /api/generations/:id - Delete generation and file
router.delete('/:id', deleteGeneration);

export default router;
