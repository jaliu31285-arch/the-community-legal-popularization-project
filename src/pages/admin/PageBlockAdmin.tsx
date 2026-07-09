import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  Upload,
  X,
  Eye,
  EyeOff,
  Type,
  Image,
  Video,
  LayoutGrid,
  Images,
  BarChart3,
  Minus,
  Monitor,
  MoveUp,
  MoveDown,
  GripVertical,
  Save,
} from 'lucide-react';
import { api, uploadFile } from '@/services/api';

const BLOCK_TYPES = [
  { value: 'hero', label: '大横幅 Hero', icon: Monitor, desc: '全屏大横幅，标题+副标题+描述' },
  { value: 'text', label: '纯文字', icon: Type, desc: '标题+正文文字区块' },
  { value: 'image_text', label: '图文混排', icon: Image, desc: '左侧图右侧文字，或反过来' },
  { value: 'video', label: '视频区块', icon: Video, desc: '独立视频展示区，支持在线播放' },
  { value: 'cards', label: '卡片组', icon: LayoutGrid, desc: '可添加若干小卡片（图标+标题+描述）' },
  { value: 'gallery', label: '图片集/作品', icon: Images, desc: '图片网格展示，适合学生作品' },
  { value: 'stats', label: '数据统计', icon: BarChart3, desc: '数字+标签的统计展示' },
  { value: 'divider', label: '分割线', icon: Minus, desc: '区块间的分隔线' },
];

const PAGE_OPTIONS = [
  { value: 'home', label: '首页' },
  { value: 'activities', label: '活动页' },
  { value: 'about', label: '关于页' },
  { value: 'achievements', label: '成果页' },
  { value: 'resources', label: '资源页' },
];

const ICON_OPTIONS = [
  'Landmark', 'Users', 'Theater', 'Award', 'BookOpen', 'MapPin',
  'Image', 'Shield', 'Scale', 'FileText', 'Gift', 'Gamepad2',
  'MessageSquare', 'Wallet', 'AlertTriangle', 'AlertCircle',
  'UserCheck', 'Cpu', 'Sun', 'Phone', 'Flag', 'Heart',
  'Star', 'Target', 'Lightbulb', 'GraduationCap', 'Briefcase',
];

const COLOR_OPTIONS = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'cyan', 'amber'];

interface BlockItem {
  icon?: string;
  title?: string;
  subtitle?: string;
  desc?: string;
  image?: string;
  label?: string;
  value?: string;
  color?: string;
  link?: string;
}

interface PageBlock {
  id: number;
  page_name: string;
  block_type: string;
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  video_url: string;
  items: BlockItem[];
  background_color: string;
  text_color: string;
  layout: string;
  sort_order: number;
  is_active: number;
}

export default function PageBlockAdmin() {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPageBlocks();
      setBlocks(data.filter((b: PageBlock) => b.page_name === selectedPage));
    } catch (error: any) {
      alert(error.message || '获取区块失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, [selectedPage]);

  const openAddModal = (blockType: string) => {
    setShowTypePicker(false);
    const defaultItems: BlockItem[] = [];
    if (blockType === 'cards') {
      defaultItems.push({ icon: 'Shield', title: '卡片标题', desc: '卡片描述文字', color: 'blue' });
    } else if (blockType === 'gallery') {
      defaultItems.push({ title: '作品名称', subtitle: '作者', image: '' });
    } else if (blockType === 'stats') {
      defaultItems.push({ label: '统计项', value: '0', color: 'blue' });
    }

    setEditingBlock(null);
    setFormData({
      page_name: selectedPage,
      block_type: blockType,
      title: '',
      subtitle: '',
      content: '',
      image_url: '',
      video_url: '',
      items: defaultItems,
      background_color: '',
      text_color: '',
      layout: 'default',
      sort_order: blocks.length + 1,
      is_active: 1,
    });
    setShowModal(true);
  };

  const handleEdit = (block: PageBlock) => {
    setEditingBlock(block);
    setFormData({
      ...block,
      items: block.items && block.items.length > 0 ? [...block.items] : [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个区块吗？')) return;
    try {
      await api.deletePageBlock(id);
      await fetchBlocks();
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const handleToggleActive = async (block: PageBlock) => {
    try {
      await api.updatePageBlock(block.id, { is_active: block.is_active ? 0 : 1 });
      await fetchBlocks();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    const order = newBlocks.map((b, i) => ({ id: b.id, sort_order: i + 1 }));
    try {
      await api.reorderPageBlocks(order);
      await fetchBlocks();
    } catch (error: any) {
      alert(error.message || '排序失败');
    }
  };

  const handleSubmit = async () => {
    if (!formData.block_type) {
      alert('请选择区块类型');
      return;
    }
    setSubmitting(true);
    try {
      if (editingBlock) {
        await api.updatePageBlock(editingBlock.id, formData);
      } else {
        await api.createPageBlock(formData);
      }
      setShowModal(false);
      await fetchBlocks();
    } catch (error: any) {
      alert(error.message || '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const result = await uploadFile(file, 'image');
      setFormData({ ...formData, image_url: result.url });
    } catch (error: any) {
      alert(error.message || '上传失败');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const result = await uploadFile(file, 'resource');
      setFormData({ ...formData, video_url: result.url });
    } catch (error: any) {
      alert(error.message || '上传失败');
    } finally {
      setUploadingVideo(false);
    }
  };

  const addItem = () => {
    const items = [...(formData.items || [])];
    const type = formData.block_type;
    if (type === 'cards') {
      items.push({ icon: 'Star', title: '新卡片', desc: '卡片描述', color: 'blue' });
    } else if (type === 'gallery') {
      items.push({ title: '新作品', subtitle: '', image: '' });
    } else if (type === 'stats') {
      items.push({ label: '新统计', value: '0', color: 'blue' });
    }
    setFormData({ ...formData, items });
  };

  const updateItem = (index: number, key: string, value: any) => {
    const items = [...(formData.items || [])];
    items[index] = { ...items[index], [key]: value };
    setFormData({ ...formData, items });
  };

  const removeItem = (index: number) => {
    const items = [...(formData.items || [])];
    items.splice(index, 1);
    setFormData({ ...formData, items });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const items = [...(formData.items || [])];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
    setFormData({ ...formData, items });
  };

  const handleItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile(file, 'image');
      updateItem(index, 'image', result.url);
    } catch (error: any) {
      alert(error.message || '上传失败');
    }
  };

  const getTypeIcon = (type: string) => {
    const found = BLOCK_TYPES.find((t) => t.value === type);
    if (found) {
      const Icon = found.icon;
      return <Icon className="w-5 h-5" />;
    }
    return <Type className="w-5 h-5" />;
  };

  const getTypeLabel = (type: string) => {
    return BLOCK_TYPES.find((t) => t.value === type)?.label || type;
  };

  const hasItems = ['cards', 'gallery', 'stats'].includes(formData.block_type);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">页面区块管理</h1>
        <p className="text-slate-600">可视化管理页面各区块，支持添加图文、视频、卡片、图片集等多种类型</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-sm">选择页面：</span>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAGE_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowTypePicker(!showTypePicker)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              添加新区块
            </button>
            {showTypePicker && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-2">
                  {BLOCK_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => openAddModal(type.value)}
                        className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{type.label}</div>
                          <div className="text-xs text-slate-500">{type.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          </div>
        ) : blocks.length === 0 ? (
          <div className="p-20 text-center">
            <LayoutGrid className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">该页面暂无区块</p>
            <button
              onClick={() => setShowTypePicker(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              添加第一个区块
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className={`p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors ${block.is_active ? '' : 'opacity-50'}`}
              >
                <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
                  <GripVertical className="w-5 h-5 cursor-grab" />
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(block.block_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">
                      {block.title || getTypeLabel(block.block_type)}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {getTypeLabel(block.block_type)}
                    </span>
                    {block.video_url && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                        含视频
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {block.subtitle || `排序：${block.sort_order}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                    title="上移"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                    title="下移"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(block)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title={block.is_active ? '点击禁用' : '点击启用'}
                  >
                    {block.is_active ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(block)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingBlock ? '编辑区块' : '添加新区块'}
                </h2>
                <p className="text-sm text-slate-500">
                  类型：{getTypeLabel(formData.block_type)}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* 基础设置 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">所属页面</label>
                  <select
                    value={formData.page_name}
                    onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PAGE_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">区块类型</label>
                  <select
                    value={formData.block_type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const items: BlockItem[] = [];
                      if (type === 'cards') {
                        items.push({ icon: 'Star', title: '卡片标题', desc: '卡片描述', color: 'blue' });
                      } else if (type === 'gallery') {
                        items.push({ title: '作品名称', subtitle: '作者', image: '' });
                      } else if (type === 'stats') {
                        items.push({ label: '统计项', value: '0', color: 'blue' });
                      }
                      setFormData({ ...formData, block_type: type, items });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BLOCK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 标题/副标题 - 大多数类型都有 */}
              {formData.block_type !== 'divider' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">标题</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="输入区块标题"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">副标题</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="输入副标题（可选）"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* 正文内容 - text, image_text, hero, video 类型 */}
              {['text', 'image_text', 'hero', 'video'].includes(formData.block_type) && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {formData.block_type === 'video' ? '视频说明（可选）' : '正文内容'}
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    placeholder="输入内容"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}

              {/* 图片上传 */}
              {['hero', 'image_text', 'video', 'gallery'].includes(formData.block_type) && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {formData.block_type === 'video' ? '视频封面图（可选）' : '区块主图'}
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.image_url ? (
                      <div className="relative">
                        <img
                          src={formData.image_url}
                          alt="预览"
                          className="w-32 h-24 object-cover rounded-xl border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-32 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-500">上传图片</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* 视频上传 */}
              {['hero', 'image_text', 'video'].includes(formData.block_type) && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">视频文件</label>
                  <div className="flex items-center gap-3">
                    {formData.video_url ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                        <Video className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-slate-700 max-w-xs truncate">
                          {formData.video_url.split('/').pop()}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, video_url: '' })}
                          className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        {uploadingVideo ? (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-600">上传视频文件</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                      </label>
                    )}
                    <p className="text-xs text-slate-400">支持 MP4, WebM 等浏览器可播放格式</p>
                  </div>
                </div>
              )}

              {/* 图文布局方向 */}
              {formData.block_type === 'image_text' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">图片位置</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="layout"
                        checked={formData.layout !== 'right'}
                        onChange={() => setFormData({ ...formData, layout: 'default' })}
                      />
                      <span className="text-sm">左图右文</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="layout"
                        checked={formData.layout === 'right'}
                        onChange={() => setFormData({ ...formData, layout: 'right' })}
                      />
                      <span className="text-sm">左文右图</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 背景色和文字色 */}
              {formData.block_type !== 'divider' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">背景样式</label>
                    <select
                      value={formData.background_color}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">默认（白色/透明）</option>
                      <option value="bg-slate-50">浅灰色背景</option>
                      <option value="bg-slate-900">深灰背景</option>
                      <option value="from-blue-600 via-blue-500 to-cyan-400">蓝青渐变</option>
                      <option value="from-emerald-500 via-teal-500 to-cyan-500">绿青渐变</option>
                      <option value="from-amber-500 via-orange-500 to-red-500">橙红渐变</option>
                      <option value="bg-gradient-to-r from-blue-600 to-cyan-500">蓝绿渐变</option>
                      <option value="bg-gradient-to-br from-purple-600 to-pink-500">紫粉渐变</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">Hero区块使用渐变，其他使用纯色或渐变色</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">文字颜色</label>
                    <select
                      value={formData.text_color}
                      onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">默认（深色文字）</option>
                      <option value="white">白色文字</option>
                      <option value="text-blue-600">蓝色</option>
                      <option value="text-emerald-600">绿色</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-1">深色背景请选白色文字</p>
                  </div>
                </div>
              )}

              {/* 排序 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">排序</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">状态</label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
                </div>
              </div>

              {/* 子项管理 - cards/gallery/stats */}
              {hasItems && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">
                      {formData.block_type === 'cards' && '卡片列表'}
                      {formData.block_type === 'gallery' && '图片/作品列表'}
                      {formData.block_type === 'stats' && '统计项列表'}
                    </h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      添加一项
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.items || []).map((item: BlockItem, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-600">
                            第 {index + 1} 项
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveItem(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem(index, 'down')}
                              disabled={index === (formData.items || []).length - 1}
                              className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-1 text-red-500 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Cards 字段 */}
                        {formData.block_type === 'cards' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">图标</label>
                              <select
                                value={item.icon}
                                onChange={(e) => updateItem(index, 'icon', e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              >
                                {ICON_OPTIONS.map((ic) => (
                                  <option key={ic} value={ic}>{ic}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">颜色</label>
                              <select
                                value={item.color}
                                onChange={(e) => updateItem(index, 'color', e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              >
                                {COLOR_OPTIONS.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-slate-500 mb-1">标题</label>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs text-slate-500 mb-1">描述</label>
                              <textarea
                                value={item.desc || ''}
                                onChange={(e) => updateItem(index, 'desc', e.target.value)}
                                rows={2}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm resize-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Gallery 字段 */}
                        {formData.block_type === 'gallery' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="row-span-2">
                              <label className="block text-xs text-slate-500 mb-1">图片</label>
                              {item.image ? (
                                <div className="relative w-full h-24">
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateItem(index, 'image', '')}
                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <label className="w-full h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400">
                                  <Image className="w-6 h-6 text-slate-400" />
                                  <span className="text-xs text-slate-500 mt-1">上传</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleItemImageUpload(e, index)}
                                  />
                                </label>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">标题/作品名</label>
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">副标题/作者</label>
                              <input
                                type="text"
                                value={item.subtitle || ''}
                                onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Stats 字段 */}
                        {formData.block_type === 'stats' && (
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">数值</label>
                              <input
                                type="text"
                                value={item.value || ''}
                                onChange={(e) => updateItem(index, 'value', e.target.value)}
                                placeholder="如 100+"
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">标签</label>
                              <input
                                type="text"
                                value={item.label || ''}
                                onChange={(e) => updateItem(index, 'label', e.target.value)}
                                placeholder="如 参与人数"
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-500 mb-1">颜色</label>
                              <select
                                value={item.color}
                                onChange={(e) => updateItem(index, 'color', e.target.value)}
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                              >
                                {COLOR_OPTIONS.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                保存区块
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
