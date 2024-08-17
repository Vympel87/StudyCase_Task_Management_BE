import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  projectName: z.string().min(1, 'Project name is required'),
});

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    taskSchema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
