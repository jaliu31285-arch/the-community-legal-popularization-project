import { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Image as ImageIcon, Sparkles } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

const defaultActivities = [
  { day: 1, date: '7月1日', title: '破冰开营', description: '团队组建、规则讲解、网络安全意识启蒙', highlights: ['认识新朋友', '学习网络安全基础知识', '制定团队公约'], schedule: [{ time: '09:00', title: '开营仪式', description: '领导致辞、团队介绍' }, { time: '10:00', title: '破冰游戏', description: '趣味互动，增进了解' }, { time: '14:00', title: '网络安全讲座', description: '专家讲解网络安全知识' }, { time: '16:00', title: '团队建设', description: '分组讨论，制定计划' }] },
  { day: 2, date: '7月2日', title: '网络暴力专题', description: '认识网络暴力、典型案例分析、应对方法学习', highlights: ['了解网络暴力类型', '学习法律保护措施', '模拟应对场景'], schedule: [{ time: '09:00', title: '知识讲解', description: '网络暴力定义与常见形式' }, { time: '10:30', title: '案例分析', description: '真实案例深度剖析' }, { time: '14:00', title: '情景演练', description: '模拟应对网络暴力' }, { time: '16:00', title: '心得分享', description: '学员分享学习感悟' }] },
  { day: 3, date: '7月3日', title: '网络诈骗专题', description: '常见诈骗类型、防范技巧、情景模拟演练', highlights: ['识别诈骗套路', '学习防范技巧', '反诈情景剧'], schedule: [{ time: '09:00', title: '诈骗类型讲解', description: '未成年人高发诈骗类型' }, { time: '10:30', title: '防范技巧', description: '实用防范方法分享' }, { time: '14:00', title: '情景模拟', description: '反诈情景剧表演' }, { time: '16:00', title: '知识竞赛', description: '反诈知识问答比赛' }] },
  { day: 4, date: '7月4日', title: '消费理性专题', description: '消费陷阱识别、理性消费观培养、趣味互动游戏', highlights: ['认识消费陷阱', '培养理性消费', '趣味互动游戏'], schedule: [{ time: '09:00', title: '消费陷阱讲解', description: '常见消费陷阱分析' }, { time: '10:30', title: '理性消费', description: '正确消费观念培养' }, { time: '14:00', title: '互动游戏', description: '消费决策模拟游戏' }, { time: '16:00', title: '成果展示', description: '学员作品展示' }] },
  { day: 5, date: '7月5日', title: '成果展示', description: '学习成果汇报、网络安全承诺、结营仪式', highlights: ['成果汇报', '签署承诺', '结营留念'], schedule: [{ time: '09:00', title: '成果汇报', description: '各小组学习成果展示' }, { time: '10:30', title: '网络安全承诺', description: '签署文明上网承诺书' }, { time: '14:00', title: '结营仪式', description: '颁发证书、合影留念' }] },
];

export default function Activities() {
  const [activeDay, setActiveDay] = useState(1);
  const [activities, setActivities] = useState<any[]>(defaultActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getActivities();
        setActivities(data.length > 0 ? data : defaultActivities);
        if (data.length > 0) {
          setActiveDay(data[0].day);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setActivities(defaultActivities);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentActivity = activities.find((a) => a.day === activeDay) || activities[0];

  return (
    <div>
      <PageBanner
        title="活动回顾"
        subtitle="五天精彩，全程记录"
        gradient="from-violet-600 via-purple-500 to-pink-500"
        icon={<Calendar className="w-10 h-10 text-white" />}
      />

      {/* Day Tabs */}
      <section className="py-12 bg-white sticky top-16 lg:top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {activities.map((activity) => (
              <button
                key={activity.day}
                onClick={() => setActiveDay(activity.day)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                  activeDay === activity.day
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Day {activity.day}
                <span className="block text-xs opacity-80">{activity.date}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Day Content */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <span className="inline-block text-violet-600 font-medium mb-3">
                Day {currentActivity.day} · {currentActivity.date}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                {currentActivity.title}
              </h2>
              <p className="text-slate-600 text-lg">{currentActivity.description}</p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {currentActivity.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center border border-slate-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                  <p className="text-slate-700 font-medium">{highlight}</p>
                </div>
              ))}
            </div>

            {/* Schedule Timeline */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 mb-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <Clock className="w-7 h-7 text-violet-500" />
                当日活动流程
              </h3>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-200 via-purple-200 to-pink-200"></div>
                
                {currentActivity.schedule.map((item, index) => (
                  <div key={index} className="relative flex gap-6 mb-8 last:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold z-10 flex-shrink-0">
                      {item.time.split(':')[0]}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="bg-slate-50 rounded-2xl p-5 hover:bg-slate-100 transition-colors">
                        <h4 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h4>
                        <p className="text-slate-600">{item.description}</p>
                        <p className="text-sm text-violet-500 mt-2 font-medium">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery Placeholder */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <ImageIcon className="w-7 h-7 text-violet-500" />
                精彩瞬间
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="text-center">
                      <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-violet-500 font-medium">活动照片 {i}</p>
                      <p className="text-xs text-violet-400">待上传</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-slate-500 mt-6">
                📷 更多精彩照片即将上线，敬请期待...
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
