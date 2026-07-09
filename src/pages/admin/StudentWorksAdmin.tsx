import GenericCrud, { CrudField } from './GenericCrud';
import { api } from '@/services/api';

const fields: CrudField[] = [
  { key: 'category', label: '作品分类', type: 'select', required: true, listDisplay: true, options: [
    { label: '海报设计', value: 'poster' },
    { label: '爱心卡', value: 'card' },
    { label: '学法心得', value: 'essay' },
    { label: '视频作品', value: 'video' },
    { label: '其他作品', value: 'other' },
  ]},
  { key: 'title', label: '作品标题', type: 'text', required: true, listDisplay: true },
  { key: 'author', label: '作者', type: 'text', listDisplay: true },
  { key: 'description', label: '作品描述', type: 'textarea' },
  { key: 'content', label: '详细内容', type: 'textarea', helpText: '文字作品的详细内容，如学法心得全文' },
  { key: 'image_url', label: '作品图片', type: 'image', helpText: '海报、爱心卡等图片作品的地址' },
  { key: 'video_url', label: '视频地址', type: 'text', helpText: '视频作品的URL地址' },
  { key: 'sort_order', label: '排序', type: 'number', default: 0 },
  { key: 'is_active', label: '是否启用', type: 'toggle', default: true },
];

export default function StudentWorksAdmin() {
  return (
    <GenericCrud
      title="学生作品管理"
      description="管理学生作品，支持海报设计、爱心卡、学法心得等多种类型"
      fields={fields}
      fetchAll={api.getAllStudentWorks}
      create={api.createStudentWork}
      update={api.updateStudentWork}
      remove={api.deleteStudentWork}
      listTitleKey="title"
      frontendPage="/student-works"
      frontendLocation="学生作品展示页面"
    />
  );
}