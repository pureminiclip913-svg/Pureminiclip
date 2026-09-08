import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';

const router = Router();

// GET /api/projects - List projects
router.get('/', getProjects);

// POST /api/projects - Create project
router.post('/', createProject);

// GET /api/projects/:id - Get project
router.get('/:id', getProjectById);

// PUT /api/projects/:id - Update project
router.put('/:id', updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', deleteProject);

export default router;
