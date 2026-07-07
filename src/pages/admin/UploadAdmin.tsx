import { useState, useRef } from 'react';
import { Upload, FileImage, FileText, Film, File, Download, Trash2, Loader2 } from 'lucide-react';
import { uploadFile } from '@/services/api';

export default function UploadAdmin() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="w-6 h-6 text-blue-500" />;
    if (type.startsWith('video/')) return <Film className="w-6 h-6 text-purple-500" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-6 h-6 text-red-500" />;
    return <File className="w-6 h-6 text-slate-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const isImage = file.type.startsWith('image/');
        const result = await uploadFile(file, isImage ? 'image' : 'resource');
        setUploadedFiles((prev) => [
          {
            ...result,
            size: file.size,
            type: file.type,
          },
          ...prev,
        ]);
      }
    } catch (error: any) {
      alert(error.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('链接已复制到剪贴板');
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">文件上传</h1>
        <p className="text-slate-500 mt-1">上传图片、文档、视频等资源文件</p>
      </div>

      {/* 上传区域 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {uploading ? '正在上传...' : '拖拽文件到这里，或点击上传'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                支持图片、PDF、Word、PPT、视频等格式，单文件最大 50MB
              </p>
            </div>
            {uploading && <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />}
          </div>
        </div>
      </div>

      {/* 已上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            已上传文件 ({uploadedFiles.length})
          </h2>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {file.type?.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                    {getFileIcon(file.type || '')}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{file.originalName}</p>
                  <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => copyUrl(file.url)}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  复制链接
                </button>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-semibold text-slate-800 mb-3">📌 使用说明</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• 上传后的文件可以在各内容管理模块中直接引用</li>
          <li>• 图片文件建议尺寸：轮播图 1920x600px，封面图 800x600px</li>
          <li>• 上传后请及时复制文件链接，方便后续使用</li>
          <li>• 所有文件均保存在服务器 uploads 目录中</li>
        </ul>
      </div>
    </div>
  );
}
