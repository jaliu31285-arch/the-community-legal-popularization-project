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
  { title: '算法陷阱', description: '短视频、直播平台通过算法推荐，让用户沉迷其中，不知不觉产生消费冲动。', icon: 'Cpu', examples: ['无限刷短视频', '直播间停留时间过长', '反复看到相似商品推荐'] },
  { title: '直播打赏', description: '主播通过话术引导、制造紧迫感等方式，诱导未成年人进行高额打赏。', icon: 'Gift', examples: ['"感谢大哥的礼物"', '"最后5分钟，冲榜了"', '"加入粉丝团有福利"'] },
  { title: '游戏充值', description: '游戏内虚拟道具、皮肤等消费，容易让未成年人产生攀比心理。', icon: 'Coins', examples: ['限时皮肤",不买就没了', '"充值返利，错过可惜"', '"别人都有，我也要"'] },
  { title: '虚假福利', description: '声称"限时特惠"、"限量抢购"等，利用从众心理诱导消费。', icon: 'Sparkles', examples: ['仅剩最后3件"', '"前100名特价"', '"内部员工价"'] },
  { title: '信息茧房', description: '平台根据用户偏好推送相似内容，导致视野狭窄，更容易被营销信息影响。', icon: 'Layers', examples: ['只看到自己喜欢的内容', '难以获取不同观点', '被单一类型的广告包围'] },
];

const defaultRationalConsumptionTips = [
  { id: 1, title: '制定消费计划', content: '每月零花钱制定预算，分清哪些是必需品，哪些是想要的东西。坚持记账，了解钱的去向。', icon: 'Wallet' },
  { id: 2, title: '延迟消费决策', content: '遇到喜欢的东西，先放一放，等待24小时再决定是否购买。很多冲动消费都会在冷静后消失。', icon: 'HelpCircle' },
  { id: 3, title: '货比三家', content: '购买前多比较不同平台的价格和评价，不急于下单。理性消费不是不消费，而是聪明地消费。', icon: 'Users' },
  { id: 4, title: '区分"需要"和"想要"', content: '需要是生存必需的东西，想要是满足欲望的东西。问问自己："不买这个会怎样？"', icon: 'Shield' },
];

const defaultScreenFreeActivities = [
  { title: '阅读时光', description: '阅读纸质书籍，沉浸在文字的世界里', icon: 'BookOpen', ideas: ['读一本好书', '写读书笔记', '分享读书心得'] },
  { title: '户外运动', description: '走出家门，享受阳光和新鲜空气', icon: 'Sun', ideas: ['骑自行车', '打篮球', '跑步锻炼'] },
  { title: '手工制作', description: '动手创造，体验成就感', icon: 'Palette', ideas: ['画画', '做手工', 'DIY装饰'] },
  { title: '家庭互动', description: '和家人一起度过美好时光', icon: 'Home', ideas: ['看电影', '玩桌游', '一起做饭'] },
  { title: '音乐欣赏', description: '聆听美妙的音乐，放松心情', icon: 'Music', ideas: ['学乐器', '听音乐会', '唱歌'] },
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
        title="理性消费 健康成长"
        subtitle="识别消费陷阱，树立正确消费观"
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
              <Coins className="w-10 h-10" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              我的理性消费公约
            </h2>
            <div className="text-lg text-white/90 space-y-4 mb-10 text-left bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <p>✊ 消费前三思，分清"需要"和"想要"</p>
              <p>✊ 制定零花钱计划，养成记账好习惯</p>
              <p>✊ 不攀比、不盲从，理性看待网红产品</p>
              <p>✊ 保护好支付密码，充值打赏告诉家长</p>
              <p>✊ 远离抽奖赌博，不抱侥幸心理</p>
              <p>✊ 多参与线下活动，发现生活更多美好</p>
            </div>
            <p className="text-xl font-medium">
              做金钱的小主人，不为消费所奴役 💪
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
