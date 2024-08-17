import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getUserLogin, login, logout, register } from '../controllers/authController';

const authRoutes: Router = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/getUserLogin', authenticate, getUserLogin);
authRoutes.post('/logout', authenticate, logout);

export default authRoutes;
