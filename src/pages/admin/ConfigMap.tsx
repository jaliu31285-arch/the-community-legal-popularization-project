import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Home,
  Newspaper,
  Calendar,
  BookOpen,
  Users,
  Award,
  AlertTriangle,
  Shield,
  ShoppingBag,
  Settings,
  Bell,
  Link2,
  LayoutList,
  Sidebar,
  ChevronRight,
  Image,
  FileText,
  Layers,
  GraduationCap,
  Building,
  BarChart3,
  Menu,
  Sprout,
  ExternalLink,
} from 'lucide-react';

interface ConfigItem {
  name: string;
  description: string;
  adminPath: string;
  icon: React.ReactNode;
  fields: string[];
}

interface PageConfig {
  pageName: string;
  pagePath: string;
  icon: React.ReactNode;
  description: string;
  items: ConfigItem[];
}

const configMap: PageConfig[] = [
  {
    pageName: '首页',
    pagePath: '/',
    icon: <Home className="w-5 h-5" />,
    description: '网站首页，展示核心内容和入口',
    items: [
      {
        name: '轮播图/Banner',
        description: '页面顶部大Banner轮播区域',
        adminPath: '/admin/banners',
        icon: <Image className="w-5 h-5" />,
        fields: ['标题', '副标题', '描述', '背景图片', '跳转链接', '渐变颜色'],
      },
      {
        name: '三大普法专题',
        description: '首页中部核心内容区域',
        adminPath: '/admin/topics',
        icon: <BookOpen className="w-5 h-5" />,
        fields: ['标题', '描述', '配图', '详情链接', '媒体类型', '图标', '颜色'],
      },
      {
        name: '新闻动态',
        description: '首页左侧新闻动态列表',
        adminPath: '/admin/news',
        icon: <Newspaper className="w-5 h-5" />,
        fields: ['标题', '摘要', '正文', '分类', '日期', '封面图片'],
      },
      {
        name: '公告栏',
        description: '首页右侧边栏公告区域',
        adminPath: '/admin/announcements',
        icon: <Bell className="w-5 h-5" />,
        fields: ['标题', '内容', '日期', '图片', '链接', '是否置顶'],
      },
      {
        name: '统计数据',
        description: '首页右侧数据统计展示',
        adminPath: '/admin/stats',
        icon: <BarChart3 className="w-5 h-5" />,
        fields: ['标签', '数值', '图标', '颜色主题'],
      },
      {
        name: '快速链接',
        description: '首页右侧快速入口链接',
        adminPath: '/admin/quick-links',
        icon: <Link2 className="w-5 h-5" />,
        fields: ['链接名称', '链接地址', '链接图标', '图标名称'],
      },
      {
        name: '侧边栏组件',
        description: '首页侧边栏的各个组件模块',
        adminPath: '/admin/sidebar-widgets',
        icon: <Sidebar className="w-5 h-5" />,
        fields: ['标题', '组件类型', '显示位置', '图片', '链接'],
      },
      {
        name: '页面区块',
        description: '首页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
    ],
  },
  {
    pageName: '校园欺凌与网络暴力',
    pagePath: '/cyberbullying',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: '校园欺凌与网络暴力防治普法专题页面',
    items: [
      {
        name: '专题内容',
        description: '知识科普、案例分析、法律法规等内容',
        adminPath: '/admin/topics',
        icon: <BookOpen className="w-5 h-5" />,
        fields: ['标题', '内容', '配图', '链接', '媒体类型', '内容类型', '图标', '颜色'],
      },
      {
        name: '页面区块',
        description: '专题页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
      {
        name: '侧边栏组件',
        description: '专题页侧边栏组件',
        adminPath: '/admin/sidebar-widgets',
        icon: <Sidebar className="w-5 h-5" />,
        fields: ['标题', '组件类型', '显示位置', '图片', '链接'],
      },
    ],
  },
  {
    pageName: '网络诈骗与网络造谣',
    pagePath: '/fraud',
    icon: <Shield className="w-5 h-5" />,
    description: '网络诈骗与网络造谣防范普法专题页面',
    items: [
      {
        name: '专题内容',
        description: '知识科普、案例分析、法律法规等内容',
        adminPath: '/admin/topics',
        icon: <BookOpen className="w-5 h-5" />,
        fields: ['标题', '内容', '配图', '链接', '媒体类型', '内容类型', '图标', '颜色'],
      },
      {
        name: '页面区块',
        description: '专题页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
      {
        name: '侧边栏组件',
        description: '专题页侧边栏组件',
        adminPath: '/admin/sidebar-widgets',
        icon: <Sidebar className="w-5 h-5" />,
        fields: ['标题', '组件类型', '显示位置', '图片', '链接'],
      },
    ],
  },
  {
    pageName: '不良行为矫治与权益保护',
    pagePath: '/consumption',
    icon: <ShoppingBag className="w-5 h-5" />,
    description: '不良行为矫治与权益保护普法专题页面',
    items: [
      {
        name: '专题内容',
        description: '知识科普、案例分析、法律法规等内容',
        adminPath: '/admin/topics',
        icon: <BookOpen className="w-5 h-5" />,
        fields: ['标题', '内容', '配图', '链接', '媒体类型', '内容类型', '图标', '颜色'],
      },
      {
        name: '页面区块',
        description: '专题页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
      {
        name: '侧边栏组件',
        description: '专题页侧边栏组件',
        adminPath: '/admin/sidebar-widgets',
        icon: <Sidebar className="w-5 h-5" />,
        fields: ['标题', '组件类型', '显示位置', '图片', '链接'],
      },
    ],
  },
  {
    pageName: '活动回顾',
    pagePath: '/activities',
    icon: <Calendar className="w-5 h-5" />,
    description: '实践活动日程和纪实展示',
    items: [
      {
        name: '活动列表',
        description: '活动时间轴中的每一天活动卡片',
        adminPath: '/admin/activities',
        icon: <Calendar className="w-5 h-5" />,
        fields: ['第几天', '日期', '活动主题', '描述', '亮点', '安排', '活动图片', '详情链接'],
      },
      {
        name: '页面区块',
        description: '活动页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
    ],
  },
  {
    pageName: '学习资源库',
    pagePath: '/resources',
    icon: <FileText className="w-5 h-5" />,
    description: '普法学习资源下载和浏览',
    items: [
      {
        name: '资源列表',
        description: '资源列表中的每个资源卡片',
        adminPath: '/admin/resources',
        icon: <FileText className="w-5 h-5" />,
        fields: ['资源名称', '分类', '文件类型', '简介', '文件地址', '封面图片', '外部链接', '文件大小'],
      },
      {
        name: '页面区块',
        description: '资源页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
    ],
  },
  {
    pageName: '项目成果',
    pagePath: '/achievements',
    icon: <Award className="w-5 h-5" />,
    description: '项目成果和荣誉展示',
    items: [
      {
        name: '成果列表',
        description: '成果展示区域的每个成果卡片',
        adminPath: '/admin/achievements',
        icon: <Award className="w-5 h-5" />,
        fields: ['成果名称', '类型', '数值/副标题', '描述', '封面图片', '链接地址'],
      },
      {
        name: '统计数据',
        description: '成果页的数据统计展示',
        adminPath: '/admin/stats',
        icon: <BarChart3 className="w-5 h-5" />,
        fields: ['标签', '数值', '图标', '颜色主题'],
      },
      {
        name: '页面区块',
        description: '成果页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
    ],
  },
  {
    pageName: '关于我们',
    pagePath: '/about',
    icon: <Users className="w-5 h-5" />,
    description: '团队介绍、指导老师、合作单位',
    items: [
      {
        name: '团队成员',
        description: '团队成员展示区域',
        adminPath: '/admin/team',
        icon: <Users className="w-5 h-5" />,
        fields: ['姓名', '职位/分工', '头像', '个人简介'],
      },
      {
        name: '指导老师',
        description: '指导老师展示区域',
        adminPath: '/admin/advisors',
        icon: <GraduationCap className="w-5 h-5" />,
        fields: ['姓名', '职称/职务', '所属单位', '头像', '简介'],
      },
      {
        name: '合作单位',
        description: '合作单位/支持单位展示区域',
        adminPath: '/admin/partners',
        icon: <Building className="w-5 h-5" />,
        fields: ['单位名称', '单位类型', '描述', 'Logo图片'],
      },
      {
        name: '页面区块',
        description: '关于页可配置的内容区块',
        adminPath: '/admin/page-sections',
        icon: <Layers className="w-5 h-5" />,
        fields: ['区块标题', '副标题', '正文', '图片', '背景颜色'],
      },
    ],
  },
  {
    pageName: '全站通用',
    pagePath: '*',
    icon: <Settings className="w-5 h-5" />,
    description: '全站通用的设置和配置',
    items: [
      {
        name: '站点基本设置',
        description: '网站名称、副标题、Logo、联系方式等',
        adminPath: '/admin/site-settings',
        icon: <Settings className="w-5 h-5" />,
        fields: ['网站名称', '副标题', '描述', 'Logo', '联系邮箱', '联系电话', '联系地址', '备案号', '版权信息'],
      },
      {
        name: '导航菜单',
        description: '网站顶部导航栏菜单',
        adminPath: '/admin/nav',
        icon: <Menu className="w-5 h-5" />,
        fields: ['菜单名称', '跳转路径', '父级菜单'],
      },
      {
        name: '页脚区块',
        description: '网站底部页脚的各个内容区块',
        adminPath: '/admin/footer-sections',
        icon: <LayoutList className="w-5 h-5" />,
        fields: ['区块标题', '区块类型', '内容(JSON格式)'],
      },
    ],
  },
];

export default function ConfigMap() {
  const navigate = useNavigate();
  const [expandedPage, setExpandedPage] = useState<string>('首页');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConfig = configMap.filter((page) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (page.pageName.toLowerCase().includes(term)) return true;
    if (page.description.toLowerCase().includes(term)) return true;
    return page.items.some(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.fields.some((f) => f.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-emerald-600" />
          配置地图
        </h1>
        <p className="text-slate-500 mt-1">
          可视化查看前端每个页面对应的后台管理模块，快速找到需要修改的内容
        </p>
      </div>

      {/* 搜索框 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="relative max-w-lg">
          <Menu className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索页面、模块或字段..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
        <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
          <Sprout className="w-5 h-5" />
          使用说明
        </h3>
        <ul className="text-sm text-emerald-700 space-y-1.5">
          <li>• 点击页面卡片展开，查看该页面包含的所有可配置模块</li>
          <li>• 点击模块右侧的"前往管理"按钮，直接跳转到对应的后台管理页面</li>
          <li>• 每个模块都列出了可修改的字段，方便你确认修改的内容</li>
          <li>• 不确定在哪修改？用上方搜索框搜索关键词即可快速定位</li>
        </ul>
      </div>

      {/* 页面列表 */}
      <div className="space-y-4">
        {filteredConfig.map((page) => (
          <div
            key={page.pageName}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedPage(expandedPage === page.pageName ? '' : page.pageName)
              }
              className="w-full px-6 py-5 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                {page.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{page.pageName}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                    {page.pagePath}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{page.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  {page.items.length} 个模块
                </span>
                <ChevronRight
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedPage === page.pageName ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </button>

            {expandedPage === page.pageName && (
              <div className="border-t border-slate-100 p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/50">
                {page.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-xl p-4 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800">{item.name}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {item.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.fields.slice(0, 4).map((field) => (
                            <span
                              key={field}
                              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                            >
                              {field}
                            </span>
                          ))}
                          {item.fields.length > 4 && (
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                              +{item.fields.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(item.adminPath)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      前往管理
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredConfig.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Menu className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>未找到匹配的配置项</p>
        </div>
      )}
    </div>
  );
}
