import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  Clock,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Upload,
  GripVertical,
} from 'lucide-react';
import { api, uploadFile } from '@/services/api';

interface TimePoint {
  id?: number;
  time: string;
  title: string;
  content: string;
  images: string[];
  video_url: string | null;
  sort_order: number;
  is_active: number;
}

interface ReviewDay {
  id?: number;
  date: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: number;
  time_points: TimePoint[];
}

export default function ActivityReviewAdmin() {
  const [days, setDays] = useState<ReviewDay[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getActivityReviewAdmin();
        setDays(data.days || []);
        setEnabled(data.enabled);
      } catch (error) {
        console.error('Failed to fetch activity review:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddDay = () => {
    const newDay: ReviewDay = {
      date: '2026-07-20',
      title: '新的一天',
      description: '',
      sort_order: days.length + 1,
      is_active: 1,
      time_points: [],
    };
    setDays([...days, newDay]);
  };

  const handleUpdateDay = (index: number, field: keyof ReviewDay, value: any) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const handleDeleteDay = (index: number) => {
    if (confirm('确定删除这一天吗？所有时间点也将被删除。')) {
      const newDays = days.filter((_, i) => i !== index);
      setDays(newDays);
    }
  };

  const handleAddPoint = (dayIndex: number) => {
    const newDays = [...days];
    const newPoint: TimePoint = {
      time: '上午 09:00',
      title: '新环节',
      content: '',
      images: [],
      video_url: null,
      sort_order: newDays[dayIndex].time_points.length + 1,
      is_active: 1,
    };
    newDays[dayIndex].time_points = [...newDays[dayIndex].time_points, newPoint];
    setDays(newDays);
  };

  const handleUpdatePoint = (dayIndex: number, pointIndex: number, field: keyof TimePoint, value: any) => {
    const newDays = [...days];
    newDays[dayIndex].time_points[pointIndex] = {
      ...newDays[dayIndex].time_points[pointIndex],
      [field]: value,
    };
    setDays(newDays);
  };

  const handleDeletePoint = (dayIndex: number, pointIndex: number) => {
    if (confirm('确定删除这个时间点吗？')) {
      const newDays = [...days];
      newDays[dayIndex].time_points = newDays[dayIndex].time_points.filter((_, i) => i !== pointIndex);
      setDays(newDays);
    }
  };

  const handleImageUpload = async (dayIndex: number, pointIndex: number, file: File) => {
    try {
      const result = await uploadFile(file, 'image');
      const newDays = [...days];
      newDays[dayIndex].time_points[pointIndex].images = [
        ...newDays[dayIndex].time_points[pointIndex].images,
        result.url,
      ];
      setDays(newDays);
    } catch (error: any) {
      alert('上传失败：' + error.message);
    }
  };

  const handleRemoveImage = (dayIndex: number, pointIndex: number, imageIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].time_points[pointIndex].images = newDays[dayIndex].time_points[pointIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setDays(newDays);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateActivityReview({ enabled, days });
      alert('保存成功！');
    } catch (error: any) {
      alert('保存失败：' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">活动回顾管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理活动回顾的日期、时间点和内容</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              enabled
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {enabled ? '已启用' : '已禁用'}
          </button>
          <button
            onClick={handleAddDay}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            添加日期
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? '保存中...' : '保存全部'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day, dayIndex) => (
          <div key={day.id || dayIndex} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedDay(expandedDay === (day.id || dayIndex) ? null : (day.id || dayIndex))}
            >
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-slate-300 cursor-move" />
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex flex-col items-center justify-center text-white">
                  <span className="text-xs opacity-90">{day.date.split('-')[1]}月</span>
                  <span className="text-xl font-bold">{day.date.split('-')[2]}日</span>
                </div>
                <div>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => handleUpdateDay(dayIndex, 'title', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-lg font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-emerald-500 outline-none w-full"
                  />
                  <input
                    type="text"
                    value={day.description}
                    onChange={(e) => handleUpdateDay(dayIndex, 'description', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="添加描述..."
                    className="text-sm text-slate-500 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-emerald-500 outline-none w-full mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">
                  {day.time_points.length} 个环节
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateDay(dayIndex, 'is_active', day.is_active === 1 ? 0 : 1);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    day.is_active === 1
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {day.is_active === 1 ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDay(dayIndex);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedDay === (day.id || dayIndex) ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {expandedDay === (day.id || dayIndex) && (
              <div className="p-5 pt-0 border-t border-slate-100">
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      日期
                    </label>
                    <input
                      type="date"
                      value={day.date}
                      onChange={(e) => handleUpdateDay(dayIndex, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      排序
                    </label>
                    <input
                      type="number"
                      value={day.sort_order}
                      onChange={(e) => handleUpdateDay(dayIndex, 'sort_order', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-700">
                    <Clock className="w-4 h-4 inline mr-1" />
                    时间点列表
                  </h3>
                  <button
                    onClick={() => handleAddPoint(dayIndex)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加时间点
                  </button>
                </div>

                <div className="space-y-3">
                  {day.time_points.map((point, pointIndex) => (
                    <div key={point.id || pointIndex} className="p-4 bg-slate-50 rounded-xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">时间</label>
                          <input
                            type="text"
                            value={point.time}
                            onChange={(e) => handleUpdatePoint(dayIndex, pointIndex, 'time', e.target.value)}
                            placeholder="如：上午 09:00"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">标题</label>
                          <input
                            type="text"
                            value={point.title}
                            onChange={(e) => handleUpdatePoint(dayIndex, pointIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          <FileText className="w-4 h-4 inline mr-1" />
                          内容描述
                        </label>
                        <textarea
                          value={point.content}
                          onChange={(e) => handleUpdatePoint(dayIndex, pointIndex, 'content', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          <ImageIcon className="w-4 h-4 inline mr-1" />
                          现场照片
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {point.images.map((img, imgIndex) => (
                            <div key={imgIndex} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => handleRemoveImage(dayIndex, pointIndex, imgIndex)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                files.forEach((file) => handleImageUpload(dayIndex, pointIndex, file));
                              }}
                              className="hidden"
                            />
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-400">上传</span>
                          </label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-600 mb-1">
                          <Video className="w-4 h-4 inline mr-1" />
                          视频地址
                        </label>
                        <input
                          type="text"
                          value={point.video_url || ''}
                          onChange={(e) => handleUpdatePoint(dayIndex, pointIndex, 'video_url', e.target.value || null)}
                          placeholder="输入视频URL，支持mp4等格式"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">排序：</span>
                          <input
                            type="number"
                            value={point.sort_order}
                            onChange={(e) => handleUpdatePoint(dayIndex, pointIndex, 'sort_order', Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-slate-200 rounded text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdatePoint(dayIndex, pointIndex, 'is_active', point.is_active === 1 ? 0 : 1)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              point.is_active === 1
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {point.is_active === 1 ? '显示' : '隐藏'}
                          </button>
                          <button
                            onClick={() => handleDeletePoint(dayIndex, pointIndex)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {days.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">还没有添加日期，点击上方按钮添加</p>
          </div>
        )}
      </div>
    </div>
  );
}
