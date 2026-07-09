import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { api } from '@/services/api';

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [footerSections, setFooterSections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, sections] = await Promise.all([
          api.getSiteSettings(),
          api.getFooterSections(),
        ]);
        setSiteSettings(settings);
        setFooterSections(sections);
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      }
    };
    fetchData();
  }, []);

  const siteName = siteSettings.site_name || '法润青苗';
  const siteSubtitle = siteSettings.site_subtitle || '未成年人网络安全普法平台';
  const siteDescription = siteSettings.site_description || '四川大学"法暖万家·守护朝夕"团队打造的未成年人网络安全普法公益平台，守护青少年健康成长，共筑清朗网络空间。';
  const contactEmail = siteSettings.contact_email || 'farunqingmiao@example.com';
  const contactPhone = siteSettings.contact_phone || '028-XXXXXXX';
  const contactAddress = siteSettings.contact_address || '四川省成都市四川大学';
  const copyright = siteSettings.copyright || '© 2024 法润青苗 - 四川大学"法暖万家·守护朝夕"团队';
  const icpNumber = siteSettings.icp_number || '';

  const renderSectionContent = (section: any) => {
    const type = section.section_type;
    let content: any = section.content || {};
    if (typeof content === 'string') {
      try {
        content = content ? JSON.parse(content) : {};
      } catch (e) {
        content = {};
      }
    }

    if (type === 'links') {
      const links = Array.isArray(content) ? content : [];
      return (
        <ul className="space-y-3">
          {links.map((link: any, index: number) => (
            <li key={index}>
              {link.url && link.url.startsWith('/') ? (
                <Link to={link.url} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a href={link.url || '#'} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (type === 'contact') {
      return (
        <ul className="space-y-4">
          {content.address && (
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-slate-400 text-sm">{content.address}</span>
            </li>
          )}
          {content.email && (
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-400 text-sm">{content.email}</span>
            </li>
          )}
          {content.phone && (
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-400 text-sm">{content.phone}</span>
            </li>
          )}
        </ul>
      );
    }

    return null;
  };

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{siteName}</h3>
                <p className="text-slate-400 text-xs">{siteSubtitle}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {siteDescription}
            </p>
            <div className="flex gap-2">
              <a
                href={`mailto:${contactEmail}`}
                className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${contactPhone}`}
                className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.id}>
              <h4 className="font-semibold text-base mb-4 text-white">{section.title}</h4>
              {renderSectionContent(section)}
            </div>
          ))}

          {footerSections.length === 0 && (
            <>
              <div>
                <h4 className="font-semibold text-base mb-4 text-white">快速导航</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      首页
                    </Link>
                  </li>
                  <li>
                    <Link to="/cyberbullying" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      校园欺凌与网络暴力
                    </Link>
                  </li>
                  <li>
                    <Link to="/fraud" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      网络诈骗与网络造谣
                    </Link>
                  </li>
                  <li>
                    <Link to="/consumption" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      不良行为矫治与权益保护
                    </Link>
                  </li>
                  <li>
                    <Link to="/activity-review" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      活动回顾
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-base mb-4 text-white">更多栏目</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/resources" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      学习资源库
                    </Link>
                  </li>
                  <li>
                    <Link to="/achievements" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      项目成果展示
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      关于我们
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-base mb-4 text-white">联系我们</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{contactAddress}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{contactEmail}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{contactPhone}</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-sm">
            {copyright}
          </p>
          {icpNumber && (
            <p className="text-slate-500 text-sm">
              {icpNumber}
            </p>
          )}
          <p className="text-slate-500 text-sm flex items-center gap-1">
            用 <Heart className="w-4 h-4 text-red-400 fill-red-400" /> 守护青少年成长
          </p>
        </div>
      </div>
    </footer>
  );
}
