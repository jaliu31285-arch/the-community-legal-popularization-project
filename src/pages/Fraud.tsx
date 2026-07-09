import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Gamepad2,
  Gift,
  UserCheck,
  ShoppingCart,
  RefreshCw,
  GraduationCap,
  Phone,
  Camera,
  Lock,
  Flag,
  Wind,
  ChevronRight,
} from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const iconMap: Record<string, React.ReactNode> = {
  Gamepad2: <Gamepad2 className="w-8 h-8" />,
  Gift: <Gift className="w-8 h-8" />,
  UserCheck: <UserCheck className="w-8 h-8" />,
  ShoppingCart: <ShoppingCart className="w-8 h-8" />,
  RefreshCw: <RefreshCw className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  Wind: <Wind className="w-6 h-6" />,
  Camera: <Camera className="w-6 h-6" />,
  Phone: <Phone className="w-6 h-6" />,
  Lock: <Lock className="w-6 h-6" />,
  Flag: <Flag className="w-6 h-6" />,
};

const defaultFraudTypes = [
  { id: 1, title: '免费皮肤诈骗', description: '骗子声称可以免费获取游戏皮肤，要求点击链接、下载APP、填写个人信息或支付"手续费"。', icon: 'Gift', tips: ['不点击陌生链接', '不下载未知APP', '不支付任何费用'] },
  { id: 2, title: '虚假中奖诈骗', description: '通过私信、邮件等方式告知中奖，要求提供个人信息并支付"手续费"、"税费"等。', icon: 'Gift', tips: ['不相信"天上掉馅饼"', '官方活动通过正规渠道通知', '不向陌生人转账'] },
  { id: 3, title: '冒充熟人诈骗', description: '冒充老师、家长、同学等熟人，以急事为由借钱或要求转账。', icon: 'UserCheck', tips: ['通过电话确认身份', '不轻易转账', '大额转账务必见面核实'] },
  { id: 4, title: '游戏交易诈骗', description: '在游戏账号、装备交易中，骗子先收取费用后失联。', icon: 'Gamepad2', tips: ['使用正规交易平台', '不私下交易', '保留交易凭证'] },
  { id: 5, title: '网络造谣诈骗', description: '骗子编造虚假信息制造恐慌，引诱受害者点击虚假链接或转账。', icon: 'RefreshCw', tips: ['不信谣不传谣', '通过官方渠道核实信息', '不轻易点击不明链接'] },
  { id: 6, title: '充值返利诈骗', description: '声称充值游戏可以获得高额返利，引诱未成年人不断充值。', icon: 'ShoppingCart', tips: ['不相信"充值返利"', '设置消费限额', '充值前告知家长'] },
];

const defaultFraudScripts = [
  { title: '中奖话术', script: '"恭喜你！你已被抽中为本游戏幸运用户，获得价值888元的游戏礼包！只需支付88元手续费即可领取！"', reveal: '这是典型的中奖诈骗，正规游戏不会要求用户支付"手续费"来领取奖品。' },
  { title: '充值返利', script: '"现在充值100元送200元！限时优惠，错过今天再等一年！"', reveal: '充值返利是常见的诈骗手段，骗子会用虚假返利引诱你不断充值，最终卷款跑路。' },
  { title: '账号异常', script: '"你的账号存在安全风险，请点击链接进行验证，否则账号将被冻结。"', reveal: '官方不会通过私信发送验证链接，这是骗子盗取账号的常用手段。' },
  { title: '免费皮肤', script: '"加我QQ，我免费送你限定皮肤！只要把账号密码发给我就行。"', reveal: '不要相信"免费皮肤"的诱惑，这是骗子在盗取你的游戏账号。' },
];

const defaultAntiFraudSteps = [
  { step: 1, title: '立即停止操作', description: '不要再与骗子进行任何沟通，停止转账、扫码等操作。', icon: 'Camera' },
  { step: 2, title: '告知家长老师', description: '第一时间告诉家长或老师，寻求帮助和指导。', icon: 'Phone' },
  { step: 3, title: '保留证据', description: '保存聊天记录、转账凭证、链接等所有证据。', icon: 'Lock' },
  { step: 4, title: '联系平台客服', description: '向相关平台举报诈骗账号，冻结交易。', icon: 'Flag' },
  { step: 5, title: '报警处理', description: '如果涉及金额较大或情节严重，及时拨打110报警。', icon: 'Wind' },
];

const defaultAntiFraudMotto = [
  '不轻信，不透露，不转账',
  '陌生来电不轻信，可疑链接不点击',
  '天上不会掉馅饼，中奖信息要警惕',
  '遇到诈骗别慌张，及时报警找警察',
];

export default function Fraud() {
  const [activeScript, setActiveScript] = useState(0);
  const [fraudTypes, setFraudTypes] = useState<any[]>(defaultFraudTypes);
  const [fraudScripts, setFraudScripts] = useState<any[]>(defaultFraudScripts);
  const [antiFraudSteps, setAntiFraudSteps] = useState<any[]>(defaultAntiFraudSteps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topics = await api.getTopics('fraud');
        const knowledgeItems = topics.filter((t: any) => t.type === 'knowledge');
        const methodItems = topics.filter((t: any) => t.type === 'method');
        
        setFraudTypes(knowledgeItems.length > 0 ? knowledgeItems.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.content,
          icon: t.icon || 'Gift',
          tips: ['不轻易相信此类信息', '及时告知家长'],
        })) : defaultFraudTypes);
        
        setFraudScripts(defaultFraudScripts);
        setAntiFraudSteps(methodItems.length > 0 ? methodItems.map((m: any, i: number) => ({
          step: i + 1,
          title: m.title,
          description: m.content,
          icon: m.icon || 'Lock',
        })) : defaultAntiFraudSteps);
      } catch (error) {
        console.error('Failed to fetch fraud data:', error);
        setFraudTypes(defaultFraudTypes);
        setFraudScripts(defaultFraudScripts);
        setAntiFraudSteps(defaultAntiFraudSteps);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <PageBanner
        title="网络诈骗与网络造谣"
        subtitle="活动首日聚焦'网络诈骗'，识破套路，远离造谣"
        gradient="from-emerald-600 via-teal-500 to-cyan-500"
        icon={<AlertTriangle className="w-10 h-10 text-white" />}
      />

      {/* Fraud Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-growth-600 font-medium mb-3">高发类型</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              未成年人常见诈骗类型
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              了解骗子的常用手法，才能更好地保护自己
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fraudTypes.map((type, index) => (
              <div
                key={type.id}
                className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-growth-500 to-teal-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {iconMap[type.icon]}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{type.title}</h3>
                <p className="text-slate-600 mb-5">{type.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-growth-600 mb-2">💡 防范提示：</p>
                  {type.tips.map((tip, i) => (
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

      {/* Script Reveal Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-warm-600 font-medium mb-3">话术拆解</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              诈骗话术大揭秘
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              听听骗子怎么说，识破他们的阴谋诡计
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {fraudScripts.map((script, index) => (
                <button
                  key={index}
                  onClick={() => setActiveScript(index)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeScript === index
                      ? 'bg-gradient-to-r from-growth-500 to-teal-500 text-white shadow-lg shadow-growth-200'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {script.title}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-warm-500 to-orange-500 p-6 text-white">
                <p className="text-sm font-medium mb-2">⚠️ 诈骗话术：</p>
                <p className="text-xl font-medium">{fraudScripts[activeScript].script}</p>
              </div>
              <div className="p-8">
                <p className="text-sm font-medium text-growth-600 mb-2">🔍 真相揭秘：</p>
                <p className="text-lg text-slate-700">{fraudScripts[activeScript].reveal}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anti-Fraud Steps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-primary-600 font-medium mb-3">处置流程</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              被骗后怎么办
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              万一不幸被骗，请按照以下步骤处理，争取挽回损失
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-growth-200 via-primary-200 to-rose-200 -translate-x-1/2"></div>
              
              {antiFraudSteps.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:justify-center`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 inline-block">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        第{step.step}步：{step.title}
                      </h3>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-growth-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg z-10 flex-shrink-0">
                    {iconMap[step.icon]}
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Anti-Fraud Motto Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            📢 反诈口诀
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defaultAntiFraudMotto.map((motto, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <p className="text-xl font-medium">{motto}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 text-xl text-white/90">
              记住这些口诀，让骗子无机可乘！
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
