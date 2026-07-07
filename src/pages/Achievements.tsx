import { useState, useEffect } from 'react';
import {
  Award,
  FileText,
  Newspaper,
  Video,
  TrendingUp,
  BarChart3,
  Users,
  Heart,
  BookOpen,
  Handshake,
} from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const typeIcons: Record<string, React.ReactNode> = {
  report: <FileText className="w-6 h-6" />,
  media: <Newspaper className="w-6 h-6" />,
  video: <Video className="w-6 h-6" />,
  data: <BarChart3 className="w-6 h-6" />,
};

const typeColors: Record<string, string> = {
  report: 'from-blue-500 to-indigo-600',
  media: 'from-purple-500 to-pink-600',
  video: 'from-rose-500 to-red-600',
  data: 'from-emerald-500 to-teal-600',
};

const defaultAchievements = [
  { id: 1, title: '服务青少年', type: 'stat', value: '500+', description: '覆盖社区未成年人' },
  { id: 2, title: '志愿服务时长', type: 'stat', value: '1000+', description: '小时志愿服务' },
  { id: 3, title: '普法课程', type: 'stat', value: '20+', description: '场主题普法课程' },
  { id: 4, title: '实践社区', type: 'stat', value: '12', description: '个实践社区/学校' },
  { id: 5, title: '实践调研报告', type: 'report', value: '', description: '详细记录实践过程和成果，为后续工作提供参考' },
  { id: 6, title: '活动纪实Vlog', type: 'video', value: '', description: '记录五天实践活动的精彩瞬间，展现团队风采' },
  { id: 7, title: '媒体报道', type: 'media', value: '', description: '多家媒体报道本次实践活动，扩大影响力' },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>(defaultAchievements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAchievements();
        setAchievements(data.length > 0 ? data : defaultAchievements);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
        setAchievements(defaultAchievements);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dataAchievements = achievements.filter((a) => a.type === 'stat');
  const otherAchievements = achievements.filter((a) => a.type !== 'stat');

  return (
    <div>
      <PageBanner
        title="项目成果展示"
        subtitle="用心耕耘，收获满满"
        gradient="from-rose-500 via-pink-500 to-purple-500"
        icon={<Award className="w-10 h-10 text-white" />}
      />

      {/* Key Data */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-rose-600 font-medium mb-3">成果数据</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              用数据说话
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              每一个数字背后，都是我们的付出与收获
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {dataAchievements.map((item, index) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 text-center border border-rose-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center">
                  {index === 0 ? <Users className="w-8 h-8" /> : 
                   index === 1 ? <Heart className="w-8 h-8" /> : 
                   <BookOpen className="w-8 h-8" />}
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-rose-600 mb-2">
                  {item.value}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Achievements */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-purple-600 font-medium mb-3">成果展示</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              我们的收获
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              调研报告、媒体报道、视频记录、共建合作
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {otherAchievements.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${typeColors[item.type]} text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {typeIcons[item.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        {item.type === 'report' ? '调研报告' : 
                         item.type === 'media' ? '媒体报道' : '视频记录'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{item.description}</p>
                    <button className="text-purple-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      查看详情
                      <TrendingUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cooperation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-growth-600 font-medium mb-3">合作共建</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              合作伙伴
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              感谢以下单位对本次实践活动的大力支持
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {['四川大学法学院', '四川大学团委', 'XX社区居委会', 'XX街道办事处', 'XX小学', 'XX中学', 'XX律师事务所', 'XX公益基金会'].map((partner, index) => (
              <div
                key={index}
                className="w-40 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 hover:border-growth-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="text-center">
                  <Handshake className="w-6 h-6 mx-auto mb-1 text-slate-400 group-hover:text-growth-500 transition-colors" />
                  <span className="text-sm text-slate-600 font-medium">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-3xl flex items-center justify-center">
              <Award className="w-10 h-10" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              成果属于每一个参与者
            </h2>
            <p className="text-xl text-white/90 mb-10">
              感谢每一位参与活动的同学、家长、老师和志愿者，
              让我们继续携手前行，守护更多青少年的健康成长！
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
