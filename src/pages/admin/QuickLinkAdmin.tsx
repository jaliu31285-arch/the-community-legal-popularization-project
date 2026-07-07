import GenericCrud from './GenericCrud';
import { api } from '@/services/api';
import type { CrudField } from './GenericCrud';

const fields: CrudField[] = [
  { key: 'title', label: '链接名称', type: 'text', required: true, listDisplay: true, helpText: '快速链接显示的文字' },
  { key: 'link_url', label: '链接地址', type: 'text', required: true, listDisplay: true, helpText: '点击链接跳转的地址', formatHint: '站内链接: /xxx  外部链接: https://xxx' },
  { key: 'image_url', label: '链接图标', type: 'image', helpText: '链接的图标/Logo图片，有图优先显示图片，无图显示Lucide图标', formatHint: 'https://... 或 /uploads/xxx.jpg' },
  { key: 'icon', label: '图标名称', type: 'text', listDisplay: true, placeholder: '如: Flag, Phone, BookOpen, Shield', helpText: 'Lucide图标库的图标名称，没有上传图片时使用' },
];

export default function QuickLinkAdmin() {
  return (
    <GenericCrud
      title="快速链接管理"
      description="管理首页侧边栏快速链接"
      fields={fields}
      fetchAll={() => api.getAllQuickLinks()}
      create={(data) => api.createQuickLink(data)}
      update={(id, data) => api.updateQuickLink(id, data)}
      remove={(id) => api.deleteQuickLink(id)}
      listTitleKey="title"
      frontendPage="首页右侧边栏"
      frontendLocation="快速链接区域，以图标+文字列表形式展示"
    />
  );
}
