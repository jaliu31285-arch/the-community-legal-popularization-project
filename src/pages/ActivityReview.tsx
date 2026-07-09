import { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Image, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

interface ReviewItem {
  id: number;
  date: string;
  title: string;
  description: string;
  time_points: Array<{
    id: number;
    time: string;
    title: string;
    content: string;
    images: string[];
    video_url: string | null;
  }>;
}

const defaultDays: ReviewItem[] = [
  {
    id: 1,
    date: '2026-07-20',
    title: '首日：实景研学',
    description: '走进检察院、法院开展实景研学，聚焦校园欺凌、网络诈骗、网络造谣等成长风险场景',
    time_points: [
      {
        id: 1,
        time: '上午 09:00',
        title: '开营仪式',
        content: '法治护航少年成长主题营会正式启动，人大代表、检察官、社区工作人员出席开营仪式。',
        images: [],
        video_url: null,
      },
      {
        id: 2,
        time: '上午 10:00',
        title: '检察院参观',
        content: '走进检察院，了解检察职能，参观未成年人检察工作区。',
        images: [],
        video_url: null,
      },
      {
        id: 3,
        time: '下午 14:00',
        title: '法院旁听',
        content: '走进法院，旁听案件审理，感受司法威严。',
        images: [],
        video_url: null,
      },
    ],
  },
  {
    id: 2,
    date: '2026-07-21',
    title: '次日：社区法治实践',
    description: '在枫树社区开展基础法治思维转化，案例拆解、角色扮演、结营仪式',
    time_points: [
      {
        id: 1,
        time: '上午 09:00',
        title: '案例拆解 workshop',
        content: '通过真实案例拆解，帮助青少年认清各类违法风险的危害与后果。',
        images: [],
        video_url: null,
      },
      {
        id: 2,
        time: '上午 10:30',
        title: '角色扮演',
        content: '趣味角色扮演活动，在互动中学习法律知识。',
        images: [],
        video_url: null,
      },
      {
        id: 3,
        time: '下午 14:00',
        title: '结营仪式',
        content: '人大代表现场观摩研学成果，颁发结业证书，展示法治情景绘制作品。',
        images: [],
        video_url: null,
      },
    ],
  },
];

export default function ActivityReview() {
  const [days, setDays] = useState<ReviewItem[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getActivityReview();
        if (data && data.enabled === false) {
          setIsEnabled(false);
        } else if (data && data.days) {
          setDays(data.days);
        } else {
          setDays(defaultDays);
        }
      } catch (error) {
        console.error('Failed to fetch activity review:', error);
        setDays(defaultDays);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="h-64 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <PageBanner
            title="活动回顾"
            subtitle="精彩瞬间 值得铭记"
            bgColor="from-emerald-600 to-teal-600"
          />
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-lg">活动回顾内容即将上线，敬请期待...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageBanner
        title="活动回顾"
        subtitle="精彩瞬间 值得铭记"
        bgColor="from-emerald-600 to-teal-600"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {days.map((day, dayIndex) => (
            <div key={day.id} className="mb-8">
              <div
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                      <span className="text-xs opacity-90">7月</span>
                      <span className="text-xl font-bold">{day.date.split('-')[2]}日</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 mb-1">{day.title}</h2>
                      <p className="text-slate-500 text-sm">{day.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400 hidden sm:block">
                      {day.time_points.length} 个环节
                    </span>
                    {expandedDay === day.id ? (
                      <ChevronUp className="w-6 h-6 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedDay === day.id && (
                <div className="mt-6 ml-8 border-l-2 border-emerald-200 pl-8 space-y-6">
                  {day.time_points.map((point, pointIndex) => (
                    <div key={point.id} className="relative">
                      <div className="absolute -left-[41px] top-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow"></div>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">{point.time}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{point.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">{point.content}</p>

                        {point.images && point.images.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Image className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-500">现场照片</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {point.images.map((img, imgIndex) => (
                                <div key={imgIndex} className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                  <img
                                    src={img}
                                    alt={`${point.title} - 照片${imgIndex + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {point.video_url && (
                          <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Play className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-500">活动视频</span>
                            </div>
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                              <video
                                src={point.video_url}
                                controls
                                className="w-full h-full"
                              >
                                您的浏览器不支持视频播放
                              </video>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
