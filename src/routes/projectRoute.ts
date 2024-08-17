import { Router } from 'express';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateProject } from '../schemas/projectSchema';

const projectRoutes: Router = Router();

projectRoutes.post('/', authenticate, validateProject, createProject);
projectRoutes.get('/', authenticate, getProjects);
projectRoutes.get('/:id', authenticate, getProjectById);
projectRoutes.put('/:id', authenticate, validateProject, updateProject);
projectRoutes.delete('/:id', authenticate, deleteProject);

export default projectRoutes;
