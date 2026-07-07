import GenericCrud from './GenericCrud';
import { api } from '@/services/api';

export default function AchievementAdmin() {
  return (
    <GenericCrud
      title="成果管理"
      description="管理项目成果展示内容"
      listTitleKey="title"
      frontendPage="项目成果展示页"
      frontendLocation="成果展示区域的每个成果卡片，包含标题、描述和预览图"
      fields={[
        { key: 'title', label: '成果名称', type: 'text', required: true, helpText: '成果的标题名称' },
        { key: 'type', label: '类型', type: 'select', helpText: '成果的类型，用于分类展示', options: [
          { label: '调研报告', value: 'report' },
          { label: '数据统计', value: 'stat' },
          { label: '媒体报道', value: 'media' },
          { label: '视频作品', value: 'video' },
          { label: '合作共建', value: 'coop' },
        ]},
        { key: 'value', label: '数值/副标题', type: 'text', helpText: '数据统计类成果的数值，或其他类型成果的副标题' },
        { key: 'description', label: '成果描述', type: 'textarea', helpText: '成果的详细介绍' },
        { key: 'image_url', label: '封面图片', type: 'image', helpText: '成果封面图或预览图，推荐比例 4:3', formatHint: 'https://... 或 /uploads/xxx.jpg' },
        { key: 'link_url', label: '链接地址', type: 'text', helpText: '点击成果卡片跳转的链接，如报告原文、报道页面等' },
      ]}
      fetchAll={() => api.getAchievements(true)}
      create={(data) => api.createAchievement(data)}
      update={(id, data) => api.updateAchievement(id, data)}
      remove={(id) => api.deleteAchievement(id)}
    />
  );
}
