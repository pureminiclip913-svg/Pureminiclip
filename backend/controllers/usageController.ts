import { Request, Response, NextFunction } from 'express';
import { usageService } from '../services/usageService.js';

export async function getUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const usage = await usageService.getUsage();
    res.status(200).json({
      success: true,
      usage,
    });
  } catch (err) {
    next(err);
  }
}

export async function resetUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const usage = await usageService.resetUsage();
    res.status(200).json({
      success: true,
      usage,
      message: 'Studio character quota replenished to 100,000 characters.',
    });
  } catch (err) {
    next(err);
  }
}
