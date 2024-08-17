import express, { Express } from 'express';
import dotenv from 'dotenv';
import rootRouter from './routes/rootRoute';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorMiddleware';
import path from 'path';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

app.use('/storage/images', express.static(path.join(__dirname, '../storage/images')));

app.use('/api', rootRouter);

app.use(errorHandler);

export default app;
