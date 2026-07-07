import GenericCrud from './GenericCrud';
import { api } from '@/services/api';
import type { CrudField } from './GenericCrud';

const fields: CrudField[] = [
  { key: 'title', label: '区块标题', type: 'text', required: true, listDisplay: true, helpText: '页脚区块的标题，显示在区块顶部' },
  {
    key: 'section_type',
    label: '区块类型',
    type: 'select',
    options: [
      { label: '链接列表', value: 'links' },
      { label: '联系方式', value: 'contact' },
      { label: '文字内容', value: 'text' },
    ],
    listDisplay: true,
    helpText: '选择区块的内容类型，不同类型有不同的展示方式',
  },
  {
    key: 'content',
    label: '内容 (JSON格式)',
    type: 'textarea',
    listDisplay: false,
    placeholder: '链接列表: [{"label":"首页","url":"/"}]  联系方式: {"address":"...","email":"...","phone":"..."}',
    helpText: '根据区块类型填写对应格式的JSON内容',
    formatHint: '链接列表: [{"label":"名称","url":"链接地址"}]  联系方式: {"address":"地址","email":"邮箱","phone":"电话"}  文字内容: 直接输入文字',
  },
];

export default function FooterSectionAdmin() {
  return (
    <GenericCrud
      title="页脚区块管理"
      description="管理网站底部页脚的各个内容区块"
      fields={fields}
      fetchAll={() => api.getAllFooterSections()}
      create={(data) => api.createFooterSection(data)}
      update={(id, data) => api.updateFooterSection(id, data)}
      remove={(id) => api.deleteFooterSection(id)}
      listTitleKey="title"
      frontendPage="全站底部"
      frontendLocation="页脚区域的各个内容区块（快速链接、联系方式等）"
    />
  );
}
