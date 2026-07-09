import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, ExternalLink, Download, FileText } from 'lucide-react';
import { api } from '@/services/api';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const data = await api.getNewsById(Number(id));
        setNews(data);
      } catch (err: any) {
        setError(err.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
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

  if (error || !news) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error || '新闻不存在'}</p>
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

  const contentType = news.content_type || 'text';

  const effectiveType = (() => {
    if (contentType === 'file' && news.file_url) return 'file';
    if (contentType === 'link' && news.link_url) return 'link';
    if (contentType === 'text' && news.content) return 'text';
    if (news.file_url) return 'file';
    if (news.link_url) return 'link';
    if (news.content) return 'text';
    return 'text';
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-16">
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
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {news.category || '新闻动态'}
              </span>
              <span className="flex items-center gap-1 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                {news.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {news.title}
            </h1>
            {news.summary && (
              <p className="text-lg text-white/80">
                {news.summary}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {news.image_url && (
              <div className="w-full h-64 md:h-80 overflow-hidden">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {effectiveType === 'text' && (
                <div className="prose prose-emerald max-w-none">
                  {news.content ? (
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                      {news.content}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">
                      暂无详细内容
                    </p>
                  )}
                </div>
              )}

              {effectiveType === 'link' && news.link_url && (
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
                        此内容为外部链接，点击下方按钮跳转查看完整内容
                      </p>
                    </div>
                    <a
                      href={news.link_url}
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

              {effectiveType === 'file' && news.file_url && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">附件文档</p>
                        <p className="text-xs text-slate-500">支持在线预览，也可下载查看</p>
                      </div>
                    </div>
                    <a
                      href={news.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载文件
                    </a>
                  </div>
                  {news.file_url.toLowerCase().endsWith('.pdf') ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <iframe
                        src={news.file_url}
                        className="w-full"
                        style={{ height: '80vh', minHeight: '600px' }}
                        title="PDF预览"
                      />
                    </div>
                  ) : news.file_url.toLowerCase().endsWith('.doc') || news.file_url.toLowerCase().endsWith('.docx') ? (
                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <iframe
                          src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(window.location.origin + news.file_url)}`}
                          className="w-full"
                          style={{ height: '80vh', minHeight: '600px' }}
                          title="Word文档预览"
                        />
                      </div>
                      <p className="text-center text-sm text-slate-500">
                        如预览加载失败，请点击上方"下载文件"按钮查看
                      </p>
                    </div>
                  ) : (
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
                          href={news.file_url}
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
