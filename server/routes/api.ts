import { Router, Request, Response } from 'express';
import db from '../models/db';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router();

// ============ 轮播图管理 ============
router.get('/banners', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM banners';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id DESC';
  const banners = db.prepare(sql).all();
  res.json(banners);
});

router.get('/banners/:id', (req: Request, res: Response) => {
  const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: '轮播图不存在' });
  }
  res.json(banner);
});

router.post('/banners', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, subtitle, description, image_url, gradient, sort_order, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ message: '标题不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO banners (title, subtitle, description, image_url, gradient, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    subtitle || '',
    description || '',
    image_url || '',
    gradient || 'from-blue-600 via-blue-500 to-cyan-400',
    sort_order || 0,
    is_active ?? 1
  );
  const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(banner);
});

router.put('/banners/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, subtitle, description, image_url, gradient, sort_order, is_active } = req.body;
  const existing = db.prepare('SELECT * FROM banners WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '轮播图不存在' });
  }
  db.prepare(`
    UPDATE banners SET 
      title = COALESCE(?, title),
      subtitle = COALESCE(?, subtitle),
      description = COALESCE(?, description),
      image_url = COALESCE(?, image_url),
      gradient = COALESCE(?, gradient),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    subtitle ?? null,
    description ?? null,
    image_url ?? null,
    gradient ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const banner = db.prepare('SELECT * FROM banners WHERE id = ?').get(req.params.id);
  res.json(banner);
});

router.delete('/banners/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '轮播图不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 新闻动态管理 ============
router.get('/news', (req: Request, res: Response) => {
  const { all, category } = req.query;
  let sql = 'SELECT * FROM news WHERE 1=1';
  const params: unknown[] = [];
  if (all !== 'true') {
    sql += ' AND is_active = 1';
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY date DESC, id DESC';
  const news = db.prepare(sql).all(...params);
  res.json(news);
});

router.get('/news/:id', (req: Request, res: Response) => {
  const newsItem = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  if (!newsItem) {
    return res.status(404).json({ message: '新闻不存在' });
  }
  res.json(newsItem);
});

router.post('/news', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, content, summary, category, date, image_url, link_url, content_type, file_url, sort_order, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ message: '标题不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO news (title, content, summary, category, date, image_url, link_url, content_type, file_url, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    content || '',
    summary || '',
    category || '活动动态',
    date || new Date().toISOString().split('T')[0],
    image_url || '',
    link_url || '',
    content_type || 'text',
    file_url || '',
    sort_order || 0,
    is_active ?? 1
  );
  const newsItem = db.prepare('SELECT * FROM news WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newsItem);
});

router.put('/news/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '新闻不存在' });
  }
  const { title, content, summary, category, date, image_url, link_url, content_type, file_url, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE news SET 
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      summary = COALESCE(?, summary),
      category = COALESCE(?, category),
      date = COALESCE(?, date),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      content_type = COALESCE(?, content_type),
      file_url = COALESCE(?, file_url),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    content ?? null,
    summary ?? null,
    category ?? null,
    date ?? null,
    image_url ?? null,
    link_url ?? null,
    content_type ?? null,
    file_url ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const newsItem = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
  res.json(newsItem);
});

router.delete('/news/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '新闻不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 活动管理 ============
router.get('/activities', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM activities';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY day ASC, sort_order ASC';
  const activities = db.prepare(sql).all() as Array<{ highlights?: string | null; schedule?: string | null; [key: string]: unknown }>;
  res.json(activities.map((a) => ({
    ...a,
    highlights: a.highlights ? JSON.parse(a.highlights) : [],
    schedule: a.schedule ? JSON.parse(a.schedule) : [],
  })));
});

router.get('/activities/:id', (req: Request, res: Response) => {
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id) as { highlights?: string | null; schedule?: string | null; [key: string]: unknown } | undefined;
  if (!activity) {
    return res.status(404).json({ message: '活动不存在' });
  }
  res.json({
    ...activity,
    highlights: activity.highlights ? JSON.parse(activity.highlights) : [],
    schedule: activity.schedule ? JSON.parse(activity.schedule) : [],
  });
});

router.post('/activities', authMiddleware, (req: AuthRequest, res: Response) => {
  const { day, date, title, description, highlights, schedule, image_url, link_url, sort_order, is_active } = req.body;
  if (!title || day === undefined) {
    return res.status(400).json({ message: '标题和天数不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO activities (day, date, title, description, highlights, schedule, image_url, link_url, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    day,
    date || '',
    title,
    description || '',
    JSON.stringify(highlights || []),
    JSON.stringify(schedule || []),
    image_url || '',
    link_url || '',
    sort_order || 0,
    is_active ?? 1
  );
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid) as { highlights?: string | null; schedule?: string | null; [key: string]: unknown };
  res.status(201).json({
    ...activity,
    highlights: activity.highlights ? JSON.parse(activity.highlights) : [],
    schedule: activity.schedule ? JSON.parse(activity.schedule) : [],
  });
});

router.put('/activities/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '活动不存在' });
  }
  const { day, date, title, description, highlights, schedule, image_url, link_url, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE activities SET 
      day = COALESCE(?, day),
      date = COALESCE(?, date),
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      highlights = COALESCE(?, highlights),
      schedule = COALESCE(?, schedule),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    day ?? null,
    date ?? null,
    title ?? null,
    description ?? null,
    highlights ? JSON.stringify(highlights) : null,
    schedule ? JSON.stringify(schedule) : null,
    image_url ?? null,
    link_url ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id) as { highlights?: string | null; schedule?: string | null; [key: string]: unknown };
  res.json({
    ...activity,
    highlights: activity.highlights ? JSON.parse(activity.highlights) : [],
    schedule: activity.schedule ? JSON.parse(activity.schedule) : [],
  });
});

router.delete('/activities/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '活动不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 资源管理 ============
router.get('/resources', (req: Request, res: Response) => {
  const { all, category, type } = req.query;
  let sql = 'SELECT * FROM resources WHERE 1=1';
  const params: unknown[] = [];
  if (all !== 'true') {
    sql += ' AND is_active = 1';
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }
  sql += ' ORDER BY sort_order ASC, id DESC';
  const resources = db.prepare(sql).all(...params);
  res.json(resources);
});

router.get('/resources/:id', (req: Request, res: Response) => {
  const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
  if (!resource) {
    return res.status(404).json({ message: '资源不存在' });
  }
  res.json(resource);
});

router.post('/resources', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, category, type, description, file_url, file_size, cover_color, image_url, link_url, sort_order, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ message: '标题不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO resources (title, category, type, description, file_url, file_size, cover_color, image_url, link_url, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    category || '科普读物',
    type || 'pdf',
    description || '',
    file_url || '',
    file_size || '',
    cover_color || 'from-blue-500 to-blue-600',
    image_url || '',
    link_url || '',
    sort_order || 0,
    is_active ?? 1
  );
  const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(resource);
});

router.put('/resources/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '资源不存在' });
  }
  const { title, category, type, description, file_url, file_size, cover_color, image_url, link_url, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE resources SET 
      title = COALESCE(?, title),
      category = COALESCE(?, category),
      type = COALESCE(?, type),
      description = COALESCE(?, description),
      file_url = COALESCE(?, file_url),
      file_size = COALESCE(?, file_size),
      cover_color = COALESCE(?, cover_color),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    category ?? null,
    type ?? null,
    description ?? null,
    file_url ?? null,
    file_size ?? null,
    cover_color ?? null,
    image_url ?? null,
    link_url ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
  res.json(resource);
});

router.delete('/resources/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM resources WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '资源不存在' });
  }
  res.json({ message: '删除成功' });
});

router.post('/resources/:id/download', (req: Request, res: Response) => {
  db.prepare('UPDATE resources SET download_count = download_count + 1 WHERE id = ?').run(req.params.id);
  res.json({ message: '成功' });
});

// ============ 团队成员管理 ============
router.get('/team', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM team_members';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const team = db.prepare(sql).all();
  res.json(team);
});

router.get('/team/:id', (req: Request, res: Response) => {
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ message: '成员不存在' });
  }
  res.json(member);
});

router.post('/team', authMiddleware, (req: AuthRequest, res: Response) => {
  const { name, role, avatar, description, sort_order, is_active } = req.body;
  if (!name) {
    return res.status(400).json({ message: '姓名不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO team_members (name, role, avatar, description, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name,
    role || '',
    avatar || '👨‍🎓',
    description || '',
    sort_order || 0,
    is_active ?? 1
  );
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(member);
});

router.put('/team/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '成员不存在' });
  }
  const { name, role, avatar, description, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE team_members SET 
      name = COALESCE(?, name),
      role = COALESCE(?, role),
      avatar = COALESCE(?, avatar),
      description = COALESCE(?, description),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    name ?? null,
    role ?? null,
    avatar ?? null,
    description ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  res.json(member);
});

router.delete('/team/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '成员不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 成果展示管理 ============
router.get('/achievements', (req: Request, res: Response) => {
  const { all, type } = req.query;
  let sql = 'SELECT * FROM achievements WHERE 1=1';
  const params: unknown[] = [];
  if (all !== 'true') {
    sql += ' AND is_active = 1';
  }
  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }
  sql += ' ORDER BY sort_order ASC, id DESC';
  const achievements = db.prepare(sql).all(...params);
  res.json(achievements);
});

router.get('/achievements/:id', (req: Request, res: Response) => {
  const achievement = db.prepare('SELECT * FROM achievements WHERE id = ?').get(req.params.id);
  if (!achievement) {
    return res.status(404).json({ message: '成果不存在' });
  }
  res.json(achievement);
});

router.post('/achievements', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, type, value, description, image_url, link_url, sort_order, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ message: '标题不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO achievements (title, type, value, description, image_url, link_url, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    type || 'report',
    value || '',
    description || '',
    image_url || '',
    link_url || '',
    sort_order || 0,
    is_active ?? 1
  );
  const achievement = db.prepare('SELECT * FROM achievements WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(achievement);
});

router.put('/achievements/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM achievements WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '成果不存在' });
  }
  const { title, type, value, description, image_url, link_url, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE achievements SET 
      title = COALESCE(?, title),
      type = COALESCE(?, type),
      value = COALESCE(?, value),
      description = COALESCE(?, description),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    type ?? null,
    value ?? null,
    description ?? null,
    image_url ?? null,
    link_url ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const achievement = db.prepare('SELECT * FROM achievements WHERE id = ?').get(req.params.id);
  res.json(achievement);
});

router.delete('/achievements/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM achievements WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '成果不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 普法专题管理 ============
router.get('/topics', (req: Request, res: Response) => {
  const { all, category } = req.query;
  let sql = 'SELECT * FROM topics WHERE 1=1';
  const params: unknown[] = [];
  if (all !== 'true') {
    sql += ' AND is_active = 1';
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const topics = db.prepare(sql).all(...params);
  res.json(topics);
});

router.get('/topics/:id', (req: Request, res: Response) => {
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(req.params.id);
  if (!topic) {
    return res.status(404).json({ message: '专题不存在' });
  }
  res.json(topic);
});

router.post('/topics', authMiddleware, (req: AuthRequest, res: Response) => {
  const { category, title, content, type, icon, color, sort_order, is_active } = req.body;
  if (!category || !title) {
    return res.status(400).json({ message: '分类和标题不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO topics (category, title, content, type, icon, color, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    category,
    title,
    content || '',
    type || 'knowledge',
    icon || '',
    color || '',
    sort_order || 0,
    is_active ?? 1
  );
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(topic);
});

router.put('/topics/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM topics WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '专题不存在' });
  }
  const { category, title, content, type, icon, color, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE topics SET 
      category = COALESCE(?, category),
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      type = COALESCE(?, type),
      icon = COALESCE(?, icon),
      color = COALESCE(?, color),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    category ?? null,
    title ?? null,
    content ?? null,
    type ?? null,
    icon ?? null,
    color ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(req.params.id);
  res.json(topic);
});

router.delete('/topics/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM topics WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '专题不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 指导老师管理 ============
router.get('/advisors', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM advisors';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const advisors = db.prepare(sql).all();
  res.json(advisors);
});

router.get('/advisors/:id', (req: Request, res: Response) => {
  const advisor = db.prepare('SELECT * FROM advisors WHERE id = ?').get(req.params.id);
  if (!advisor) {
    return res.status(404).json({ message: '指导老师不存在' });
  }
  res.json(advisor);
});

router.post('/advisors', authMiddleware, (req: AuthRequest, res: Response) => {
  const { name, title, department, avatar, description, sort_order, is_active } = req.body;
  if (!name) {
    return res.status(400).json({ message: '姓名不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO advisors (name, title, department, avatar, description, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    title || '',
    department || '',
    avatar || '👨‍🏫',
    description || '',
    sort_order || 0,
    is_active ?? 1
  );
  const advisor = db.prepare('SELECT * FROM advisors WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(advisor);
});

router.put('/advisors/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM advisors WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '指导老师不存在' });
  }
  const { name, title, department, avatar, description, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE advisors SET 
      name = COALESCE(?, name),
      title = COALESCE(?, title),
      department = COALESCE(?, department),
      avatar = COALESCE(?, avatar),
      description = COALESCE(?, description),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    name ?? null,
    title ?? null,
    department ?? null,
    avatar ?? null,
    description ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const advisor = db.prepare('SELECT * FROM advisors WHERE id = ?').get(req.params.id);
  res.json(advisor);
});

router.delete('/advisors/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM advisors WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '指导老师不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 合作单位管理 ============
router.get('/partners', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM partners';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const partners = db.prepare(sql).all();
  res.json(partners);
});

router.get('/partners/:id', (req: Request, res: Response) => {
  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
  if (!partner) {
    return res.status(404).json({ message: '合作单位不存在' });
  }
  res.json(partner);
});

router.post('/partners', authMiddleware, (req: AuthRequest, res: Response) => {
  const { name, type, description, logo_url, sort_order, is_active } = req.body;
  if (!name) {
    return res.status(400).json({ message: '名称不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO partners (name, type, description, logo_url, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    name,
    type || '',
    description || '',
    logo_url || '',
    sort_order || 0,
    is_active ?? 1
  );
  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(partner);
});

router.put('/partners/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '合作单位不存在' });
  }
  const { name, type, description, logo_url, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE partners SET 
      name = COALESCE(?, name),
      type = COALESCE(?, type),
      description = COALESCE(?, description),
      logo_url = COALESCE(?, logo_url),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    name ?? null,
    type ?? null,
    description ?? null,
    logo_url ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
  res.json(partner);
});

router.delete('/partners/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '合作单位不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 统计数据管理 ============
router.get('/stats/home', (req: Request, res: Response) => {
  const stats = db.prepare('SELECT * FROM stats WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all();
  res.json(stats);
});

router.get('/stats/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const stats = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC, id ASC').all();
  res.json(stats);
});

router.get('/stats', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM stats';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const stats = db.prepare(sql).all();
  res.json(stats);
});

router.get('/stats/:id', (req: Request, res: Response) => {
  const stat = db.prepare('SELECT * FROM stats WHERE id = ?').get(req.params.id);
  if (!stat) {
    return res.status(404).json({ message: '统计数据不存在' });
  }
  res.json(stat);
});

router.post('/stats', authMiddleware, (req: AuthRequest, res: Response) => {
  const { label, value, icon, color, sort_order, is_active } = req.body;
  if (!label || !value) {
    return res.status(400).json({ message: '标签和数值不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO stats (label, value, icon, color, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    label,
    value,
    icon || '',
    color || '',
    sort_order || 0,
    is_active ?? 1
  );
  const stat = db.prepare('SELECT * FROM stats WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(stat);
});

router.put('/stats/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM stats WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '统计数据不存在' });
  }
  const { label, value, icon, color, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE stats SET 
      label = COALESCE(?, label),
      value = COALESCE(?, value),
      icon = COALESCE(?, icon),
      color = COALESCE(?, color),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    label ?? null,
    value ?? null,
    icon ?? null,
    color ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const stat = db.prepare('SELECT * FROM stats WHERE id = ?').get(req.params.id);
  res.json(stat);
});

router.delete('/stats/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM stats WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '统计数据不存在' });
  }
  res.json({ message: '删除成功' });
});

router.get('/stats/dashboard', authMiddleware, (req: AuthRequest, res: Response) => {
  const bannerCount = db.prepare('SELECT COUNT(*) as count FROM banners').get() as { count: number };
  const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
  const activityCount = db.prepare('SELECT COUNT(*) as count FROM activities').get() as { count: number };
  const resourceCount = db.prepare('SELECT COUNT(*) as count FROM resources').get() as { count: number };
  const teamCount = db.prepare('SELECT COUNT(*) as count FROM team_members').get() as { count: number };
  const achievementCount = db.prepare('SELECT COUNT(*) as count FROM achievements').get() as { count: number };
  const totalDownloads = db.prepare('SELECT COALESCE(SUM(download_count), 0) as total FROM resources').get() as { total: number };
  res.json({
    banners: bannerCount.count,
    news: newsCount.count,
    activities: activityCount.count,
    resources: resourceCount.count,
    team: teamCount.count,
    achievements: achievementCount.count,
    totalDownloads: totalDownloads.total,
  });
});

// ============ 站点设置管理 ============
router.get('/settings', (req: Request, res: Response) => {
  const settings = db.prepare('SELECT setting_key, setting_value FROM site_settings').all();
  const result: Record<string, string | null> = {};
  for (const s of settings as Array<{ setting_key: string; setting_value: string | null }>) {
    result[s.setting_key] = s.setting_value;
  }
  res.json(result);
});

router.get('/settings/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const settings = db.prepare('SELECT * FROM site_settings ORDER BY id ASC').all();
  res.json(settings);
});

router.put('/settings', authMiddleware, (req: AuthRequest, res: Response) => {
  const settings = req.body;
  if (typeof settings !== 'object' || settings === null) {
    return res.status(400).json({ message: '设置数据格式错误' });
  }
  const stmt = db.prepare(`
    INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
    VALUES (?, ?, 'text', '')
    ON CONFLICT(setting_key) DO UPDATE SET 
      setting_value = excluded.setting_value,
      updated_at = CURRENT_TIMESTAMP
  `);
  const transaction = db.transaction((items: Array<{ key: string; value: string }>) => {
    for (const item of items) {
      stmt.run(item.key, item.value);
    }
  });
  const items = Object.entries(settings).map(([key, value]) => ({ key, value: value as string }));
  transaction(items);
  res.json({ message: '设置保存成功' });
});

// ============ 导航菜单管理 ============
router.get('/nav', (req: Request, res: Response) => {
  const navItems = db.prepare('SELECT * FROM nav_items WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all();
  res.json(navItems);
});

router.get('/nav/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const navItems = db.prepare('SELECT * FROM nav_items ORDER BY sort_order ASC, id ASC').all();
  res.json(navItems);
});

router.get('/nav/:id', (req: Request, res: Response) => {
  const navItem = db.prepare('SELECT * FROM nav_items WHERE id = ?').get(req.params.id);
  if (!navItem) {
    return res.status(404).json({ message: '导航项不存在' });
  }
  res.json(navItem);
});

router.post('/nav', authMiddleware, (req: AuthRequest, res: Response) => {
  const { label, path, parent_id, sort_order, is_active } = req.body;
  if (!label || !path) {
    return res.status(400).json({ message: '名称和路径不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO nav_items (label, path, parent_id, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    label,
    path,
    parent_id || 0,
    sort_order || 0,
    is_active ?? 1
  );
  const navItem = db.prepare('SELECT * FROM nav_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(navItem);
});

router.put('/nav/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM nav_items WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '导航项不存在' });
  }
  const { label, path, parent_id, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE nav_items SET 
      label = COALESCE(?, label),
      path = COALESCE(?, path),
      parent_id = COALESCE(?, parent_id),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    label ?? null,
    path ?? null,
    parent_id ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const navItem = db.prepare('SELECT * FROM nav_items WHERE id = ?').get(req.params.id);
  res.json(navItem);
});

router.delete('/nav/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM nav_items WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '导航项不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 公告管理 ============
router.get('/announcements', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM announcements';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY is_sticky DESC, sort_order ASC, date DESC, id DESC';
  const announcements = db.prepare(sql).all();
  res.json(announcements);
});

router.get('/announcements/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const announcements = db.prepare('SELECT * FROM announcements ORDER BY is_sticky DESC, sort_order ASC, date DESC, id DESC').all();
  res.json(announcements);
});

router.get('/announcements/:id', (req: Request, res: Response) => {
  const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ message: '公告不存在' });
  }
  res.json(announcement);
});

router.post('/announcements', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, content, date, image_url, link_url, content_type, is_sticky, sort_order, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ message: '标题不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO announcements (title, content, date, image_url, link_url, content_type, is_sticky, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    content || '',
    date || new Date().toISOString().split('T')[0],
    image_url || '',
    link_url || '',
    content_type || 'text',
    is_sticky ?? 0,
    sort_order || 0,
    is_active ?? 1
  );
  const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(announcement);
});

router.put('/announcements/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '公告不存在' });
  }
  const { title, content, date, image_url, link_url, content_type, is_sticky, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE announcements SET 
      title = COALESCE(?, title),
      content = COALESCE(?, content),
      date = COALESCE(?, date),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      content_type = COALESCE(?, content_type),
      is_sticky = COALESCE(?, is_sticky),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    content ?? null,
    date ?? null,
    image_url ?? null,
    link_url ?? null,
    content_type ?? null,
    is_sticky ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
  res.json(announcement);
});

router.delete('/announcements/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '公告不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 快速链接管理 ============
router.get('/quick-links', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM quick_links';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const quickLinks = db.prepare(sql).all();
  res.json(quickLinks);
});

router.get('/quick-links/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const quickLinks = db.prepare('SELECT * FROM quick_links ORDER BY sort_order ASC, id ASC').all();
  res.json(quickLinks);
});

router.get('/quick-links/:id', (req: Request, res: Response) => {
  const quickLink = db.prepare('SELECT * FROM quick_links WHERE id = ?').get(req.params.id);
  if (!quickLink) {
    return res.status(404).json({ message: '快速链接不存在' });
  }
  res.json(quickLink);
});

router.post('/quick-links', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, link_url, icon, sort_order, is_active } = req.body;
  if (!title || !link_url) {
    return res.status(400).json({ message: '标题和链接不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO quick_links (title, link_url, icon, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    title,
    link_url,
    icon || '',
    sort_order || 0,
    is_active ?? 1
  );
  const quickLink = db.prepare('SELECT * FROM quick_links WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(quickLink);
});

router.put('/quick-links/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM quick_links WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '快速链接不存在' });
  }
  const { title, link_url, icon, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE quick_links SET 
      title = COALESCE(?, title),
      link_url = COALESCE(?, link_url),
      icon = COALESCE(?, icon),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    link_url ?? null,
    icon ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const quickLink = db.prepare('SELECT * FROM quick_links WHERE id = ?').get(req.params.id);
  res.json(quickLink);
});

router.delete('/quick-links/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM quick_links WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '快速链接不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 页脚区块管理 ============
router.get('/footer-sections', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM footer_sections';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const sections = db.prepare(sql).all() as Array<{ content?: string | null; section_type?: string; [key: string]: unknown }>;
  res.json(sections.map((s) => ({
    ...s,
    content: s.content ? JSON.parse(s.content) : null,
  })));
});

router.get('/footer-sections/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const sections = db.prepare('SELECT * FROM footer_sections ORDER BY sort_order ASC, id ASC').all() as Array<{ content?: string | null; section_type?: string; [key: string]: unknown }>;
  res.json(sections.map((s) => ({
    ...s,
    content: s.content ? JSON.parse(s.content) : null,
  })));
});

router.get('/footer-sections/:id', (req: Request, res: Response) => {
  const section = db.prepare('SELECT * FROM footer_sections WHERE id = ?').get(req.params.id) as { content?: string | null; section_type?: string; [key: string]: unknown } | undefined;
  if (!section) {
    return res.status(404).json({ message: '页脚区块不存在' });
  }
  res.json({
    ...section,
    content: section.content ? JSON.parse(section.content) : null,
  });
});

router.post('/footer-sections', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, section_type, content, sort_order, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ message: '标题不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO footer_sections (title, section_type, content, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    title,
    section_type || 'links',
    content ? JSON.stringify(content) : '',
    sort_order || 0,
    is_active ?? 1
  );
  const section = db.prepare('SELECT * FROM footer_sections WHERE id = ?').get(result.lastInsertRowid) as { content?: string | null; section_type?: string; [key: string]: unknown };
  res.status(201).json({
    ...section,
    content: section.content ? JSON.parse(section.content) : null,
  });
});

router.put('/footer-sections/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM footer_sections WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '页脚区块不存在' });
  }
  const { title, section_type, content, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE footer_sections SET 
      title = COALESCE(?, title),
      section_type = COALESCE(?, section_type),
      content = COALESCE(?, content),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    section_type ?? null,
    content ? JSON.stringify(content) : null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const section = db.prepare('SELECT * FROM footer_sections WHERE id = ?').get(req.params.id) as { content?: string | null; section_type?: string; [key: string]: unknown };
  res.json({
    ...section,
    content: section.content ? JSON.parse(section.content) : null,
  });
});

router.delete('/footer-sections/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM footer_sections WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '页脚区块不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 侧边栏组件管理 ============
router.get('/sidebar-widgets', (req: Request, res: Response) => {
  const { all } = req.query;
  let sql = 'SELECT * FROM sidebar_widgets';
  if (all !== 'true') {
    sql += ' WHERE is_active = 1';
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const widgets = db.prepare(sql).all();
  res.json(widgets);
});

router.get('/sidebar-widgets/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const widgets = db.prepare('SELECT * FROM sidebar_widgets ORDER BY sort_order ASC, id ASC').all();
  res.json(widgets);
});

router.get('/sidebar-widgets/:id', (req: Request, res: Response) => {
  const widget = db.prepare('SELECT * FROM sidebar_widgets WHERE id = ?').get(req.params.id);
  if (!widget) {
    return res.status(404).json({ message: '侧边栏组件不存在' });
  }
  res.json(widget);
});

router.post('/sidebar-widgets', authMiddleware, (req: AuthRequest, res: Response) => {
  const { title, widget_type, content, image_url, link_url, sort_order, position, is_active } = req.body;
  if (!title || !widget_type) {
    return res.status(400).json({ message: '标题和组件类型不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO sidebar_widgets (title, widget_type, content, image_url, link_url, sort_order, position, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    widget_type,
    content || '',
    image_url || '',
    link_url || '',
    sort_order || 0,
    position || 'right',
    is_active ?? 1
  );
  const widget = db.prepare('SELECT * FROM sidebar_widgets WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(widget);
});

router.put('/sidebar-widgets/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM sidebar_widgets WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '侧边栏组件不存在' });
  }
  const { title, widget_type, content, image_url, link_url, sort_order, position, is_active } = req.body;
  db.prepare(`
    UPDATE sidebar_widgets SET 
      title = COALESCE(?, title),
      widget_type = COALESCE(?, widget_type),
      content = COALESCE(?, content),
      image_url = COALESCE(?, image_url),
      link_url = COALESCE(?, link_url),
      sort_order = COALESCE(?, sort_order),
      position = COALESCE(?, position),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title ?? null,
    widget_type ?? null,
    content ?? null,
    image_url ?? null,
    link_url ?? null,
    sort_order ?? null,
    position ?? null,
    is_active ?? null,
    req.params.id
  );
  const widget = db.prepare('SELECT * FROM sidebar_widgets WHERE id = ?').get(req.params.id);
  res.json(widget);
});

router.delete('/sidebar-widgets/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM sidebar_widgets WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '侧边栏组件不存在' });
  }
  res.json({ message: '删除成功' });
});

// ============ 页面区块管理 ============
router.get('/page-sections', (req: Request, res: Response) => {
  const { all, page } = req.query;
  let sql = 'SELECT * FROM page_sections WHERE 1=1';
  const params: unknown[] = [];
  if (all !== 'true') {
    sql += ' AND is_active = 1';
  }
  if (page) {
    sql += ' AND page_name = ?';
    params.push(page);
  }
  sql += ' ORDER BY sort_order ASC, id ASC';
  const sections = db.prepare(sql).all();
  res.json(sections);
});

router.get('/page-sections/all', authMiddleware, (req: AuthRequest, res: Response) => {
  const sections = db.prepare('SELECT * FROM page_sections ORDER BY sort_order ASC, id ASC').all();
  res.json(sections);
});

router.get('/page-sections/:id', (req: Request, res: Response) => {
  const section = db.prepare('SELECT * FROM page_sections WHERE id = ?').get(req.params.id);
  if (!section) {
    return res.status(404).json({ message: '页面区块不存在' });
  }
  res.json(section);
});

router.post('/page-sections', authMiddleware, (req: AuthRequest, res: Response) => {
  const { page_name, section_key, title, subtitle, content, image_url, background_color, sort_order, is_active } = req.body;
  if (!page_name || !section_key) {
    return res.status(400).json({ message: '页面名称和区块键不能为空' });
  }
  const result = db.prepare(`
    INSERT INTO page_sections (page_name, section_key, title, subtitle, content, image_url, background_color, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    page_name,
    section_key,
    title || '',
    subtitle || '',
    content || '',
    image_url || '',
    background_color || '',
    sort_order || 0,
    is_active ?? 1
  );
  const section = db.prepare('SELECT * FROM page_sections WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(section);
});

router.put('/page-sections/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT * FROM page_sections WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '页面区块不存在' });
  }
  const { page_name, section_key, title, subtitle, content, image_url, background_color, sort_order, is_active } = req.body;
  db.prepare(`
    UPDATE page_sections SET 
      page_name = COALESCE(?, page_name),
      section_key = COALESCE(?, section_key),
      title = COALESCE(?, title),
      subtitle = COALESCE(?, subtitle),
      content = COALESCE(?, content),
      image_url = COALESCE(?, image_url),
      background_color = COALESCE(?, background_color),
      sort_order = COALESCE(?, sort_order),
      is_active = COALESCE(?, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    page_name ?? null,
    section_key ?? null,
    title ?? null,
    subtitle ?? null,
    content ?? null,
    image_url ?? null,
    background_color ?? null,
    sort_order ?? null,
    is_active ?? null,
    req.params.id
  );
  const section = db.prepare('SELECT * FROM page_sections WHERE id = ?').get(req.params.id);
  res.json(section);
});

router.delete('/page-sections/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM page_sections WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '页面区块不存在' });
  }
  res.json({ message: '删除成功' });
});

export default router;
