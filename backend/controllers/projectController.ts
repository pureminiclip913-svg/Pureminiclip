import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../services/databaseService.js';

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await databaseService.getProjects();
    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const project = await databaseService.getProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: `Project with ID '${id}' was not found.`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, text, voiceId, modelId, settings } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PROJECT_NAME',
          message: 'A valid project name is required.',
        },
      });
      return;
    }

    const newProject = await databaseService.createProject({
      name: name.trim(),
      description: description || '',
      text: text || '',
      voiceId: voiceId || '21m00Tcm4TlvDq8ikWAM',
      modelId: modelId || 'eleven_multilingual_v2',
      settings: settings || {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        speed: 1.0,
        use_speaker_boost: true,
      },
    });

    res.status(201).json({
      success: true,
      project: newProject,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const updated = await databaseService.updateProject(id, updates);
    if (!updated) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: `Project with ID '${id}' was not found.`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      project: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await databaseService.deleteProject(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: `Project with ID '${id}' was not found.`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
}
