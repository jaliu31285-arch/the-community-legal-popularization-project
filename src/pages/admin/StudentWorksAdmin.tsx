import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Image as ImageIcon,
  FileText,
  ToggleLeft,
  ToggleRight,
  Upload,
  Tag,
} from 'lucide-react';
import { api, uploadFile } from '@/services/api';

interface StudentWork {
  id: number;
  title: string;
  category: string;
  author: string;
  description: string;
  image_url: string;
  content_text: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

const categories = ['爱心卡', '海报设计', '心得体会', '绘画作品', '其他'];

export default function StudentWorksAdmin() {
  const [works, setWorks] = useState<StudentWork[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWork, setEditingWork] = useState<StudentWork | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '其他',
    author: '',
    description: '',
    image_url: '',
    content_text: '',
    sort_order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.getStudentWorksAdmin();
      setWorks(data.works || []);
      setEnabled(data.enabled);
    } catch (error) {
      console.error('Failed to fetch student works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingWork(null);
    setFormData({
      title: '',
      category: '其他',
      author: '',
      description: '',
      image_url: '',
      content_text: '',
      sort_order: works.length + 1,
    });
    setShowModal(true);
  };

  const handleEdit = (work: StudentWork) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      category: work.category,
      author: work.author,
      description: work.description,
      image_url: work.image_url,
      content_text: work.content_text,
      sort_order: work.sort_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('请输入作品标题');
      return;
    }

    try {
      if (editingWork) {
        await api.updateStudentWork(editingWork.id, formData);
      } else {
        await api.createStudentWork(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      alert('保存失败：' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除这个作品吗？')) {
      try {
        await api.deleteStudentWork(id);
        fetchData();
      } catch (error: any) {
        alert('删除失败：' + error.message);
      }
    }
  };

  const handleToggleActive = async (work: StudentWork) => {
    try {
      await api.updateStudentWork(work.id, {
        ...work,
        is_active: work.is_active === 1 ? 0 : 1,
      });
      fetchData();
    } catch (error: any) {
      alert('操作失败：' + error.message);
    }
  };

  const handleToggleEnabled = async () => {
    try {
      await api.updateStudentWorksEnabled(!enabled);
      setEnabled(!enabled);
    } catch (error: any) {
      alert('操作失败：' + error.message);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, 'image');
      setFormData({ ...formData, image_url: result.url });
    } catch (error: any) {
      alert('上传失败：' + error.message);
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
          <h1 className="text-2xl font-bold text-slate-800">学生作品管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理学生作品的展示内容</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleEnabled}
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
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            添加作品
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">作品</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">分类</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">作者</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">排序</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-slate-600">状态</th>
                <th className="px-5 py-3 text-right text-sm font-medium text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {works.map((work) => (
                <tr key={work.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {work.image_url ? (
                          <img src={work.image_url} alt={work.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            {work.content_text ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{work.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{work.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                      <Tag className="w-3 h-3 inline mr-1" />
                      {work.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{work.author || '-'}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{work.sort_order}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActive(work)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        work.is_active === 1
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {work.is_active === 1 ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(work)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(work.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {works.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">还没有作品，点击上方按钮添加</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingWork ? '编辑作品' : '添加作品'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">作品标题 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="请输入作品标题"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">作者</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="请输入作者姓名"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">排序</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">简介</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="请输入作品简介"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">作品图片</label>
                <div className="flex items-start gap-4">
                  {formData.image_url ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                      <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <Upload className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-xs text-slate-400">点击上传</span>
                    </label>
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="或输入图片URL"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  文字作品内容
                </label>
                <textarea
                  value={formData.content_text}
                  onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                  rows={5}
                  placeholder="对于文字类作品，可在此处输入完整内容"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
