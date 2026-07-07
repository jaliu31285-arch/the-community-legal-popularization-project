import GenericCrud, { CrudField } from './GenericCrud';
import { api } from '@/services/api';

const fields: CrudField[] = [
  { key: 'name', label: '单位名称', type: 'text', required: true, listDisplay: true, helpText: '合作单位的全称' },
  { key: 'type', label: '单位类型', type: 'text', listDisplay: true, placeholder: '例如: 指导单位、合作单位、支持单位', helpText: '单位的类型，如指导单位、合作单位、支持单位等' },
  { key: 'description', label: '描述', type: 'textarea', placeholder: '请输入单位描述', helpText: '单位的简要介绍' },
  { key: 'logo_url', label: 'Logo图片', type: 'image', helpText: '单位Logo，推荐横向长方形图片，用于展示合作伙伴', formatHint: 'https://... 或 /uploads/xxx.jpg' },
];

export default function PartnerAdmin() {
  return (
    <GenericCrud
      title="合作单位管理"
      description="管理项目合作单位信息"
      fields={fields}
      fetchAll={api.getAllPartners}
      create={api.createPartner}
      update={api.updatePartner}
      remove={api.deletePartner}
      listTitleKey="name"
      frontendPage="关于我们页"
      frontendLocation="合作单位/支持单位展示区域，以Logo墙形式展示"
    />
  );
}