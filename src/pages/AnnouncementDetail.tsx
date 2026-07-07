import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, ExternalLink, Download, FileText, Pin } from 'lucide-react';
import { api } from '@/services/api';

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;
      try {
        const data = await api.getAnnouncementById(Number(id));
        setAnnouncement(data);
      } catch (err: any) {
        setError(err.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error || '公告不存在'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            返回上页
          </button>
        </div>
      </div>
    );
  }

  const contentType = announcement.content_type || 'text';

  const effectiveType = (() => {
    if (contentType === 'file' && announcement.file_url) return 'file';
    if (contentType === 'link' && announcement.link_url) return 'link';
    if (contentType === 'text' && announcement.content) return 'text';
    if (announcement.file_url) return 'file';
    if (announcement.link_url) return 'link';
    if (announcement.content) return 'text';
    return 'text';
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              {announcement.is_sticky && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-sm">
                  <Pin className="w-3.5 h-3.5" />
                  置顶
                </span>
              )}
              <span className="flex items-center gap-1 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                {announcement.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {announcement.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {announcement.image_url && (
              <div className="w-full h-64 md:h-80 overflow-hidden">
                <img
                  src={announcement.image_url}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {effectiveType === 'text' && (
                <div className="prose prose-emerald max-w-none">
                  {announcement.content ? (
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                      {announcement.content}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">
                      暂无详细内容
                    </p>
                  )}
                </div>
              )}

              {effectiveType === 'link' && announcement.link_url && (
                <div className="text-center py-12">
                  <div className="inline-flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-2xl">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        外部链接
                      </h3>
                      <p className="text-slate-500 mb-4 text-sm">
                        此公告为外部链接，点击下方按钮跳转查看完整内容
                      </p>
                    </div>
                    <a
                      href={announcement.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
                    >
                      <ExternalLink className="w-5 h-5" />
                      查看原文
                    </a>
                  </div>
                </div>
              )}

              {effectiveType === 'file' && announcement.file_url && (
                <div className="text-center py-12">
                  <div className="inline-flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-2xl">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        文件下载
                      </h3>
                      <p className="text-slate-500 mb-4 text-sm">
                        点击下方按钮下载文件查看完整内容
                      </p>
                    </div>
                    <a
                      href={announcement.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                    >
                      <Download className="w-5 h-5" />
                      下载文件
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
