import GenericCrud from './GenericCrud';
import { api } from '@/services/api';
import type { CrudField } from './GenericCrud';

const fields: CrudField[] = [
  { key: 'title', label: '组件标题', type: 'text', required: true, listDisplay: true, helpText: '侧边栏组件的标题，显示在组件顶部' },
  {
    key: 'widget_type',
    label: '组件类型',
    type: 'select',
    options: [
      { label: '公告列表', value: 'announcements' },
      { label: '统计数据', value: 'stats' },
      { label: '快速链接', value: 'quick_links' },
      { label: '联系方式', value: 'contact' },
      { label: '自定义内容', value: 'custom' },
      { label: '图片广告', value: 'image' },
    ],
    listDisplay: true,
    helpText: '选择组件类型，系统会根据类型自动渲染对应内容',
  },
  {
    key: 'position',
    label: '显示位置',
    type: 'select',
    options: [
      { label: '右侧边栏', value: 'right' },
      { label: '左侧边栏', value: 'left' },
    ],
    listDisplay: true,
    helpText: '组件显示在页面的左侧还是右侧边栏',
  },
  { key: 'content', label: '自定义内容', type: 'textarea', listDisplay: false, helpText: '自定义内容类型时填写，支持HTML标签' },
  { key: 'image_url', label: '图片地址', type: 'image', listDisplay: false, helpText: '图片广告类型时使用', formatHint: 'https://... 或 /uploads/xxx.jpg' },
  { key: 'link_url', label: '链接地址', type: 'text', listDisplay: false, helpText: '点击图片广告跳转的链接' },
];

export default function SidebarWidgetAdmin() {
  return (
    <GenericCrud
      title="侧边栏组件管理"
      description="管理网站侧边栏的各个组件模块"
      fields={fields}
      fetchAll={() => api.getAllSidebarWidgets()}
      create={(data) => api.createSidebarWidget(data)}
      update={(id, data) => api.updateSidebarWidget(id, data)}
      remove={(id) => api.deleteSidebarWidget(id)}
      listTitleKey="title"
      frontendPage="首页/专题页等有侧边栏的页面"
      frontendLocation="页面左侧或右侧的侧边栏区域"
    />
  );
}
