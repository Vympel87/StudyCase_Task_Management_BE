import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { validateUser } from '../schemas/userSchema';
import { authenticate } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const userRoutes: Router = Router();

userRoutes.post('/', authenticate, upload.single('avatar'), validateUser, createUser);
userRoutes.get('/', authenticate, getUsers);
userRoutes.get('/:id', authenticate, getUserById);
userRoutes.put('/:id', authenticate, upload.single('avatar'), validateUser, updateUser);
userRoutes.delete('/:id', authenticate, deleteUser);

export default userRoutes;
