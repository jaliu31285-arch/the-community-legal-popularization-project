import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Cpu,
  Layers,
  Gift,
  Coins,
  Sparkles,
  HelpCircle,
  Wallet,
  Users,
  Shield,
  Sun,
  Palette,
  BookOpen,
  Home,
  Music,
  ChevronRight,
} from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Gift: <Gift className="w-8 h-8" />,
  Coins: <Coins className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  HelpCircle: <HelpCircle className="w-7 h-7" />,
  Wallet: <Wallet className="w-7 h-7" />,
  Users: <Users className="w-7 h-7" />,
  Shield: <Shield className="w-7 h-7" />,
  Sun: <Sun className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
  Home: <Home className="w-8 h-8" />,
  Music: <Music className="w-8 h-8" />,
};

const defaultConsumptionTraps = [
  { title: '不良行为识别', description: '未成年人常见的不良行为包括：逃学旷课、夜不归宿、打架斗殴、偷窃、赌博、网络成瘾等。这些行为不仅影响学习，还可能触犯法律。', icon: 'Cpu', examples: ['逃学旷课', '夜不归宿', '打架斗殴', '偷窃行为'] },
  { title: '网络成瘾危害', description: '过度沉迷网络会导致学习成绩下降、视力受损、社交能力退化、身心健康受损，甚至诱发违法犯罪行为。', icon: 'Gift', examples: ['沉迷游戏', '熬夜刷视频', '忽视现实社交'] },
  { title: '未成年人权益', description: '未成年人享有受教育权、生命健康权、人身自由权、隐私权、财产权等合法权益，任何组织和个人不得侵犯。', icon: 'Coins', examples: ['受教育权', '生命健康权', '隐私权', '财产权'] },
  { title: '自我保护技巧', description: '面对不良诱惑和侵害时，要学会拒绝、求助、报警，保护自己的人身安全和合法权益。', icon: 'Sparkles', examples: ['拒绝不良诱惑', '及时告诉家长', '拨打110报警'] },
  { title: '法律责任意识', description: '未成年人虽然受法律特殊保护，但实施违法犯罪行为同样要承担相应的法律责任，需要从小树立法治观念。', icon: 'Layers', examples: ['违法必究', '承担责任', '依法办事'] },
];

const defaultRationalConsumptionTips = [
  { id: 1, title: '认清不良行为', content: '了解哪些行为是不良行为，认识其危害和后果。逃学、打架、偷窃、沉迷网络等行为都会影响你的成长，甚至触犯法律。', icon: 'Wallet' },
  { id: 2, title: '学会自我约束', content: '面对诱惑时要学会控制自己，不要因为一时冲动做出错误的决定。培养自律能力，养成良好的生活习惯。', icon: 'HelpCircle' },
  { id: 3, title: '懂得求助', content: '遇到困难或受到侵害时，不要独自承受，要及时告诉家长、老师或拨打110报警。求助不是软弱，而是智慧。', icon: 'Users' },
  { id: 4, title: '保护自身权益', content: '了解自己的合法权益，当权益受到侵害时要勇敢维权。未成年人受法律特殊保护，要学会用法律武器保护自己。', icon: 'Shield' },
];

const defaultScreenFreeActivities = [
  { title: '法治学习', description: '学习法律知识，增强法治观念', icon: 'BookOpen', ideas: ['阅读普法书籍', '观看法治教育片', '参加法治讲座'] },
  { title: '户外运动', description: '走出家门，享受阳光和新鲜空气', icon: 'Sun', ideas: ['骑自行车', '打篮球', '跑步锻炼'] },
  { title: '兴趣培养', description: '发展特长，丰富课余生活', icon: 'Palette', ideas: ['画画', '学乐器', '书法'] },
  { title: '家庭互动', description: '和家人一起度过美好时光', icon: 'Home', ideas: ['看电影', '玩桌游', '一起做饭'] },
  { title: '社会实践', description: '参与公益活动，服务社区', icon: 'Music', ideas: ['社区志愿服务', '普法宣传', '参观学习'] },
];

export default function Consumption() {
  const [consumptionTraps, setConsumptionTraps] = useState<any[]>([]);
  const [rationalConsumptionTips, setRationalConsumptionTips] = useState<any[]>([]);
  const [screenFreeActivities, setScreenFreeActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topics = await api.getTopics('consumption');
        const knowledgeItems = topics.filter((t: any) => t.type === 'knowledge');
        const methodItems = topics.filter((t: any) => t.type === 'method');
        
        setConsumptionTraps(knowledgeItems.length > 0 ? knowledgeItems.map((t: any) => ({
          title: t.title,
          description: t.content,
          icon: t.icon || 'Gift',
          examples: ['常见消费陷阱表现'],
        })) : defaultConsumptionTraps);
        
        setRationalConsumptionTips(methodItems.length > 0 ? methodItems.map((m: any) => ({
          id: m.id,
          title: m.title,
          content: m.content,
          icon: m.icon || 'Wallet',
        })) : defaultRationalConsumptionTips);
        
        setScreenFreeActivities(defaultScreenFreeActivities);
      } catch (error) {
        console.error('Failed to fetch consumption data:', error);
        setConsumptionTraps(defaultConsumptionTraps);
        setRationalConsumptionTips(defaultRationalConsumptionTips);
        setScreenFreeActivities(defaultScreenFreeActivities);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <PageBanner
        title="不良行为矫治与权益保护"
        subtitle="活动首日聚焦'不良行为矫治、权益自我保护'"
        gradient="from-amber-500 via-orange-500 to-red-500"
        icon={<ShoppingBag className="w-10 h-10 text-white" />}
      />

      {/* Traps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-warm-600 font-medium mb-3">陷阱识别</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              警惕网络消费陷阱
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              网络世界藏着很多消费陷阱，让我们一起识破它们
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {consumptionTraps.map((trap, index) => (
              <div
                key={trap.title}
                className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warm-500 to-orange-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {iconMap[trap.icon]}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{trap.title}</h3>
                <p className="text-slate-600 mb-5">{trap.description}</p>
                <div className="bg-warm-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-warm-600 mb-2">⚠️ 常见表现：</p>
                  <ul className="space-y-1">
                    {trap.examples.map((example, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-warm-500 mt-0.5 flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-growth-600 font-medium mb-3">理性消费</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              做明智的消费者
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              学会管理自己的零花钱，培养健康的消费习惯
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {rationalConsumptionTips.map((tip, index) => (
              <div
                key={tip.id}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-growth-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0">
                    {iconMap[tip.icon]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{tip.title}</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {tip.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen Free Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-primary-600 font-medium mb-3">生活方式</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              发现无屏幕的乐趣
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              放下手机和电脑，现实世界有更多精彩等着你
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {screenFreeActivities.map((activity, index) => (
              <div
                key={activity.title}
                className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-6 border border-primary-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[activity.icon]}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{activity.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{activity.description}</p>
                <div className="flex flex-wrap gap-2">
                  {activity.ideas.map((idea) => (
                    <span
                      key={idea}
                      className="px-3 py-1 bg-white text-primary-600 text-sm rounded-full border border-primary-100"
                    >
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pledge Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-3xl flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              我的法治成长公约
            </h2>
            <div className="text-lg text-white/90 space-y-4 mb-10 text-left bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <p>✊ 认清不良行为，远离违法犯罪</p>
              <p>✊ 遵守法律法规，树立法治观念</p>
              <p>✊ 保护自身权益，勇敢维护正义</p>
              <p>✊ 遇到困难求助，不独自承受</p>
              <p>✊ 尊重他人权利，友善待人接物</p>
              <p>✊ 积极学习法律，增强自我保护</p>
            </div>
            <p className="text-xl font-medium">
              法治护航，健康成长 💪
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
