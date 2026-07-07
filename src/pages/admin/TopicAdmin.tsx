import GenericCrud, { CrudField } from './GenericCrud';
import { api } from '@/services/api';

const fields: CrudField[] = [
  { key: 'category', label: '专题分类', type: 'select', required: true, listDisplay: true, options: [
    { label: '网络暴力', value: 'cyberbullying' },
    { label: '网络诈骗', value: 'fraud' },
    { label: '消费诱导', value: 'consumption' },
  ]},
  { key: 'title', label: '标题', type: 'text', required: true, listDisplay: true },
  { key: 'content', label: '内容', type: 'textarea', required: true, placeholder: '请输入内容' },
  { key: 'image_url', label: '配图', type: 'image', helpText: '内容配图，显示在卡片或详情页', formatHint: 'https://... 或 /uploads/xxx.jpg' },
  { key: 'link_url', label: '详情链接', type: 'text', helpText: '点击跳转的外部链接，留空则显示文字内容' },
  { key: 'content_type', label: '媒体类型', type: 'select', helpText: '媒体类型：纯文字直接显示，文章/视频/链接则跳转', options: [
    { label: '纯文字', value: 'text' },
    { label: '文章', value: 'article' },
    { label: '视频', value: 'video' },
    { label: '链接', value: 'link' },
  ]},
  { key: 'type', label: '内容类型', type: 'select', listDisplay: true, options: [
    { label: '知识科普', value: 'knowledge' },
    { label: '案例分析', value: 'case' },
    { label: '法律法规', value: 'law' },
    { label: '应对方法', value: 'method' },
    { label: '求助渠道', value: 'channel' },
  ]},
  { key: 'icon', label: '图标', type: 'text', placeholder: '例如: AlertTriangle' },
  { key: 'color', label: '颜色', type: 'text', placeholder: '例如: blue' },
];

export default function TopicAdmin() {
  return (
    <GenericCrud
      title="普法专题管理"
      description="管理三大普法专题的内容（网络暴力、网络诈骗、消费诱导）"
      fields={fields}
      fetchAll={api.getAllTopics}
      create={api.createTopic}
      update={api.updateTopic}
      remove={api.deleteTopic}
      listTitleKey="title"
      frontendPage="网络暴力/网络诈骗/消费诱导专题页"
      frontendLocation="各专题页面的知识科普、案例分析等内容区块"
    />
  );
}