import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Calendar, ArrowRight, Phone, Mail, MapPin, Shield, AlertTriangle, ShoppingBag, Heart, Sparkles, Star, Zap } from 'lucide-react';
import { api } from '@/services/api';

const defaultTopics = [
  { id: 1, title: '拒绝网络暴力', description: '认识网络暴力的危害', icon: 'AlertTriangle', color: 'from-pink-500 to-rose-500', route: '/cyberbullying' },
  { id: 2, title: '谨防网络诈骗', description: '识破诈骗套路', icon: 'Shield', color: 'from-orange-500 to-amber-500', route: '/fraud' },
  { id: 3, title: '理性消费成长', description: '远离消费陷阱', icon: 'ShoppingBag', color: 'from-purple-500 to-violet-500', route: '/consumption' },
];

const defaultNews = [
  { id: 1, title: '暑期实践活动正式启动', summary: '四川大学"法暖万家·守护朝夕"团队走进社区', category: '活动动态', date: '2024-07-01' },
  { id: 2, title: '网络安全知识讲座圆满结束', summary: '互动问答环节气氛热烈', category: '实践纪实', date: '2024-07-02' },
  { id: 3, title: '青少年网络安全公约发布', summary: '承诺文明上网', category: '普法资讯', date: '2024-07-03' },
  { id: 4, title: '反诈情景剧精彩上演', summary: '寓教于乐普及反诈知识', category: '活动动态', date: '2024-07-04' },
  { id: 5, title: '普法进社区获家长好评', summary: '家长纷纷表示受益匪浅', category: '实践纪实', date: '2024-07-05' },
  { id: 6, title: '知识竞赛成功举办', summary: '掀起学习热潮', category: '活动动态', date: '2024-07-06' },
];

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
  Heart: <Heart className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Phone: <Phone className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
};

export default function HomeStyleC() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [newsData, setNewsData] = useState<any[]>(defaultNews);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, news, anns, stats] = await Promise.all([
          api.getSiteSettings(), api.getNews(), api.getAnnouncements(6), api.getHomeStats(),
        ]);
        setSiteSettings(settings);
        setNewsData(news.length > 0 ? news.slice(0, 6) : defaultNews);
        setAnnouncements(anns.length > 0 ? anns : []);
        setStatsData(stats || []);
      } catch (e) { /* use defaults */ } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  const gradientColors = [
    'from-violet-600 via-pink-500 to-orange-400',
    'from-cyan-500 via-blue-500 to-purple-600',
    'from-emerald-400 via-teal-500 to-blue-500',
  ];

  const bannerSlides = [
    { title: '法润青苗', subtitle: '一起守护少年的你', emoji: '🌱' },
    { title: '拒绝网络暴力', subtitle: '让网络充满阳光', emoji: '🛡️' },
    { title: '谨防网络诈骗', subtitle: '做个聪明的冲浪人', emoji: '🔍' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* 大Banner - 青春风格 */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index]}`}></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full blur-2xl"></div>
            </div>
            <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
              <div className="text-center">
                <div className="text-6xl md:text-8xl mb-6 animate-bounce-slow">{slide.emoji}</div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">{slide.title}</h1>
                <p className="text-xl md:text-2xl text-white/80 font-light">{slide.subtitle}</p>
                <div className="flex justify-center gap-4 mt-8">
                  <Link to="/cyberbullying" className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all shadow-lg">
                    开始探索
                  </Link>
                  <Link to="/about" className="px-8 py-4 bg-white/20 text-white rounded-full font-bold text-lg hover:bg-white/30 transition-all">
                    了解我们
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {bannerSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/40'}`} />
          ))}
        </div>
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* 核心内容区 */}
      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* 三大专题 - 卡片风格 */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">✦ 普法专题</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">守护少年的你</h2>
            <p className="text-slate-500 mt-3 text-lg">三大核心专题，为你的网络安全保驾护航</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {defaultTopics.map((topic, i) => (
              <Link key={i} to={topic.route} className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative p-8 text-white min-h-[280px] flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <div className="text-white">{iconMap[topic.icon]}</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{topic.title}</h3>
                    <p className="text-white/80">{topic.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 font-medium mt-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    开始学习 <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 统计数据 - 动态数字 */}
        <section>
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: '服务青少年', value: '500+', emoji: '👥', color: 'text-pink-500' },
                { label: '志愿时长', value: '1000+', emoji: '⏱️', color: 'text-orange-500' },
                { label: '普法课程', value: '20+', emoji: '📚', color: 'text-purple-500' },
                { label: '服务社区', value: '12', emoji: '🏘️', color: 'text-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.emoji}</div>
                  <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 新闻动态 - 瀑布流 */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">✦ 最新动态</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">发生了什么？</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.map((news, i) => (
              <Link key={i} to={`/news/${news.id}`} className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all ${i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
                <div className={`p-6 ${i === 0 ? 'md:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${i === 0 ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>{news.category}</span>
                    <span className={`text-xs ${i === 0 ? 'text-white/60' : 'text-slate-400'}`}>{news.date}</span>
                  </div>
                  <h3 className={`font-bold mb-2 ${i === 0 ? 'text-2xl text-white' : 'text-lg text-slate-800 group-hover:text-purple-600 transition-colors'}`}>{news.title}</h3>
                  <p className={`text-sm ${i === 0 ? 'text-white/80' : 'text-slate-500'} line-clamp-2`}>{news.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 公告 */}
        {announcements.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">📢 最新公告</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              {announcements.slice(0, 5).map((ann, i) => (
                <Link key={i} to={`/announcements/${ann.id}`} className="block bg-white rounded-2xl p-5 border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-purple-600 transition-colors">{ann.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {ann.is_sticky === 1 && <span className="text-xs px-2 py-1 bg-red-100 text-red-500 rounded-full font-medium">置顶</span>}
                      <span className="text-xs text-slate-400">{ann.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 底部 */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 p-10 md:p-16 text-white text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black mb-4">一起守护少年的你</h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">四川大学"法暖万家·守护朝夕"团队，与您携手共建清朗网络空间</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4" /> {siteSettings.contact_phone || '028-XXXXXXX'}
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4" /> {siteSettings.contact_email || 'farunqingmiao@example.com'}
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" /> {siteSettings.contact_address || '四川大学'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}