import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const dataDir = isProduction 
  ? path.join(process.cwd(), 'data')
  : path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'farunqingmiao.db');
const db: Database.Database = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 管理员表
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 轮播图表
db.exec(`
  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT,
    gradient TEXT DEFAULT 'from-blue-600 via-blue-500 to-cyan-400',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 新闻动态表
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    category TEXT,
    date TEXT,
    image_url TEXT,
    link_url TEXT,
    content_type TEXT DEFAULT 'text',
    file_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.prepare('ALTER TABLE news ADD COLUMN link_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE news ADD COLUMN content_type TEXT DEFAULT \'text\'').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE news ADD COLUMN file_url TEXT').run();
} catch (e) {}

// 活动表
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER NOT NULL,
    date TEXT,
    title TEXT NOT NULL,
    description TEXT,
    highlights TEXT,
    schedule TEXT,
    image_url TEXT,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 为旧表添加新字段（如果不存在）
try {
  db.prepare('ALTER TABLE activities ADD COLUMN image_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE activities ADD COLUMN link_url TEXT').run();
} catch (e) {}

// 资源表
db.exec(`
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    type TEXT DEFAULT 'pdf',
    description TEXT,
    file_url TEXT,
    file_size TEXT,
    cover_color TEXT,
    image_url TEXT,
    link_url TEXT,
    download_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.prepare('ALTER TABLE resources ADD COLUMN image_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE resources ADD COLUMN link_url TEXT').run();
} catch (e) {}

// 团队成员表
db.exec(`
  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    avatar TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 成果表
db.exec(`
  CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'report',
    value TEXT,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.prepare('ALTER TABLE achievements ADD COLUMN image_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE achievements ADD COLUMN link_url TEXT').run();
} catch (e) {}

// 普法专题表
db.exec(`
  CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'knowledge',
    icon TEXT,
    color TEXT,
    image_url TEXT,
    link_url TEXT,
    content_type TEXT DEFAULT 'text',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.prepare('ALTER TABLE topics ADD COLUMN image_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE topics ADD COLUMN link_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE topics ADD COLUMN content_type TEXT DEFAULT \'text\'').run();
} catch (e) {}

// 指导老师表
db.exec(`
  CREATE TABLE IF NOT EXISTS advisors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT,
    department TEXT,
    avatar TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 合作单位表
db.exec(`
  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    logo_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 统计数据表
db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 站点设置表
db.exec(`
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text',
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 导航菜单项表
db.exec(`
  CREATE TABLE IF NOT EXISTS nav_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    path TEXT NOT NULL,
    parent_id INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 侧边栏组件表
db.exec(`
  CREATE TABLE IF NOT EXISTS sidebar_widgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    widget_type TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    position TEXT DEFAULT 'right',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 页脚区块表
db.exec(`
  CREATE TABLE IF NOT EXISTS footer_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    section_type TEXT DEFAULT 'links',
    content TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 页面区块表
db.exec(`
  CREATE TABLE IF NOT EXISTS page_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_name TEXT NOT NULL,
    section_key TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    background_color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 公告表
db.exec(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    date TEXT,
    image_url TEXT,
    link_url TEXT,
    content_type TEXT DEFAULT 'text',
    is_sticky INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.prepare('ALTER TABLE announcements ADD COLUMN image_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE announcements ADD COLUMN link_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE announcements ADD COLUMN content_type TEXT DEFAULT \'text\'').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE announcements ADD COLUMN file_url TEXT').run();
} catch (e) {}

// 快速链接表
db.exec(`
  CREATE TABLE IF NOT EXISTS quick_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    link_url TEXT NOT NULL,
    icon TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.prepare('ALTER TABLE quick_links ADD COLUMN image_url TEXT').run();
} catch (e) {}

// 初始化默认管理员
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO admins (username, password, name, role)
    VALUES (?, ?, ?, ?)
  `).run('admin', hashedPassword, '超级管理员', 'super_admin');
  console.log('默认管理员已创建: admin / admin123');
}

// 初始化一些示例数据
const bannerCount = db.prepare('SELECT COUNT(*) as count FROM banners').get() as { count: number };
if (bannerCount.count === 0) {
  const insertBanner = db.prepare(`
    INSERT INTO banners (title, subtitle, description, gradient, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertBanner.run('法润青苗', '未成年人网络安全普法平台', '守护青少年健康成长，共筑清朗网络空间', 'from-blue-600 via-blue-500 to-cyan-400', 1);
  insertBanner.run('拒绝网络暴力', '共建友善网络环境', '学法懂法，依法维权，让网络空间充满正能量', 'from-emerald-500 via-teal-500 to-cyan-500', 2);
  insertBanner.run('谨防网络诈骗', '守护青春钱袋子', '认清诈骗套路，提高防范意识，保护个人财产安全', 'from-amber-500 via-orange-500 to-red-500', 3);
  console.log('示例轮播图已初始化');
}

// 初始化普法专题数据
const topicsCount = db.prepare('SELECT COUNT(*) as count FROM topics').get() as { count: number };
if (topicsCount.count === 0) {
  const insertTopic = db.prepare(`
    INSERT INTO topics (category, title, content, type, icon, color, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertTopic.run('cyberbullying', '网络暴力定义', '网络暴力是指在网络空间中，利用网络技术手段对他人进行侮辱、诽谤、恐吓、人肉搜索等行为，给受害者带来身心伤害。', 'knowledge', 'AlertTriangle', 'blue', 1);
  insertTopic.run('cyberbullying', '常见形式', '常见的网络暴力形式包括：侮辱性言论、恶意造谣、人肉搜索、P图恶搞、恶意刷屏、网络骚扰等。', 'knowledge', 'AlertTriangle', 'blue', 2);
  insertTopic.run('cyberbullying', '典型案例', '案例一：某中学生因在网上发表不同意见，被网友人肉搜索并遭受持续辱骂，导致精神抑郁。案例二：一名女生的照片被恶意P图传播，造成严重的名誉损害。', 'case', 'FileText', 'blue', 3);
  insertTopic.run('cyberbullying', '法律法规', '《中华人民共和国刑法》第246条：侮辱罪、诽谤罪；《网络安全法》第12条：不得利用网络侵害他人合法权益；《未成年人保护法》第64条：保护未成年人免受网络欺凌。', 'law', 'Scale', 'blue', 4);
  insertTopic.run('cyberbullying', '应对方法', '1.保持冷静，不要回应；2.保留证据，截图保存；3.设置隐私，拉黑对方；4.寻求帮助，告诉家长老师；5.依法维权，报警处理。', 'method', 'Shield', 'blue', 5);
  insertTopic.run('cyberbullying', '求助渠道', '1.学校心理咨询师；2.当地公安机关；3.12377网络违法与不良信息举报中心；4.12355青少年维权热线；5.家长和老师。', 'channel', 'Phone', 'blue', 6);
  
  insertTopic.run('fraud', '免费皮肤诈骗', '骗子声称可以免费获取游戏皮肤，要求点击链接、下载APP、填写个人信息或支付"手续费"，最终导致账号被盗或钱财损失。', 'knowledge', 'Gift', 'green', 1);
  insertTopic.run('fraud', '虚假中奖诈骗', '通过私信、邮件等方式告知中奖，要求提供个人信息并支付"手续费"、"税费"等，实为诈骗。', 'knowledge', 'Gift', 'green', 2);
  insertTopic.run('fraud', '冒充熟人诈骗', '冒充老师、家长、同学等熟人，以急事为由借钱或要求转账，利用信任进行诈骗。', 'knowledge', 'UserCheck', 'green', 3);
  insertTopic.run('fraud', '游戏交易诈骗', '在游戏账号、装备交易中，骗子先收取费用后失联，或通过虚假交易平台骗取钱财。', 'knowledge', 'Gamepad2', 'green', 4);
  insertTopic.run('fraud', '诈骗话术拆解', '常见话术："恭喜你中奖了！"、"只需支付少量手续费即可领取"、"这是内部通道，限时优惠"、"你的账号存在风险，需要验证"。', 'knowledge', 'MessageSquare', 'green', 5);
  insertTopic.run('fraud', '防范技巧', '1.不轻易相信"免费"、"中奖"等信息；2.不点击陌生链接，不下载未知APP；3.不向陌生人转账，不透露验证码；4.遇到可疑情况及时告知家长。', 'method', 'Shield', 'green', 6);
  insertTopic.run('fraud', '处置流程', '1.立即停止操作；2.告知家长或老师；3.保留聊天记录、转账凭证等证据；4.联系平台客服举报；5.必要时报警处理。', 'method', 'AlertCircle', 'green', 7);
  
  insertTopic.run('consumption', '算法陷阱', '短视频、直播平台通过算法推荐，让用户沉迷其中，不知不觉产生消费冲动。平台会根据用户偏好推送相似内容，形成信息茧房。', 'knowledge', 'Cpu', 'orange', 1);
  insertTopic.run('consumption', '直播打赏', '主播通过话术引导、制造紧迫感等方式，诱导未成年人进行高额打赏。未成年人缺乏判断力，容易冲动消费。', 'knowledge', 'Gift', 'orange', 2);
  insertTopic.run('consumption', '游戏充值', '游戏内虚拟道具、皮肤等消费，容易让未成年人产生攀比心理，不断追求新装备，造成经济损失。', 'knowledge', 'Gamepad2', 'orange', 3);
  insertTopic.run('consumption', '虚假福利', '声称"限时特惠"、"限量抢购"、"内部优惠"等，利用从众心理和紧迫感诱导消费，实际商品质量差或价格虚高。', 'knowledge', 'Gift', 'orange', 4);
  insertTopic.run('consumption', '理性消费建议', '1.制定消费计划，预算内消费；2.延迟消费，冷静思考；3.货比三家，理性决策；4.区分"需要"和"想要"；5.遇到大额消费先告知家长。', 'method', 'Wallet', 'orange', 5);
  insertTopic.run('consumption', '无屏幕生活方案', '1.阅读纸质书籍；2.户外运动；3.手工制作；4.与家人朋友互动；5.培养兴趣爱好。', 'method', 'Sun', 'orange', 6);
  
  console.log('普法专题数据已初始化');
}

// 初始化指导老师数据
const advisorsCount = db.prepare('SELECT COUNT(*) as count FROM advisors').get() as { count: number };
if (advisorsCount.count === 0) {
  const insertAdvisor = db.prepare(`
    INSERT INTO advisors (name, title, department, avatar, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertAdvisor.run('张明教授', '法学教授', '四川大学法学院', '👨‍🏫', '长期从事青少年法治教育研究，具有丰富的普法经验', 1);
  insertAdvisor.run('李华律师', '执业律师', '四川XX律师事务所', '👩‍⚖️', '专注于未成年人保护法律事务，热心公益普法事业', 2);
  console.log('指导老师数据已初始化');
}

// 初始化合作单位数据
const partnersCount = db.prepare('SELECT COUNT(*) as count FROM partners').get() as { count: number };
if (partnersCount.count === 0) {
  const insertPartner = db.prepare(`
    INSERT INTO partners (name, type, description, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  insertPartner.run('四川大学法学院', '指导单位', '项目发起单位，提供专业指导', 1);
  insertPartner.run('XX街道办事处', '合作单位', '实践活动支持单位', 2);
  insertPartner.run('XX社区居委会', '实践基地', '活动开展场地提供', 3);
  insertPartner.run('XX小学', '合作学校', '青少年普法教育合作', 4);
  console.log('合作单位数据已初始化');
}

// 初始化统计数据
const statsCount = db.prepare('SELECT COUNT(*) as count FROM stats').get() as { count: number };
if (statsCount.count === 0) {
  const insertStat = db.prepare(`
    INSERT INTO stats (label, value, icon, color, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertStat.run('服务青少年', '500+', 'Users', 'green', 1);
  insertStat.run('实践社区', '12', 'MapPin', 'green', 2);
  insertStat.run('普法课程', '20+', 'BookOpen', 'warm', 3);
  insertStat.run('学习资料', '1000+', 'FileText', 'green', 4);
  console.log('统计数据已初始化');
}

// 初始化站点设置
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare(`
    INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
    VALUES (?, ?, ?, ?)
  `);
  insertSetting.run('site_name', '法润青苗', 'text', '网站名称');
  insertSetting.run('site_subtitle', '未成年人网络安全普法平台', 'text', '网站副标题');
  insertSetting.run('site_description', '四川大学"法暖万家·守护朝夕"团队打造的未成年人网络安全普法公益平台，守护青少年健康成长，共筑清朗网络空间。', 'textarea', '网站描述');
  insertSetting.run('logo_url', '', 'text', 'Logo图片地址');
  insertSetting.run('contact_email', 'farunqingmiao@example.com', 'text', '联系邮箱');
  insertSetting.run('contact_phone', '028-XXXXXXX', 'text', '联系电话');
  insertSetting.run('contact_address', '四川省成都市四川大学', 'text', '联系地址');
  insertSetting.run('icp_number', '蜀ICP备XXXXXXXX号', 'text', '备案号');
  insertSetting.run('copyright', '© 2024 法润青苗 - 四川大学"法暖万家·守护朝夕"团队', 'text', '版权信息');
  insertSetting.run('banner_title', '法润青苗', 'text', '首页大Banner标题');
  insertSetting.run('banner_subtitle', '未成年人网络安全普法平台', 'text', '首页大Banner副标题');
  insertSetting.run('banner_description', '守护青少年健康成长，共筑清朗网络空间', 'text', '首页大Banner描述');
  insertSetting.run('banner_image', '', 'text', '首页大Banner背景图');
  insertSetting.run('site_style', 'style-a', 'text', '网站风格：style-a公益组织风 / style-b政务教育风 / style-c青春校园风');
  insertSetting.run('style_locked', '0', 'text', '风格锁定：0未锁定 / 1已锁定');
  console.log('站点设置已初始化');
}

// 初始化导航菜单
const navCount = db.prepare('SELECT COUNT(*) as count FROM nav_items').get() as { count: number };
if (navCount.count === 0) {
  const insertNav = db.prepare(`
    INSERT INTO nav_items (label, path, parent_id, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  insertNav.run('首页', '/', 0, 1);
  insertNav.run('网络暴力专题', '/cyberbullying', 0, 2);
  insertNav.run('网络诈骗专题', '/fraud', 0, 3);
  insertNav.run('消费诱导专题', '/consumption', 0, 4);
  insertNav.run('活动回顾', '/activities', 0, 5);
  insertNav.run('学习资源库', '/resources', 0, 6);
  insertNav.run('项目成果展示', '/achievements', 0, 7);
  insertNav.run('关于我们', '/about', 0, 8);
  console.log('导航菜单已初始化');
}

// 初始化公告
const announcementCount = db.prepare('SELECT COUNT(*) as count FROM announcements').get() as { count: number };
if (announcementCount.count === 0) {
  const insertAnnouncement = db.prepare(`
    INSERT INTO announcements (title, content, date, is_sticky, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertAnnouncement.run('暑期实践活动正式启动', '四川大学"法暖万家·守护朝夕"团队走进社区，开展网络安全普法活动', '2024-07-01', 1, 1);
  insertAnnouncement.run('关于开展"我与法治"故事征集活动的通知', '欢迎广大青少年积极参与，分享你的法治故事', '2024-07-02', 0, 2);
  insertAnnouncement.run('网络安全知识讲座圆满结束', '专家为青少年讲解网络安全知识，互动问答环节气氛热烈', '2024-07-03', 0, 3);
  insertAnnouncement.run('青少年网络安全公约发布', '参与活动的青少年共同签署网络安全公约，承诺文明上网', '2024-07-04', 0, 4);
  console.log('公告数据已初始化');
}

// 初始化快速链接
const quickLinksCount = db.prepare('SELECT COUNT(*) as count FROM quick_links').get() as { count: number };
if (quickLinksCount.count === 0) {
  const insertQuickLink = db.prepare(`
    INSERT INTO quick_links (title, link_url, icon, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  insertQuickLink.run('12377举报中心', 'https://www.12377.cn', 'Flag', 1);
  insertQuickLink.run('12355青少年热线', 'http://www.12355.net', 'Phone', 2);
  insertQuickLink.run('中国普法网', 'http://www.legalinfo.gov.cn', 'BookOpen', 3);
  insertQuickLink.run('青少年维权网', '', 'Shield', 4);
  console.log('快速链接已初始化');
}

// 初始化页脚区块
const footerCount = db.prepare('SELECT COUNT(*) as count FROM footer_sections').get() as { count: number };
if (footerCount.count === 0) {
  const insertFooter = db.prepare(`
    INSERT INTO footer_sections (title, section_type, content, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  insertFooter.run('快速导航', 'links', JSON.stringify([
    { label: '首页', url: '/' },
    { label: '网络暴力专题', url: '/cyberbullying' },
    { label: '网络诈骗专题', url: '/fraud' },
    { label: '消费诱导专题', url: '/consumption' },
    { label: '活动回顾', url: '/activities' },
  ]), 1);
  insertFooter.run('更多栏目', 'links', JSON.stringify([
    { label: '学习资源库', url: '/resources' },
    { label: '项目成果展示', url: '/achievements' },
    { label: '关于我们', url: '/about' },
  ]), 2);
  insertFooter.run('联系我们', 'contact', JSON.stringify({
    address: '四川省成都市四川大学',
    email: 'farunqingmiao@example.com',
    phone: '028-XXXXXXX',
  }), 3);
  console.log('页脚区块已初始化');
}

// 初始化侧边栏组件
const sidebarCount = db.prepare('SELECT COUNT(*) as count FROM sidebar_widgets').get() as { count: number };
if (sidebarCount.count === 0) {
  const insertWidget = db.prepare(`
    INSERT INTO sidebar_widgets (title, widget_type, content, sort_order, position)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertWidget.run('网站公告', 'announcements', '', 1, 'right');
  insertWidget.run('访问统计', 'stats', '', 2, 'right');
  insertWidget.run('快速链接', 'quick_links', '', 3, 'right');
  insertWidget.run('联系我们', 'contact', '', 4, 'right');
  console.log('侧边栏组件已初始化');
}

export default db;
