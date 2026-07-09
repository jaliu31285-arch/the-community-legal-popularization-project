import GenericCrud, { CrudField } from './GenericCrud';
import { api } from '@/services/api';

const fields: CrudField[] = [
  { key: 'name', label: '姓名', type: 'text', required: true, listDisplay: true },
  { key: 'school', label: '学校', type: 'text', listDisplay: true },
  { key: 'grade', label: '年级', type: 'text', listDisplay: true },
  { key: 'signature_image', label: '签名图片', type: 'image', helpText: '后台上传的签名图片' },
  { key: 'message', label: '承诺留言', type: 'textarea' },
  { key: 'is_active', label: '是否显示', type: 'toggle', default: true },
];

export default function PromiseWallAdmin() {
  return (
    <GenericCrud
      title="承诺墙签名管理"
      description="管理反网暴承诺墙的签名数据"
      fields={fields}
      fetchAll={api.getAllPromiseWallSignatures}
      create={api.createPromiseWallSignature}
      update={api.updatePromiseWallSignature}
      remove={api.deletePromiseWallSignature}
      listTitleKey="name"
      frontendPage="/promise-wall"
      frontendLocation="承诺墙签名页面"
    />
  );
}