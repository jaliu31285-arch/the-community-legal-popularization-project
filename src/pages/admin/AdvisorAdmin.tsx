import GenericCrud, { CrudField } from './GenericCrud';
import { api } from '@/services/api';

const fields: CrudField[] = [
  { key: 'name', label: '姓名', type: 'text', required: true, listDisplay: true, helpText: '指导老师的姓名' },
  { key: 'title', label: '职称/职务', type: 'text', listDisplay: true, helpText: '老师的职称或职务，如"教授"、"副教授"' },
  { key: 'department', label: '所属单位', type: 'text', listDisplay: true, helpText: '老师所在的学校或部门' },
  { key: 'avatar', label: '头像', type: 'text', placeholder: '上传图片URL或emoji表情如👨‍🏫', helpText: '老师照片，可使用图片URL或emoji表情。推荐正方形图片', formatHint: 'https://... 或 /uploads/xxx.jpg 或 emoji如👨‍🏫👩‍🏫' },
  { key: 'description', label: '简介', type: 'textarea', placeholder: '请输入简介', helpText: '老师的个人简介，包括研究方向、学术成就等' },
];

export default function AdvisorAdmin() {
  return (
    <GenericCrud
      title="指导老师管理"
      description="管理项目指导老师信息"
      fields={fields}
      fetchAll={api.getAllAdvisors}
      create={api.createAdvisor}
      update={api.updateAdvisor}
      remove={api.deleteAdvisor}
      listTitleKey="name"
      frontendPage="关于我们页"
      frontendLocation="指导老师展示区域"
    />
  );
}