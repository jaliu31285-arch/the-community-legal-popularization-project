import GenericCrud from './GenericCrud';
import { api } from '@/services/api';
import type { CrudField } from './GenericCrud';

const fields: CrudField[] = [
  { key: 'label', label: '菜单名称', type: 'text', required: true, listDisplay: true },
  { key: 'path', label: '跳转路径', type: 'text', required: true, listDisplay: true, helpText: '站内路由如 /about，或外部链接如 https://xxx', formatHint: '/xxx 或 https://xxx' },
  {
    key: 'parent_id',
    label: '父级菜单',
    type: 'select',
    options: [{ label: '一级菜单', value: 0 }],
    listDisplay: false,
  },
];

export default function NavAdmin() {
  return (
    <GenericCrud
      title="导航菜单管理"
      description="管理网站顶部导航菜单"
      fields={fields}
      fetchAll={() => api.getAllNav()}
      create={(data) => api.createNavItem(data)}
      update={(id, data) => api.updateNavItem(id, data)}
      remove={(id) => api.deleteNavItem(id)}
      listTitleKey="label"
      frontendPage="全站顶部"
      frontendLocation="导航栏菜单"
    />
  );
}
