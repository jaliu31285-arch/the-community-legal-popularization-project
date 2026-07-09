import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, ChevronUp, ChevronDown, Loader2, Upload, Info, MapPin, ExternalLink, X } from 'lucide-react';
import { uploadFile } from '@/services/api';

export interface CrudField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'file';
  options?: { label: string; value: any }[];
  placeholder?: string;
  required?: boolean;
  listDisplay?: boolean;
  helpText?: string;
  formatHint?: string;
  showWhen?: { field: string; value: any };
}

interface GenericCrudProps {
  title: string;
  description: string;
  fields: CrudField[];
  fetchAll: () => Promise<any[]>;
  create: (data: any) => Promise<any>;
  update: (id: number, data: any) => Promise<any>;
  remove: (id: number) => Promise<any>;
  listImageKey?: string;
  listTitleKey: string;
  frontendLocation?: string;
  frontendPage?: string;
}

export default function GenericCrud({
  title,
  description,
  fields,
  fetchAll,
  create,
  update,
  remove,
  listTitleKey,
  frontendLocation,
  frontendPage,
}: GenericCrudProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchAll();
      setItems(data);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    const initial: any = {};
    fields.forEach((f) => {
      initial[f.key] = f.type === 'number' ? 0 : '';
    });
    initial.is_active = 1;
    initial.sort_order = 0;
    setFormData(initial);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这条记录吗？')) return;
    try {
      await remove(id);
      await fetchData();
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      await update(item.id, { is_active: item.is_active ? 0 : 1 });
      await fetchData();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await update(editingItem.id, formData);
      } else {
        await create(formData);
      }
      setShowModal(false);
      await fetchData();
    } catch (error: any) {
      alert(error.message || '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (fieldKey: string, file: File, type: 'image' | 'resource' = 'image') => {
    setUploading(true);
    try {
      const result = await uploadFile(file, type);
      setFormData((prev: any) => ({ ...prev, [fieldKey]: result.url }));
    } catch (error: any) {
      alert(error.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item[listTitleKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayFields = fields.filter((f) => f.listDisplay !== false);

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          新增
        </button>
      </div>

      {/* 前端位置说明 */}
      {(frontendLocation || frontendPage) && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-800">前端对应位置</p>
            {frontendPage && (
              <p className="text-sm text-emerald-700 mt-0.5">
                页面：<span className="font-medium">{frontendPage}</span>
              </p>
            )}
            {frontendLocation && (
              <p className="text-sm text-emerald-600 mt-0.5">{frontendLocation}</p>
            )}
          </div>
        </div>
      )}

      {/* 搜索栏 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 列表 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>暂无数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID</th>
                  {displayFields.slice(0, 4).map((f) => (
                    <th key={f.key} className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">排序</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">状态</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{item.id}</td>
                    {displayFields.slice(0, 4).map((f) => (
                      <td key={f.key} className="px-6 py-4">
                        {f.type === 'image' && item[f.key] ? (
                          <img
                            src={item[f.key]}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : f.key === listTitleKey ? (
                          <span className="font-medium text-slate-800">{item[f.key]}</span>
                        ) : (
                          <span className="text-slate-600 text-sm">{item[f.key] || '-'}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => update(item.id, { sort_order: (item.sort_order || 0) - 1 })}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        </button>
                        <span className="text-sm text-slate-600 w-6 text-center">{item.sort_order || 0}</span>
                        <button
                          onClick={() => update(item.id, { sort_order: (item.sort_order || 0) + 1 })}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.is_active ? '启用' : '禁用'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        )}
      </div>

      {/* 弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingItem ? '编辑' : '新增'}{title}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              {fields.map((field) => {
                if (field.showWhen) {
                  const { field: depField, value: depValue } = field.showWhen;
                  if (formData[depField] !== depValue) return null;
                }
                return (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={formData[field.key] || 0}
                      onChange={(e) => setFormData({ ...formData, [field.key]: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'image' && (
                    <div className="space-y-3">
                      {formData[field.key] && (
                        <div className="relative inline-block">
                          <img
                            src={formData[field.key]}
                            alt="预览"
                            className="w-32 h-32 rounded-xl object-cover border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, [field.key]: '' })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            title="清除图片"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600">{uploading ? '上传中...' : '点击上传图片'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(field.key, file, 'image');
                          }}
                        />
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          placeholder="或输入图片URL链接"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {field.type === 'file' && (
                    <div className="space-y-3">
                      {formData[field.key] && (
                        <div className="relative p-3 pr-10 bg-slate-50 rounded-xl text-sm text-slate-600">
                          <div className="truncate">{formData[field.key]}</div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, [field.key]: '' })}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            title="清除文件"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600">{uploading ? '上传中...' : '点击上传文件'}</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(field.key, file, 'resource');
                          }}
                        />
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          placeholder="或输入文件URL链接"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* 帮助说明 */}
                  {field.helpText && (
                    <p className="mt-2 text-xs text-slate-500 flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      {field.helpText}
                    </p>
                  )}

                  {/* 格式提示 */}
                  {field.formatHint && (
                    <p className="mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      格式：{field.formatHint}
                    </p>
                  )}
                </div>
                );
              })}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">排序</label>
                  <input
                    type="number"
                    value={formData.sort_order || 0}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">状态</label>
                  <select
                    value={formData.is_active ?? 1}
                    onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
