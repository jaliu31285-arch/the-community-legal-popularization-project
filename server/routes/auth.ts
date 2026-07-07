import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../models/db';
import { generateToken, AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username) as any;

  if (!admin) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  const isValidPassword = bcrypt.compareSync(password, admin.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  const token = generateToken({
    id: admin.id,
    username: admin.username,
    role: admin.role,
  });

  res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    },
  });
});

// 获取当前管理员信息
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  const admin = db.prepare('SELECT id, username, name, role FROM admins WHERE id = ?').get(req.admin!.id) as any;
  
  if (!admin) {
    return res.status(404).json({ message: '管理员不存在' });
  }

  res.json(admin);
});

// 修改密码
router.put('/password', authMiddleware, (req: AuthRequest, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: '旧密码和新密码不能为空' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: '新密码长度至少6位' });
  }

  const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin!.id) as any;

  if (!admin) {
    return res.status(404).json({ message: '管理员不存在' });
  }

  const isValidPassword = bcrypt.compareSync(oldPassword, admin.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: '旧密码错误' });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hashedPassword, req.admin!.id);

  res.json({ message: '密码修改成功' });
});

export default router;
