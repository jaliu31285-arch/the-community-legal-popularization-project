import GenericCrud from './GenericCrud';
import { api } from '@/services/api';

export default function ActivityAdmin() {
  return (
    <GenericCrud
      title="活动管理"
      description="管理实践活动日程和记录"
      listTitleKey="title"
      frontendPage="活动回顾页"
      frontendLocation="活动时间轴中的每一天活动卡片，包含日期、主题和现场照片"
      fields={[
        { key: 'day', label: '第几天', type: 'number', required: true, helpText: '活动日程的第几天，用于时间轴排序' },
        { key: 'date', label: '日期', type: 'text', placeholder: '7月1日', helpText: '活动的具体日期，显示在时间轴上' },
        { key: 'title', label: '活动主题', type: 'text', required: true, helpText: '活动的主题名称' },
        { key: 'description', label: '活动描述', type: 'textarea', helpText: '活动的详细内容介绍' },
        { key: 'highlights', label: '活动亮点', type: 'textarea', helpText: '活动亮点或特色，用换行分隔多条' },
        { key: 'schedule', label: '活动安排', type: 'textarea', helpText: '具体日程安排，用换行分隔多条' },
        { key: 'image_url', label: '活动图片', type: 'image', helpText: '活动现场照片，推荐比例 16:9，显示在活动卡片上', formatHint: 'https://... 或 /uploads/xxx.jpg' },
        { key: 'link_url', label: '详情链接', type: 'text', helpText: '活动详情页链接，点击活动卡片跳转，留空则不跳转' },
      ]}
      fetchAll={() => api.getActivities(true)}
      create={(data) => api.createActivity(data)}
      update={(id, data) => api.updateActivity(id, data)}
      remove={(id) => api.deleteActivity(id)}
    />
  );
}
