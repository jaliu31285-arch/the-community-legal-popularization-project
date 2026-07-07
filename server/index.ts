import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import uploadRoutes from './routes/upload';
import './models/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = isProduction 
  ? path.join(process.cwd(), 'uploads')
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '法润青苗后台服务运行正常' });
});

// 前端静态文件
app.use(express.static(path.join(__dirname, '../dist')));

// 处理 SPA 路由
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || '服务器内部错误' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 法润青苗后台服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🌐 外网访问: http://${os.hostname()}:${PORT}`);
  console.log(`🔐 默认管理员: admin / admin123`);
  console.log(`📁 上传目录: ${path.join(__dirname, 'uploads')}`);
});

export default app;
