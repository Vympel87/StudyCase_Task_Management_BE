import { Router } from 'express';
import authRoutes from './authRoute';
import projectRoutes from './projectRoute';
import taskRoutes from './taskRoute';
import userRoutes from './userRoute'; 

const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/projects', projectRoutes);
rootRouter.use('/tasks', taskRoutes);
rootRouter.use('/users', userRoutes);

export default rootRouter;
