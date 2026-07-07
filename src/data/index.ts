export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'orange';
  route: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export interface CaseItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface KnowledgeItem {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export interface ActivityDay {
  day: number;
  date: string;
  title: string;
  description: string;
  schedule: TimelineItem[];
  highlights: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  type: 'ppt' | 'pdf' | 'doc' | 'video' | 'image';
  description: string;
  fileSize: string;
  coverColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  type: 'report' | 'media' | 'video' | 'data';
  value?: string;
  description: string;
}

export const banners: Banner[] = [
  {
    id: '1',
    title: '法润青苗',
    subtitle: '未成年人网络安全普法平台',
    description: '守护青少年健康成长，共筑清朗网络空间',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
  },
  {
    id: '2',
    title: '拒绝网络暴力',
    subtitle: '共建友善网络环境',
    description: '学法懂法，依法维权，让网络空间充满正能量',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  {
    id: '3',
    title: '谨防网络诈骗',
    subtitle: '守护青春钱袋子',
    description: '认清诈骗套路，提高防范意识，保护个人财产安全',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
  },
];

export const topics: Topic[] = [
  {
    id: '1',
    title: '网络暴力专题',
    description: '了解网络暴力的危害，学会用法律武器保护自己',
    icon: 'Shield',
    color: 'blue',
    route: '/cyberbullying',
  },
  {
    id: '2',
    title: '网络诈骗专题',
    description: '识别常见诈骗手法，提高警惕防范于未然',
    icon: 'AlertTriangle',
    color: 'green',
    route: '/fraud',
  },
  {
    id: '3',
    title: '消费诱导专题',
    description: '理性面对网络消费，培养健康的消费观念',
    icon: 'ShoppingBag',
    color: 'orange',
    route: '/consumption',
  },
];

export const timelineData: TimelineItem[] = [
  {
    time: 'Day 1',
    title: '开营仪式 & 网络安全初识',
    description: '破冰互动，团队组建，开启网络安全普法之旅',
  },
  {
    time: 'Day 2',
    title: '网络暴力主题日',
    description: '案例分析、情景短剧、友善上网倡议',
  },
  {
    time: 'Day 3',
    title: '网络诈骗主题日',
    description: '反诈小课堂、角色扮演、防骗口诀学习',
  },
  {
    time: 'Day 4',
    title: '理性消费主题日',
    description: '消费陷阱揭秘、理财小课堂、趣味手工',
  },
  {
    time: 'Day 5',
    title: '成果展示 & 结营仪式',
    description: '作品展示、知识竞赛、颁奖仪式、合影留念',
  },
];

export const newsData: NewsItem[] = [
  {
    id: '1',
    title: '法润青苗实践队走进社区开展网络安全普法活动',
    date: '2024-07-15',
    summary: '四川大学"法暖万家·守护朝夕"团队深入社区，为青少年带来生动有趣的网络安全普法课程...',
    category: '活动动态',
  },
  {
    id: '2',
    title: '《青少年网络安全口袋书》正式发布',
    date: '2024-07-18',
    summary: '精心编绘的漫画版口袋书受到同学们的热烈欢迎，已免费发放500余册...',
    category: '成果发布',
  },
  {
    id: '3',
    title: '社区网络安全知识竞赛成功举办',
    date: '2024-07-20',
    summary: '来自5个社区的30名选手参赛，展现了丰富的网络安全知识储备...',
    category: '活动回顾',
  },
  {
    id: '4',
    title: '家校社协同育人座谈会顺利召开',
    date: '2024-07-22',
    summary: '学校、家庭、社区三方携手，共商未成年人网络保护大计...',
    category: '合作交流',
  },
];

export const statsData: StatItem[] = [
  { value: '500+', label: '参与青少年', icon: 'Users', color: 'blue' },
  { value: '5', label: '覆盖社区', icon: 'MapPin', color: 'green' },
  { value: '20+', label: '普法课程', icon: 'BookOpen', color: 'orange' },
  { value: '1000+', label: '资料发放', icon: 'FileText', color: 'blue' },
];
