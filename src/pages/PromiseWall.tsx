import { useState, useEffect, useRef } from 'react';
import { PenLine, Image, Heart, Send, X } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { api } from '@/services/api';

interface Signature {
  id: number;
  name: string;
  signature_type: 'handwrite' | 'photo' | 'text';
  signature_image: string | null;
  message: string;
  created_at: string;
}

const defaultSignatures: Signature[] = [
  {
    id: 1,
    name: '小明',
    signature_type: 'text',
    signature_image: null,
    message: '我承诺：拒绝网络暴力，共建清朗网络空间！',
    created_at: '2026-07-21',
  },
  {
    id: 2,
    name: '小红',
    signature_type: 'text',
    signature_image: null,
    message: '我承诺：文明上网，理性发言，不造谣不传谣！',
    created_at: '2026-07-21',
  },
  {
    id: 3,
    name: '小华',
    signature_type: 'text',
    signature_image: null,
    message: '我承诺：增强法治意识，学会用法律保护自己！',
    created_at: '2026-07-21',
  },
];

export default function PromiseWall() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signMode, setSignMode] = useState<'text' | 'handwrite' | 'photo'>('text');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getPromiseWall();
        if (data && data.enabled === false) {
          setIsEnabled(false);
        } else if (data && data.signatures) {
          setSignatures(data.signatures);
        } else {
          setSignatures(defaultSignatures);
        }
      } catch (error) {
        console.error('Failed to fetch promise wall:', error);
        setSignatures(defaultSignatures);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showSignModal && signMode === 'handwrite' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [showSignModal, signMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
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
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('请输入您的姓名');
      return;
    }

    let signatureImage = null;

    if (signMode === 'handwrite' && canvasRef.current) {
      signatureImage = canvasRef.current.toDataURL();
    } else if (signMode === 'photo' && selectedPhoto) {
      signatureImage = selectedPhoto;
    }

    const newSignature: Signature = {
      id: Date.now(),
      name: name.trim(),
      signature_type: signMode,
      signature_image: signatureImage,
      message: message.trim() || '我承诺：文明上网，拒绝网络暴力！',
      created_at: new Date().toISOString().split('T')[0],
    };

    try {
      await api.createSignature({
        name: name.trim(),
        signature_type: signMode,
        signature_image: signatureImage,
        message: message.trim(),
      });
    } catch (error) {
      console.error('Failed to submit signature:', error);
    }

    setSignatures([newSignature, ...signatures]);
    setShowSignModal(false);
    setName('');
    setMessage('');
    setSelectedPhoto(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
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
            title="反网暴承诺墙"
            subtitle="许下承诺 守护清朗"
            bgColor="from-emerald-600 to-teal-600"
          />
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-lg">承诺墙功能即将上线，敬请期待...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageBanner
        title="反网暴承诺墙"
        subtitle="许下承诺 守护清朗"
        bgColor="from-emerald-600 to-teal-600"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <button
            onClick={() => setShowSignModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <PenLine className="w-6 h-6" />
            我要签名承诺
          </button>
          <p className="mt-3 text-slate-500">
            已有 <span className="text-emerald-600 font-bold">{signatures.length}</span> 人参与签名
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {signatures.map((sig) => (
            <div
              key={sig.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {sig.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{sig.name}</p>
                  <p className="text-xs text-slate-400">{sig.created_at}</p>
                </div>
                <Heart className="w-4 h-4 text-red-400 flex-shrink-0" />
              </div>

              {sig.signature_image && (
                <div className="mb-3 aspect-video bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={sig.signature_image}
                    alt={`${sig.name}的签名`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              <p className="text-sm text-slate-600 leading-relaxed">{sig.message}</p>
            </div>
          ))}
        </div>
      </div>

      {showSignModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">签署承诺</h2>
                <button
                  onClick={() => setShowSignModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-2">
                <button
                  onClick={() => setSignMode('text')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    signMode === 'text'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  文字签名
                </button>
                <button
                  onClick={() => setSignMode('handwrite')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    signMode === 'handwrite'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  手写签名
                </button>
                <button
                  onClick={() => setSignMode('photo')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    signMode === 'photo'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  上传照片
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  您的姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入您的姓名"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>

              {signMode === 'handwrite' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    手写签名
                  </label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full cursor-crosshair"
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="mt-2 text-sm text-slate-500 hover:text-slate-700"
                  >
                    清除重写
                  </button>
                </div>
              )}

              {signMode === 'photo' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    上传签名照片
                  </label>
                  <label className="block w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    {selectedPhoto ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={selectedPhoto}
                          alt="签名照片"
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <Image className="w-8 h-8 mb-2" />
                        <span className="text-sm">点击上传签名照片</span>
                      </div>
                    )}
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  承诺寄语
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下您的承诺寄语（选填）"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                提交承诺
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
