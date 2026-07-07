import GenericCrud from './GenericCrud';
import { api } from '@/services/api';
import type { CrudField } from './GenericCrud';

const fields: CrudField[] = [
  {
    key: 'page_name',
    label: '所属页面',
    type: 'select',
    required: true,
    listDisplay: true,
    helpText: '选择该区块属于哪个页面',
    options: [
      { label: '首页', value: 'home' },
      { label: '网络暴力专题', value: 'cyberbullying' },
      { label: '网络诈骗专题', value: 'fraud' },
      { label: '消费诱导专题', value: 'consumption' },
      { label: '活动回顾', value: 'activities' },
      { label: '学习资源库', value: 'resources' },
      { label: '项目成果', value: 'achievements' },
      { label: '关于我们', value: 'about' },
    ],
  },
  { key: 'section_key', label: '区块标识', type: 'text', required: true, listDisplay: true, placeholder: '如: hero, intro, features', helpText: '区块的唯一标识符，用于前端识别和渲染' },
  { key: 'title', label: '区块标题', type: 'text', listDisplay: true, helpText: '区块的大标题，显示在区块顶部' },
  { key: 'subtitle', label: '副标题', type: 'text', listDisplay: false, helpText: '区块的副标题，显示在标题下方' },
  { key: 'content', label: '正文内容', type: 'textarea', listDisplay: false, helpText: '区块的主要文字内容' },
  { key: 'image_url', label: '图片地址', type: 'image', listDisplay: false, helpText: '区块配图，根据区块设计可能在左侧或右侧', formatHint: 'https://... 或 /uploads/xxx.jpg' },
  { key: 'background_color', label: '背景颜色', type: 'text', listDisplay: false, placeholder: '如: #f8fafc 或 bg-slate-50', helpText: '区块的背景颜色，可以是CSS颜色值或Tailwind类名' },
];

export default function PageSectionAdmin() {
  return (
    <GenericCrud
      title="页面区块管理"
      description="管理各页面的内容区块，实现全站内容可配置"
      fields={fields}
      fetchAll={() => api.getAllPageSections()}
      create={(data) => api.createPageSection(data)}
      update={(id, data) => api.updatePageSection(id, data)}
      remove={(id) => api.deletePageSection(id)}
      listTitleKey="title"
      frontendPage="所有页面"
      frontendLocation="各个页面中的可配置内容区块（如介绍区、特色区等）"
    />
  );
}
