import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import { taskSchema } from '../schemas/taskSchema';
import { ZodError } from 'zod';
import { Status } from './types';

export const createTask = async (req: Request, res: Response) => {
  const userId = req.user?.id; 
  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    taskSchema.parse(req.body);
    const { title, description, status, projectName } = req.body;

    const projectId = await getProjectIdByName(projectName);
    if (!projectId) return res.status(404).json({ error: 'Project not found' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status as Status,
        userId,
        projectId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    taskSchema.parse(req.body);
    const { title, description, status, projectName } = req.body;

    const projectId = await getProjectIdByName(projectName);
    if (!projectId) return res.status(404).json({ error: 'Project not found' });

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        userId,
        projectId,
      },
    });
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: true, project: true },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { user: true, project: true },
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

const getProjectIdByName = async (projectName: string) => {
  const project = await prisma.project.findFirst({
    where: { name: projectName },
  });
  return project ? project.id : null;
};
