import { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Download,
  Eye,
  FileImage,
  Video,
  FileSpreadsheet,
  Presentation,
  Search,
} from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const typeIcons: Record<string, React.ReactNode> = {
  ppt: <Presentation className="w-6 h-6" />,
  pdf: <FileText className="w-6 h-6" />,
  doc: <FileSpreadsheet className="w-6 h-6" />,
  video: <Video className="w-6 h-6" />,
  image: <FileImage className="w-6 h-6" />,
};

const categories = ['全部', '课件PPT', '科普读物', '法律资料', '工具卡片', '实用模板', '设计素材'];

const defaultResources = [
  { id: 1, title: '网络安全普法课件', category: '课件PPT', type: 'ppt', description: '面向未成年人的网络安全普法教育课件', fileSize: '5.2 MB', coverColor: 'from-blue-500 to-blue-600', fileUrl: '' },
  { id: 2, title: '青少年网络安全口袋书', category: '科普读物', type: 'pdf', description: '漫画版网络安全知识手册，通俗易懂', fileSize: '3.8 MB', coverColor: 'from-emerald-500 to-emerald-600', fileUrl: '' },
  { id: 3, title: '反诈口诀卡片', category: '工具卡片', type: 'image', description: '朗朗上口的反诈口诀，方便记忆', fileSize: '1.2 MB', coverColor: 'from-amber-500 to-amber-600', fileUrl: '' },
  { id: 4, title: '家庭网络行为公约', category: '实用模板', type: 'doc', description: '家庭网络行为公约模板，可自定义填写', fileSize: '256 KB', coverColor: 'from-purple-500 to-purple-600', fileUrl: '' },
  { id: 5, title: '网络暴力防范指南', category: '法律资料', type: 'pdf', description: '详细介绍网络暴力的定义、危害及应对方法', fileSize: '2.1 MB', coverColor: 'from-rose-500 to-rose-600', fileUrl: '' },
  { id: 6, title: '网络诈骗案例集', category: '科普读物', type: 'pdf', description: '精选未成年人高发诈骗案例及防范措施', fileSize: '4.5 MB', coverColor: 'from-violet-500 to-violet-600', fileUrl: '' },
];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<any[]>(defaultResources);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getResources();
        setResources(data.length > 0 ? data : defaultResources);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
        setResources(defaultResources);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResources = resources.filter((resource) => {
    const matchCategory = activeCategory === '全部' || resource.category === activeCategory;
    const matchSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      <PageBanner
        title="学习资源库"
        subtitle="丰富的普法学习资料免费下载"
        gradient="from-cyan-600 via-sky-500 to-blue-500"
        icon={<BookOpen className="w-10 h-10 text-white" />}
      />

      {/* Search & Filter */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索学习资源..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-lg shadow-primary-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <p className="text-slate-500">
              共找到 <span className="font-bold text-primary-600">{filteredResources.length}</span> 个资源
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={resource.id} resource={resource} index={index} />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">暂无相关资源</h3>
              <p className="text-slate-500">试试其他关键词或分类吧</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ResourceCard({ resource, index }: { resource: any; index: number }) {
  const hasFile = !!resource.file_url;
  const hasLink = !!resource.link_url;
  const actionUrl = resource.file_url || resource.link_url;
  const isExternalLink = !hasFile && hasLink;

  const handleAction = () => {
    if (!actionUrl) return;
    if (hasFile) {
      try {
        api.createResource({ ...resource, download_count: (resource.download_count || 0) + 1 }).catch(() => {});
      } catch (error) {
        console.error('Failed to update download count:', error);
      }
    }
    window.open(actionUrl, '_blank');
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Cover */}
      <div className={`h-40 bg-gradient-to-br ${resource.cover_color || 'from-blue-500 to-blue-600'} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10 text-white text-center">
          <div className="w-14 h-14 mx-auto mb-2 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            {typeIcons[resource.type] || typeIcons['pdf']}
          </div>
          <p className="text-sm font-medium uppercase tracking-wide opacity-90">{resource.type}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {resource.category}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {resource.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{resource.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">{resource.file_size}</span>
          <div className="flex gap-2">
            {actionUrl && (
              <button 
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors" 
                onClick={() => window.open(actionUrl, '_blank')}
                title={isExternalLink ? '查看链接' : '预览'}
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
            {actionUrl && (
              <button 
                className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors" 
                onClick={handleAction}
                title={isExternalLink ? '访问链接' : '下载'}
              >
                {isExternalLink ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
