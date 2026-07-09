import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { PenTool, Send, Calendar, CheckCircle } from 'lucide-react';

interface Signature {
  id: number;
  name: string;
  school: string;
  grade: string;
  signature_image: string;
  signature_data: string;
  message: string;
  created_at: string;
}

export default function PromiseWall() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    grade: '',
    message: '',
  });

  useEffect(() => {
    api.getPromiseWallSignatures().then((data) => {
      setSignatures(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const submitSignature = () => {
    if (!formData.name) return;
    const canvas = canvasRef.current;
    const signatureData = canvas?.toDataURL('image/png') || '';
    
    api.createPromiseWallSignature({
      ...formData,
      signature_data: signatureData,
    }).then((newSignature) => {
      setSignatures([newSignature, ...signatures]);
      setShowForm(false);
      setIsSigned(true);
      setFormData({ name: '', school: '', grade: '', message: '' });
      clearCanvas();
    });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">反网暴承诺墙</h1>
          <p className="text-xl opacity-90">我承诺：抵制网络暴力，守护清朗网络空间</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-slate-600 text-lg">
            已有 <span className="text-emerald-600 font-bold text-2xl">{signatures.length}</span> 位同学签署承诺
          </p>
        </div>

        {!isSigned && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full max-w-md mx-auto mb-12 flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
          >
            <PenTool className="w-5 h-5" />
            我要签署承诺
          </button>
        )}

        {isSigned && (
          <div className="w-full max-w-md mx-auto mb-12 flex items-center justify-center gap-3 px-8 py-4 bg-emerald-100 text-emerald-700 rounded-xl font-semibold">
            <CheckCircle className="w-5 h-5" />
            您已成功签署承诺！
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {signatures.map((sig) => (
            <div
              key={sig.id}
              className="bg-white rounded-xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {sig.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{sig.name}</p>
                  <p className="text-slate-500 text-xs">{sig.school} · {sig.grade}</p>
                </div>
              </div>
              {sig.signature_image && (
                <div className="bg-slate-50 rounded-lg p-2 mb-3">
                  <img src={sig.signature_image} alt="签名" className="w-full h-24 object-contain" />
                </div>
              )}
              {sig.message && (
                <p className="text-slate-600 text-sm bg-emerald-50 p-2 rounded-lg">"{sig.message}"</p>
              )}
              <p className="text-slate-400 text-xs mt-3 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(sig.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {signatures.length === 0 && (
          <div className="text-center py-20">
            <PenTool className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">暂无承诺签名</p>
            <p className="text-slate-400">点击上方按钮签署您的承诺</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">签署反网暴承诺书</h2>
              <p className="opacity-90 text-sm mt-1">请填写信息并签署您的承诺</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="请输入您的姓名"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">学校</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="学校名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">年级</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="如：六年级"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">承诺留言</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="写下您的承诺..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">请在此处签名</label>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={120}
                  className="w-full border-2 border-dashed border-slate-300 rounded-lg cursor-crosshair bg-slate-50"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <button
                  onClick={clearCanvas}
                  className="mt-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  清除签名
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={submitSignature}
                  disabled={!formData.name}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  提交承诺
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}