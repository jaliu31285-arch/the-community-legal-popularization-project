import GenericCrud from './GenericCrud';
import { api } from '@/services/api';
import type { CrudField } from './GenericCrud';

const fields: CrudField[] = [
  { key: 'title', label: '标题', type: 'text', required: true, listDisplay: true, helpText: '建议不超过30字' },
  { key: 'summary', label: '摘要', type: 'textarea', helpText: '新闻摘要，显示在列表页，建议不超过100字' },
  { key: 'category', label: '分类', type: 'select', helpText: '新闻分类，用于筛选和展示', options: [
    { label: '活动动态', value: '活动动态' },
    { label: '实践纪实', value: '实践纪实' },
    { label: '普法资讯', value: '普法资讯' },
    { label: '通知公告', value: '通知公告' },
  ]},
  { key: 'date', label: '日期', type: 'text', placeholder: '2024-07-01', listDisplay: true },
  { key: 'image_url', label: '封面图片', type: 'image', helpText: '新闻封面图，推荐比例 4:3，首页图文列表显示', formatHint: 'https://... 或 /uploads/xxx.jpg' },
  {
    key: 'content_type',
    label: '内容类型',
    type: 'select',
    required: true,
    helpText: '选择详情页的内容展示方式：图文、外部链接或文件下载',
    options: [
      { label: '图文内容', value: 'text' },
      { label: '外部链接', value: 'link' },
      { label: '文件下载', value: 'file' },
    ],
  },
  { key: 'content', label: '正文内容', type: 'textarea', helpText: '新闻详细内容，支持换行', showWhen: { field: 'content_type', value: 'text' } },
  { key: 'link_url', label: '外部链接', type: 'text', helpText: '公众号文章链接或其他外部链接，点击"查看原文"跳转', formatHint: 'https://mp.weixin.qq.com/...', showWhen: { field: 'content_type', value: 'link' } },
  { key: 'file_url', label: '文件附件', type: 'file', helpText: '上传PDF/Word等文件，点击"下载文件"获取', showWhen: { field: 'content_type', value: 'file' } },
];

export default function NewsAdmin() {
  return (
    <GenericCrud
      title="新闻动态管理"
      description="管理最新动态和活动新闻"
      listTitleKey="title"
      frontendPage="首页 / 新闻列表"
      frontendLocation="首页左侧新闻动态区域，点击可查看详情"
      fields={fields}
      fetchAll={() => api.getNews(true)}
      create={(data) => api.createNews(data)}
      update={(id, data) => api.updateNews(id, data)}
      remove={(id) => api.deleteNews(id)}
    />
  );
}
