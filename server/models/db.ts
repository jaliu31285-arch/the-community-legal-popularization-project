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
try {
  db.prepare('ALTER TABLE news ADD COLUMN video_url TEXT').run();
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
try {
  db.prepare('ALTER TABLE activities ADD COLUMN video_url TEXT').run();
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
try {
  db.prepare('ALTER TABLE announcements ADD COLUMN video_url TEXT').run();
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
  insertSetting.run('site_name', '法治护航少年成长', 'text', '网站名称');
  insertSetting.run('site_subtitle', '人大代表联动未检职能社区青少年法治教育主题营会', 'text', '网站副标题');
  insertSetting.run('site_description', '以代表履职+未检联动+情景式普法，为青少年筑牢法治思想防线，守护青少年健康成长。', 'textarea', '网站描述');
  insertSetting.run('logo_url', '', 'text', 'Logo图片地址');
  insertSetting.run('contact_email', 'farunqingmiao@example.com', 'text', '联系邮箱');
  insertSetting.run('contact_phone', '028-XXXXXXX', 'text', '联系电话');
  insertSetting.run('contact_address', '枫树社区', 'text', '联系地址');
  insertSetting.run('icp_number', '蜀ICP备XXXXXXXX号', 'text', '备案号');
  insertSetting.run('copyright', '© 2026 法治护航少年成长主题营会', 'text', '版权信息');
  insertSetting.run('banner_title', '法治护航 少年成长', 'text', '首页大Banner标题');
  insertSetting.run('banner_subtitle', '人大代表联动未检职能社区青少年法治教育主题营会', 'text', '首页大Banner副标题');
  insertSetting.run('banner_description', '2026年7月20日-21日 | 以代表履职+未检联动+情景式普法，为青少年筑牢法治思想防线', 'text', '首页大Banner描述');
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

// 页面动态区块表
db.exec(`
  CREATE TABLE IF NOT EXISTS page_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_name TEXT NOT NULL DEFAULT 'home',
    block_type TEXT NOT NULL DEFAULT 'text',
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    items TEXT,
    background_color TEXT,
    text_color TEXT,
    layout TEXT DEFAULT 'default',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.prepare('ALTER TABLE page_blocks ADD COLUMN video_url TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE page_blocks ADD COLUMN items TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE page_blocks ADD COLUMN text_color TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE page_blocks ADD COLUMN layout TEXT DEFAULT \'default\'').run();
} catch (e) {}

// 操作日志表（用于撤回功能）
db.exec(`
  CREATE TABLE IF NOT EXISTS change_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    operation TEXT NOT NULL,
    old_data TEXT,
    new_data TEXT,
    admin_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 初始化首页动态区块（法治营会主题）
const pageBlocksCount = db.prepare('SELECT COUNT(*) as count FROM page_blocks').get() as { count: number };
if (pageBlocksCount.count === 0) {
  const insertBlock = db.prepare(`
    INSERT INTO page_blocks (page_name, block_type, title, subtitle, content, image_url, video_url, items, background_color, text_color, layout, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Hero 横幅区块
  insertBlock.run('home', 'hero',
    '法治护航 少年成长',
    '人大代表联动未检职能社区青少年法治教育主题营会',
    '2026年7月20日-21日 | 以代表履职+未检联动+情景式普法，为青少年筑牢法治思想防线',
    '', '', '',
    'from-blue-600 via-blue-500 to-cyan-400',
    'white',
    'default', 1
  );

  // 2. 活动介绍区块（图文）
  insertBlock.run('home', 'image_text',
    '活动介绍',
    '两天沉浸式社区主题营会',
    '此次为两天的暑期法治主题营会。首日组织学员走进检察院、法院开展实景研学，活动聚焦青少年高频面临的校园欺凌、网络诈骗、网络造谣、不良行为矫治、权益自我保护等成长风险场景，精准贴合青少年法治教育需求。次日在枫树社区开展基础法治思维转化，依托案例拆解、角色扮演等趣味形式，帮助青少年认清各类违法风险的危害与后果，掌握基础自我保护技巧。',
    '', '', '',
    '', '', 'left', 2
  );

  // 3. 活动亮点卡片组
  insertBlock.run('home', 'cards',
    '活动亮点',
    '四大特色 精准普法',
    '', '', '',
    JSON.stringify([
      { icon: 'Landmark', title: '实景研学', desc: '走进检察院、法院，零距离感受司法庄严' },
      { icon: 'Users', title: '代表履职', desc: '法律领域人大代表现场指导，专业赋能' },
      { icon: 'Theater', title: '情景教学', desc: '案例拆解、角色扮演，沉浸式学法体验' },
      { icon: 'Award', title: '结营仪式', desc: '法治情景绘制、学法心得分享，见证成长' },
    ]),
    '', '', 'default', 3
  );

  // 4. 每日回顾（图片集）
  insertBlock.run('home', 'gallery',
    '每日精彩回顾',
    '见证每一个成长瞬间',
    '', '', '',
    JSON.stringify([
      { title: 'Day 1', subtitle: '检察法院实景研学', image: '' },
      { title: 'Day 2', subtitle: '社区法治思维转化', image: '' },
    ]),
    'bg-slate-50', '', 'default', 4
  );

  // 5. 学生作品展示
  insertBlock.run('home', 'gallery',
    '学生作品展示',
    '法治情景绘制 · 学法心得分享',
    '', '', '',
    JSON.stringify([
      { title: '法治海报作品一', subtitle: '作者：XXX', image: '' },
      { title: '法治海报作品二', subtitle: '作者：XXX', image: '' },
      { title: '爱心承诺卡', subtitle: '作者：XXX', image: '' },
      { title: '学法心得', subtitle: '作者：XXX', image: '' },
    ]),
    '', '', 'default', 5
  );

  // 6. 视频区块
  insertBlock.run('home', 'video',
    '活动精彩视频',
    '记录营会美好瞬间',
    '', '', '',
    '',
    'bg-slate-900', 'white', 'default', 6
  );

  // 7. 数据统计
  insertBlock.run('home', 'stats',
    '活动数据',
    '用数字见证成效',
    '', '', '',
    JSON.stringify([
      { label: '参与学员', value: '50+', icon: 'Users', color: 'blue' },
      { label: '法治课程', value: '8节', icon: 'BookOpen', color: 'green' },
      { label: '实践基地', value: '3个', icon: 'MapPin', color: 'orange' },
      { label: '学生作品', value: '100+', icon: 'Image', color: 'purple' },
    ]),
    'bg-gradient-to-r from-blue-600 to-cyan-500', 'white', 'default', 7
  );

  console.log('首页动态区块已初始化');
}

// 活动回顾 - 日期表
db.exec(`
  CREATE TABLE IF NOT EXISTS activity_review_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 活动回顾 - 时间点表
db.exec(`
  CREATE TABLE IF NOT EXISTS activity_review_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_id INTEGER NOT NULL,
    time TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    images TEXT,
    video_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (day_id) REFERENCES activity_review_days(id) ON DELETE CASCADE
  )
`);

// 活动回顾开关设置
db.exec(`
  CREATE TABLE IF NOT EXISTS activity_review_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enabled INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 学生作品表
db.exec(`
  CREATE TABLE IF NOT EXISTS student_works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT DEFAULT '其他',
    author TEXT,
    description TEXT,
    image_url TEXT,
    content_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 学生作品开关设置
db.exec(`
  CREATE TABLE IF NOT EXISTS student_works_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enabled INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 承诺墙签名表
db.exec(`
  CREATE TABLE IF NOT EXISTS promise_wall_signatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    signature_type TEXT DEFAULT 'text',
    signature_image TEXT,
    message TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 承诺墙开关设置
db.exec(`
  CREATE TABLE IF NOT EXISTS promise_wall_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enabled INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 初始化活动回顾数据
const reviewDaysCount = db.prepare('SELECT COUNT(*) as count FROM activity_review_days').get() as { count: number };
if (reviewDaysCount.count === 0) {
  const insertDay = db.prepare(`
    INSERT INTO activity_review_days (date, title, description, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  const insertPoint = db.prepare(`
    INSERT INTO activity_review_points (day_id, time, title, content, images, video_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const day1Id = insertDay.run(
    '2026-07-20',
    '首日：实景研学',
    '走进检察院、法院开展实景研学，聚焦校园欺凌、网络诈骗、网络造谣等成长风险场景',
    1
  ).lastInsertRowid;

  insertPoint.run(day1Id, '上午 09:00', '开营仪式', '法治护航少年成长主题营会正式启动，人大代表、检察官、社区工作人员出席开营仪式。', '[]', null, 1);
  insertPoint.run(day1Id, '上午 10:00', '检察院参观', '走进检察院，了解检察职能，参观未成年人检察工作区。', '[]', null, 2);
  insertPoint.run(day1Id, '下午 14:00', '法院旁听', '走进法院，旁听案件审理，感受司法威严。', '[]', null, 3);

  const day2Id = insertDay.run(
    '2026-07-21',
    '次日：社区法治实践',
    '在枫树社区开展基础法治思维转化，案例拆解、角色扮演、结营仪式',
    2
  ).lastInsertRowid;

  insertPoint.run(day2Id, '上午 09:00', '案例拆解 workshop', '通过真实案例拆解，帮助青少年认清各类违法风险的危害与后果。', '[]', null, 1);
  insertPoint.run(day2Id, '上午 10:30', '角色扮演', '趣味角色扮演活动，在互动中学习法律知识。', '[]', null, 2);
  insertPoint.run(day2Id, '下午 14:00', '结营仪式', '人大代表现场观摩研学成果，颁发结业证书，展示法治情景绘制作品。', '[]', null, 3);

  // 初始化设置
  db.prepare('INSERT INTO activity_review_settings (enabled) VALUES (1)').run();
  db.prepare('INSERT INTO student_works_settings (enabled) VALUES (1)').run();
  db.prepare('INSERT INTO promise_wall_settings (enabled) VALUES (1)').run();

  console.log('活动回顾、学生作品、承诺墙数据已初始化');
}

// 记录操作日志
export function logChange(tableName: string, recordId: number, operation: 'update' | 'delete' | 'create', oldData: any = null, newData: any = null, adminId: number | null = null) {
  db.prepare(`
    INSERT INTO change_logs (table_name, record_id, operation, old_data, new_data, admin_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    tableName,
    recordId,
    operation,
    oldData ? JSON.stringify(oldData) : null,
    newData ? JSON.stringify(newData) : null,
    adminId
  );
}

// 获取最近的操作记录
export function getRecentChanges(tableName?: string, limit = 20) {
  let sql = 'SELECT * FROM change_logs';
  const params: any[] = [];
  if (tableName) {
    sql += ' WHERE table_name = ?';
    params.push(tableName);
  }
  sql += ' ORDER BY id DESC LIMIT ?';
  params.push(limit);
  return db.prepare(sql).all(...params).map((row: any) => ({
    ...row,
    old_data: row.old_data ? JSON.parse(row.old_data) : null,
    new_data: row.new_data ? JSON.parse(row.new_data) : null,
  }));
}

export default db;
