import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction 
  ? path.join(process.cwd(), 'uploads')
  : path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'));
    }
  },
});

// 上传单张图片
router.post('/image', authMiddleware, upload.single('file'), (req: AuthRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择要上传的文件' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
  });
});

// 上传多个文件
router.post('/files', authMiddleware, upload.array('files', 10), (req: AuthRequest, res) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: '请选择要上传的文件' });
  }

  const files = (req.files as Express.Multer.File[]).map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    type: file.mimetype,
  }));

  res.json({ files });
});

// 上传资源文件
router.post('/resource', authMiddleware, upload.single('file'), (req: AuthRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择要上传的文件' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: formatFileSize(req.file.size),
    type: req.file.mimetype,
  });
});

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default router;
