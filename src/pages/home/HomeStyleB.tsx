import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Calendar, ArrowRight, Phone, Mail, MapPin, Users, BookOpen, Flag, Shield, AlertTriangle, ShoppingBag, ExternalLink, Megaphone, Award, TrendingUp } from 'lucide-react';
import { api } from '@/services/api';

const defaultBanners = [
  { title: '法治护航 少年成长', subtitle: '人大代表联动未检职能社区青少年法治教育主题营会', description: '守护青少年健康成长，共筑清朗网络空间', bg: 'from-blue-700 via-indigo-700 to-blue-800' },
  { title: '抵制校园欺凌与网络暴力', subtitle: '共建友善网络环境', description: '学法懂法，依法维权', bg: 'from-indigo-700 via-blue-700 to-sky-700' },
  { title: '防范网络诈骗与造谣', subtitle: '守护青春钱袋子', description: '认清诈骗套路，提高防范意识', bg: 'from-red-700 via-rose-700 to-orange-700' },
];

const defaultTopics = [
  { id: 1, title: '校园欺凌与网络暴力', description: '认识校园欺凌与网络暴力，学会自我保护，共建友善网络空间', icon: 'AlertTriangle', route: '/cyberbullying' },
  { id: 2, title: '网络诈骗与网络造谣', description: '识破诈骗套路，远离网络造谣，守护财产安全', icon: 'Shield', route: '/fraud' },
  { id: 3, title: '不良行为矫治与权益保护', description: '认清不良行为危害，掌握权益保护技巧，健康快乐成长', icon: 'ShoppingBag', route: '/consumption' },
];

const defaultNews = [
  { id: 1, title: '暑期实践活动正式启动', summary: '四川大学"法暖万家·守护朝夕"团队走进社区，开展网络安全普法活动', category: '活动动态', date: '2024-07-01' },
  { id: 2, title: '网络安全知识讲座圆满结束', summary: '专家为青少年讲解网络安全知识，互动问答环节气氛热烈', category: '实践纪实', date: '2024-07-02' },
  { id: 3, title: '青少年网络安全公约发布', summary: '参与活动的青少年共同签署网络安全公约，承诺文明上网', category: '普法资讯', date: '2024-07-03' },
  { id: 4, title: '反诈主题情景剧精彩上演', summary: '同学们自编自导反诈情景剧，寓教于乐普及反诈知识', category: '活动动态', date: '2024-07-04' },
];

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
  Flag: <Flag className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Calendar: <Calendar className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
};

export default function HomeStyleB() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [newsData, setNewsData] = useState<any[]>(defaultNews);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, news, anns, stats] = await Promise.all([
          api.getSiteSettings(), api.getNews(), api.getAnnouncements(6), api.getHomeStats(),
        ]);
        setSiteSettings(settings);
        setNewsData(news.slice(0, 4) || defaultNews);
        setAnnouncements(anns.length > 0 ? anns : []);
        setStatsData(stats || []);
      } catch (e) { /* use defaults */ }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const bannerSlides = [
    { title: siteSettings.banner_title || '法润青苗', subtitle: siteSettings.banner_subtitle || '未成年人网络安全普法平台', description: siteSettings.banner_description || '守护青少年健康成长，共筑清朗网络空间', bg: 'from-blue-700 via-indigo-700 to-blue-800' },
    { title: '拒绝网络暴力', subtitle: '共建友善网络环境', description: '学法懂法，依法维权，让网络空间充满正能量', bg: 'from-indigo-700 via-blue-700 to-sky-700' },
    { title: '谨防网络诈骗', subtitle: '守护青春钱袋子', description: '认清诈骗套路，提高防范意识，保护个人财产安全', bg: 'from-red-700 via-rose-700 to-orange-700' },
  ];

  const contactInfo = {
    email: siteSettings.contact_email || 'farunqingmiao@example.com',
    phone: siteSettings.contact_phone || '028-XXXXXXX',
    address: siteSettings.contact_address || '四川省成都市四川大学',
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 顶部信息栏 */}
      <div className="bg-slate-900 text-white/80 text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>欢迎访问四川大学"法暖万家·守护朝夕"团队普法平台</span>
          <div className="flex items-center gap-4">
            <span>📞 {contactInfo.phone}</span>
            <span>📧 {contactInfo.email}</span>
          </div>
        </div>
      </div>

      {/* 大Banner - 政务风格 */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`}></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
              <div className="max-w-3xl">
                <div className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-medium rounded mb-4">政府普法教育平台</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
                <p className="text-xl md:text-2xl text-white/90 mb-2">{slide.subtitle}</p>
                <p className="text-base text-white/70 max-w-xl">{slide.description}</p>
                <div className="flex gap-3 mt-6">
                  <Link to="/cyberbullying" className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-lg">开始学习</Link>
                  <Link to="/about" className="px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors">了解更多</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-10 h-1 rounded-full transition-all ${i === currentSlide ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* 统计数据 - 政务风格 */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: '服务青少年', value: '500+', icon: '👥' },
              { label: '志愿时长', value: '1000+', icon: '⏱️' },
              { label: '普法课程', value: '20+', icon: '📚' },
              { label: '服务社区', value: '12', icon: '🏘️' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-700">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 主内容区 - 单栏通栏 */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* 三大专题 */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">普法学习专题</h2>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-4"></div>
            <p className="text-slate-500 mt-3">聚焦未成年人网络安全核心议题，开展系统化普法教育</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {defaultTopics.map((topic, i) => (
              <Link key={i} to={topic.route} className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className={`h-2 bg-gradient-to-r ${i === 0 ? 'from-blue-600 to-blue-400' : i === 1 ? 'from-red-600 to-orange-400' : 'from-purple-600 to-pink-400'}`}></div>
                <div className="p-8">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {iconMap[topic.icon]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{topic.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{topic.description}</p>
                  <div className="flex items-center gap-1 text-blue-600 font-medium text-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    进入专题 <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 新闻动态 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">新闻动态</h2>
              <div className="w-12 h-1 bg-blue-600 mt-2"></div>
            </div>
            <Link to="/activities" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              查看更多 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {newsData.map((news, i) => (
              <Link key={i} to={`/news/${news.id}`} className="flex gap-4 bg-white rounded-lg border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{news.category}</span>
                    <span className="text-xs text-slate-400">{news.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">{news.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{news.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 公告 */}
        {announcements.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">网站公告</h2>
              <div className="w-12 h-1 bg-red-500 mx-auto mt-2"></div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
              {announcements.slice(0, 5).map((ann, i) => (
                <Link key={i} to={`/announcements/${ann.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group">
                  <Megaphone className={`w-5 h-5 flex-shrink-0 ${ann.is_sticky ? 'text-red-500' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{ann.title}</span>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{ann.date}</span>
                  {ann.is_sticky === 1 && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded flex-shrink-0">置顶</span>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 底部联系 */}
        <section className="bg-slate-800 rounded-xl p-8 text-white">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">联系我们</h3>
              <div className="space-y-3 text-sm text-white/70">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {contactInfo.phone}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {contactInfo.email}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {contactInfo.address}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">快速链接</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.12377.cn" target="_blank" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /> 12377举报中心</a>
                <a href="http://www.12355.net" target="_blank" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /> 12355青少年热线</a>
                <a href="http://www.legalinfo.gov.cn" target="_blank" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /> 中国普法网</a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">关于我们</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                四川大学"法暖万家·守护朝夕"团队致力于未成年人网络安全普法教育，通过线上线下相结合的方式，为青少年健康成长保驾护航。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}