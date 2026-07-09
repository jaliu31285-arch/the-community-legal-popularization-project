import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteStyle } from '@/hooks/useSiteStyle';
import HomeStyleB from './home/HomeStyleB';
import HomeStyleC from './home/HomeStyleC';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Users,
  BookOpen,
  Flag,
  Shield,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';
import { api } from '@/services/api';

const defaultTopics = [
  { id: 1, title: '校园欺凌与网络暴力', description: '认识校园欺凌与网络暴力，学会自我保护', icon: 'AlertTriangle', color: 'green', route: '/cyberbullying', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anti%20bullying%20campus%20safety%20poster%20with%20shield%20and%20students%20blue%20green%20gradient%20style&image_size=landscape_4_3' },
  { id: 2, title: '网络诈骗防范', description: '识破诈骗套路，守护财产安全', icon: 'Shield', color: 'warm', route: '/fraud', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fraud%20prevention%20poster%20with%20lock%20and%20warning%20symbols%20orange%20yellow%20gradient%20style&image_size=landscape_4_3' },
  { id: 3, title: '不良行为矫治与权益保护', description: '认清不良行为危害，掌握权益保护技巧', icon: 'Scale', color: 'green', route: '/consumption', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=juvenile%20rights%20protection%20legal%20education%20poster%20with%20scale%20and%20shield%20purple%20blue%20gradient%20style&image_size=landscape_4_3' },
];

const defaultNews = [
  { id: 1, title: '暑期实践活动正式启动', summary: '四川大学"法暖万家·守护朝夕"团队走进社区，开展网络安全普法活动', category: '活动动态', date: '2024-07-01', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=community%20legal%20education%20activity%20with%20young%20volunteers%20and%20students%20outdoor%20event&image_size=portrait_4_3' },
  { id: 2, title: '网络安全知识讲座圆满结束', summary: '专家为青少年讲解网络安全知识，互动问答环节气氛热烈', category: '实践纪实', date: '2024-07-02', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cybersecurity%20seminar%20for%20teenagers%20with%20presentation%20slides%20modern%20classroom&image_size=portrait_4_3' },
  { id: 3, title: '青少年网络安全公约发布', summary: '参与活动的青少年共同签署网络安全公约，承诺文明上网', category: '普法资讯', date: '2024-07-03', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=teenagers%20signing%20internet%20safety%20agreement%20in%20formal%20ceremony%20bright%20room&image_size=portrait_4_3' },
  { id: 4, title: '反诈主题情景剧精彩上演', summary: '同学们自编自导反诈情景剧，寓教于乐普及反诈知识', category: '活动动态', date: '2024-07-04', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=students%20performing%20anti%20fraud%20drama%20on%20stage%20with%20costumes%20school%20theater&image_size=portrait_4_3' },
  { id: 5, title: '普法进社区活动获家长好评', summary: '活动受到社区居民广泛好评，家长纷纷表示受益匪浅', category: '实践纪实', date: '2024-07-05', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20parents%20and%20children%20at%20community%20legal%20fair%20colorful%20booths&image_size=portrait_4_3' },
  { id: 6, title: '网络安全知识竞赛成功举办', summary: '同学们积极参与网络安全知识竞赛，掀起学习热潮', category: '活动动态', date: '2024-07-06', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=knowledge%20competition%20event%20with%20students%20raising%20hands%20quiz%20show%20style&image_size=portrait_4_3' },
];

const defaultAnnouncements = [
  { id: 1, title: '关于开展"我与法治"故事征集活动的通知', date: '2024-07-01', is_sticky: 1, image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=story%20competition%20announcement%20poster%20with%20book%20and%20pen%20elegant%20design&image_size=square' },
  { id: 2, title: '暑期实践活动报名须知', date: '2024-06-28', is_sticky: 0 },
  { id: 3, title: '网络安全普法志愿者招募', date: '2024-06-25', is_sticky: 0 },
  { id: 4, title: '学习资源库更新通知', date: '2024-06-20', is_sticky: 0 },
];

const defaultQuickLinks = [
  { id: 1, title: '12377举报中心', link_url: 'https://www.12377.cn', icon: 'Flag', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cyber%20report%20center%20icon%20with%20flag%20symbol%20red%20and%20white%20clean%20design&image_size=square' },
  { id: 2, title: '12355青少年热线', link_url: 'http://www.12355.net', icon: 'Phone', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=helpline%20center%20icon%20with%20phone%20symbol%20blue%20and%20white%20clean%20design&image_size=square' },
  { id: 3, title: '中国普法网', link_url: 'http://www.legalinfo.gov.cn', icon: 'BookOpen', image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=legal%20education%20website%20icon%20with%20book%20symbol%20green%20and%20white%20clean%20design&image_size=square' },
];

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
  Users: <Users className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Flag: <Flag className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Calendar: <Calendar className="w-4 h-4" />,
};

export default function Home() {
  const { style, loading: styleLoading, fetchStyle } = useSiteStyle();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [newsData, setNewsData] = useState<any[]>(defaultNews);
  const [announcements, setAnnouncements] = useState<any[]>(defaultAnnouncements);
  const [quickLinks, setQuickLinks] = useState<any[]>(defaultQuickLinks);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStyle();
    const fetchData = async () => {
      try {
        const [settings, news, anns, links, stats] = await Promise.all([
          api.getSiteSettings(),
          api.getNews(),
          api.getAnnouncements(6),
          api.getQuickLinks(),
          api.getHomeStats(),
        ]);
        setSiteSettings(settings);
        setNewsData(news.slice(0, 6) || defaultNews);
        setAnnouncements(anns.length > 0 ? anns : defaultAnnouncements);
        setQuickLinks(links.length > 0 ? links : defaultQuickLinks);
        setStatsData(stats || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const bannerSlides = [
    {
      title: siteSettings.banner_title || '法润青苗',
      subtitle: siteSettings.banner_subtitle || '未成年人网络安全普法平台',
      description: siteSettings.banner_description || '守护青少年健康成长，共筑清朗网络空间',
      bg: 'from-emerald-600 via-green-500 to-teal-500',
    },
    {
      title: '拒绝网络暴力',
      subtitle: '共建友善网络环境',
      description: '学法懂法，依法维权，让网络空间充满正能量',
      bg: 'from-teal-600 via-cyan-500 to-sky-500',
    },
    {
      title: '谨防网络诈骗',
      subtitle: '守护青春钱袋子',
      description: '认清诈骗套路，提高防范意识，保护个人财产安全',
      bg: 'from-amber-500 via-orange-500 to-rose-500',
    },
  ];

  // 根据风格渲染不同首页
  if (style === 'style-b') return <HomeStyleB />;
  if (style === 'style-c') return <HomeStyleC />;

  

  // 默认 Style A - 公益组织风

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {siteSettings.banner_image ? (
              <div className="absolute inset-0">
                <img
                  src={siteSettings.banner_image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`}></div>
            )}
            <div className="container mx-auto px-4 h-full flex items-center justify-between relative z-10">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-2">
                  {slide.subtitle}
                </p>
                <p className="text-base text-white/80">
                  {slide.description}
                </p>
              </div>
              <div className="hidden lg:block w-80 h-80 flex-shrink-0">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute inset-8 bg-white/5 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-white/15 rounded-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <Shield className="w-16 h-16 mx-auto mb-2 opacity-80" />
                        <span className="text-sm font-medium opacity-90">网络安全</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-10 w-4 h-4 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-20 right-0 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-10 right-20 w-5 h-5 bg-white/35 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-0 left-10 w-3 h-3 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-8 h-1.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Main Content */}
          <div className="flex-1 space-y-8">
            {/* Three Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                  三大普法专题
                </h2>
                <Link to="/cyberbullying" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                  更多 →
                </Link>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {defaultTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      to={topic.route}
                      className="group block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all duration-300"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={topic.image_url || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(topic.title + ' 公益普法海报')}&image_size=landscape_4_3`}
                          alt={topic.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                            topic.color === 'green' ? 'bg-emerald-500' :
                            topic.color === 'warm' ? 'bg-amber-500' : 'bg-sky-500'
                          }`}>
                            {iconMap[topic.icon]}
                          </div>
                          <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                            {topic.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {topic.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* News */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                  新闻动态
                </h2>
                <Link to="/activities" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                  更多 →
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  {newsData.slice(0, 6).map((news, index) => (
                    <Link
                      key={news.id}
                      to={`/news/${news.id}`}
                      className={`block flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-300 ${index === 0 ? 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50' : ''}`}
                    >
                      <div className="w-32 h-24 md:w-40 md:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={news.image_url || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(news.title + ' 新闻图片')}&image_size=portrait_4_3`}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">
                            {news.category || '新闻'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {news.date}
                          </span>
                        </div>
                        <h3 className="text-slate-800 font-medium hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
                          {news.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {news.summary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-72 xl:w-80 space-y-6">
            {/* Announcements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-emerald-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                  网站公告
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {announcements.slice(0, 5).map((item) => (
                  <div key={item.id} className="group">
                    <Link to={`/announcements/${item.id}`} className="flex flex-col gap-2">
                      {item.image_url && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        {item.is_sticky ? (
                          <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                            置顶
                          </span>
                        ) : null}
                        <span className="text-sm text-slate-700 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            {statsData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-emerald-50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                    数据统计
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {statsData.slice(0, 4).map((stat, index) => (
                      <div key={index} className="text-center py-3 bg-slate-50 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-500">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-emerald-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                  快速链接
                </h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                          {link.image_url ? (
                            <img
                              src={link.image_url}
                              alt={link.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              {iconMap[link.icon] || <ArrowRight className="w-5 h-5" />}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium">{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                联系我们
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 opacity-80" />
                  <span className="opacity-90">{siteSettings.contact_email || 'farunqingmiao@example.com'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 opacity-80" />
                  <span className="opacity-90">{siteSettings.contact_phone || '028-XXXXXXX'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 opacity-80 mt-0.5 flex-shrink-0" />
                  <span className="opacity-90">{siteSettings.contact_address || '四川省成都市四川大学'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}