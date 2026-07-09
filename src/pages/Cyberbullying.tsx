import { useState, useEffect } from 'react';
import {
  Shield,
  HelpCircle,
  HeartCrack,
  Scale,
  ShieldCheck,
  Phone,
  Siren,
  Flag,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@/services/api';

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-6 h-6" />,
  HeartCrack: <HeartCrack className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Phone: <Phone className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Siren: <Siren className="w-5 h-5" />,
  Flag: <Flag className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
};

const defaultKnowledge = [
  { id: 1, title: '网络暴力定义', content: '网络暴力是指在网络空间中，利用网络技术手段对他人进行侮辱、诽谤、恐吓、人肉搜索等行为，给受害者带来身心伤害。', icon: 'HelpCircle' },
  { id: 2, title: '常见形式', content: '常见的网络暴力形式包括：侮辱性言论、恶意造谣、人肉搜索、P图恶搞、恶意刷屏、网络骚扰等。', icon: 'HeartCrack' },
  { id: 3, title: '法律法规', content: '《中华人民共和国刑法》第246条：侮辱罪、诽谤罪；《网络安全法》第12条：不得利用网络侵害他人合法权益；《未成年人保护法》第64条：保护未成年人免受网络欺凌。', icon: 'Scale' },
  { id: 4, title: '应对方法', content: '1.保持冷静，不要回应；2.保留证据，截图保存；3.设置隐私，拉黑对方；4.寻求帮助，告诉家长老师；5.依法维权，报警处理。', icon: 'ShieldCheck' },
];

const defaultCases = [
  { id: 1, title: '中学生遭人肉搜索', category: '侮辱诽谤', summary: '一名中学生因发表不同意见，被网友人肉搜索并持续辱骂', content: '案例详情：某中学生在社交媒体上发表了对某热门事件的不同看法，随即遭到部分网友的人肉搜索，个人信息被曝光，遭到持续的辱骂和威胁，导致其精神抑郁，无法正常学习和生活。', tags: ['人肉搜索', '辱骂'] },
  { id: 2, title: '女生照片被恶意P图', category: '恶意恶搞', summary: '女生照片被恶意修改传播，造成严重名誉损害', content: '案例详情：一名女生的照片被网友恶意P图后在网络上传播，照片被添加侮辱性元素，严重损害了她的名誉。尽管最终侵权者被依法处理，但对当事人造成的心理伤害难以弥补。', tags: ['P图', '名誉侵权'] },
];

const defaultHelpChannels = [
  { title: '12377', phone: '12377', description: '网络违法与不良信息举报中心', icon: 'Siren' },
  { title: '12355', phone: '12355', description: '青少年维权热线', icon: 'Phone' },
  { title: '家长老师', phone: '-', description: '最直接的求助对象', icon: 'Shield' },
  { title: '公安机关', phone: '110', description: '严重情况请及时报警', icon: 'Flag' },
];

export default function Cyberbullying() {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [helpChannels, setHelpChannels] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topics, settings] = await Promise.all([
          api.getTopics('cyberbullying'),
          api.getSiteSettings(),
        ]);
        const knowledgeItems = topics.filter((t: any) => t.type === 'knowledge');
        const caseItems = topics.filter((t: any) => t.type === 'case');
        const channelItems = topics.filter((t: any) => t.type === 'channel');
        
        setKnowledge(knowledgeItems.length > 0 ? knowledgeItems : defaultKnowledge);
        setCases(caseItems.length > 0 ? caseItems.map((c: any) => ({
          id: c.id,
          title: c.title,
          category: '案例分析',
          summary: c.content.substring(0, 50) + '...',
          content: c.content,
          tags: ['案例'],
        })) : defaultCases);
        setHelpChannels(channelItems.length > 0 ? channelItems.map((c: any) => ({
          title: c.title,
          phone: '-',
          description: c.content,
          icon: c.icon || 'Phone',
        })) : defaultHelpChannels);
        setSiteSettings(settings);
      } catch (error) {
        console.error('Failed to fetch cyberbullying data:', error);
        setKnowledge(defaultKnowledge);
        setCases(defaultCases);
        setHelpChannels(defaultHelpChannels);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-emerald-100 text-sm">普法专题</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">校园欺凌与网络暴力</h1>
            <p className="text-lg text-emerald-100">认识欺凌危害，学会自我保护，共筑友善成长环境</p>
          </div>
        </div>
      </div>

      {/* Knowledge Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            <h2 className="text-xl font-bold text-slate-800">知识科普</h2>
          </div>
          <p className="text-slate-600 mb-8 max-w-2xl">
            认识网络暴力的本质、形式与危害，学会用法律武器保护自己
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledge.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    {iconMap[item.icon]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
            <h2 className="text-xl font-bold text-slate-800">案例警示</h2>
          </div>
          <p className="text-slate-600 mb-8 max-w-2xl">
            从真实案例中吸取教训，增强自我保护意识
          </p>

          <div className="max-w-4xl space-y-3">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedCase(expandedCase === caseItem.id ? null : caseItem.id)}
                  className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-medium">
                        {caseItem.category}
                      </span>
                      <div className="flex gap-2">
                        {caseItem.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="flex items-center gap-1 text-slate-400 text-xs">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{caseItem.title}</h3>
                    <p className="text-sm text-slate-600">{caseItem.summary}</p>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {expandedCase === caseItem.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>
                {expandedCase === caseItem.id && (
                  <div className="px-5 pb-5 border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{caseItem.content}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {caseItem.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 bg-slate-200 text-slate-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Channels Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            <h2 className="text-xl font-bold text-slate-800">求助渠道</h2>
          </div>
          <p className="text-slate-600 mb-8 max-w-2xl">
            遭遇网络暴力时，请勇敢求助，这些渠道可以帮到你
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpChannels.map((channel) => (
              <div
                key={channel.title}
                className="bg-white rounded-lg border border-slate-200 p-5 text-center hover:border-emerald-200 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  {iconMap[channel.icon]}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{channel.title}</h3>
                <p className="text-xl font-bold text-emerald-600 mb-1">{channel.phone}</p>
                <p className="text-xs text-slate-500">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pledge Section */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <HeartCrack className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">友善上网倡议</h2>
            </div>
            <div className="bg-white/10 rounded-lg p-6 space-y-3">
              <p className="flex items-start gap-3">
                <span className="text-emerald-200">✓</span>
                <span>文明发言，不辱骂、不攻击他人</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-200">✓</span>
                <span>尊重隐私，不人肉搜索、不散布他人信息</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-200">✓</span>
                <span>理性思考，不造谣、不传谣、不信谣</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-200">✓</span>
                <span>换位思考，己所不欲勿施于人</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-200">✓</span>
                <span>勇于发声，对网络暴力说"不"</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-emerald-200">✓</span>
                <span>关爱他人，做网络空间的正能量使者</span>
              </p>
            </div>
            <p className="mt-6 text-center text-emerald-100">
              让我们共同守护清朗网络空间
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
