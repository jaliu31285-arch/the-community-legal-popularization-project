import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Scale,
  ShieldCheck,
  Phone,
  Flag,
  UserCircle,
  Heart,
  Gavel,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const iconMap: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Phone: <Phone className="w-5 h-5" />,
  Flag: <Flag className="w-5 h-5" />,
  Gavel: <Gavel className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
};

const defaultBehaviors = [
  { id: 1, title: '校园欺凌行为', icon: 'AlertTriangle', color: 'red', description: '包括肢体欺凌、言语欺凌、社交欺凌、网络欺凌等多种形式，对受害者造成身心伤害。', examples: ['打架斗殴', '起侮辱性绰号', '孤立排挤同学', '网络造谣'] },
  { id: 2, title: '不良交友行为', icon: 'UserCircle', color: 'orange', description: '与社会不良人员交往，容易受到不良影响，甚至走上违法犯罪道路。', examples: ['结识社会闲散人员', '参与不良团伙', '夜不归宿', '离家出走'] },
  { id: 3, title: '不良上网行为', icon: 'AlertTriangle', color: 'orange', description: '沉迷网络、浏览不良信息、参与网络暴力等，影响身心健康和学习生活。', examples: ['沉迷网络游戏', '浏览色情暴力网站', '参与网络骂战', '人肉搜索他人'] },
  { id: 4, title: '违纪违法行为', icon: 'Gavel', color: 'red', description: '小偷小摸、敲诈勒索、打架斗殴等行为，严重者将触犯法律。', examples: ['偷窃他人财物', '敲诈勒索低年级同学', '聚众斗殴', '故意毁坏公物'] },
];

const defaultCorrectionMethods = [
  { id: 1, title: '认识危害', icon: 'Lightbulb', content: '充分认识不良行为的危害性，明白"小时偷针，大时偷金"的道理，从小事做起，防微杜渐。' },
  { id: 2, title: '自我约束', icon: 'ShieldCheck', content: '增强法律意识和纪律观念，自觉遵守校规校纪和法律法规，培养自控能力。' },
  { id: 3, title: '主动求助', icon: 'BookOpen', content: '遇到困难或困惑时，主动向家长、老师、心理咨询师求助，不要自己扛着。' },
  { id: 4, title: '远离不良', icon: 'AlertTriangle', content: '远离有不良行为的朋友，不参与不良团伙活动，不交损友。' },
];

const defaultRights = [
  { id: 1, title: '生命健康权', icon: 'Heart', content: '享有生命健康的权利，任何人不得伤害你的身体，校园欺凌、家庭暴力都是违法行为。' },
  { id: 2, title: '受教育权', icon: 'BookOpen', content: '享有接受教育的权利，学校不得随意开除学生，家长应保障子女完成义务教育。' },
  { id: 3, title: '人格尊严权', icon: 'UserCircle', content: '享有人格尊严不受侵犯的权利，禁止侮辱、诽谤、诬告陷害未成年人。' },
  { id: 4, title: '隐私权', icon: 'ShieldCheck', content: '享有隐私权，信件、日记、手机信息等个人隐私受法律保护。' },
  { id: 5, title: '财产权', icon: 'Gavel', content: '个人合法财产受法律保护，任何人不得侵占、哄抢、破坏。' },
];

const defaultProtectionTips = [
  { id: 1, title: '遭遇校园欺凌怎么办？', steps: ['保持冷静，确保人身安全', '及时向老师、家长报告', '保留证据（伤痕、信息等）', '必要时报警处理'] },
  { id: 2, title: '如何保护个人隐私？', steps: ['不随意透露个人信息', '设置强密码，定期更换', '不点击陌生链接，不下载未知软件', '谨慎发布个人照片和动态'] },
  { id: 3, title: '合法权益受侵害如何维权？', steps: ['告诉家长或老师', '向学校、社区反映', '拨打12355青少年维权热线', '必要时通过法律途径解决'] },
];

const defaultHelpChannels = [
  { title: '12355', phone: '12355', description: '青少年维权热线', icon: 'Phone' },
  { title: '110', phone: '110', description: '报警电话（紧急情况）', icon: 'Flag' },
  { title: '家长老师', phone: '-', description: '最直接的求助对象', icon: 'Heart' },
  { title: '法律援助', phone: '12348', description: '法律援助服务热线', icon: 'Scale' },
];

export default function Consumption() {
  const [behaviors, setBehaviors] = useState<any[]>(defaultBehaviors);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topics = await api.getTopics('consumption');
        if (topics && topics.length > 0) {
          const knowledgeTopics = topics.filter((t: any) => t.type === 'knowledge');
          if (knowledgeTopics.length > 0) {
            setBehaviors(knowledgeTopics.map((t: any, i: number) => ({
              id: t.id,
              title: t.title,
              icon: t.icon || 'AlertTriangle',
              color: t.color || 'orange',
              description: t.content,
              examples: [],
            })));
          }
        }
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-slate-200 rounded-xl"></div>
            <div className="h-64 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageBanner
        title="不良行为矫治与权益保护"
        subtitle="认识不良行为危害 学会自我保护"
        bgColor="from-orange-500 via-amber-500 to-yellow-500"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* 不良行为类型 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">常见不良行为</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {behaviors.map((behavior, index) => (
                <div
                  key={behavior.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                      behavior.color === 'red' ? 'bg-red-500' : 'bg-orange-500'
                    }`}>
                      {iconMap[behavior.icon] || <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">{behavior.title}</h3>
                      <p className="text-sm text-slate-500">{behavior.description}</p>
                    </div>
                  </div>
                  {behavior.examples && behavior.examples.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {behavior.examples.map((ex: string, i: number) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            behavior.color === 'red'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-orange-50 text-orange-600'
                          }`}
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {ex}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 矫治方法 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">不良行为矫治方法</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {defaultCorrectionMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                      {iconMap[method.icon] || <Lightbulb className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{method.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{method.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 未成年人合法权益 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">未成年人合法权益</h2>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {defaultRights.map((right) => (
                  <div key={right.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      {iconMap[right.icon] || <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">{right.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{right.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 自我保护指南 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">自我保护指南</h2>
            </div>
            <div className="space-y-3">
              {defaultProtectionTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedTip(expandedTip === tip.title ? null : tip.title)}
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="font-bold text-slate-800 text-left">{tip.title}</h3>
                    {expandedTip === tip.title ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedTip === tip.title && (
                    <div className="px-5 pb-5">
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        {tip.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-sm text-slate-700">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 求助渠道 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-rose-500 to-red-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800">求助渠道</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {defaultHelpChannels.map((channel, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center text-white">
                    {iconMap[channel.icon] || <Phone className="w-6 h-6" />}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{channel.title}</h4>
                  <p className="text-xs text-slate-500">{channel.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
