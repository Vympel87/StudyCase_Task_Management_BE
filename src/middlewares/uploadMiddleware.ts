import multer, { MulterError } from 'multer';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const dir = path.join(__dirname, '.././storages/images');
    fs.exists(dir, (exists) => {
      if (!exists) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    });
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req: Request, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!') as any, false);
    }
    cb(null, true);
  }
});

export const multerErrorHandler = (err: any, req: Request, res: Response, next: Function) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 5 MB limit.' });
    }
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: `Error: ${err.message}` });
  }
  next();
};

export default upload;
