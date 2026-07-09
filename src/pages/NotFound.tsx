import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 py-16">
      <div className="text-center px-4">
        <div className="text-8xl md:text-9xl font-bold text-emerald-500 mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">页面未找到</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页继续浏览。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            返回上一页
          </button>
        </div>
      </div>
    </div>
  );
}
