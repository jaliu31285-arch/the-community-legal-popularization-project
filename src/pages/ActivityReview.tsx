import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Calendar, Play, Image, FileText } from 'lucide-react';

interface ActivityReviewItem {
  id: number;
  item_type: string;
  title: string;
  content: string;
  image_url: string;
  video_url: string;
}

interface ActivityReview {
  id: number;
  date: string;
  day: number;
  title: string;
  description: string;
  items: ActivityReviewItem[];
}

export default function ActivityReview() {
  const [reviews, setReviews] = useState<ActivityReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getActivityReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">活动回顾</h1>
          <p className="text-xl opacity-90">记录法治营会的每一个精彩瞬间</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">暂无活动回顾数据</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2"></div>

            {reviews.map((review, index) => (
              <div key={review.id} className={`relative flex items-start mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center -translate-x-1/2 shadow-lg z-10">
                  <Calendar className="w-5 h-5" />
                </div>

                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'pr-20 md:pr-16 md:pl-0' : 'pl-20 md:pl-16 md:pr-0'}`}>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Day {review.day}
                      </span>
                      <span className="text-slate-500 text-sm">{review.date}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">{review.title}</h2>
                    {review.description && (
                      <p className="text-slate-600 mb-6">{review.description}</p>
                    )}

                    <div className="space-y-6">
                      {review.items.map((item) => (
                        <div key={item.id} className="border-t border-slate-100 pt-4">
                          {item.item_type === 'text' && (
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                {item.title}
                              </h3>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{item.content}</p>
                            </div>
                          )}
                          {item.item_type === 'image' && item.image_url && (
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                <Image className="w-5 h-5 text-blue-500" />
                                {item.title}
                              </h3>
                              <img src={item.image_url} alt={item.title} className="w-full rounded-lg" />
                            </div>
                          )}
                          {item.item_type === 'video' && item.video_url && (
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                                <Play className="w-5 h-5 text-blue-500" />
                                {item.title}
                              </h3>
                              <video controls className="w-full rounded-lg" preload="metadata">
                                <source src={item.video_url} type="video/mp4" />
                              </video>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}