import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Plus, Edit, Trash2, Calendar, Play, Image, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import GenericCrud, { CrudField } from './GenericCrud';

interface ActivityReviewItem {
  id: number;
  item_type: string;
  title: string;
  content: string;
  image_url: string;
  video_url: string;
  sort_order: number;
}

interface ActivityReview {
  id: number;
  date: string;
  day: number;
  title: string;
  description: string;
  items: ActivityReviewItem[];
}

export default function ActivityReviewAdmin() {
  const [reviews, setReviews] = useState<ActivityReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ActivityReview | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [itemForm, setItemForm] = useState({
    review_id: 0,
    item_type: 'text',
    title: '',
    content: '',
    image_url: '',
    video_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.getAllActivityReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  };

  const handleAddReview = (data: any) => {
    api.createActivityReview(data).then(() => loadData());
  };

  const handleUpdateReview = (id: number, data: any) => {
    api.updateActivityReview(id, data).then(() => loadData());
  };

  const handleDeleteReview = (id: number) => {
    api.deleteActivityReview(id).then(() => loadData());
  };

  const handleAddItem = () => {
    if (!selectedReview) return;
    api.createActivityReviewItem({
      ...itemForm,
      review_id: selectedReview.id,
    }).then(() => {
      loadData();
      setItemForm({ review_id: 0, item_type: 'text', title: '', content: '', image_url: '', video_url: '' });
    });
  };

  const handleDeleteItem = (itemId: number) => {
    api.deleteActivityReviewItem(itemId).then(() => loadData());
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const reviewFields: CrudField[] = [
    { key: 'date', label: '日期', type: 'date', required: true, listDisplay: true },
    { key: 'day', label: '天数', type: 'number', required: true, listDisplay: true },
    { key: 'title', label: '标题', type: 'text', required: true, listDisplay: true },
    { key: 'description', label: '描述', type: 'textarea' },
    { key: 'sort_order', label: '排序', type: 'number', default: 0 },
    { key: 'is_active', label: '是否启用', type: 'toggle', default: true },
  ];

  if (loading) {
    return <div className="p-4">加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">活动回顾管理</h1>
          <p className="text-slate-500 mt-1">管理活动每日回顾内容，支持图文视频混合展示</p>
        </div>
      </div>

      <GenericCrud
        title="活动日期管理"
        description="添加活动日期和基本信息"
        fields={reviewFields}
        data={reviews}
        fetchAll={() => Promise.resolve(reviews)}
        create={handleAddReview}
        update={handleUpdateReview}
        remove={handleDeleteReview}
        listTitleKey="title"
        frontendPage="/activity-review"
        frontendLocation="活动回顾页面"
        customAction={(item: ActivityReview) => (
          <button
            onClick={() => toggleExpand(item.id)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {expandedIds.includes(item.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        )}
      />

      {expandedIds.map(reviewId => {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return null;
        return (
          <div key={reviewId} className="mt-4 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">
                  {review.title} · 内容管理
                </h3>
                <button
                  onClick={() => { setSelectedReview(review); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Plus className="w-4 h-4" /> 添加内容项
                </button>
              </div>
            </div>
            <div className="p-6">
              {review.items.length === 0 ? (
                <p className="text-slate-400 text-center py-8">暂无内容，点击上方按钮添加</p>
              ) : (
                <div className="space-y-4">
                  {review.items.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {item.item_type === 'text' && <FileText className="w-5 h-5 text-blue-500" />}
                          {item.item_type === 'image' && <Image className="w-5 h-5 text-green-500" />}
                          {item.item_type === 'video' && <Play className="w-5 h-5 text-red-500" />}
                          <span className="font-medium text-slate-800">{item.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full">
                            {item.item_type === 'text' ? '文字' : item.item_type === 'image' ? '图片' : '视频'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.content && <p className="text-slate-600 text-sm">{item.content}</p>}
                      {item.image_url && <img src={item.image_url} alt="" className="mt-2 max-w-xs rounded-lg" />}
                      {item.video_url && (
                        <video controls className="mt-2 max-w-xs rounded-lg" preload="metadata">
                          <source src={item.video_url} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-bold">添加内容项</h2>
              <p className="text-sm opacity-90">{selectedReview.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">类型</label>
                <select
                  value={itemForm.item_type}
                  onChange={(e) => setItemForm({ ...itemForm, item_type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="text">文字</option>
                  <option value="image">图片</option>
                  <option value="video">视频</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
                <input
                  type="text"
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  placeholder="内容标题"
                />
              </div>
              {itemForm.item_type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">内容</label>
                  <textarea
                    value={itemForm.content}
                    onChange={(e) => setItemForm({ ...itemForm, content: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg resize-none"
                    rows={4}
                    placeholder="请输入文字内容"
                  />
                </div>
              )}
              {itemForm.item_type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">图片URL</label>
                  <input
                    type="text"
                    value={itemForm.image_url}
                    onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    placeholder="图片地址"
                  />
                </div>
              )}
              {itemForm.item_type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">视频URL</label>
                  <input
                    type="text"
                    value={itemForm.video_url}
                    onChange={(e) => setItemForm({ ...itemForm, video_url: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    placeholder="视频地址"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}