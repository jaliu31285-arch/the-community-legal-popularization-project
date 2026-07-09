import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Image, FileText, Heart, Filter } from 'lucide-react';

interface StudentWork {
  id: number;
  category: string;
  title: string;
  author: string;
  description: string;
  content: string;
  image_url: string;
  video_url: string;
}

const categoryMap: Record<string, { label: string; icon: string }> = {
  poster: { label: '海报设计', icon: 'Image' },
  card: { label: '爱心卡', icon: 'Heart' },
  essay: { label: '学法心得', icon: 'FileText' },
  video: { label: '视频作品', icon: 'Video' },
  other: { label: '其他作品', icon: 'Image' },
};

export default function StudentWorks() {
  const [works, setWorks] = useState<StudentWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWork, setSelectedWork] = useState<StudentWork | null>(null);

  useEffect(() => {
    api.getStudentWorks().then((data) => {
      setWorks(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const categories = ['all', ...new Set(works.map((w) => w.category))];

  const filteredWorks = selectedCategory === 'all' 
    ? works 
    : works.filter((w) => w.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">学生作品展示</h1>
          <p className="text-xl opacity-90">法治情景绘制 · 学法心得分享</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Filter className="w-5 h-5 text-slate-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              {cat === 'all' ? '全部作品' : categoryMap[cat]?.label || cat}
            </button>
          ))}
        </div>

        {filteredWorks.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">暂无作品数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => (
              <div
                key={work.id}
                onClick={() => setSelectedWork(work)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border border-slate-100 group"
              >
                <div className="aspect-video bg-slate-100 relative">
                  {work.image_url ? (
                    <img
                      src={work.image_url}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      {work.category === 'essay' ? (
                        <FileText className="w-12 h-12" />
                      ) : (
                        <Image className="w-12 h-12" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-slate-700">
                    {categoryMap[work.category]?.label || work.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {work.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-3">{work.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">作者：{work.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedWork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedWork(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {selectedWork.image_url && (
                <img src={selectedWork.image_url} alt={selectedWork.title} className="w-full rounded-t-2xl" />
              )}
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {categoryMap[selectedWork.category]?.label || selectedWork.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedWork.title}</h2>
              <p className="text-slate-500 mb-4">作者：{selectedWork.author}</p>
              <p className="text-slate-600 mb-4">{selectedWork.description}</p>
              {selectedWork.content && (
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="font-semibold text-slate-800 mb-2">详细内容</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedWork.content}</p>
                </div>
              )}
              {selectedWork.video_url && (
                <div className="border-t border-slate-100 pt-4">
                  <video controls className="w-full rounded-lg" preload="metadata">
                    <source src={selectedWork.video_url} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}