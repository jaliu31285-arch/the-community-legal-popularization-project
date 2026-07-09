import { useState, useEffect } from 'react';
import {
  Trash2,
  ToggleLeft,
  ToggleRight,
  Upload,
  User,
  MessageSquare,
  Image as ImageIcon,
  PenLine,
} from 'lucide-react';
import { api, uploadFile } from '@/services/api';

interface Signature {
  id: number;
  name: string;
  signature_type: string;
  signature_image: string | null;
  message: string;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export default function PromiseWallAdmin() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    message: '',
    signature_image: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.getPromiseWallAdmin();
      setSignatures(data.signatures || []);
      setEnabled(data.enabled);
    } catch (error) {
      console.error('Failed to fetch promise wall:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定删除这条签名吗？')) {
      try {
        await api.deleteSignature(id);
        fetchData();
      } catch (error: any) {
        alert('删除失败：' + error.message);
      }
    }
  };

  const handleToggleEnabled = async () => {
    try {
      await api.updatePromiseWallEnabled(!enabled);
      setEnabled(!enabled);
    } catch (error: any) {
      alert('操作失败：' + error.message);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadFile(file, 'image');
      setUploadForm({ ...uploadForm, signature_image: result.url });
    } catch (error: any) {
      alert('上传失败：' + error.message);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.name.trim()) {
      alert('请输入姓名');
      return;
    }
    if (!uploadForm.signature_image) {
      alert('请上传签名照片');
      return;
    }

    try {
      await api.createSignature({
        name: uploadForm.name,
        signature_type: 'photo',
        signature_image: uploadForm.signature_image,
        message: uploadForm.message,
      });
      setShowUploadModal(false);
      setUploadForm({ name: '', message: '', signature_image: '' });
      fetchData();
    } catch (error: any) {
      alert('添加失败：' + error.message);
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
          <h1 className="text-2xl font-bold text-slate-800">承诺墙管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理反网暴承诺墙的签名内容</p>
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
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
            上传签名照片
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <PenLine className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{signatures.length}</p>
              <p className="text-sm text-slate-500">总签名数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {signatures.filter(s => s.signature_type === 'photo').length}
              </p>
              <p className="text-sm text-slate-500">照片签名</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {signatures.filter(s => s.signature_type === 'handwrite').length}
              </p>
              <p className="text-sm text-slate-500">手写签名</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {signatures.filter(s => s.signature_type === 'text').length}
              </p>
              <p className="text-sm text-slate-500">文字签名</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-medium text-slate-800">签名列表</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {signatures.map((sig) => (
            <div key={sig.id} className="p-4 flex items-center gap-4 hover:bg-slate-50">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {sig.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800">{sig.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sig.signature_type === 'photo'
                      ? 'bg-blue-100 text-blue-700'
                      : sig.signature_type === 'handwrite'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {sig.signature_type === 'photo' ? '照片' : sig.signature_type === 'handwrite' ? '手写' : '文字'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate mt-0.5">{sig.message}</p>
              </div>
              {sig.signature_image && (
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={sig.signature_image} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              <div className="text-xs text-slate-400 flex-shrink-0">
                {sig.created_at?.split('T')[0]}
              </div>
              <button
                onClick={() => handleDelete(sig.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {signatures.length === 0 && (
          <div className="text-center py-16">
            <PenLine className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">还没有签名记录</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">上传签名照片</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="请输入姓名"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">签名照片 *</label>
                {uploadForm.signature_image ? (
                  <div className="relative w-full h-40 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={uploadForm.signature_image}
                      alt="签名照片"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => setUploadForm({ ...uploadForm, signature_image: '' })}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
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
                    <Upload className="w-10 h-10 text-slate-300 mb-2" />
                    <span className="text-sm text-slate-400">点击上传签名照片</span>
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">承诺寄语</label>
                <textarea
                  value={uploadForm.message}
                  onChange={(e) => setUploadForm({ ...uploadForm, message: e.target.value })}
                  rows={3}
                  placeholder="写下您的承诺寄语（选填）"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-5 py-2.5 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUploadSubmit}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
