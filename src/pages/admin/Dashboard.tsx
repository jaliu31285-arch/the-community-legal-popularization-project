import { useState, useEffect } from 'react';
import {
  Image,
  Newspaper,
  Calendar,
  FolderOpen,
  Users,
  Award,
  Download,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/services/api';

const statCards = [
  { key: 'banners', label: '轮播图', icon: Image, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
  { key: 'news', label: '新闻动态', icon: Newspaper, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  { key: 'activities', label: '活动记录', icon: Calendar, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
  { key: 'resources', label: '学习资源', icon: FolderOpen, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
  { key: 'team', label: '团队成员', icon: Users, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50' },
  { key: 'achievements', label: '项目成果', icon: Award, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">仪表盘</h1>
          <p className="text-slate-500 mt-1">查看网站内容数据概览</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const value = stats?.[stat.key] || 0;
          return (
            <div
              key={stat.key}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {loading ? '...' : value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ color: 'transparent' }} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">运行中</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 下载统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">资源下载统计</h2>
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-slate-500">总下载次数</p>
              <p className="text-4xl font-bold text-slate-800 mt-1">
                {loading ? '...' : stats?.totalDownloads || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">系统状态</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-700">数据库</p>
                <p className="text-sm text-slate-500">SQLite</p>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">正常</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-700">后端服务</p>
                <p className="text-sm text-slate-500">Express API</p>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">正常</span>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '添加轮播图', icon: Image, color: 'bg-blue-500' },
            { label: '发布新闻', icon: Newspaper, color: 'bg-purple-500' },
            { label: '上传资源', icon: FolderOpen, color: 'bg-amber-500' },
            { label: '管理成员', icon: Users, color: 'bg-emerald-500' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-slate-700">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
