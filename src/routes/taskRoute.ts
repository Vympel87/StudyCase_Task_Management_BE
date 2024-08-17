import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateTask } from '../schemas/taskSchema';

const taskRoutes: Router = Router();

taskRoutes.post('/', authenticate, validateTask, createTask);
taskRoutes.get('/', authenticate, getTasks);
taskRoutes.get('/:id', authenticate, getTaskById);
taskRoutes.put('/:id', authenticate, validateTask, updateTask);
taskRoutes.delete('/:id', authenticate, deleteTask);

export default taskRoutes;
