import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../services/databaseService.js';
import { storageService } from '../services/storageService.js';

export async function getGenerations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const generations = await databaseService.getGenerations();
    res.status(200).json({
      success: true,
      count: generations.length,
      generations,
    });
  } catch (err) {
    next(err);
  }
}

export async function getGenerationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const generation = await databaseService.getGenerationById(id);

    if (!generation) {
      res.status(404).json({
        success: false,
        error: {
          code: 'GENERATION_NOT_FOUND',
          message: `Generation with ID '${id}' was not found.`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      generation,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteGeneration(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const generation = await databaseService.getGenerationById(id);

    if (!generation) {
      res.status(404).json({
        success: false,
        error: {
          code: 'GENERATION_NOT_FOUND',
          message: `Generation with ID '${id}' was not found.`,
        },
      });
      return;
    }

    // Delete audio file from storage
    if (generation.audioFileName) {
      await storageService.deleteAudio(generation.audioFileName);
    }

    await databaseService.deleteGeneration(id);

    res.status(200).json({
      success: true,
      message: 'Generation deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
}

export async function clearAllGenerations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const generations = await databaseService.getGenerations();
    for (const gen of generations) {
      if (gen.audioFileName) {
        await storageService.deleteAudio(gen.audioFileName);
      }
      await databaseService.deleteGeneration(gen.id);
    }
    res.status(200).json({
      success: true,
      message: 'All generations cleared.',
    });
  } catch (err) {
    next(err);
  }
}

