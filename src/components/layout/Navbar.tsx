import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, GraduationCap, Zap } from 'lucide-react';
import { api } from '@/services/api';
import { useSiteStyle } from '@/hooks/useSiteStyle';

const defaultNavItems = [
  { id: 1, path: '/', label: '首页' },
  { id: 2, path: '/cyberbullying', label: '网络暴力专题' },
  { id: 3, path: '/fraud', label: '网络诈骗专题' },
  { id: 4, path: '/consumption', label: '消费诱导专题' },
  { id: 5, path: '/activities', label: '活动回顾' },
  { id: 6, path: '/resources', label: '学习资源库' },
  { id: 7, path: '/achievements', label: '项目成果' },
  { id: 8, path: '/about', label: '关于我们' },
];

export default function Navbar() {
  const { style, fetchStyle } = useSiteStyle();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<any[]>(defaultNavItems);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const location = useLocation();

  useEffect(() => {
    fetchStyle();
    const fetchData = async () => {
      try {
        const [nav, settings] = await Promise.all([
          api.getNav(),
          api.getSiteSettings(),
        ]);
        if (nav && nav.length > 0) {
          setNavItems(nav);
        }
        setSiteSettings(settings);
      } catch (error) {
        console.error('Failed to fetch nav data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const siteName = siteSettings.site_name || '法润青苗';
  const siteSubtitle = siteSettings.site_subtitle || '未成年人网络安全普法平台';

  // 风格特定的导航栏样式
  const getNavStyle = () => {
    if (style === 'style-b') {
      return isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200'
        : 'bg-[#1a3a5c]';
    }
    if (style === 'style-c') {
      return isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200'
        : 'bg-white/80 backdrop-blur-sm border-b border-slate-100';
    }
    // style-a
    return isScrolled
      ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200'
      : 'bg-emerald-600';
  };

  const getTextColor = (isActive: boolean) => {
    if (isActive) {
      if (style === 'style-b') return isScrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10';
      if (style === 'style-c') return isScrolled ? 'text-purple-600 bg-purple-50' : 'text-purple-600 bg-purple-50';
      return isScrolled ? 'text-emerald-600 bg-emerald-50' : 'text-emerald-600 bg-white';
    }
    if (style === 'style-b') return isScrolled ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10';
    if (style === 'style-c') return isScrolled ? 'text-slate-600 hover:text-purple-600 hover:bg-slate-50' : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50';
    return isScrolled ? 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50' : 'text-white hover:bg-white/10';
  };

  const getLogoIcon = () => {
    if (style === 'style-b') return <GraduationCap className="w-6 h-6 text-white" />;
    if (style === 'style-c') return <Zap className="w-6 h-6 text-purple-600" />;
    return <Sprout className="w-6 h-6 text-emerald-600" />;
  };

  const getLogoBg = () => {
    if (style === 'style-b') return 'bg-white/20';
    if (style === 'style-c') return 'bg-purple-100';
    return 'bg-white';
  };

  const getLogoTextColor = () => {
    if (style === 'style-c') return isScrolled ? 'text-slate-800' : 'text-purple-600';
    return isScrolled ? 'text-slate-800' : 'text-white';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavStyle()}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-lg ${getLogoBg()} flex items-center justify-center shadow-sm`}>
              {getLogoIcon()}
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight transition-colors ${getLogoTextColor()}`}>
                {siteName}
              </span>
              <span className={`text-xs leading-tight transition-colors ${
                isScrolled ? 'text-slate-500' : style === 'style-b' ? 'text-blue-200' : style === 'style-c' ? 'text-purple-400' : 'text-emerald-100'
              }`}>
                {siteSubtitle}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${getTextColor(isActive)}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-slate-600 hover:bg-slate-100'
                : style === 'style-b' ? 'text-white hover:bg-white/10' : style === 'style-c' ? 'text-purple-600 hover:bg-purple-50' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b border-slate-100 last:border-b-0 ${
                      isActive
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
