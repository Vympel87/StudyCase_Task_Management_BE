import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../internal';
import bcrypt from 'bcrypt';
import prisma from '../utils/prismaClient';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  
  res.json({ token });
};

export const getUserLogin = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ email: user.email, id: user.id });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, password_confirmation, username } = req.body;

  if (password !== password_confirmation) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  res.status(201).json({ user });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    await prisma.revokedToken.create({
      data: {
        token
      }
    });
  }
  res.status(200).json({ message: 'Logged out successfully' });
};