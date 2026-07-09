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
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const iconMap: Record<string, React.ReactNode> = {
  HelpCircle: <HelpCircle className="w-8 h-8" />,
  HeartCrack: <HeartCrack className="w-8 h-8" />,
  Scale: <Scale className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Phone: <Phone className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Siren: <Siren className="w-8 h-8" />,
  Flag: <Flag className="w-8 h-8" />,
  AlertTriangle: <AlertTriangle className="w-8 h-8" />,
};

const defaultKnowledge = [
  { id: 1, title: '校园欺凌定义', content: '校园欺凌是指发生在学生之间，蓄意或恶意通过肢体、语言及网络等手段实施欺负、侮辱，造成另一方人身伤害、财产损失或精神损害的行为。包括肢体欺凌、语言欺凌、社交欺凌和网络欺凌。', icon: 'HelpCircle', tips: ['认识欺凌行为', '拒绝参与欺凌', '保护被欺凌者'] },
  { id: 2, title: '网络暴力常见形式', content: '网络暴力的常见形式包括：侮辱性言论、恶意造谣、人肉搜索、P图恶搞、恶意刷屏、网络骚扰、网络造谣等，这些行为严重危害青少年身心健康。', icon: 'HeartCrack', tips: ['不参与网络攻击', '不传播不良信息', '保护个人隐私'] },
  { id: 3, title: '校园欺凌与网络暴力的联系', content: '校园欺凌和网络暴力常常相互交织：现实中的欺凌可能延伸到网络空间，而网络上的欺凌也可能影响到现实生活。两者都会对受害者造成严重的心理创伤。', icon: 'Scale', tips: ['关注身边同学', '及时发现异常', '防止欺凌蔓延'] },
  { id: 4, title: '应对方法', content: '1.保持冷静，不要回应；2.保留证据，截图保存；3.设置隐私，拉黑对方；4.寻求帮助，告诉家长老师；5.依法维权，报警处理；6.必要时寻求心理辅导。', icon: 'ShieldCheck', tips: ['保持冷静', '保留证据', '寻求帮助'] },
  { id: 5, title: '法律保护', content: '未成年人受《未成年人保护法》《预防未成年人犯罪法》等法律保护。遭遇欺凌时，要勇敢运用法律武器维护自身权益。', icon: 'Flag', tips: ['了解法律规定', '勇敢维护权益', '寻求法律援助'] },
  { id: 6, title: '心理防护', content: '遭遇欺凌后，及时寻求心理辅导非常重要。不要独自承受，要相信家人、老师和专业人士会帮助你度过难关。', icon: 'Shield', tips: ['关注心理健康', '及时寻求帮助', '保持积极心态'] },
];

const defaultCases = [
  { id: 1, title: '校园欺凌延伸至网络', category: '校园欺凌', summary: '初中生因与同学发生矛盾，被对方在微信群发布侮辱性言论和PS丑照', content: '案例详情：初中生小A因与同学发生矛盾，被对方在微信群、QQ空间发布侮辱性言论和PS丑照，并被多人转发评论。小A因此不敢上学，出现严重心理问题。家长发现后及时报警，警方介入调查，对涉事学生进行了批评教育。', tags: ['校园欺凌', '网络暴力', 'PS照片'] },
  { id: 2, title: '网络造谣毁人名誉', category: '网络造谣', summary: '高中生编造传播同学虚假信息，构成诽谤罪', content: '案例详情：高中生小C因嫉妒同学成绩好，在校园论坛和社交媒体上编造传播对方的虚假负面信息，导致该同学受到排挤和议论。受害同学家长以诽谤罪向法院起诉，法院责令小C公开赔礼道歉，并赔偿精神损害抚慰金。', tags: ['网络造谣', '诽谤', '法律责任'] },
];

const defaultHelpChannels = [
  { title: '12377', phone: '12377', description: '网络违法与不良信息举报中心', icon: 'Siren' },
  { title: '12355', phone: '12355', description: '青少年维权热线', icon: 'Phone' },
  { title: '家长老师', phone: '-', description: '最直接的求助对象', icon: 'Shield' },
  { title: '公安机关', phone: '110', description: '严重情况请及时报警', icon: 'Flag' },
];

const defaultAntiBullyingMotto = [
  '不做欺凌者，不当旁观者',
  '抵制网络暴力，共建清朗空间',
  '反对造谣传谣，维护网络文明',
  '遇到欺凌要勇敢，及时求助保安全',
];

export default function Cyberbullying() {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [helpChannels, setHelpChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topics = await api.getTopics('cyberbullying');
        const knowledgeItems = topics.filter((t: any) => t.type === 'knowledge');
        const caseItems = topics.filter((t: any) => t.type === 'case');
        const channelItems = topics.filter((t: any) => t.type === 'channel');
        
        setKnowledge(knowledgeItems.length > 0 ? knowledgeItems.map((t: any) => ({
          id: t.id,
          title: t.title,
          content: t.content,
          icon: t.icon || 'HelpCircle',
          tips: ['不轻易相信此类信息', '及时告知家长'],
        })) : defaultKnowledge);
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
    <div>
      <PageBanner
        title="校园欺凌与网络暴力"
        subtitle="活动首日聚焦'校园欺凌、网络造谣'，认识危害，学会自我保护"
        gradient="from-emerald-600 via-teal-500 to-cyan-500"
        icon={<AlertTriangle className="w-10 h-10 text-white" />}
      />

      {/* Knowledge Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-growth-600 font-medium mb-3">知识科普</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              认识校园欺凌与网络暴力
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              认识网络暴力的本质、形式与危害，学会用法律武器保护自己
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledge.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-growth-500 to-teal-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {iconMap[item.icon]}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 mb-5 text-sm leading-relaxed">{item.content}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-growth-600 mb-2">💡 防范提示：</p>
                  {item.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-growth-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-warm-600 font-medium mb-3">案例警示</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              真实案例警示
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              从真实案例中吸取教训，增强自我保护意识
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {cases.map((caseItem, index) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => setExpandedCase(expandedCase === caseItem.id ? null : caseItem.id)}
                  className="w-full p-6 flex items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-warm-100 text-warm-700 text-sm rounded-full font-medium">
                        {caseItem.category}
                      </span>
                      <div className="flex gap-2">
                        {caseItem.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{caseItem.title}</h3>
                    <p className="text-slate-600">{caseItem.summary}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedCase === caseItem.id ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                {expandedCase === caseItem.id && (
                  <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                    <p className="text-slate-700 leading-relaxed mb-4">{caseItem.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {caseItem.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-primary-600 font-medium mb-3">求助渠道</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              遭遇欺凌时怎么办
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              遭遇网络暴力时，请勇敢求助，这些渠道可以帮到你
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {helpChannels.map((channel, index) => (
              <div
                key={channel.title}
                className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-6 border border-primary-100 hover:shadow-lg hover:-translate-y-1 transition-all group text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[channel.icon]}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{channel.title}</h3>
                <p className="text-2xl font-bold text-primary-600 mb-2">{channel.phone}</p>
                <p className="text-sm text-slate-600">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pledge Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12">
              📢 反欺凌反造谣倡议
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defaultAntiBullyingMotto.map((motto, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <p className="text-xl font-medium">{motto}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-lg text-white/90 space-y-4">
              <p>✊ 拒绝校园欺凌，不参与、不围观</p>
              <p>✊ 反对网络暴力，不辱骂、不人肉搜索</p>
              <p>✊ 不造谣、不传谣、不信谣，理性上网</p>
              <p>✊ 遇到欺凌及时报告，保护自己和他人</p>
              <p>✊ 尊重他人隐私，不散布个人信息</p>
              <p>✊ 友善待人，共同维护和谐校园环境</p>
            </div>
            <p className="mt-8 text-xl">
              让我们共同守护和谐校园与清朗网络空间 💪
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}