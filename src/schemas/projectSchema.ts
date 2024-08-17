import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  try {
    projectSchema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
