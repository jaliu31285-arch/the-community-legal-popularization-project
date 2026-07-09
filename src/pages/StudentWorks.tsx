import { useState, useEffect } from 'react';
import { Image, FileText, Grid3X3, Layers, Tag, Heart } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

interface StudentWork {
  id: number;
  title: string;
  category: string;
  author: string;
  description: string;
  image_url: string;
  content_text: string;
  created_at: string;
}

const defaultWorks: StudentWork[] = [
  {
    id: 1,
    title: '友善评论爱心卡',
    category: '爱心卡',
    author: '小明',
    description: '用温暖的语言传递正能量',
    image_url: '',
    content_text: '网络世界也需要温暖，让我们用友善的评论传递爱与正能量。每一句鼓励的话语，都可能成为他人前进的动力。',
    created_at: '2026-07-21',
  },
  {
    id: 2,
    title: '法治宣传海报',
    category: '海报设计',
    author: '小红',
    description: '青少年法治教育主题海报',
    image_url: '',
    content_text: '',
    created_at: '2026-07-21',
  },
  {
    id: 3,
    title: '学法心得',
    category: '心得体会',
    author: '小华',
    description: '参加法治营会的心得体会',
    image_url: '',
    content_text: '通过这次法治营会，我学到了很多法律知识，明白了什么是校园欺凌，如何保护自己。感谢人大代表和检察官叔叔阿姨们的悉心教导！',
    created_at: '2026-07-21',
  },
];

const categories = ['全部', '爱心卡', '海报设计', '心得体会', '绘画作品', '其他'];

export default function StudentWorks() {
  const [works, setWorks] = useState<StudentWork[]>([]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedWork, setSelectedWork] = useState<StudentWork | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getStudentWorks();
        if (data && data.enabled === false) {
          setIsEnabled(false);
        } else if (data && data.works) {
          setWorks(data.works);
        } else {
          setWorks(defaultWorks);
        }
      } catch (error) {
        console.error('Failed to fetch student works:', error);
        setWorks(defaultWorks);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredWorks = activeCategory === '全部'
    ? works
    : works.filter(w => w.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <PageBanner
            title="学生作品"
            subtitle="青春笔触 法治心声"
            bgColor="from-emerald-600 to-teal-600"
          />
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-lg">学生作品展示即将上线，敬请期待...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageBanner
        title="学生作品"
        subtitle="青春笔触 法治心声"
        bgColor="from-emerald-600 to-teal-600"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorks.map(work => (
            <div
              key={work.id}
              onClick={() => setSelectedWork(work)}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100 to-teal-100 relative overflow-hidden">
                {work.image_url ? (
                  <img
                    src={work.image_url}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {work.category === '心得体会' || work.category === '其他' ? (
                      <FileText className="w-16 h-16 text-emerald-400" />
                    ) : (
                      <Image className="w-16 h-16 text-emerald-400" />
                    )}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-emerald-700">
                    {work.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{work.title}</h3>
                <p className="text-sm text-slate-500 mb-2">作者：{work.author}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{work.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-16">
            <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">该分类暂无作品</p>
          </div>
        )}
      </div>

      {selectedWork && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 relative">
              {selectedWork.image_url ? (
                <img
                  src={selectedWork.image_url}
                  alt={selectedWork.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-24 h-24 text-emerald-400" />
                </div>
              )}
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  {selectedWork.category}
                </span>
                <span className="text-sm text-slate-400">{selectedWork.created_at}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedWork.title}</h2>
              <p className="text-slate-500 mb-4">作者：{selectedWork.author}</p>
              <p className="text-slate-600 leading-relaxed">{selectedWork.description}</p>
              {selectedWork.content_text && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-3">作品内容</h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedWork.content_text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
