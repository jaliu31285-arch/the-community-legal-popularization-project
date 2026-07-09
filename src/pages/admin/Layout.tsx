import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Newspaper,
  Calendar,
  FolderOpen,
  Users,
  Award,
  Upload,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  BookOpen,
  GraduationCap,
  Building,
  BarChart3,
  Settings,
  Menu as MenuIcon,
  Bell,
  Link2,
  LayoutList,
  Sidebar,
  Layers,
  Sprout,
  ChevronDown,
  Map,
  History,
  LayoutGrid,
  Heart,
} from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { path: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/admin/config-map', label: '配置地图', icon: Map },
  {
    path: '/admin/site-settings',
    label: '站点设置',
    icon: Settings,
    children: [
      { path: '/admin/site-settings', label: '基本设置', icon: Settings },
      { path: '/admin/nav', label: '导航菜单', icon: MenuIcon },
      { path: '/admin/footer-sections', label: '页脚区块', icon: LayoutList },
    ],
  },
  {
    path: '/admin/banners',
    label: '内容管理',
    icon: Layers,
    children: [
      { path: '/admin/banners', label: '轮播图管理', icon: Image },
      { path: '/admin/news', label: '新闻动态', icon: Newspaper },
      { path: '/admin/announcements', label: '公告管理', icon: Bell },
      { path: '/admin/activities', label: '活动管理', icon: Calendar },
      { path: '/admin/resources', label: '资源管理', icon: FolderOpen },
    ],
  },
  {
    path: '/admin/topics',
    label: '普法专题',
    icon: BookOpen,
    children: [
      { path: '/admin/topics', label: '专题内容', icon: BookOpen },
      { path: '/admin/page-sections', label: '页面区块', icon: Layers },
    ],
  },
  {
    path: '/admin/team',
    label: '团队合作',
    icon: Users,
    children: [
      { path: '/admin/team', label: '团队成员', icon: Users },
      { path: '/admin/advisors', label: '指导老师', icon: GraduationCap },
      { path: '/admin/partners', label: '合作单位', icon: Building },
    ],
  },
  {
    path: '/admin/stats',
    label: '数据展示',
    icon: BarChart3,
    children: [
      { path: '/admin/stats', label: '统计数据', icon: BarChart3 },
      { path: '/admin/achievements', label: '成果展示', icon: Award },
      { path: '/admin/quick-links', label: '快速链接', icon: Link2 },
      { path: '/admin/sidebar-widgets', label: '侧边栏组件', icon: Sidebar },
    ],
  },
  { path: '/admin/upload', label: '文件上传', icon: Upload },
  { path: '/admin/change-logs', label: '操作记录/撤回', icon: History },
  { path: '/admin/page-blocks', label: '页面区块管理', icon: LayoutGrid },
  {
    path: '/admin/activity-review',
    label: '活动回顾管理',
    icon: Calendar,
    children: [
      { path: '/admin/activity-review', label: '活动回顾', icon: Calendar },
    ],
  },
  {
    path: '/admin/student-works',
    label: '学生作品管理',
    icon: Image,
    children: [
      { path: '/admin/student-works', label: '学生作品', icon: Image },
    ],
  },
  {
    path: '/admin/promise-wall',
    label: '承诺墙管理',
    icon: Heart,
    children: [
      { path: '/admin/promise-wall', label: '承诺签名', icon: Heart },
    ],
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['站点设置', '内容管理', '普法专题', '团队合作', '数据展示']);
  const { isAuthenticated, admin, logout, checkAuth } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const isChildActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some((child) => location.pathname === child.path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 bg-emerald-600">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5 text-emerald-600" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-base text-white">法润青苗</h1>
              <p className="text-xs text-emerald-100">后台管理系统</p>
            </div>
          )}
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.label);
            const childActive = isChildActive(item.children);

            if (hasChildren) {
              return (
                <div key={item.path}>
                  <button
                    onClick={() => sidebarOpen && toggleMenu(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive || childActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>
                  {sidebarOpen && isExpanded && item.children && (
                    <div className="mt-1 ml-4 space-y-1 border-l border-slate-200 pl-3">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childIsActive = location.pathname === child.path;
                        return (
                          <button
                            key={child.path}
                            onClick={() => navigate(child.path)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                              childIsActive
                                ? 'bg-emerald-100 text-emerald-700 font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            <ChildIcon className="w-4 h-4 flex-shrink-0" />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 bg-white">
          {sidebarOpen && admin && (
            <div className="mb-3 px-3 py-2.5 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700">{admin.name || admin.username}</p>
              <p className="text-xs text-slate-500">{admin.role === 'super_admin' ? '超级管理员' : '管理员'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">欢迎回来，{admin?.name || admin?.username}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
