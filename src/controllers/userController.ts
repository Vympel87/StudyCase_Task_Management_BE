import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const avatar = req.file ? `/storages/images/${req.file.filename}` : undefined;

  console.log('Request File:', req.file);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatar,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: `Failed to create user: ${error.message}` });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const avatar = req.file ? `/storages/images/${req.file.filename}` : undefined;

  console.log('Request File:', req.file);

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        password: password ? await bcrypt.hash(password, 10) : undefined,
        avatar,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    if (user.avatar) {
      const filePath = path.join(__dirname, '../..', user.avatar);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete avatar:', err);
        }
      });
    }

    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
