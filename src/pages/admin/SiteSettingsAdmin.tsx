import { useState, useEffect } from 'react';
import { Save, Loader2, Settings, Upload, ExternalLink, Info, MapPin, Image, FileText, Phone, Mail, MapPinIcon, Shield, Type, Palette } from 'lucide-react';
import { api, uploadFile } from '@/services/api';

interface SettingItem {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
}

interface SettingGroup {
  name: string;
  icon: React.ReactNode;
  description: string;
  items: SettingItem[];
}

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getAllSettings();
      setSettings(data);
      const initial: Record<string, any> = {};
      data.forEach((s: SettingItem) => {
        initial[s.setting_key] = s.setting_value || '';
      });
      setFormData(initial);
    } catch (error: any) {
      alert(error.message || '获取设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveSettings(formData);
      alert('保存成功');
      await fetchSettings();
    } catch (error: any) {
      alert(error.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const result = await uploadFile(file, 'image');
      setFormData((prev) => ({ ...prev, [key]: result.url }));
    } catch (error: any) {
      alert(error.message || '上传失败');
    } finally {
      setUploadingKey(null);
    }
  };

  const isImageSetting = (key: string) => {
    const imageSettingKeys = ['logo_url', 'banner_image'];
    return imageSettingKeys.includes(key);
  };

  const getSettingHelpText = (key: string): string => {
    const helpMap: Record<string, string> = {
      site_name: '显示在浏览器标签页和导航栏的网站名称',
      site_subtitle: '网站的副标题或口号，显示在首页Banner和网站标题旁',
      site_description: '网站的简介，用于SEO和首页展示',
      logo_url: '网站Logo图片，推荐尺寸200x60，支持PNG透明背景',
      contact_email: '公开的联系邮箱，显示在页脚和联系我们区域',
      contact_phone: '公开的联系电话，显示在页脚和联系我们区域',
      contact_address: '联系地址，显示在页脚和联系我们区域',
      icp_number: '网站备案号，显示在网站底部',
      copyright: '版权声明文字，显示在网站最底部',
      banner_title: '首页大Banner的主标题文字',
      banner_subtitle: '首页大Banner的副标题文字',
      banner_description: '首页大Banner的描述文字',
      banner_image: '首页大Banner的背景图片，推荐尺寸1920x600',
    };
    return helpMap[key] || '';
  };

  const getSettingFormatHint = (key: string): string => {
    if (isImageSetting(key)) {
      return 'https://... 或 /uploads/xxx.jpg 或上传本地图片';
    }
    if (key.includes('email')) {
      return 'example@domain.com';
    }
    if (key.includes('phone')) {
      return '028-XXXXXXX 或 138XXXXXXXX';
    }
    return '';
  };

  const groupedSettings = settings.reduce((acc: Record<string, SettingGroup>, setting) => {
    let groupName = '其他设置';
    let groupIcon = <Settings className="w-5 h-5" />;
    let groupDesc = '';
    const key = setting.setting_key;
    
    if (key.startsWith('site_') || key.startsWith('logo_')) {
      groupName = '基本信息';
      groupIcon = <Type className="w-5 h-5" />;
      groupDesc = '网站的基本标识和介绍信息';
    } else if (key.startsWith('banner_')) {
      groupName = '首页Banner';
      groupIcon = <Image className="w-5 h-5" />;
      groupDesc = '首页顶部大Banner的文字和背景设置';
    } else if (key.startsWith('contact_')) {
      groupName = '联系方式';
      groupIcon = <Phone className="w-5 h-5" />;
      groupDesc = '对外公开的联系信息，显示在页脚和联系页面';
    } else if (key.startsWith('copyright') || key.startsWith('icp_')) {
      groupName = '底部信息';
      groupIcon = <Shield className="w-5 h-5" />;
      groupDesc = '网站底部的版权和备案信息';
    }
    
    if (!acc[groupName]) {
      acc[groupName] = { name: groupName, icon: groupIcon, description: groupDesc, items: [] };
    }
    acc[groupName].items.push(setting);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-7 h-7 text-emerald-600" />
            站点设置
          </h1>
          <p className="text-slate-500 mt-1">管理网站的基本配置信息，所有修改实时生效</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          保存设置
        </button>
      </div>

      {/* 前端位置说明 */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-emerald-800">前端对应位置</p>
          <p className="text-sm text-emerald-700 mt-0.5">
            全站：影响网站的标题、Logo、联系方式、页脚等全局元素
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([groupName, group]) => (
          <div key={groupName} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  {group.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">{group.name}</h2>
                  <p className="text-sm text-slate-500">{group.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.items.map((setting) => {
                  const isImage = isImageSetting(setting.setting_key);
                  const helpText = getSettingHelpText(setting.setting_key);
                  const formatHint = getSettingFormatHint(setting.setting_key);
                  
                  return (
                    <div key={setting.id} className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        {setting.description || setting.setting_key}
                      </label>
                      
                      {isImage ? (
                        <div className="space-y-3">
                          {formData[setting.setting_key] && (
                            <img
                              src={formData[setting.setting_key]}
                              alt="预览"
                              className="max-h-24 rounded-lg object-contain border border-slate-200 bg-slate-50 p-2"
                            />
                          )}
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors w-fit">
                            <Upload className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-600">
                              {uploadingKey === setting.setting_key ? '上传中...' : '点击上传图片'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(setting.setting_key, file);
                              }}
                            />
                          </label>
                          <div className="relative">
                            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={formData[setting.setting_key] || ''}
                              onChange={(e) => setFormData({ ...formData, [setting.setting_key]: e.target.value })}
                              placeholder="或输入图片URL链接"
                              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      ) : setting.setting_type === 'textarea' ? (
                        <textarea
                          value={formData[setting.setting_key] || ''}
                          onChange={(e) => setFormData({ ...formData, [setting.setting_key]: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[setting.setting_key] || ''}
                          onChange={(e) => setFormData({ ...formData, [setting.setting_key]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      )}
                      
                      {helpText && (
                        <p className="text-xs text-slate-500 flex items-start gap-1">
                          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {helpText}
                        </p>
                      )}
                      
                      {formatHint && (
                        <p className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block">
                          格式：{formatHint}
                        </p>
                      )}
                      
                      <p className="text-xs text-slate-400">键名: {setting.setting_key}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          保存所有设置
        </button>
      </div>
    </div>
  );
}
