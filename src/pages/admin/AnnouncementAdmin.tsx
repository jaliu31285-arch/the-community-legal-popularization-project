import GenericCrud from './GenericCrud';
import { api } from '@/services/api';
import type { CrudField } from './GenericCrud';

const fields: CrudField[] = [
  { key: 'title', label: '公告标题', type: 'text', required: true, listDisplay: true },
  { key: 'date', label: '发布日期', type: 'text', listDisplay: true },
  { key: 'image_url', label: '公告图片', type: 'image', helpText: '公告配图，有图的公告优先显示', formatHint: 'https://... 或 /uploads/xxx.jpg' },
  {
    key: 'content_type',
    label: '内容类型',
    type: 'select',
    required: true,
    helpText: '选择详情页的内容展示方式：文字、外部链接或文件下载',
    options: [
      { label: '文字内容', value: 'text' },
      { label: '外部链接', value: 'link' },
      { label: '文件下载', value: 'file' },
    ],
  },
  { key: 'content', label: '公告内容', type: 'textarea', listDisplay: false, helpText: '公告详细内容，支持换行', showWhen: { field: 'content_type', value: 'text' } },
  { key: 'link_url', label: '详情链接', type: 'text', helpText: '公众号文章链接或其他外部链接，点击"查看原文"跳转', formatHint: 'https://mp.weixin.qq.com/...', showWhen: { field: 'content_type', value: 'link' } },
  { key: 'file_url', label: '文件附件', type: 'file', helpText: '上传PDF/Word等文件，点击"下载文件"获取', showWhen: { field: 'content_type', value: 'file' } },
  {
    key: 'is_sticky',
    label: '是否置顶',
    type: 'select',
    helpText: '置顶公告显示在列表最前面，带红色标记',
    options: [
      { label: '否', value: 0 },
      { label: '是', value: 1 },
    ],
    listDisplay: true,
  },
];

export default function AnnouncementAdmin() {
  return (
    <GenericCrud
      title="公告管理"
      description="管理网站公告信息"
      fields={fields}
      fetchAll={() => api.getAllAnnouncements()}
      create={(data) => api.createAnnouncement(data)}
      update={(id, data) => api.updateAnnouncement(id, data)}
      remove={(id) => api.deleteAnnouncement(id)}
      listTitleKey="title"
      frontendPage="首页右侧边栏"
      frontendLocation="网站公告列表区域，点击可查看详情"
    />
  );
}
